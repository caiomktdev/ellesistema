"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl?: string;
  variantId?: string;
  variantName?: string;
}

export interface CartItemType {
  product: CartProduct;
  quantity: number;
}

export type AppliedCoupon = {
  code: string;
  type: "percent" | "shipping";
  discount: number;
  message?: string;
};

interface CartState {
  items: CartItemType[];
  isOpen: boolean;
  appliedCoupon: AppliedCoupon | null;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.product.id === product.id &&
              i.product.variantId === product.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id &&
                i.product.variantId === product.variantId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { product, quantity }], isOpen: true };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product.id === productId &&
                i.product.variantId === variantId
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId && i.product.variantId === variantId
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      setCoupon: (coupon) => set({ appliedCoupon: coupon }),

      clearCart: () => set({ items: [], appliedCoupon: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        ),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "linefit-cart" }
  )
);
