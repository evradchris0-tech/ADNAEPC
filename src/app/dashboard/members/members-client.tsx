'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMembers, useDeleteMember } from '@/hooks/use-members';
import { MembersTable } from '@/components/tables/members-table';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function MembersClient() {
  const t = useTranslations('members');
  const tCommon = useTranslations('common');

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 20,
  });

  // Data fetching
  const { members, isLoading, refresh } = useMembers(filters);
  const { deleteMember, isDeleting } = useDeleteMember();

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const result = await deleteMember(deleteId);
      if (result.success) {
        toast.success(t('deleted'));
        refresh();
        setDeleteId(null);
      } else {
        toast.error(result.error || tCommon('error'));
      }
    } catch (error) {
      toast.error(tCommon('error'));
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={tCommon('search')}
          className="pl-10"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
        />
      </div>

      {/* Table */}
      <MembersTable members={members} loading={isLoading} />

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('deleteMember')}
        description={t('deleteConfirm')}
      />
    </div>
  );
}
