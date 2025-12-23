"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Users2,
  HandCoins,
  Wallet,
  Gift,
  Church,
  FileText,
  Settings,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');

  const navigation = [
    { name: t('dashboard'), href: "/dashboard", icon: LayoutDashboard },
    { name: t('members'), href: "/dashboard/members", icon: Users },
    { name: t('associations'), href: "/dashboard/associations", icon: Users2 },
    { name: t('commitments'), href: "/dashboard/commitments", icon: HandCoins },
    { name: t('payments'), href: "/dashboard/payments", icon: Wallet },
    { name: t('contributions'), href: "/dashboard/contributions", icon: Gift },
    { name: t('offerings'), href: "/dashboard/offerings", icon: Church },
    { name: t('reports'), href: "/dashboard/reports", icon: FileText },
    { name: t('settings'), href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h1 className="text-2xl font-bold">{tCommon('appName')}</h1>
        <p className="text-sm text-muted-foreground">{tCommon('appDescription')}</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
