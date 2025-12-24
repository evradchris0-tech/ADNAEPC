'use client';

import { useTranslations } from 'next-intl';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';

interface Association {
  id: string;
  name: string;
  sigle: string;
  description?: string;
  _count?: {
    members: number;
  };
}

interface AssociationsTableProps {
  associations: Association[];
  loading?: boolean;
  onDelete?: (id: string) => void;
}

export function AssociationsTable({
  associations,
  loading = false,
  onDelete,
}: AssociationsTableProps) {
  const t = useTranslations('associations');
  const tCommon = useTranslations('common');

  const columns = [
    {
      key: 'sigle',
      header: t('sigle'),
      cell: (row: Association) => (
        <div className="font-medium">{row.sigle}</div>
      ),
    },
    {
      key: 'name',
      header: t('name'),
      cell: (row: Association) => (
        <div>
          <div className="font-medium">{row.name}</div>
          {row.description && (
            <div className="text-sm text-muted-foreground line-clamp-1">
              {row.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'memberCount',
      header: t('memberCount'),
      cell: (row: Association) => (
        <Badge variant="secondary">
          {row._count?.members ?? 0} {t('members')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: tCommon('actions'),
      cell: (row: Association) => (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/associations/${row.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/associations/${row.id}/edit`}>
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
      data={associations}
      loading={loading}
      emptyMessage={t('noAssociations')}
    />
  );
}
