'use client';

import { useTranslations } from 'next-intl';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { formatPhoneNumber } from '@/lib/utils/format';

interface Member {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE';
  phone?: string;
  email?: string;
  situation: string;
}

interface MembersTableProps {
  members: Member[];
  loading?: boolean;
}

export function MembersTable({ members, loading }: MembersTableProps) {
  const t = useTranslations('members');

  const columns = [
    {
      key: 'matricule',
      header: t('matricule'),
      cell: (row: Member) => (
        <span className="font-medium">{row.matricule}</span>
      ),
    },
    {
      key: 'fullName',
      header: t('fullName'),
      cell: (row: Member) => (
        <div>
          <div className="font-medium">{row.firstName} {row.lastName}</div>
          {row.email && <div className="text-sm text-muted-foreground">{row.email}</div>}
        </div>
      ),
    },
    {
      key: 'gender',
      header: t('gender'),
      cell: (row: Member) => (
        <Badge variant={row.gender === 'MALE' ? 'default' : 'secondary'}>
          {t(row.gender === 'MALE' ? 'male' : 'female')}
        </Badge>
      ),
    },
    {
      key: 'phone',
      header: t('phone'),
      cell: (row: Member) => row.phone ? formatPhoneNumber(row.phone) : '-',
    },
    {
      key: 'situation',
      header: t('situation'),
      cell: (row: Member) => (
        <Badge variant="outline">
          {row.situation}
        </Badge>
      ),
    },
  ];

  return <DataTable columns={columns} data={members} loading={loading} emptyMessage={t('noResults')} />;
}
