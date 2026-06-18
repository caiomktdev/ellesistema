import { getProductMedia } from "@/lib/product-media";

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  stock: number;
  sku: string;
  featured: boolean;
  badge: string | null;
  categorySlug: string;
  categoryName: string;
  description: string;
  weight: number;
};

export const CATALOG_CATEGORIES = [
  { id: "cat-kits", name: "Kits", slug: "kits" },
];

const KIT4_DESCRIPTION = `<p>Kit com <strong>4 camisas</strong> da mesma cor. Qualidade premium, tecido macio e durável, ideal para o dia a dia.</p>`;

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  { id: "cat-1", name: "Kit 4 Camisas Brancas", slug: "kit-4-camisas-brancas", price: 29990, compareAt: null, stock: 50, sku: "EL-K4-BRA", featured: true, badge: null, categorySlug: "kits", categoryName: "Kits", description: KIT4_DESCRIPTION, weight: 0.8 },
  { id: "cat-2", name: "Kit 4 Camisas Pretas", slug: "kit-4-camisas-pretas", price: 29990, compareAt: null, stock: 50, sku: "EL-K4-PRE", featured: true, badge: null, categorySlug: "kits", categoryName: "Kits", description: KIT4_DESCRIPTION, weight: 0.8 },
  { id: "cat-3", name: "Kit 4 Camisas Ofwhite", slug: "kit-4-camisas-ofwhite", price: 29990, compareAt: null, stock: 50, sku: "EL-K4-OFW", featured: true, badge: null, categorySlug: "kits", categoryName: "Kits", description: KIT4_DESCRIPTION, weight: 0.8 },
  { id: "cat-4", name: "Kit 4 Camisas Azul Marinho", slug: "kit-4-camisas-azul-marinho", price: 29990, compareAt: null, stock: 50, sku: "EL-K4-AZM", featured: true, badge: null, categorySlug: "kits", categoryName: "Kits", description: KIT4_DESCRIPTION, weight: 0.8 },
];

export function getCatalogVariants(_productId: string) {
  return [];
}

export function getCatalogImages(slug: string, productId: string) {
  const media = getProductMedia(slug);
  return [{ id: `${productId}-img-0`, url: media.primary, alt: slug, position: 0, productId }];
}

export function getCatalogProductBySlug(slug: string) {
  const product = CATALOG_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  const category = CATALOG_CATEGORIES.find((c) => c.slug === product.categorySlug);
  return {
    ...product,
    images: getCatalogImages(product.slug, product.id),
    variants: [],
    category: category
      ? { id: category.id, name: category.name, slug: category.slug, description: null, imageUrl: null, active: true, createdAt: new Date() }
      : null,
    reviews: [] as Array<{ id: string; rating: number; title?: string | null; body?: string | null; createdAt: Date; user?: { name: string } }>,
  };
}

export function filterCatalogProducts(params: {
  busca?: string;
  ordem?: string;
  destaque?: string;
}) {
  let list = [...CATALOG_PRODUCTS];

  if (params.destaque === "true") list = list.filter((p) => p.featured);
  if (params.busca) {
    const q = params.busca.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (params.ordem === "menor") list.sort((a, b) => a.price - b.price);
  else if (params.ordem === "maior") list.sort((a, b) => b.price - a.price);

  return list.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAt: p.compareAt,
    imageUrl: getProductMedia(p.slug).primary,
    badge: p.badge,
  }));
}

export function getCatalogProductByIdOrSlug(id: string, slug?: string) {
  return CATALOG_PRODUCTS.find((p) => p.id === id || p.slug === slug);
}

export function getProductBadge(slug: string): string | null {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug)?.badge ?? null;
}
