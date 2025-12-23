import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AssociationsPage() {
  const user = await getCurrentUser();
  const t = await getTranslations('associations');

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Link href="/dashboard/associations/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addAssociation')}
            </Button>
          </Link>
        }
      />

      <div className="mt-6">
        <p className="text-muted-foreground">Table coming in Phase 9...</p>
      </div>
    </div>
  );
}
