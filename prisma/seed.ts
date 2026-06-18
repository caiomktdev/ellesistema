import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Iniciando seed...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@elleessencial.com.br" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@elleessencial.com.br",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✓ Usuário admin criado: admin@elleessencial.com.br / admin123");

  const kit = await prisma.category.upsert({
    where: { slug: "kits" },
    update: { name: "Kits", active: true },
    create: { name: "Kits", slug: "kits", active: true },
  });
  console.log("✓ Categoria kits criada");

  await prisma.product.deleteMany({});

  const products = [
    { id: "cat-1", name: "Kit 4 Camisas Brancas", slug: "kit-4-camisas-brancas", price: 29990, stock: 50, sku: "EL-K4-BRA", featured: true, weight: 0.8, image: "/products/camisa-branca.png" },
    { id: "cat-2", name: "Kit 4 Camisas Pretas", slug: "kit-4-camisas-pretas", price: 29990, stock: 50, sku: "EL-K4-PRE", featured: true, weight: 0.8, image: "/products/camisa-preta.png" },
    { id: "cat-3", name: "Kit 4 Camisas Ofwhite", slug: "kit-4-camisas-ofwhite", price: 29990, stock: 50, sku: "EL-K4-OFW", featured: true, weight: 0.8, image: "/products/camisa-ofwhite.png" },
    { id: "cat-4", name: "Kit 4 Camisas Azul Marinho", slug: "kit-4-camisas-azul-marinho", price: 29990, stock: 50, sku: "EL-K4-AZM", featured: true, weight: 0.8, image: "/products/camisa-preta.png" },
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        sku: p.sku,
        featured: p.featured,
        weight: p.weight,
        active: true,
        categoryId: kit.id,
      },
    });
    await prisma.productImage.create({
      data: { productId: product.id, url: p.image, alt: p.name, position: 0 },
    });
  }
  console.log("✓ 8 produtos kit criados");

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
      { code: "ELLEBASIC10", description: "10% de desconto", type: "percent", value: 10, minOrder: 0 },
      { code: "FRETEGRATIS", description: "Frete grátis", type: "shipping", value: 0, minOrder: 0 },
    ],
  });
  console.log("✓ Cupons criados");

  console.log("\n✅ Seed concluído!");
  console.log("🔑 Admin: admin@elleessencial.com.br / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
