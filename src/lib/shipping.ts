import { prisma } from "@/lib/prisma";

const DEFAULT_SHIPPING = 1990;
const FREE_SHIPPING_MIN = 50000;

export async function calculateShipping(subtotal: number, totalWeight = 0.5): Promise<{ cost: number; name: string; days: number }> {
  try {
    const rules = await prisma.shippingRule.findMany({
      where: { active: true },
      orderBy: { price: "asc" },
    });

    if (rules.length > 0) {
      const freeRule = rules.find((r) => r.price === 0 && subtotal >= r.minValue);
      if (freeRule) return { cost: 0, name: freeRule.name, days: freeRule.days };

      const match = rules.find(
        (r) =>
          r.price > 0 &&
          subtotal >= r.minValue &&
          (r.maxValue == null || subtotal <= r.maxValue) &&
          totalWeight >= r.minWeight &&
          (r.maxWeight == null || totalWeight <= r.maxWeight)
      );
      if (match) return { cost: match.price, name: match.name, days: match.days };
    }
  } catch {
    /* fallback */
  }

  if (subtotal >= FREE_SHIPPING_MIN) {
    return { cost: 0, name: "Frete Grátis", days: 7 };
  }
  return { cost: DEFAULT_SHIPPING, name: "Frete Padrão", days: 7 };
}
