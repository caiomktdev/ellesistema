import { prisma } from "@/lib/prisma";
import ProductsClient from "@/components/shop/ProductsClient";
import {
  CATALOG_CATEGORIES,
  filterCatalogProducts,
  getProductBadge,
} from "@/lib/catalog";

interface SearchParams {
  categoria?: string;
  busca?: string;
  ordem?: string;
  destaque?: string;
  pagina?: string;
}

async function getProducts(params: SearchParams) {
  try {
    const where: Record<string, unknown> = { active: true };
    if (params.destaque === "true") where.featured = true;
    if (params.busca) where.name = { contains: params.busca, mode: "insensitive" };
    if (params.categoria) {
      if (params.categoria === "roupas") {
        where.category = { slug: { in: ["tops", "leggings", "shorts", "conjuntos", "macacoes", "roupas"] } };
      } else if (params.categoria === "colecao-pulsar") {
        where.featured = true;
      } else {
        where.category = { slug: params.categoria };
      }
    }

    const orderBy: Record<string, string> = {};
    if (params.ordem === "menor") orderBy.price = "asc";
    else if (params.ordem === "maior") orderBy.price = "desc";
    else orderBy.createdAt = "desc";

    return await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { position: "asc" }, take: 1 },
        category: { select: { name: true } },
      },
      orderBy,
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const db = await prisma.category.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
    if (db.length > 0) return db;
  } catch {
    /* fallback */
  }
  return CATALOG_CATEGORIES.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  type DbProduct = {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAt: number | null;
    images: Array<{ url: string }>;
    category?: { name: string } | null;
  };

  const display =
    products.length > 0
      ? (products as DbProduct[]).map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          compareAt: p.compareAt,
          imageUrl: p.images[0]?.url ?? null,
          categoryName: p.category?.name ?? null,
          badge: getProductBadge(p.slug),
        }))
      : filterCatalogProducts(params);

  return (
    <ProductsClient
      initialProducts={display}
      categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
      searchParams={params}
    />
  );
}
