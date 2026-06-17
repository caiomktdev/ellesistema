import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  CATALOG_CATEGORIES,
  CATALOG_PRODUCTS,
  getCatalogImages,
  getCatalogVariants,
} from "../src/lib/catalog";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Iniciando seed...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@linefit.com.br" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@linefit.com.br",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✓ Usuário admin criado: admin@linefit.com.br / admin123");

  const catalogSlugs = CATALOG_PRODUCTS.map((p) => p.slug);
  const categoryIds: Record<string, string> = {};

  for (const cat of CATALOG_CATEGORIES) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, active: true },
      create: { name: cat.name, slug: cat.slug, active: true },
    });
    categoryIds[cat.slug] = c.id;
  }
  console.log("✓ Categorias criadas");

  await prisma.product.updateMany({
    where: { slug: { notIn: catalogSlugs } },
    data: { active: false },
  });

  for (const p of CATALOG_PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        price: p.price,
        compareAt: p.compareAt,
        stock: p.stock,
        sku: p.sku,
        featured: p.featured,
        weight: p.weight,
        active: true,
        categoryId: categoryIds[p.categorySlug],
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        compareAt: p.compareAt,
        stock: p.stock,
        sku: p.sku,
        featured: p.featured,
        weight: p.weight,
        active: true,
        categoryId: categoryIds[p.categorySlug],
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    const images = getCatalogImages(p.slug, product.id);
    for (const img of images) {
      await prisma.productImage.create({
        data: { productId: product.id, url: img.url, alt: img.alt, position: img.position },
      });
    }

    await prisma.productVariant.deleteMany({ where: { productId: product.id } });
    for (const v of getCatalogVariants(product.id)) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: v.name,
          value: v.value,
          price: v.price,
          stock: v.stock,
        },
      });
    }
  }
  console.log("✓ Produtos de moda fitness criados");

  await prisma.shippingRule.deleteMany({});
  await prisma.shippingRule.createMany({
    data: [
      { name: "Frete Padrão", minWeight: 0, maxWeight: 5, minValue: 0, price: 1990, days: 7 },
      { name: "Frete Grátis", minWeight: 0, minValue: 19900, price: 0, days: 7 },
    ],
  });
  console.log("✓ Regras de frete criadas");

  await prisma.coupon.deleteMany({});
  await prisma.coupon.createMany({
    data: [
      { code: "LINEFIT10", description: "10% de desconto", type: "percent", value: 10, minOrder: 0 },
      { code: "FRETEGRATIS", description: "Frete grátis", type: "shipping", value: 0, minOrder: 0 },
    ],
  });
  console.log("✓ Cupons criados");

  console.log("\n✅ Seed concluído!");
  console.log("🔑 Admin: admin@linefit.com.br / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
