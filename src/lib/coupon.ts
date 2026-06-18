import { prisma } from "@/lib/prisma";

export type CouponResult = {
  valid: boolean;
  code: string;
  type: "percent" | "shipping";
  discount: number;
  message?: string;
};

const MOCK_COUPONS: Record<string, Omit<CouponResult, "valid" | "code">> = {
  ELLEBASIC10: { type: "percent", discount: 10, message: "10% de desconto aplicado" },
  FRETEGRATIS: { type: "shipping", discount: 0, message: "Frete grátis aplicado" },
};

export async function validateCoupon(code: string, subtotal: number): Promise<CouponResult> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, code: normalized, type: "percent", discount: 0, message: "Informe um cupom" };

  try {
    const coupon = await prisma.coupon.findUnique({ where: { code: normalized } });
    if (coupon && coupon.active) {
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return { valid: false, code: normalized, type: "percent", discount: 0, message: "Cupom expirado" };
      }
      if (coupon.maxUses != null && coupon.uses >= coupon.maxUses) {
        return { valid: false, code: normalized, type: "percent", discount: 0, message: "Cupom esgotado" };
      }
      if (subtotal < coupon.minOrder) {
        return { valid: false, code: normalized, type: "percent", discount: 0, message: `Pedido mínimo ${(coupon.minOrder / 100).toFixed(2)}` };
      }
      return {
        valid: true,
        code: normalized,
        type: coupon.type as "percent" | "shipping",
        discount: coupon.value,
        message: coupon.description ?? "Cupom aplicado",
      };
    }
  } catch {
    /* fallback */
  }

  const mock = MOCK_COUPONS[normalized];
  if (mock) return { valid: true, code: normalized, ...mock };
  return { valid: false, code: normalized, type: "percent", discount: 0, message: "Cupom inválido" };
}

export function applyCouponDiscount(
  subtotal: number,
  shippingCost: number,
  coupon: CouponResult | null,
  paymentMethod: string
): { discount: number; shippingCost: number; pixDiscount: number } {
  let discount = 0;
  let finalShipping = shippingCost;

  if (coupon?.valid) {
    if (coupon.type === "percent") {
      discount += Math.round(subtotal * (coupon.discount / 100));
    } else if (coupon.type === "shipping") {
      finalShipping = 0;
    }
  }

  const pixDiscount = paymentMethod === "pix" ? Math.round(subtotal * 0.1) : 0;

  return { discount, shippingCost: finalShipping, pixDiscount };
}
