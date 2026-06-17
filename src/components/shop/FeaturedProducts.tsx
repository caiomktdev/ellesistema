import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "./ProductCard";
import { CATALOG_PRODUCTS, getProductBadge } from "@/lib/catalog";
import { getProductMedia } from "@/lib/product-media";

async function getFeatured() {
  try {
    return await prisma.product.findMany({
      where: { featured: true, active: true },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

type DisplayProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt?: number | null;
  imageUrl?: string | null;
  badge?: string | null;
};

export default async function FeaturedProducts() {
  const products = await getFeatured();

  const display: DisplayProduct[] =
    products.length > 0
      ? products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          compareAt: p.compareAt,
          imageUrl: p.images[0]?.url ?? null,
          badge: getProductBadge(p.slug),
        }))
      : CATALOG_PRODUCTS.filter((p) => p.featured)
          .slice(0, 8)
          .map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            compareAt: p.compareAt,
            imageUrl: getProductMedia(p.slug).primary,
            badge: p.badge,
          }));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-10 md:py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] text-[#999] tracking-[0.25em] uppercase mb-1.5">Line Fit</p>
          <h2 className="text-2xl md:text-3xl font-black text-[#111] tracking-tight">Mais vendidos</h2>
        </div>
        <Link
          href="/produtos"
          className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#111] tracking-[0.15em] border-b border-[#111] pb-0.5 hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-colors"
        >
          VER TODOS
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-5">
        {display.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            compareAt={product.compareAt ?? undefined}
            imageUrl={product.imageUrl ?? undefined}
            badge={product.badge ?? undefined}
          />
        ))}
      </div>

      <div className="flex md:hidden justify-center mt-8">
        <Link
          href="/produtos"
          className="flex items-center gap-2 text-xs font-semibold text-[#111] tracking-[0.2em] border border-[#111] px-8 py-3.5 hover:bg-[#111] hover:text-white transition-colors"
        >
          VER TODOS OS PRODUTOS
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
