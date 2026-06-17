"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-[400px] bg-white z-[51] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0f0f0]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#1a1a1a]" />
                <h2 className="font-bold text-[#111]">
                  Carrinho
                  {items.length > 0 && (
                    <span className="ml-1.5 text-sm font-normal text-[#999]">
                      ({items.length} {items.length === 1 ? "item" : "itens"})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="min-h-11 min-w-11 flex items-center justify-center text-[#999] hover:text-[#111] hover:bg-[#f5f5f5] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-[#bbb]">
                  <ShoppingBag className="w-14 h-14 stroke-[1.5]" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#999]">Seu carrinho está vazio</p>
                    <Link
                      href="/produtos"
                      onClick={closeCart}
                      className="text-sm text-[#1a1a1a] hover:underline mt-1 inline-block"
                    >
                      Explorar produtos →
                    </Link>
                  </div>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <motion.div
                    key={`${product.id}-${product.variantId}`}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-3 py-3 border-b border-[#f5f5f5] last:border-0"
                  >
                    <div className="w-16 h-16 bg-[#f8f7fb] rounded-xl overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#aaaaaa] text-xs font-black">LF</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111] leading-snug">{product.name}</p>
                      {product.variantName && (
                        <p className="text-xs text-[#999] mt-0.5">{product.variantName}</p>
                      )}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
                        <div className="flex items-center border border-[#e8e8e8] rounded-lg overflow-hidden self-start">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1, product.variantId)}
                            className="min-h-10 min-w-10 flex items-center justify-center text-[#999] hover:text-[#111] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="min-w-10 text-center text-sm font-medium">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1, product.variantId)}
                            className="min-h-10 min-w-10 flex items-center justify-center text-[#999] hover:text-[#111] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <span className="text-sm font-bold text-[#1a1a1a]">
                            {formatPrice(product.price * quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(product.id, product.variantId)}
                            className="min-h-10 min-w-10 flex items-center justify-center text-[#ccc] hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[#f0f0f0] space-y-4 safe-bottom">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#666]">Subtotal</span>
                  <span className="font-bold text-lg text-[#111]">{formatPrice(total())}</span>
                </div>
                <p className="text-xs text-[#bbb]">Frete e descontos calculados no checkout</p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-semibold py-3.5 rounded-xl transition-colors group text-sm"
                >
                  Finalizar compra
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/carrinho"
                  onClick={closeCart}
                  className="w-full text-center text-sm text-[#999] hover:text-[#1a1a1a] transition-colors block"
                >
                  Ver carrinho completo
                </Link>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
