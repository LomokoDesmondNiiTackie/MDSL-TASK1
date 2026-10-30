"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ChartCandlestick,
  Wallet,
  ArrowLeftRight,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Markets",
    href: "/dashboard/markets",
    icon: ChartCandlestick,
  },
  {
    name: "Accounts",
    href: "/dashboard/accounts",
    icon: Wallet,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen p-4 text-foreground sm:p-5">
      <aside className="flex w-60 shrink-0 flex-col rounded-2xl p-5 shadow-sm">
        <Link href="/dashboard" className="mb-10 flex items-center gap-3 px-2">
            <h2 className="text-lg font-bold tracking-tight">StockForex</h2>
        </Link>

        <nav aria-label="Main navigation" className="flex flex-col gap-1.5">
          {navigation.map(({ name, href, icon: Icon }) => {
            const isActive =
              href === "/dashboard"
                ? pathname === href
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted hover:bg-slate-100/20 hover:text-foreground"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className="shrink-0"
                />

                <span>{name}</span>

                {isActive && (
                  <span className="ml-auto size-1.5 rounded-full bg-white/80" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
