"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/banners/banner-01.webp",
    alt: "Coleção Pulsar — três modelos",
    href: "/produtos?categoria=roupas",
  },
  {
    src: "/banners/banner-02.webp",
    alt: "Coleção Pulsar — look khaki",
    href: "/produtos?categoria=roupas",
  },
  {
    src: "/banners/banner-04.webp",
    alt: "Coleção Pulsar — look preto",
    href: "/produtos?categoria=roupas",
  },
  {
    src: "/banners/banner-05.webp",
    alt: "Promoção — 2 por R$ 199",
    href: "/produtos",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  const go = useCallback(
    (idx: number) => {
      setDir(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  const prev = () => go((current - 1 + slides.length) % slides.length);
  const next = useCallback(
    () => go((current + 1) % slides.length),
    [current, go]
  );

  useEffect(() => {
    const t = setTimeout(next, 5000);
    return () => clearTimeout(t);
  }, [current, next]);

  return (
    <section className="relative w-full overflow-hidden bg-[#e8e8e8]">
      <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/8] min-h-[280px] sm:min-h-[240px] max-h-[85vh] lg:max-h-[680px]">

        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? "4%" : "-4%", opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? "-4%" : "4%", opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.65, ease: [0.32, 0, 0.14, 1] }}
            className="absolute inset-0"
          >
            <Link href={slides[current].href} className="block w-full h-full">
              <Image
                src={slides[current].src}
                alt={slides[current].alt}
                fill
                priority={current === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 min-h-11 min-w-11 flex items-center justify-center bg-white/40 hover:bg-white/70 backdrop-blur-sm rounded-full transition-all duration-200 text-[#111]"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 min-h-11 min-w-11 flex items-center justify-center bg-white/40 hover:bg-white/70 backdrop-blur-sm rounded-full transition-all duration-200 text-[#111]"
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 sm:gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="p-2 flex items-center justify-center"
              aria-label={`Slide ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-1.5 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
