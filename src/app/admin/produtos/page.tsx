import { prisma } from "@/lib/prisma";
import AdminProducts from "@/components/admin/AdminProducts";

async function getProducts() {
  try {
    return await prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        images: { take: 1, orderBy: { position: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({ where: { active: true }, orderBy: { name: "asc" } });
  } catch {
    return [];
  }
}

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <AdminProducts
      products={products.map((p: {
        id: string; name: string; slug: string; price: number; compareAt: number | null;
        stock: number; active: boolean; featured: boolean; sku?: string | null;
        category?: { name: string } | null; images: Array<{ url: string }>;
        createdAt: Date;
      }) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAt: p.compareAt,
        stock: p.stock,
        active: p.active,
        featured: p.featured,
        sku: p.sku,
        categoryName: p.category?.name ?? null,
        imageUrl: p.images[0]?.url ?? null,
        createdAt: p.createdAt,
      }))}
      categories={categories.map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))}
    />
  );
}
