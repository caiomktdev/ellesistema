import { prisma } from "@/lib/prisma";
import { validateCoupon, applyCouponDiscount, type CouponResult } from "@/lib/coupon";
import { calculateShipping } from "@/lib/shipping";
import type { CheckoutInput } from "@/lib/validations/checkout";

type ResolvedItem = {
  productId: string;
  variantId: string | null;
  name: string;
  price: number;
  quantity: number;
  weight: number;
};

function parseVariantValue(variantName?: string): string | null {
  if (!variantName) return null;
  const parts = variantName.split(":");
  return parts.length > 1 ? parts[parts.length - 1].trim() : null;
}

async function resolveCartItems(
  items: CheckoutInput["items"]
): Promise<{ items: ResolvedItem[]; subtotal: number; totalWeight: number }> {
  const resolved: ResolvedItem[] = [];
  let subtotal = 0;
  let totalWeight = 0;

  for (const item of items) {
    const product = await prisma.product.findFirst({
      where: {
        active: true,
        OR: [{ id: item.productId }, { slug: item.slug }],
      },
      include: { variants: true },
    });

    if (!product) {
      throw new Error(`Produto não encontrado: ${item.slug}`);
    }

    let variant = item.variantId
      ? product.variants.find((v) => v.id === item.variantId)
      : null;

    if (!variant) {
      const value = parseVariantValue(item.variantName);
      if (value) {
        variant = product.variants.find((v) => v.value === value) ?? null;
      }
    }

    const unitPrice = variant?.price ?? product.price;
    const availableStock = variant?.stock ?? product.stock;

    if (availableStock < item.quantity) {
      throw new Error(`Estoque insuficiente para ${product.name}`);
    }

    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;
    totalWeight += (product.weight ?? 0.2) * item.quantity;

    resolved.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      name: variant ? `${product.name} (${variant.value})` : product.name,
      price: unitPrice,
      quantity: item.quantity,
      weight: product.weight ?? 0.2,
    });
  }

  return { items: resolved, subtotal, totalWeight };
}

export async function createOrder(input: CheckoutInput) {
  const { items: resolvedItems, subtotal, totalWeight } = await resolveCartItems(input.items);

  const shippingInfo = await calculateShipping(subtotal, totalWeight);

  let coupon: CouponResult | null = null;
  if (input.couponCode?.trim()) {
    coupon = await validateCoupon(input.couponCode, subtotal);
    if (!coupon.valid) {
      throw new Error(coupon.message ?? "Cupom inválido");
    }
  }

  const { discount, shippingCost, pixDiscount } = applyCouponDiscount(
    subtotal,
    shippingInfo.cost,
    coupon,
    input.paymentMethod
  );

  const totalDiscount = discount + pixDiscount;
  const total = Math.max(0, subtotal + shippingCost - totalDiscount);

  const isInstantPayment = input.paymentMethod === "pix" || input.paymentMethod === "credit";

  const order = await prisma.$transaction(async (tx) => {
    const user = await tx.user.upsert({
      where: { email: input.email.toLowerCase() },
      update: {
        name: input.name,
        phone: input.phone,
        cpf: input.cpf.replace(/\D/g, ""),
      },
      create: {
        name: input.name,
        email: input.email.toLowerCase(),
        phone: input.phone,
        cpf: input.cpf.replace(/\D/g, ""),
        role: "CUSTOMER",
      },
    });

    const address = await tx.address.create({
      data: {
        userId: user.id,
        name: input.name,
        street: input.street,
        number: input.number,
        complement: input.complement || null,
        district: input.district,
        city: input.city,
        state: input.state.toUpperCase().slice(0, 2),
        zipCode: input.zipCode.replace(/\D/g, ""),
        isDefault: true,
      },
    });

    for (const item of resolvedItems) {
      if (item.variantId) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } });
        if (!variant || variant.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para ${item.name}`);
        }
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        });
      } else {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para ${item.name}`);
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    }

    const newOrder = await tx.order.create({
      data: {
        userId: user.id,
        addressId: address.id,
        status: isInstantPayment ? "PAID" : "PENDING",
        paymentStatus: isInstantPayment ? "APPROVED" : "PENDING",
        paymentMethod: input.paymentMethod,
        subtotal,
        shippingCost,
        discount: totalDiscount,
        total,
        shippingMethod: shippingInfo.name,
        couponCode: coupon?.valid ? coupon.code : null,
        items: {
          create: resolvedItems.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    if (coupon?.valid) {
      await tx.coupon.updateMany({
        where: { code: coupon.code },
        data: { uses: { increment: 1 } },
      });
    }

    return newOrder;
  });

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    total,
    paymentMethod: input.paymentMethod,
    paymentStatus: order.paymentStatus,
  };
}
