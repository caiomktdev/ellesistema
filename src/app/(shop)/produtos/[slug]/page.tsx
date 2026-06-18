import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetail from "@/components/shop/ProductDetail";
import { getCatalogProductBySlug } from "@/lib/catalog";

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug, active: true },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: true,
        reviews: {
          where: { approved: true },
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = (await getProduct(slug)) ?? getCatalogProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Line Fit`,
    description: product.description?.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dbProduct = await getProduct(slug);
  const catalogProduct = !dbProduct ? getCatalogProductBySlug(slug) : null;

  if (!dbProduct && !catalogProduct) notFound();

  const data = dbProduct ?? catalogProduct!;

  return (
    <ProductDetail
      id={data.id}
      name={data.name}
      slug={data.slug}
      description={data.description}
      price={data.price}
      compareAt={data.compareAt}
      stock={data.stock}
      sku={data.sku ?? null}
      images={data.images}
      variants={data.variants}
      reviews={data.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title ?? null,
        body: r.body ?? null,
        userName: "user" in r && r.user?.name ? r.user.name : "Anônimo",
        createdAt: r.createdAt,
      }))}
    />
  );
}
