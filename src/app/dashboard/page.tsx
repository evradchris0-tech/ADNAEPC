import { PageHeader } from "@/components/ui/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { Users, HandCoins, Wallet, TrendingUp } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const t = await getTranslations('dashboard');

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <PageHeader
        title={t('title')}
        description={t('welcome', { name: user.name || 'User' })}
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title={t('totalMembers')}
          value="0"
          icon={Users}
          description={t('activeMembers')}
          variant="default"
        />
        <StatsCard
          title={t('activeCommitments')}
          value="0 FCFA"
          icon={HandCoins}
          description="2025"
          variant="success"
        />
        <StatsCard
          title={t('monthlyPayments')}
          value="0 FCFA"
          icon={Wallet}
          description={new Date().toLocaleDateString('fr-FR', { month: 'long' })}
          variant="default"
        />
        <StatsCard
          title={t('completionRate')}
          value="0%"
          icon={TrendingUp}
          description="Global"
          variant="success"
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('noActivity')}
          </p>
          <div className="mt-4 text-xs text-muted-foreground space-y-1">
            <p>{t('userEmail')}: {user.email}</p>
            <p>{t('userRole')}: {user.role}</p>
            <p>
              {t('userPermissions')}:{" "}
              {user.permissions.length > 0
                ? user.permissions.join(", ")
                : t('noActivity')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
