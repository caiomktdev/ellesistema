import AdminShipping from "@/components/admin/AdminShipping";
import { prisma } from "@/lib/prisma";

async function getRules() {
  try {
    return await prisma.shippingRule.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminShippingPage() {
  const rules = await getRules();
  return <AdminShipping rules={rules} />;
}
