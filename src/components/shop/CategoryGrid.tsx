"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    label: "tops & cropped",
    title: "Coleção\nPulsar",
    sub: "Com bojo, sem bojo e cropped ribana",
    slug: "tops",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1100&q=90&auto=format&fit=crop&crop=top",
    align: "left",
  },
  {
    label: "leggings & conjuntos",
    title: "Cintura\nAlta",
    sub: "Compressão, poder e caimento perfeito",
    slug: "leggings",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&h=1100&q=90&auto=format&fit=crop&crop=top",
    align: "right",
  },
];

export default function CategoryGrid() {
  return (
    <section className="w-full bg-white px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        {collections.map((col, i) => (
          <Link
            key={col.slug}
            href={`/produtos?categoria=${col.slug}`}
            className="group relative block w-full overflow-hidden rounded-xl sm:rounded-2xl aspect-[16/10] md:aspect-[5/3]"
          >
            <Image
              src={col.img}
              alt={col.title.replace("\n", " ")}
              fill
              className="object-cover object-top brightness-[0.85] group-hover:brightness-90 group-hover:scale-105 transition-all duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Overlay — escurece a foto para contraste com o texto */}
            <div className="absolute inset-0 bg-black/30 transition-colors duration-700 group-hover:bg-black/25" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  col.align === "left"
                    ? "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.08) 100%)"
                    : "linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.08) 100%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
              }}
            />

            {/* Text */}
            <div
              className={`absolute inset-0 z-[1] flex flex-col justify-end p-4 sm:p-5 md:p-6 ${
                col.align === "right" ? "items-end text-right" : "items-start"
              }`}
            >
              <p className="text-[10px] sm:text-xs text-white/70 tracking-[0.25em] uppercase mb-1">
                {col.label}
              </p>
              <h2
                className="text-white font-black leading-tight mb-1.5 sm:mb-2"
                style={{
                  fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
                  whiteSpace: "pre-line",
                }}
              >
                {col.title}
              </h2>
              <p className="text-white/70 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{col.sub}</p>
              <span className="inline-flex items-center gap-1.5 border border-white text-white text-[10px] sm:text-xs font-semibold tracking-[0.15em] px-4 py-2 sm:px-5 sm:py-2.5 group-hover:bg-white group-hover:text-[#111] transition-all duration-300">
                CONFIRA
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Number */}
            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[1] text-white/30 text-2xl sm:text-3xl font-black leading-none select-none">
              0{i + 1}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
