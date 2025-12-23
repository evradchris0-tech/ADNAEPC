import { PageHeader } from "@/components/ui/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { Users, HandCoins, Wallet, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description={`Bienvenue, ${user.name}!`}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Total Paroissiens"
          value="0"
          icon={Users}
          description="Membres actifs"
          variant="default"
        />
        <StatsCard
          title="Engagements 2025"
          value="0 FCFA"
          icon={HandCoins}
          description="Année en cours"
          variant="success"
        />
        <StatsCard
          title="Versements du mois"
          value="0 FCFA"
          icon={Wallet}
          description="Ce mois-ci"
          variant="default"
        />
        <StatsCard
          title="Taux de réalisation"
          value="0%"
          icon={TrendingUp}
          description="Global"
          variant="success"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune activité récente pour le moment.
          </p>
          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p>Email: {user.email}</p>
            <p>Rôle: {user.role}</p>
            <p>
              Permissions:{" "}
              {user.permissions.length > 0
                ? user.permissions.join(", ")
                : "Aucune"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
