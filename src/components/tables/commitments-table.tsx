'use client';

import { useTranslations } from 'next-intl';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';

interface Commitment {
  id: string;
  year: number;
  titheAmount: number;
  constructionAmount: number;
  debtAmount: number;
  totalCommitment: number;
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
  };
  payments?: Array<{
    id: string;
    amount: number;
  }>;
}

interface CommitmentsTableProps {
  commitments: Commitment[];
  loading?: boolean;
  onDelete?: (id: string) => void;
  showMember?: boolean;
}

export function CommitmentsTable({
  commitments,
  loading = false,
  onDelete,
  showMember = true,
}: CommitmentsTableProps) {
  const t = useTranslations('commitments');
  const tCommon = useTranslations('common');

  const calculatePaid = (commitment: Commitment) => {
    return commitment.payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
  };

  const calculateBalance = (commitment: Commitment) => {
    const paid = calculatePaid(commitment);
    return Number(commitment.totalCommitment) - paid;
  };

  const getBalanceVariant = (balance: number): 'default' | 'secondary' | 'destructive' => {
    if (balance === 0) return 'secondary';
    if (balance > 0) return 'destructive';
    return 'default';
  };

  const columns = [
    ...(showMember
      ? [
          {
            key: 'member',
            header: t('member'),
            cell: (row: Commitment) => (
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
      key: 'year',
      header: t('year'),
      cell: (row: Commitment) => (
        <Badge variant="outline">{row.year}</Badge>
      ),
    },
    {
      key: 'total',
      header: t('totalCommitted'),
      cell: (row: Commitment) => (
        <div className="font-medium">
          {formatCurrency(Number(row.totalCommitment), 'fr')}
        </div>
      ),
    },
    {
      key: 'paid',
      header: t('totalPaid'),
      cell: (row: Commitment) => {
        const paid = calculatePaid(row);
        return (
          <div className="text-muted-foreground">
            {formatCurrency(paid, 'fr')}
          </div>
        );
      },
    },
    {
      key: 'balance',
      header: t('balance'),
      cell: (row: Commitment) => {
        const balance = calculateBalance(row);
        return (
          <Badge variant={getBalanceVariant(balance)}>
            {formatCurrency(balance, 'fr')}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: tCommon('actions'),
      cell: (row: Commitment) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/commitments/${row.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/commitments/${row.id}/edit`}>
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
      data={commitments}
      loading={loading}
      emptyMessage={t('noCommitments')}
    />
  );
}
