import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";

export default async function ContributionsPage() {
  const user = await getCurrentUser();
  const t = await getTranslations("contributions");

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
      />

      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Cette page est en cours de développement. Les cotisations ponctuelles seront gérées ici.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Fonctionnalités à venir :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Enregistrement de cotisations ponctuelles</li>
              <li>Suivi des cotisations par membre</li>
              <li>Historique des cotisations</li>
              <li>Rapports de cotisations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
