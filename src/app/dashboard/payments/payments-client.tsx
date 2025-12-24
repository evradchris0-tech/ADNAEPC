'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePayments, useDeletePayment } from '@/hooks/use-payments';
import { PaymentsTable } from '@/components/tables/payments-table';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export function PaymentsClient() {
  const t = useTranslations('payments');
  const tCommon = useTranslations('common');

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
  });

  // Data fetching
  const { payments, isLoading, refresh } = usePayments(filters);
  const { deletePayment, isDeleting } = useDeletePayment();

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const result = await deletePayment(deleteId);
      if (result.success) {
        toast.success('Versement supprimé avec succès');
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
          <Link href="/dashboard/payments/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('addPayment')}
            </Button>
          </Link>
        }
      />

      {/* Table */}
      <PaymentsTable
        payments={payments}
        loading={isLoading}
        onDelete={setDeleteId}
      />

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('editPayment')}
        description="Êtes-vous sûr de vouloir supprimer ce versement ?"
        isLoading={isDeleting}
      />
    </div>
  );
}
