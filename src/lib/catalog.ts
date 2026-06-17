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
  { id: "cat-tops", name: "Tops & Cropped", slug: "tops" },
  { id: "cat-leggings", name: "Leggings", slug: "leggings" },
  { id: "cat-conjuntos", name: "Conjuntos", slug: "conjuntos" },
  { id: "cat-shorts", name: "Shorts", slug: "shorts" },
  { id: "cat-macacoes", name: "Macacões", slug: "macacoes" },
  { id: "cat-acessorios", name: "Acessórios", slug: "acessorios" },
  { id: "cat-colecao", name: "Coleção Pulsar", slug: "colecao-pulsar" },
  { id: "cat-roupas", name: "Roupas", slug: "roupas" },
];

const BASE_DESCRIPTION = `<p>Peça desenvolvida com tecido premium <strong>zero transparência</strong>, ideal para treinos intensos e uso no dia a dia. Caimento anatômico e alta durabilidade.</p><ul><li>Composição: 86% poliamida · 14% elastano</li><li>Proteção UV50+</li><li>Não deforma após lavagens</li></ul>`;

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  { id: "cat-1", name: "Top Cropped Pulsar Ribana", slug: "top-cropped-pulsar-ribana", price: 8990, compareAt: 11990, stock: 40, sku: "LF-TOP-PUL-01", featured: true, badge: "Mais vendido", categorySlug: "tops", categoryName: "Tops", description: BASE_DESCRIPTION, weight: 0.15 },
  { id: "cat-2", name: "Legging Cintura Alta Compressão", slug: "legging-cintura-alta-compressao", price: 13990, compareAt: 17990, stock: 35, sku: "LF-LEG-CA-01", featured: true, badge: null, categorySlug: "leggings", categoryName: "Leggings", description: BASE_DESCRIPTION, weight: 0.25 },
  { id: "cat-3", name: "Conjunto Pulsar Verde Musgo", slug: "conjunto-pulsar-verde-musgo", price: 21990, compareAt: 27990, stock: 20, sku: "LF-CONJ-VM-01", featured: true, badge: "Novo", categorySlug: "conjuntos", categoryName: "Conjuntos", description: BASE_DESCRIPTION, weight: 0.4 },
  { id: "cat-4", name: "Short Ciclista Mid Waist", slug: "short-ciclista-mid-waist", price: 9990, compareAt: null, stock: 30, sku: "LF-SHT-MW-01", featured: false, badge: null, categorySlug: "shorts", categoryName: "Shorts", description: BASE_DESCRIPTION, weight: 0.18 },
  { id: "cat-5", name: "Top Nadador Com Bojo", slug: "top-nadador-com-bojo", price: 7990, compareAt: 10990, stock: 28, sku: "LF-TOP-NAD-01", featured: true, badge: "Oferta", categorySlug: "tops", categoryName: "Tops", description: BASE_DESCRIPTION, weight: 0.14 },
  { id: "cat-6", name: "Legging Flare Recortes", slug: "legging-flare-recortes", price: 15990, compareAt: null, stock: 22, sku: "LF-LEG-FL-01", featured: false, badge: null, categorySlug: "leggings", categoryName: "Leggings", description: BASE_DESCRIPTION, weight: 0.26 },
  { id: "cat-7", name: "Macacão Fitness Zíper", slug: "macacao-fitness-ziper", price: 18990, compareAt: 23990, stock: 18, sku: "LF-MAC-ZP-01", featured: true, badge: null, categorySlug: "macacoes", categoryName: "Macacões", description: BASE_DESCRIPTION, weight: 0.35 },
  { id: "cat-8", name: "Conjunto Khaki Premium", slug: "conjunto-khaki-premium", price: 24990, compareAt: 29990, stock: 15, sku: "LF-CONJ-KH-01", featured: true, badge: "Top Linha", categorySlug: "conjuntos", categoryName: "Conjuntos", description: BASE_DESCRIPTION, weight: 0.42 },
  { id: "cat-9", name: "Legging Push Up Scrunch", slug: "legging-push-up-scrunch", price: 14990, compareAt: 18990, stock: 25, sku: "LF-LEG-PU-01", featured: false, badge: null, categorySlug: "leggings", categoryName: "Leggings", description: BASE_DESCRIPTION, weight: 0.24 },
  { id: "cat-10", name: "Top Cropped Preto Básico", slug: "top-cropped-preto-basico", price: 6990, compareAt: null, stock: 50, sku: "LF-TOP-PR-01", featured: false, badge: null, categorySlug: "tops", categoryName: "Tops", description: BASE_DESCRIPTION, weight: 0.12 },
  { id: "cat-11", name: "Short Cargo Fitness", slug: "short-cargo-fitness", price: 11990, compareAt: 15990, stock: 24, sku: "LF-SHT-CG-01", featured: false, badge: null, categorySlug: "shorts", categoryName: "Shorts", description: BASE_DESCRIPTION, weight: 0.2 },
  { id: "cat-12", name: "Headband Pulsar", slug: "headband-pulsar", price: 2990, compareAt: null, stock: 100, sku: "LF-ACC-HB-01", featured: false, badge: null, categorySlug: "acessorios", categoryName: "Acessórios", description: BASE_DESCRIPTION, weight: 0.05 },
];

