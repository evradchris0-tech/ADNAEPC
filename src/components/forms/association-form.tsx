'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { FormField } from './form-field';
import { createAssociationSchema } from '@/lib/validations/association';
import { useState } from 'react';
import { z } from 'zod';

type AssociationFormData = z.infer<typeof createAssociationSchema>;

interface AssociationFormProps {
  initialData?: Partial<AssociationFormData>;
  onSubmit: (data: AssociationFormData) => Promise<void>;
  onCancel?: () => void;
}

export function AssociationForm({ initialData, onSubmit, onCancel }: AssociationFormProps) {
  const t = useTranslations('associations');
  const tCommon = useTranslations('common');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AssociationFormData>({
    resolver: zodResolver(createAssociationSchema),
    defaultValues: initialData || {
      name: '',
    },
  });

  const handleSubmit = async (data: AssociationFormData) => {
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
        <FormField
          name="name"
          label={t('name')}
          type="text"
          placeholder={t('name')}
          required
        />

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
