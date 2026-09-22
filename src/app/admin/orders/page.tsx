import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-foreground md:text-3xl">الطلبات</h1>

      <div className="overflow-x-auto rounded-2xl card-border bg-background-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-5 py-3 text-start font-medium">رقم الطلب</th>
              <th className="px-5 py-3 text-start font-medium">العميل</th>
              <th className="px-5 py-3 text-start font-medium">المدينة</th>
              <th className="px-5 py-3 text-start font-medium">الدفع</th>
              <th className="px-5 py-3 text-start font-medium">الإجمالي</th>
              <th className="px-5 py-3 text-start font-medium">التاريخ</th>
              <th className="px-5 py-3 text-start font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/60 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground" dir="ltr">
                  {order.number}
                </td>
                <td className="px-5 py-3 text-muted">
                  {order.user?.name ?? order.guestName ?? "—"}
                </td>
                <td className="px-5 py-3 text-muted">{order.city}</td>
                <td className="px-5 py-3 text-muted">
                  {order.paymentMethod === "COD" ? "عند الاستلام" : "تحويل بنكي"}
                </td>
                <td className="px-5 py-3 font-semibold text-amber-300">
                  {formatPrice(order.total, "ar")}
                </td>
                <td className="px-5 py-3 text-muted">
                  {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                </td>
                <td className="px-5 py-3">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-10 text-center text-sm text-muted">لا توجد طلبات بعد</p>
        )}
      </div>
    </div>
  );
}
