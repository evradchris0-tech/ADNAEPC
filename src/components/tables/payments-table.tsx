'use client';

import { useTranslations } from 'next-intl';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { formatCurrency, formatShortDate } from '@/lib/utils/format';
import { PaymentType } from '@/generated/prisma';
import Link from 'next/link';

interface Payment {
  id: string;
  amount: number;
  paymentType: PaymentType;
  paymentDate: string;
  reference?: string | null;
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
  };
  commitment?: {
    id: string;
    year: number;
  };
}

interface PaymentsTableProps {
  payments: Payment[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  showMember?: boolean;
}

export function PaymentsTable({
  payments,
  loading = false,
  onDelete,
  showMember = true,
}: PaymentsTableProps) {
  const t = useTranslations('payments');
  const tCommon = useTranslations('common');

  const getPaymentTypeLabel = (type: PaymentType) => {
    const labels: Record<PaymentType, string> = {
      [PaymentType.CASH]: t('cash'),
      [PaymentType.CHECK]: t('check'),
      [PaymentType.MOBILE_MONEY]: t('mobileMoney'),
      [PaymentType.BANK_TRANSFER]: t('bankTransfer'),
    };
    return labels[type] || type;
  };

  const getPaymentTypeVariant = (type: PaymentType): 'default' | 'secondary' | 'outline' => {
    const variants: Record<PaymentType, 'default' | 'secondary' | 'outline'> = {
      [PaymentType.CASH]: 'default',
      [PaymentType.CHECK]: 'secondary',
      [PaymentType.MOBILE_MONEY]: 'outline',
      [PaymentType.BANK_TRANSFER]: 'outline',
    };
    return variants[type] || 'default';
  };

  const columns = [
    {
      key: 'date',
      header: t('date'),
      cell: (row: Payment) => (
        <div className="font-medium">
          {formatShortDate(row.paymentDate, 'fr')}
        </div>
      ),
    },
    ...(showMember
      ? [
          {
            key: 'member',
            header: t('member'),
            cell: (row: Payment) => (
              <div>
                {row.member && (
                  <>
                    <div className="font-medium">
                      {row.member.firstName} {row.member.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {row.member.matricule}
                    </div>
                  </>
                )}
              </div>
            ),
          },
        ]
      : []),
    {
      key: 'amount',
      header: t('amount'),
      cell: (row: Payment) => (
        <div className="font-medium text-green-600">
          {formatCurrency(Number(row.amount), 'fr')}
        </div>
      ),
    },
    {
      key: 'type',
      header: t('paymentType'),
      cell: (row: Payment) => (
        <Badge variant={getPaymentTypeVariant(row.paymentType)}>
          {getPaymentTypeLabel(row.paymentType)}
        </Badge>
      ),
    },
    {
      key: 'year',
      header: t('year'),
      cell: (row: Payment) => (
        <div className="text-muted-foreground">
          {row.commitment?.year ?? '-'}
        </div>
      ),
    },
    {
      key: 'reference',
      header: t('reference'),
      cell: (row: Payment) => (
        <div className="text-sm text-muted-foreground">
          {row.reference || '-'}
        </div>
      ),
    },
    {
      key: 'actions',
      header: tCommon('actions'),
      cell: (row: Payment) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/payments/${row.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/payments/${row.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={payments}
      loading={loading}
      emptyMessage={t('noPayments')}
    />
  );
}
