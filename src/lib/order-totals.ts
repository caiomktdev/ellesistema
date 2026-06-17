"use client";

import { useMemo } from "react";
import type { AppliedCoupon } from "@/store/cart";

const FREE_SHIPPING_MIN = 19900;
const DEFAULT_SHIPPING = 1990;

export { FREE_SHIPPING_MIN, DEFAULT_SHIPPING };

export function calcOrderTotals(
  subtotal: number,
  appliedCoupon: AppliedCoupon | null,
  paymentMethod?: string
) {
  let shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : DEFAULT_SHIPPING;
  let couponDiscount = 0;

  if (appliedCoupon?.type === "shipping") {
    shipping = 0;
  } else if (appliedCoupon?.type === "percent") {
    couponDiscount = Math.round(subtotal * (appliedCoupon.discount / 100));
  }

  const pixDiscount = paymentMethod === "pix" ? Math.round(subtotal * 0.1) : 0;
  const total = Math.max(0, subtotal + shipping - couponDiscount - pixDiscount);

  return { shipping, couponDiscount, pixDiscount, total };
}

export function useOrderTotals(
  subtotal: number,
  appliedCoupon: AppliedCoupon | null,
  paymentMethod?: string
) {
  return useMemo(
    () => calcOrderTotals(subtotal, appliedCoupon, paymentMethod),
    [subtotal, appliedCoupon, paymentMethod]
  );
}
