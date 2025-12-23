"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Paroissiens", href: "/dashboard/members", icon: Users },
  { name: "Associations", href: "/dashboard/associations", icon: Users2 },
  { name: "Engagements", href: "/dashboard/commitments", icon: HandCoins },
  { name: "Versements", href: "/dashboard/payments", icon: Wallet },
  { name: "Cotisations", href: "/dashboard/contributions", icon: Gift },
  { name: "Offrandes", href: "/dashboard/offerings", icon: Church },
  { name: "Rapports", href: "/dashboard/reports", icon: FileText },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h1 className="text-2xl font-bold">ADNAEPC</h1>
        <p className="text-sm text-muted-foreground">Church Management</p>
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
