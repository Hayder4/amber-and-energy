import Link from "next/link";
import { DollarSign, Package, ShoppingCart, Users, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/shop/order-status-badge";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [revenueAgg, orderCount, productCount, customerCount, recentOrders] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-foreground md:text-3xl">نظرة عامة</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-300"
          >
            <Plus size={15} /> إضافة منتج
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="إجمالي المبيعات" value={formatPrice(revenueAgg._sum.total ?? 0, "ar")} />
        <StatCard icon={ShoppingCart} label="عدد الطلبات" value={String(orderCount)} />
        <StatCard icon={Package} label="عدد المنتجات" value={String(productCount)} />
        <StatCard icon={Users} label="عدد العملاء" value={String(customerCount)} />
      </div>

      <div className="rounded-2xl card-border bg-background-card">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-lg text-foreground">أحدث الطلبات</h2>
          <Link href="/admin/orders" className="text-sm text-amber-300 hover:text-amber-200">
            عرض الكل
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">لا توجد طلبات بعد</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-start text-xs text-muted">
                  <th className="px-5 py-3 text-start font-medium">رقم الطلب</th>
                  <th className="px-5 py-3 text-start font-medium">التاريخ</th>
                  <th className="px-5 py-3 text-start font-medium">الحالة</th>
                  <th className="px-5 py-3 text-start font-medium">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground" dir="ltr">
                      {order.number}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-5 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 font-semibold text-amber-300">
                      {formatPrice(order.total, "ar")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
