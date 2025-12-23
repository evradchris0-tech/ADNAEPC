import { PageHeader } from "@/components/ui/page-header";
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const t = await getTranslations('reports');

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
      />

      <div className="mt-6">
        <p className="text-muted-foreground">Reports interface coming soon...</p>
      </div>
    </div>
  );
}
