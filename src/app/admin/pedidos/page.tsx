import { prisma } from "@/lib/prisma";
import AdminOrders from "@/components/admin/AdminOrders";

async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return (
    <AdminOrders
      orders={orders.map((o: {
        id: string; orderNumber: number; total: number; status: string;
        paymentStatus: string; paymentMethod?: string | null; trackingCode?: string | null;
        createdAt: Date; user?: { name: string; email: string } | null;
        items: Array<{ product: { name: string } }>;
      }) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        trackingCode: o.trackingCode,
        createdAt: o.createdAt,
        userName: o.user?.name ?? null,
        userEmail: o.user?.email ?? null,
        itemCount: o.items.length,
      }))}
    />
  );
}
