import AdminFinancial from "@/components/admin/AdminFinancial";
import { prisma } from "@/lib/prisma";

async function getFinancialData() {
  try {
    const [orders, monthlyData] = await Promise.all([
      prisma.order.findMany({
        where: { paymentStatus: "APPROVED" },
        orderBy: { createdAt: "desc" },
        select: { id: true, orderNumber: true, total: true, createdAt: true, paymentMethod: true },
        take: 50,
      }),
      prisma.order.groupBy({
        by: ["createdAt"],
        _sum: { total: true },
        _count: { id: true },
        where: { paymentStatus: "APPROVED" },
      }),
    ]);
    return { orders, monthlyData };
  } catch {
    return { orders: [], monthlyData: [] };
  }
}

export default async function AdminFinancialPage() {
  const data = await getFinancialData();
  return <AdminFinancial data={data} />;
}
