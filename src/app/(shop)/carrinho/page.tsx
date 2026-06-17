"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag, Check, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { calcOrderTotals, FREE_SHIPPING_MIN } from "@/lib/order-totals";
import { useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, appliedCoupon, setCoupon } = useCartStore();
  const [couponInput, setCouponInput] = useState(appliedCoupon?.code ?? "");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = total();
  const { shipping, couponDiscount, total: orderTotal } = calcOrderTotals(subtotal, appliedCoupon);

  const handleApplyCoupon = async () => {
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });
      const data = await res.json();
      if (!data.valid) {
        setCouponError(data.message ?? "Cupom inválido");
        setCoupon(null);
        return;
      }
      setCoupon({
        code: data.code,
        type: data.type,
        discount: data.discount,
        message: data.message,
      });
      setCouponError(null);
    } catch {
      setCouponError("Erro ao validar cupom");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponInput("");
    setCouponError(null);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-20 text-center">
        <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-9 h-9 text-[#1a1a1a]" />
        </div>
        <h1 className="text-2xl font-bold text-[#111] mb-3">Seu carrinho está vazio</h1>
        <p className="text-[#999] mb-8">Adicione produtos para continuar</p>
        <Link
          href="/produtos"
          className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#000000] transition-colors shadow-[0_4px_16px_rgba(98,41,157,0.3)]"
        >
          Ver produtos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-8 py-8 sm:py-10 pb-28 lg:pb-10">
      <div className="mb-8">
        <p className="text-xs text-[#1a1a1a] font-semibold tracking-widest uppercase mb-1">Loja</p>
        <h1 className="text-3xl font-black text-[#111]">Carrinho</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map(({ product, quantity }) => (
              <motion.div
                key={`${product.id}-${product.variantId}`}
                layout
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 bg-white border border-[#f0f0f0] rounded-2xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              >
                <div className="w-20 h-20 bg-[#f8f7fb] rounded-xl overflow-hidden flex-shrink-0 border border-[#f0f0f0]">
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} width={80} height={80} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#aaaaaa] font-black text-sm">LF</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/produtos/${product.slug}`} className="text-sm font-semibold text-[#111] hover:text-[#1a1a1a] transition-colors line-clamp-2">
                        {product.name}
                      </Link>
                      {product.variantName && (
                        <p className="text-xs text-[#bbb] mt-0.5">{product.variantName}</p>
                      )}
                    </div>
                    <button onClick={() => removeItem(product.id, product.variantId)} className="min-h-11 min-w-11 flex items-center justify-center text-[#ddd] hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[#e8e8e8] rounded-lg overflow-hidden self-start">
                      <button onClick={() => updateQuantity(product.id, quantity - 1, product.variantId)} className="min-h-11 min-w-11 flex items-center justify-center text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="min-w-10 text-center text-sm font-semibold text-[#111]">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1, product.variantId)} className="min-h-11 min-w-11 flex items-center justify-center text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-[#1a1a1a]">{formatPrice(product.price * quantity)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#f0f0f0] rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-semibold text-[#111] mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#1a1a1a]" />
              Cupom de desconto
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-[#fafafa] border border-[#aaaaaa] rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#1a1a1a]" />
                  <span className="text-sm font-semibold text-[#1a1a1a]">{appliedCoupon.code}</span>
                </div>
                <button onClick={handleRemoveCoupon} className="text-[#bbb] hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="LINEFIT10"
                  className="flex-1 min-w-0 bg-[#faf9fd] border border-[#e8e8e8] focus:border-[#aaaaaa] rounded-lg px-3 py-2.5 text-sm text-[#111] outline-none transition-colors placeholder-[#bbb]"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-4 py-2.5 bg-[#f5f5f5] border border-[#aaaaaa] text-[#1a1a1a] text-sm font-semibold rounded-lg hover:bg-[#efefef] transition-colors w-full sm:w-auto disabled:opacity-50"
                >
                  {couponLoading ? "..." : "Aplicar"}
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
            <p className="text-xs text-[#bbb] mt-2">Experimente: LINEFIT10 ou FRETEGRATIS</p>
          </div>

          <div className="bg-white border border-[#f0f0f0] rounded-2xl p-5 space-y-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h3 className="font-semibold text-[#111] mb-4">Resumo do pedido</h3>
            <div className="flex justify-between text-sm">
              <span className="text-[#999]">Subtotal</span>
              <span className="text-[#111]">{formatPrice(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]">Cupom ({appliedCoupon?.code})</span>
                <span className="text-[#1a1a1a]">-{formatPrice(couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[#999]">Frete</span>
              <span className={shipping === 0 ? "text-[#1a1a1a] font-semibold" : "text-[#111]"}>
                {shipping === 0 ? "Grátis" : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-[#bbb]">
                Falta {formatPrice(FREE_SHIPPING_MIN - subtotal)} para frete grátis
              </p>
            )}
            <div className="border-t border-[#f0f0f0] pt-3 flex justify-between font-bold">
              <span className="text-[#111]">Total</span>
              <span className="text-xl text-[#1a1a1a]">{formatPrice(orderTotal)}</span>
            </div>
            <p className="text-xs text-[#bbb]">ou 12x de {formatPrice(Math.ceil(orderTotal / 12))}</p>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold py-4 rounded-xl transition-colors group mt-2 shadow-[0_4px_16px_rgba(98,41,157,0.25)]"
            >
              Finalizar compra
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/produtos" className="w-full text-center text-xs text-[#bbb] hover:text-[#1a1a1a] transition-colors block">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-[#f0f0f0] px-4 py-3 safe-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div>
            <p className="text-xs text-[#999]">Total</p>
            <p className="text-lg font-bold text-[#1a1a1a]">{formatPrice(orderTotal)}</p>
          </div>
          <Link
            href="/checkout"
            className="flex-1 max-w-[200px] flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#000000] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
          >
            Finalizar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