const SIZE_VALUES = ["P", "M", "G"] as const;

export function getCatalogVariants(productId: string) {
  return SIZE_VALUES.map((size, i) => ({
    id: `${productId}-size-${size.toLowerCase()}`,
    name: "Tamanho",
    value: size,
    price: null as number | null,
    stock: 15 - i * 2,
    productId,
  }));
}

export function getCatalogImages(slug: string, productId: string) {
  const media = getProductMedia(slug);
  const images = [{ id: `${productId}-img-0`, url: media.primary, alt: slug, position: 0, productId }];
  if (media.hover) {
    images.push({ id: `${productId}-img-1`, url: media.hover, alt: `${slug} hover`, position: 1, productId });
  }
  return images;
}

export function getCatalogProductBySlug(slug: string) {
  const product = CATALOG_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  const category = CATALOG_CATEGORIES.find((c) => c.slug === product.categorySlug);
  return {
    ...product,
    images: getCatalogImages(product.slug, product.id),
    variants: getCatalogVariants(product.id),
    category: category
      ? { id: category.id, name: category.name, slug: category.slug, description: null, imageUrl: null, active: true, createdAt: new Date() }
      : null,
    reviews: [] as Array<{ id: string; rating: number; title?: string | null; body?: string | null; createdAt: Date; user?: { name: string } }>,
  };
}

export function filterCatalogProducts(params: {
  categoria?: string;
  busca?: string;
  ordem?: string;
  destaque?: string;
}) {
  let list = [...CATALOG_PRODUCTS];

  if (params.destaque === "true") list = list.filter((p) => p.featured);
  if (params.categoria) {
    list = list.filter(
      (p) =>
        p.categorySlug === params.categoria ||
        (params.categoria === "roupas" && ["tops", "leggings", "shorts", "conjuntos", "macacoes"].includes(p.categorySlug)) ||
        (params.categoria === "colecao-pulsar" && p.featured)
    );
  }
  if (params.busca) {
    const q = params.busca.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (params.ordem === "menor") list.sort((a, b) => a.price - b.price);
  else if (params.ordem === "maior") list.sort((a, b) => b.price - a.price);
  else if (params.ordem === "relevancia") list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  else list.sort((a, b) => b.id.localeCompare(a.id));

  return list.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAt: p.compareAt,
    imageUrl: getProductMedia(p.slug).primary,
    categoryName: p.categoryName,
    badge: p.badge,
  }));
}

export function getCatalogProductByIdOrSlug(id: string, slug?: string) {
  return CATALOG_PRODUCTS.find((p) => p.id === id || p.slug === slug);
}

export function getProductBadge(slug: string): string | null {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug)?.badge ?? null;
}
