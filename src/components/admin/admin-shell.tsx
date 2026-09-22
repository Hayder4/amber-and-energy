"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  BadgePercent,
  ClipboardList,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

const navItems = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/collections", label: "المجموعات", icon: FolderTree },
  { href: "/admin/discounts", label: "الخصومات", icon: BadgePercent },
  { href: "/admin/orders", label: "الطلبات", icon: ClipboardList },
];

export function AdminShell({ userName, children }: { userName: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="mx-auto flex min-h-[85vh] max-w-7xl gap-6 px-4 py-8 md:px-8">
      <aside className="hidden w-60 shrink-0 flex-col gap-1 md:flex">
        <div className="mb-6 rounded-2xl card-border bg-background-card p-4">
          <p className="text-xs text-muted">مسجّل الدخول</p>
          <p className="truncate text-sm font-semibold text-amber-300">{userName}</p>
        </div>
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-amber-400/15 text-amber-300"
                  : "text-muted hover:bg-amber-400/5 hover:text-foreground"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
        <div className="mt-6 flex flex-col gap-1 border-t border-border pt-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-amber-400/5 hover:text-foreground"
          >
            <ArrowLeft size={17} /> العودة للمتجر
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-start text-sm font-medium text-cherry-500 hover:bg-cherry-500/10"
          >
            <LogOut size={17} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
