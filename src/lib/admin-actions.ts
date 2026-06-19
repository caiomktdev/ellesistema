"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") throw new Error("Não autorizado");
}

// ── Products ──────────────────────────────────────────────

export async function createProduct(data: {
  name: string; slug: string; price: number; compareAt?: number | null;
  stock: number; sku?: string | null; active: boolean; featured: boolean;
  weight?: number | null; description?: string | null; categoryId?: string | null;
}) {
  await checkAdmin();
  const product = await prisma.product.create({ data });
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  return product;
}

export async function updateProduct(id: string, data: {
  name?: string; price?: number; compareAt?: number | null; stock?: number;
  active?: boolean; featured?: boolean; sku?: string | null;
}) {
  await checkAdmin();
  const product = await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  return product;
}

export async function deleteProduct(id: string) {
  await checkAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
}

// ── Orders ────────────────────────────────────────────────

export async function updateOrderStatus(id: string, status: string) {
  await checkAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.order.update({ where: { id }, data: { status: status as any } });
  revalidatePath("/admin/pedidos");
}

export async function updateOrderTracking(id: string, trackingCode: string) {
  await checkAdmin();
  await prisma.order.update({ where: { id }, data: { trackingCode } });
  revalidatePath("/admin/pedidos");
}

// ── Coupons ───────────────────────────────────────────────

export async function createCoupon(data: {
  code: string; description?: string | null; type: string; value: number;
  minOrder: number; maxUses?: number | null; active: boolean; expiresAt?: Date | null;
}) {
  await checkAdmin();
  const coupon = await prisma.coupon.create({ data });
  revalidatePath("/admin/cupons");
  return coupon;
}

export async function updateCoupon(id: string, data: {
  code?: string; description?: string | null; type?: string; value?: number;
  minOrder?: number; maxUses?: number | null; active?: boolean; expiresAt?: Date | null;
}) {
  await checkAdmin();
  const coupon = await prisma.coupon.update({ where: { id }, data });
  revalidatePath("/admin/cupons");
  return coupon;
}

export async function deleteCoupon(id: string) {
  await checkAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/cupons");
}

// ── Shipping ──────────────────────────────────────────────

export async function createShippingRule(data: {
  name: string; minWeight: number; maxWeight?: number | null;
  minValue: number; maxValue?: number | null; price: number; days: number; active: boolean;
}) {
  await checkAdmin();
  const rule = await prisma.shippingRule.create({ data });
  revalidatePath("/admin/frete");
  return rule;
}

export async function updateShippingRule(id: string, data: {
  name?: string; minWeight?: number; maxWeight?: number | null;
  minValue?: number; maxValue?: number | null; price?: number; days?: number; active?: boolean;
}) {
  await checkAdmin();
  const rule = await prisma.shippingRule.update({ where: { id }, data });
  revalidatePath("/admin/frete");
  return rule;
}

export async function deleteShippingRule(id: string) {
  await checkAdmin();
  await prisma.shippingRule.delete({ where: { id } });
  revalidatePath("/admin/frete");
}
