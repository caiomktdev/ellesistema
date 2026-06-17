"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, User, ChevronDown, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import CartDrawer from "./CartDrawer";

/* ── Announcement bar ── */
const announcements = [
  { full: "FRETE GRÁTIS EM PEDIDOS ACIMA DE R$ 199", short: "FRETE GRÁTIS ACIMA DE R$ 199" },
  { full: "CUPOM  LINEFIT10  — 10% OFF NA PRIMEIRA COMPRA", short: "LINEFIT10 — 10% OFF" },
  { full: "ZERO TRANSPARÊNCIA · TECIDO PREMIUM NACIONAL", short: "ZERO TRANSPARÊNCIA · TECIDO PREMIUM" },
];

/* ── Nav ── */
const navLinks = [
  {
    label: "Coleções",
    href: "/produtos",
    sub: [
      { label: "Coleção Pulsar", href: "/produtos?categoria=colecao-pulsar", desc: "Nova temporada 2026" },
      { label: "Lançamentos", href: "/produtos?destaque=true", desc: "Peças recém chegadas" },
      { label: "Mais Vendidos", href: "/produtos?ordem=relevancia", desc: "Favoritas das clientes" },
    ],
  },
  {
    label: "Roupas",
    href: "/produtos?categoria=roupas",
    sub: [
      { label: "Tops & Cropped", href: "/produtos?categoria=tops", desc: "Com e sem bojo" },
      { label: "Leggings", href: "/produtos?categoria=leggings", desc: "Cintura alta, compressão" },
      { label: "Shorts", href: "/produtos?categoria=shorts", desc: "Treino e lifestyle" },
      { label: "Conjuntos", href: "/produtos?categoria=conjuntos", desc: "Looks completos combinados" },
      { label: "Macacões", href: "/produtos?categoria=macacoes", desc: "Peça única com estilo" },
    ],
  },
  { label: "Acessórios", href: "/produtos?categoria=acessorios" },
  { label: "Promoções", href: "/produtos?destaque=true" },
];

