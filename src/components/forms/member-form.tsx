'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { FormField } from './form-field';
import { useState } from 'react';
import { Gender } from '@/generated/prisma';

interface MemberFormData {
  firstName: string;
  lastName: string;
  gender: Gender;
  phone?: string;
  email?: string;
  birthDate?: string;
  primaryAssociationId?: string;
}

interface MemberFormProps {
  initialData?: Partial<MemberFormData>;
  associations?: Array<{ id: string; name: string }>;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export function MemberForm({ initialData, associations = [], onSubmit, onCancel }: MemberFormProps) {
  const t = useTranslations('members');
  const tCommon = useTranslations('common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MemberFormData>({
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      gender: Gender.MALE,
      phone: '',
      email: '',
    },
  });

  const handleSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="firstName"
            label={t('firstName')}
            type="text"
            placeholder={t('firstName')}
            required
          />

          <FormField
            name="lastName"
            label={t('lastName')}
            type="text"
            placeholder={t('lastName')}
            required
          />

          <FormField
            name="gender"
            label={t('gender')}
            type="select"
            options={[
              { value: Gender.MALE, label: t('male') },
              { value: Gender.FEMALE, label: t('female') },
            ]}
            required
          />

          <FormField
            name="phone"
            label={t('phone')}
            type="tel"
            placeholder="+237 6XX XX XX XX"
          />

          <FormField
            name="email"
            label={t('email')}
            type="email"
            placeholder="exemple@email.com"
          />

          <FormField
            name="birthDate"
            label={t('birthDate')}
            type="date"
          />

          {associations.length > 0 && (
            <FormField
              name="primaryAssociationId"
              label={t('primaryAssociation')}
              type="select"
              options={associations.map(a => ({ value: a.id, label: a.name }))}
            />
          )}
        </div>

        <div className="flex gap-4 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {tCommon('cancel')}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? tCommon('loading') : tCommon('save')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
