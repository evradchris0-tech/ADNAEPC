'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCommitments, useDeleteCommitment } from '@/hooks/use-commitments';
import { CommitmentsTable } from '@/components/tables/commitments-table';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function CommitmentsClient() {
  const t = useTranslations('commitments');
  const tCommon = useTranslations('common');

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
  });

  // Data fetching
  const { commitments, isLoading, refresh } = useCommitments(filters);
  const { deleteCommitment, isDeleting } = useDeleteCommitment();

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const result = await deleteCommitment(deleteId);
      if (result.success) {
        toast.success('Engagement supprimé avec succès');
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
          <Link href="/dashboard/commitments/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addCommitment')}
            </Button>
          </Link>
        }
      />

      {/* Table */}
      <CommitmentsTable
        commitments={commitments}
        loading={isLoading}
        onDelete={setDeleteId}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('editCommitment')}
        description="Êtes-vous sûr de vouloir supprimer cet engagement ?"
        isLoading={isDeleting}
      />
    </div>
  );
}
