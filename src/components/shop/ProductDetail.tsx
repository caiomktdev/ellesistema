"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Star,
  Check,
  Truck,
  Shield,
  Minus,
  Plus,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

interface Variant {
  id: string;
  name: string;
  value: string;
  price?: number | null;
  stock: number;
}

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  userName: string;
  createdAt: Date;
}

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
}

interface Props {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compareAt?: number | null;
  stock: number;
  sku?: string | null;
  images: ProductImage[];
  variants: Variant[];
  reviews: Review[];
}

export default function ProductDetail({
  id,
  name,
  slug,
  description,
  price,
  compareAt,
  stock,
  sku,
  images,
  variants,
  reviews,
}: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    variants[0]?.id
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const discount = compareAt
    ? Math.round((1 - price / compareAt) * 100)
    : null;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const variantGroups = variants.reduce<Record<string, Variant[]>>((acc, v) => {
    acc[v.name] = acc[v.name] || [];
    acc[v.name].push(v);
    return acc;
  }, {});

  const handleAddToCart = () => {
    if (variants.length > 0 && !selectedVariant) return;
    const variant = variants.find((v) => v.id === selectedVariant);
    addItem(
      {
        id,
        name,
        slug,
        price: variant?.price ?? price,
        imageUrl: images[0]?.url || undefined,
        variantId: variant?.id,
        variantName: variant ? `${variant.name}: ${variant.value}` : undefined,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#999] mb-6 sm:mb-8 overflow-x-auto scrollbar-none">
        <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Início</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/produtos" className="hover:text-[#1a1a1a] transition-colors">Produtos</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#111] truncate max-w-[180px] sm:max-w-xs">{name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-10 mb-12 sm:mb-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-[#f8f7fb] rounded-2xl overflow-hidden border border-[#f0f0f0]">
            {images[selectedImage]?.url ? (
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].alt ?? name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#aaaaaa] text-8xl font-black">
                LF
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-[#1a1a1a]" : "border-[#f0f0f0]"
                  }`}
                >
                  {img.url ? (
                    <Image src={img.url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#f8f7fb] flex items-center justify-center text-[#aaaaaa] text-xs font-bold">LF</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#111] mb-3">{name}</h1>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(avgRating)
                        ? "fill-[#1a1a1a] text-[#1a1a1a]"
                        : "text-[#ddd]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#999]">
                {avgRating.toFixed(1)} ({reviews.length} avaliações)
              </span>
            </div>
          )}

          <div className="mb-6">
            {compareAt && (
              <p className="text-sm text-[#bbb] line-through mb-1">
                {formatPrice(compareAt)}
              </p>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-[#1a1a1a]">
                {formatPrice(price)}
              </span>
              {discount && (
                <span className="px-2 py-1 bg-[#f5f5f5] text-[#1a1a1a] text-sm font-bold rounded-md border border-[#aaaaaa]">
                  -{discount}%
                </span>
              )}
            </div>
            <p className="text-sm text-[#999] mt-1">
              ou 12x de {formatPrice(Math.ceil(price / 12))} sem juros
            </p>
            <p className="text-sm text-[#1a1a1a] mt-0.5 font-medium">
              ou {formatPrice(Math.round(price * 0.9))} via Pix (10% off)
            </p>
          </div>

          {/* Variants */}
          {Object.entries(variantGroups).map(([groupName, groupVariants]) => (
            <div key={groupName} className="mb-5">
              <p className="text-sm font-semibold mb-2 text-[#999]">
                {groupName}:{" "}
                <span className="text-[#111]">
                  {groupVariants.find((v) => v.id === selectedVariant)?.value}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {groupVariants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.id)}
                    disabled={v.stock === 0}
                    className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                      selectedVariant === v.id
                        ? "border-[#1a1a1a] bg-[#f5f5f5] text-[#1a1a1a]"
                        : v.stock === 0
                        ? "border-[#f0f0f0] text-[#ddd] cursor-not-allowed line-through"
                        : "border-[#e8e8e8] text-[#888] hover:border-[#aaaaaa] hover:text-[#1a1a1a]"
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity + Add */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex items-center border border-[#e8e8e8] rounded-xl overflow-hidden self-start sm:self-auto">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="min-h-11 min-w-11 flex items-center justify-center text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="min-w-12 py-3 font-semibold text-sm text-center text-[#111]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                className="min-h-11 min-w-11 flex items-center justify-center text-[#bbb] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={stock === 0}
              className={`w-full sm:flex-1 flex items-center justify-center gap-2 font-bold py-3.5 sm:py-3 rounded-xl transition-all min-h-11 ${
                added
                  ? "bg-[#1a1a1a] text-white"
                  : stock === 0
                  ? "bg-[#f8f7fb] text-[#bbb] cursor-not-allowed"
                  : "bg-[#1a1a1a] hover:bg-[#000000] text-white shadow-[0_4px_16px_rgba(98,41,157,0.3)]"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  Adicionado!
                </>
              ) : stock === 0 ? (
                "Esgotado"
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Adicionar ao carrinho
                </>
              )}
            </motion.button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { icon: Truck, text: "Frete grátis acima de R$500" },
              { icon: Shield, text: "Compra 100% segura" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 bg-[#faf9fd] border border-[#f0f0f0] rounded-xl p-3"
              >
                <Icon className="w-4 h-4 text-[#1a1a1a] flex-shrink-0" />
                <span className="text-xs text-[#888]">{text}</span>
              </div>
            ))}
          </div>

          {sku && (
            <p className="text-xs text-[#bbb]">SKU: {sku}</p>
          )}
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="grid md:grid-cols-2 gap-8">
        {description && (
          <div>
            <h2 className="text-xl font-bold text-[#111] mb-4">Descrição</h2>
            <div
              className="prose prose-sm max-w-none text-[#666] [&_strong]:text-[#111] [&_li]:text-[#666] [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-[#111] mb-4">
            Avaliações ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <p className="text-[#bbb] text-sm">
              Nenhuma avaliação ainda. Seja o primeiro!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-[#f0f0f0] rounded-xl p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < r.rating
                                ? "fill-[#1a1a1a] text-[#1a1a1a]"
                                : "text-[#ddd]"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-[#111]">{r.userName}</span>
                    </div>
                    <span className="text-xs text-[#bbb] sm:ml-auto">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  {r.title && (
                    <p className="text-sm font-semibold text-[#111] mb-1">{r.title}</p>
                  )}
                  {r.body && (
                    <p className="text-sm text-[#888]">{r.body}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
