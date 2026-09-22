import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dictionary, type Locale } from "@/lib/dictionary";
import { Reveal } from "@/components/motion/reveal";
import { OrderStatusBadge } from "@/components/shop/order-status-badge";
import { formatPrice } from "@/lib/utils";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");

  const cookieStore = await cookies();
  const locale = (cookieStore.get("ae_locale")?.value === "en" ? "en" : "ar") as Locale;
  const dict = dictionary[locale];

  const orders = await prisma.order.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 md:px-8">
      <Reveal>
        <h1 className="font-display text-3xl text-foreground">{dict.account.title}</h1>
        <div className="mt-4 rounded-2xl card-border bg-background-card p-5">
          <p className="text-sm text-muted">{session.name}</p>
          <p className="text-sm text-muted" dir="ltr">
            {session.email}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="font-display mt-10 mb-4 text-xl text-foreground">{dict.account.orders}</h2>
        {orders.length === 0 ? (
          <p className="rounded-2xl card-border bg-background-card p-8 text-center text-muted">
            {dict.account.noOrders}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl card-border bg-background-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {dict.account.orderNumber}: <span dir="ltr">{order.number}</span>
                    </p>
                    <p className="text-xs text-muted">
                      {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} locale={locale} />
                </div>
                <ul className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm text-muted">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity, locale)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold text-foreground">
                  <span>{dict.account.orderTotal}</span>
                  <span className="text-amber-300">{formatPrice(order.total, locale)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}
