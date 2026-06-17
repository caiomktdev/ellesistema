"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { getProductMedia } from "@/lib/product-media";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number | null;
  imageUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  badge?: string | null;
}

function SizePill({ label }: { label: string }) {
  return (
    <span className="inline-flex min-w-[32px] items-center justify-center px-2.5 py-[5px] text-[11px] font-semibold text-[#333] bg-white border border-[#ccc] shadow-[0_0_0_1px_#ccc] cursor-default select-none">
      {label}
    </span>
  );
}

export default function ProductCard({
  name,
  slug,
  price,
  compareAt,
  imageUrl,
  badge,
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [wished, setWished] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const media = getProductMedia(slug);
  const primary = imageUrl || media.primary;
  const hasHoverImage = Boolean(media.hover);
  const hasHoverVideo = Boolean(media.hoverVideo);
  const showHoverMedia = hovered && (hasHoverImage || hasHoverVideo);

  const discount = compareAt ? Math.round((1 - price / compareAt) * 100) : null;

  const handleEnter = () => {
    setHovered(true);
    if (media.hoverVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      void videoRef.current.play();
    }
  };

  const handleLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="group relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link href={`/produtos/${slug}`}>
        <div className="relative block w-full overflow-hidden bg-[#f5f4f2]" style={{ aspectRatio: "420/633" }}>
          {/* Imagem principal */}
          <Image
            src={primary}
            alt={name}
            fill
            className={`object-cover object-top transition-all duration-500 ${
              showHoverMedia && hasHoverImage ? "opacity-0 scale-105" : hovered ? "scale-105" : "scale-100"
            }`}
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Imagem secundária no hover (estilo Movie Fitness) */}
          {media.hover && (
            <Image
              src={media.hover}
              alt=""
              fill
              aria-hidden
              className={`object-cover object-top transition-all duration-500 ${
                showHoverMedia && hasHoverImage ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          )}

          {/* Vídeo no hover */}
          {media.hoverVideo && (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="none"
              className={`absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-500 ${
                showHoverMedia && hasHoverVideo ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <source src={media.hoverVideo} type="video/mp4" />
            </video>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 z-[2] flex flex-col gap-1.5">
            {badge && (
              <span className="px-2.5 py-1 bg-[#1a1a1a] text-white text-[10px] font-semibold tracking-wider">
                {badge.toUpperCase()}
              </span>
            )}
            {discount && !badge && (
              <span className="px-2.5 py-1 bg-white text-[#111] text-[10px] font-bold tracking-wider">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist — sempre visível no touch */}
          <div
            className={`absolute top-3 right-3 z-[2] transition-opacity duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 ${
              wished ? "opacity-100" : ""
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setWished(!wished);
              }}
              className="flex min-h-10 min-w-10 items-center justify-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-transform active:scale-95"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  wished ? "fill-red-400 stroke-red-400" : "stroke-white fill-transparent"
                }`}
              />
            </button>
          </div>

          {/* Painel de tamanhos — só no desktop (hover); oculto no mobile */}
          <div
            className={`absolute inset-x-0 bottom-0 z-[3] hidden md:block w-full overflow-hidden bg-white/80 text-center transition-transform duration-300 ease-in-out translate-y-full ${
              hovered ? "translate-y-0" : ""
            }`}
          >
            <div className="flex flex-col gap-2 px-3 py-3">
              {media.sizeGroups.map((group) => (
                <div key={group.label ?? group.sizes.join("-")} className="flex flex-col items-center gap-1.5">
                  {group.label && media.sizeGroups.length > 1 && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#888]">
                      {group.label}
                    </span>
                  )}
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {group.sizes.map((size) => (
                      <SizePill key={size} label={size} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-3">
        <Link href={`/produtos/${slug}`}>
          <h3 className="text-xs font-medium text-[#111] hover:text-[#1a1a1a] transition-colors leading-snug line-clamp-2 tracking-wide">
            {name.toUpperCase()}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-baseline gap-2">
          <p className="text-sm font-bold text-[#111]">{formatPrice(price)}</p>
          {compareAt && (
            <p className="text-xs text-[#bbb] line-through">{formatPrice(compareAt)}</p>
          )}
        </div>
        <p className="mt-0.5 text-[10px] text-[#bbb]">
          12x de {formatPrice(Math.ceil(price / 12))}
        </p>
      </div>
    </div>
  );
}
