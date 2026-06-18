import { prisma } from "@/lib/prisma";
import ProductsClient from "@/components/shop/ProductsClient";
import { filterCatalogProducts, getProductBadge } from "@/lib/catalog";

interface SearchParams {
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

    const orderBy: Record<string, string> = {};
    if (params.ordem === "menor") orderBy.price = "asc";
    else if (params.ordem === "maior") orderBy.price = "desc";
    else orderBy.createdAt = "desc";

    return await prisma.product.findMany({
      where,
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy,
    });
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);

  type DbProduct = {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAt: number | null;
    images: Array<{ url: string }>;
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
          badge: getProductBadge(p.slug),
        }))
      : filterCatalogProducts(params);

  return <ProductsClient initialProducts={display} searchParams={params} />;
}
