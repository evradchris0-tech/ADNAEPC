'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCreateMember } from '@/hooks/use-members';
import { MemberForm } from '@/components/forms/member-form';
import { PageHeader } from '@/components/ui/page-header';
import { toast } from 'sonner';

export default function NewMemberPage() {
  const t = useTranslations('members');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { createMember, isCreating } = useCreateMember();

  const handleSubmit = async (data: any) => {
    try {
      const result = await createMember(data);

      if (result.success) {
        toast.success(t('created'));
        router.push('/dashboard/members');
      } else {
        toast.error(result.error || tCommon('error'));
      }
    } catch (error) {
      toast.error(tCommon('error'));
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/members');
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('addMember')} />

      <div className="max-w-3xl">
        <MemberForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
