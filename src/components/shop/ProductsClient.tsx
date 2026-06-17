"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, ChevronDown, Grid3X3, List, X } from "lucide-react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number | null;
  imageUrl?: string | null;
  categoryName?: string | null;
  badge?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  initialProducts: Product[];
  categories: Category[];
  searchParams: {
    categoria?: string;
    busca?: string;
    ordem?: string;
    destaque?: string;
  };
}

const sortOptions = [
  { value: "recente", label: "Mais recentes" },
  { value: "menor", label: "Menor preço" },
  { value: "maior", label: "Maior preço" },
  { value: "relevancia", label: "Relevância" },
];

const MOCK_CATEGORIES = [
  { id: "1", name: "Tops & Cropped", slug: "tops" },
  { id: "2", name: "Leggings", slug: "leggings" },
  { id: "3", name: "Conjuntos", slug: "conjuntos" },
  { id: "4", name: "Shorts", slug: "shorts" },
  { id: "5", name: "Macacões", slug: "macacoes" },
  { id: "6", name: "Acessórios", slug: "acessorios" },
];

export default function ProductsClient({
  initialProducts,
  categories,
  searchParams,
}: Props) {
  const router = useRouter();
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const displayCategories = categories.length > 0 ? categories : MOCK_CATEGORIES;

  const buildUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { ...searchParams, ...updates };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `/produtos?${params.toString()}`;
  };

  const currentSort = sortOptions.find((o) => o.value === (searchParams.ordem ?? "recente"))?.label ?? "Mais recentes";

  const activeFilters = [
    searchParams.categoria && `${searchParams.categoria}`,
    searchParams.busca && `"${searchParams.busca}"`,
    searchParams.destaque === "true" && "Destaques",
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-8 sm:py-10">

      {/* Page header */}
      <div className="mb-6 sm:mb-8">
        <p className="text-[10px] text-[#999] tracking-[0.28em] uppercase mb-1.5">Line Fit</p>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-[#111] tracking-tight break-words">
          {searchParams.busca
            ? `Resultados para "${searchParams.busca}"`
            : searchParams.categoria
            ? searchParams.categoria.charAt(0).toUpperCase() + searchParams.categoria.slice(1)
            : "Todos os Produtos"}
        </h1>
        <p className="text-[#bbb] text-sm mt-1">{initialProducts.length} produtos encontrados</p>
      </div>

      {/* ── Filter bar ── */}
      <div className="border-y border-[#ebebeb] py-3 mb-6 sm:mb-8">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-none -mx-1 px-1">

          {/* Filter toggle (mobile/tablet) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-[#333] hover:text-[#1a1a1a] transition-colors pr-4 mr-4 border-r border-[#ebebeb] flex-shrink-0 min-h-11"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            FILTRAR
          </button>

          {/* Category pills — desktop only */}
          <div className="hidden lg:flex items-center gap-2 flex-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => router.push("/produtos")}
              className={`flex-shrink-0 px-4 py-1.5 text-xs font-medium tracking-wide border transition-colors ${
                !searchParams.categoria
                  ? "border-[#111] bg-[#111] text-white"
                  : "border-[#e0e0e0] text-[#888] hover:border-[#111] hover:text-[#111]"
              }`}
            >
              Todos
            </button>
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.push(buildUrl({ categoria: cat.slug }))}
                className={`flex-shrink-0 px-4 py-1.5 text-xs font-medium tracking-wide border transition-colors ${
                  searchParams.categoria === cat.slug
                    ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                    : "border-[#e0e0e0] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto sm:ml-5 sm:pl-5 sm:border-l sm:border-[#ebebeb]">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#555] hover:text-[#111] transition-colors min-h-11 px-1"
              >
                <span className="hidden sm:inline text-[#bbb] mr-0.5">Ordenar:</span>
                <span className="max-w-[100px] sm:max-w-none truncate">{currentSort}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-30 min-w-[160px]"
                  >
                    <div
                      className="rounded-xl overflow-hidden py-1.5"
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(0,0,0,0.08)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                      }}
                    >
                      {sortOptions.map((o) => (
                        <button
                          key={o.value}
                          onClick={() => { router.push(buildUrl({ ordem: o.value })); setSortOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                            (searchParams.ordem ?? "recente") === o.value
                              ? "text-[#1a1a1a] font-semibold bg-[#1a1a1a]/5"
                              : "text-[#555] hover:text-[#111] hover:bg-black/4"
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grid/List toggle — tablet+ */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setGridView("grid")}
                className={`min-h-11 min-w-11 flex items-center justify-center transition-colors ${gridView === "grid" ? "text-[#111]" : "text-[#ccc] hover:text-[#888]"}`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGridView("list")}
                className={`min-h-11 min-w-11 flex items-center justify-center transition-colors ${gridView === "list" ? "text-[#111]" : "text-[#ccc] hover:text-[#888]"}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile expanded filter panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-[#faf9fd] border border-[#ebebeb] rounded-xl p-4 sm:p-5">
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-3 lg:hidden">Ordenar por</p>
              <div className="flex flex-wrap gap-2 mb-4 lg:hidden">
                {sortOptions.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { router.push(buildUrl({ ordem: o.value })); setFiltersOpen(false); }}
                    className={`px-4 py-2 text-xs font-medium border transition-colors ${
                      (searchParams.ordem ?? "recente") === o.value
                        ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                        : "border-[#e0e0e0] text-[#888] hover:border-[#1a1a1a]"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-3">Categorias</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { router.push("/produtos"); setFiltersOpen(false); }}
                  className={`px-4 py-2 text-xs font-medium border transition-colors ${
                    !searchParams.categoria
                      ? "border-[#111] bg-[#111] text-white"
                      : "border-[#e0e0e0] text-[#888] hover:border-[#111]"
                  }`}
                >
                  Todos
                </button>
                {displayCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { router.push(buildUrl({ categoria: cat.slug })); setFiltersOpen(false); }}
                    className={`px-4 py-2 text-xs font-medium border transition-colors ${
                      searchParams.categoria === cat.slug
                        ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                        : "border-[#e0e0e0] text-[#888] hover:border-[#1a1a1a]"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter tags */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {activeFilters.map((f) => (
            <span
              key={f}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#111] text-white text-[10px] font-semibold tracking-wider"
            >
              {f.toUpperCase()}
              <button onClick={() => router.push("/produtos")} className="p-1.5 -m-1.5">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Product grid */}
      {initialProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#bbb]">
          <p className="text-lg font-semibold text-[#888] mb-2">Nenhum produto encontrado</p>
          <p className="text-sm">Tente outros filtros ou termos de busca</p>
        </div>
      ) : (
        <motion.div
          layout
          className={
            gridView === "grid"
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-8 sm:gap-y-10"
              : "grid grid-cols-1 sm:grid-cols-2 gap-6"
          }
        >
          {initialProducts.map((product, i) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                compareAt={product.compareAt ?? undefined}
                imageUrl={product.imageUrl ?? undefined}
                badge={product.badge ?? undefined}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