export default function Header() {
  const pathname = usePathname();
  const isOverlay = pathname === "/";
  const [annIdx, setAnnIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [headerHeight, setHeaderHeight] = useState(88);
  const { itemCount, openCart } = useCartStore();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  /* Rotate announcement bar */
  useEffect(() => {
    const t = setInterval(() => setAnnIdx((i) => (i + 1) % announcements.length), 3500);
    return () => clearInterval(t);
  }, []);

  /* Scroll shadow */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Measure header height for mobile menu backdrop */
  useEffect(() => {
    const update = () => {
      if (headerRef.current) {
        const h = headerRef.current.offsetHeight;
        setHeaderHeight(h);
        document.documentElement.style.setProperty("--header-height", `${h}px`);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [searchOpen, mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <>
      <div ref={headerRef} className={isOverlay ? "fixed top-0 left-0 right-0 z-40" : "relative z-40"}>
      {/* ── Announcement bar ── */}
      <div
        className={`text-white text-[10px] sm:text-[11px] text-center py-2.5 tracking-[0.12em] sm:tracking-[0.18em] overflow-hidden relative min-h-9 flex items-center justify-center px-4 ${
          isOverlay ? "bg-black/45 backdrop-blur-md" : "bg-[#111]"
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={annIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute px-4"
          >
            <span className="sm:hidden">{announcements[annIdx].short}</span>
            <span className="hidden sm:inline">{announcements[annIdx].full}</span>
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Main header — floating island ── */}
      <header className={`px-4 lg:px-8 pt-3 pb-0 ${isOverlay ? "" : "sticky top-0"}`}>

        {/* Floating nav card */}
        <div
          className="max-w-7xl mx-auto rounded-2xl sm:rounded-full transition-all duration-300"
          style={{
            background: scrolled ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.55)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.65)"
              : "0 2px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
          }}
        >
          <div className="flex items-center justify-between h-14 px-4 sm:px-5 lg:px-8">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 z-10">
              <span
                className="text-[2rem] sm:text-[2.25rem] leading-none tracking-[0.18em] text-[#111] select-none"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300, fontStyle: "italic" }}
              >
                elle
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.sub ? handleMouseEnter(link.label) : undefined}
                  onMouseLeave={link.sub ? handleMouseLeave : undefined}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-5 py-2 text-sm font-medium text-[#333] hover:text-[#1a1a1a] transition-colors"
                  >
                    {link.label}
                    {link.sub && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          openMenu === link.label ? "rotate-180 text-[#1a1a1a]" : "opacity-40"
                        }`}
                      />
                    )}
                  </Link>

                  {/* Glass dropdown */}
                  <AnimatePresence>
                    {link.sub && openMenu === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        onMouseEnter={() => handleMouseEnter(link.label)}
                        onMouseLeave={handleMouseLeave}
                        className="absolute top-full left-0 mt-3 z-50 min-w-[260px]"
                        style={{ transformOrigin: "top left" }}
                      >
                        <div
                          className="rounded-2xl overflow-hidden py-3"
                          style={{
                            background: "rgba(248,245,255,0.95)",
                            backdropFilter: "blur(28px) saturate(200%)",
                            WebkitBackdropFilter: "blur(28px) saturate(200%)",
                            border: "1px solid rgba(98,41,157,0.18)",
                            boxShadow:
                              "0 16px 48px rgba(98,41,157,0.14), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
                          }}
                        >
                          {link.sub.map((s, i) => (
                            <motion.div
                              key={s.href + i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <Link
                                href={s.href}
                                onClick={() => setOpenMenu(null)}
                                className="flex flex-col px-5 py-2.5 hover:bg-[#1a1a1a]/10 transition-colors group"
                              >
                                <span className="text-sm font-semibold text-[#111] group-hover:text-[#1a1a1a] transition-colors">
                                  {s.label}
                                </span>
                                {s.desc && (
                                  <span className="text-[11px] text-[#999] mt-0.5">{s.desc}</span>
                                )}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="min-h-11 min-w-11 flex items-center justify-center text-[#555] hover:text-[#1a1a1a] transition-colors rounded-lg"
                aria-label="Buscar"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <Link
                href="/conta"
                className="hidden md:flex min-h-11 min-w-11 items-center justify-center text-[#555] hover:text-[#1a1a1a] transition-colors rounded-lg"
                aria-label="Conta"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>

              <button
                onClick={openCart}
                className="relative min-h-11 min-w-11 flex items-center justify-center text-[#555] hover:text-[#1a1a1a] transition-colors rounded-lg"
                aria-label="Carrinho"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                <AnimatePresence>
                  {itemCount() > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1a1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {itemCount()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile nav toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden min-h-11 min-w-11 flex items-center justify-center text-[#555] hover:text-[#111] rounded-lg transition-colors ml-0.5"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <X className="w-5 h-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <span className="flex flex-col gap-[5px]">
                        <span className="w-5 h-[1.5px] bg-current block" />
                        <span className="w-5 h-[1.5px] bg-current block" />
                        <span className="w-3.5 h-[1.5px] bg-current block" />
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Search bar — expands inside the floating card */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden px-5 lg:px-8"
              >
                <form action="/produtos" method="GET" className="pb-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
                    <input
                      autoFocus
                      name="busca"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Buscar produtos..."
                      className="w-full border border-[#e0d8f5] focus:border-[#1a1a1a] bg-white/60 rounded-xl pl-11 pr-4 py-3 text-sm text-[#111] placeholder-[#bbb] outline-none transition-colors"
                    />
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Mobile menu — drops below the floating card ── */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-30 bg-black/10"
                style={{ top: headerHeight }}
              />

              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="absolute left-0 right-0 z-40 lg:hidden px-4 mt-2 max-h-[calc(100dvh-var(--header-height)-1rem)] overflow-y-auto"
              >
                <div
                  className="max-w-7xl mx-auto rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(248,245,255,0.96)",
                    backdropFilter: "blur(32px) saturate(200%)",
                    WebkitBackdropFilter: "blur(32px) saturate(200%)",
                    border: "1px solid rgba(98,41,157,0.18)",
                    boxShadow: "0 20px 60px rgba(98,41,157,0.14), 0 4px 16px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.95)",
                  }}
                >
                  <div className="py-4 px-2">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.href + link.label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                      >
                        {link.sub ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setMobileExpanded((v) =>
                                  v === link.label ? null : link.label
                                )
                              }
                              className="flex w-full items-center justify-between px-4 py-3.5 text-[#111] hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-xl transition-colors font-medium text-sm"
                            >
                              {link.label}
                              <ChevronDown
                                className={`w-4 h-4 opacity-40 transition-transform ${
                                  mobileExpanded === link.label ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            <AnimatePresence>
                              {mobileExpanded === link.label && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden pl-2"
                                >
                                  {link.sub.map((s) => (
                                    <Link
                                      key={s.href}
                                      href={s.href}
                                      onClick={() => {
                                        setMobileOpen(false);
                                        setMobileExpanded(null);
                                      }}
                                      className="block px-4 py-2.5 text-sm text-[#666] hover:text-[#1a1a1a] rounded-lg"
                                    >
                                      {s.label}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-between px-4 py-3.5 text-[#111] hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5 rounded-xl transition-colors font-medium text-sm"
                          >
                            {link.label}
                          </Link>
                        )}
                      </motion.div>
                    ))}

                    <div className="mx-4 mt-2 pt-3 border-t border-black/8 flex items-center gap-3">
                      <Link
                        href="/conta"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 text-xs text-[#777] hover:text-[#1a1a1a] transition-colors px-1"
                      >
                        <User className="w-4 h-4" />
                        Minha conta
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      </div>

      <CartDrawer />
    </>
  );
}
