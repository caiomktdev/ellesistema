import AdminCoupons from "@/components/admin/AdminCoupons";
import { prisma } from "@/lib/prisma";

async function getCoupons() {
  try {
    return await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  return <AdminCoupons coupons={coupons} />;
}
