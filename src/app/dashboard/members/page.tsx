import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from "@/lib/auth/helpers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MembersTable } from "@/components/tables/members-table";

export default async function MembersPage() {
  const user = await getCurrentUser();
  const t = await getTranslations('members');

  if (!user) {
    redirect("/login");
  }

  // Mock data for demonstration
  const mockMembers = [
    {
      id: '1',
      matricule: '001-aa',
      firstName: 'Jean',
      lastName: 'Dupont',
      gender: 'MALE' as const,
      phone: '+237612345678',
      email: 'jean.dupont@example.com',
      situation: 'ACTIVE',
    },
    {
      id: '2',
      matricule: '002-ab',
      firstName: 'Marie',
      lastName: 'Martin',
      gender: 'FEMALE' as const,
      phone: '+237623456789',
      situation: 'ACTIVE',
    },
  ];

  return (
    <div>
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Link href="/dashboard/members/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addMember')}
            </Button>
          </Link>
        }
      />

      <div className="mt-6">
        <MembersTable members={mockMembers} />
      </div>
    </div>
  );
}
