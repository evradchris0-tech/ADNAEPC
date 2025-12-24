import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { User, Shield, Bell, Palette, Globe } from "lucide-react";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const t = await getTranslations("settings");
  const tCommon = await getTranslations("common");

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t("profile")}
            </CardTitle>
            <CardDescription>
              Informations sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("name")}
              </label>
              <p className="text-lg">{user.name || "Non défini"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("email")}
              </label>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t("role")}
              </label>
              <p className="text-lg capitalize">{user.role || "Utilisateur"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("security")}
            </CardTitle>
            <CardDescription>
              {t("securityDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Nombre de permissions : {user.permissions.length}
              </p>
              {user.permissions.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    Voir les permissions
                  </summary>
                  <ul className="mt-2 ml-4 list-disc text-muted-foreground">
                    {user.permissions.map((perm) => (
                      <li key={perm}>{perm}</li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {t("notifications")}
            </CardTitle>
            <CardDescription>
              {t("notificationsDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Fonctionnalité en cours de développement.
            </p>
          </CardContent>
        </Card>

        {/* Apparence */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t("appearance")}
            </CardTitle>
            <CardDescription>
              {t("appearanceDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Fonctionnalité en cours de développement.
            </p>
          </CardContent>
        </Card>

        {/* Langue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("language")}
            </CardTitle>
            <CardDescription>
              Langue de l'interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Français (FR)
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Sélection de la langue à venir.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
