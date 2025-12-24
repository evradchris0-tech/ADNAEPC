'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiGet, apiPost, apiPatch, apiDelete, type ApiResponse } from '@/lib/api/client';
import type { PaymentFilterInput, CreatePaymentInput, UpdatePaymentInput } from '@/lib/validations/payment';
import { PaymentType } from '@/generated/prisma';

// Types
interface Payment {
  id: string;
  memberId: string;
  commitmentId: string | null;
  amount: number;
  paymentType: PaymentType;
  paymentDate: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
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

/**
 * Hook pour lister les paiements avec pagination et filtres
 */
export function usePayments(filters: Partial<PaymentFilterInput> = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Payment[]>>(
    `/api/payments?${params.toString()}`,
    () => apiGet<Payment[]>('/api/payments', filters as Record<string, string | number | boolean>)
  );

  return {
    payments: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook pour récupérer un paiement spécifique
 */
export function usePayment(id: string | null) {
  const fetcher = id ? () => apiGet<Payment>(`/api/payments/${id}`) : null;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Payment>>(
    id ? `/api/payments/${id}` : null,
    fetcher
  );

  return {
    payment: data?.data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook pour récupérer les paiements d'un membre
 */
export function useMemberPayments(memberId: string | null, year?: number) {
  const params = new URLSearchParams();
  if (memberId) params.set('memberId', memberId);
  if (year) params.set('year', year.toString());

  const queryString = params.toString();

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Payment[]>>(
    memberId ? `/api/payments?${queryString}` : null,
    memberId ? () => apiGet<Payment[]>('/api/payments', Object.fromEntries(params)) : null
  );

  return {
    payments: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook pour récupérer les paiements d'un engagement
 */
export function useCommitmentPayments(commitmentId: string | null) {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Payment[]>>(
    commitmentId ? `/api/payments?commitmentId=${commitmentId}` : null,
    commitmentId ? () => apiGet<Payment[]>('/api/payments', { commitmentId }) : null
  );

  return {
    payments: data?.data ?? [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook pour créer un paiement
 */
export function useCreatePayment() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/payments',
    async (url: string, { arg }: { arg: CreatePaymentInput }) => {
      return apiPost(url, arg);
    }
  );

  return {
    createPayment: trigger,
    isCreating: isMutating,
    error,
  };
}

/**
 * Hook pour mettre à jour un paiement
 */
export function useUpdatePayment(id: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    `/api/payments/${id}`,
    async (url: string, { arg }: { arg: UpdatePaymentInput }) => {
      return apiPatch(url, arg);
    }
  );

  return {
    updatePayment: trigger,
    isUpdating: isMutating,
    error,
  };
}

/**
 * Hook pour supprimer un paiement
 */
export function useDeletePayment() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/payments',
    async (url: string, { arg }: { arg: { id: string } }) => {
      return apiDelete(`${url}/${arg.id}`);
    }
  );

  return {
    deletePayment: (id: string) => trigger({ id }),
    isDeleting: isMutating,
    error,
  };
}

/**
 * Hook pour les paiements du jour
 */
export function useTodayPayments() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Payment[]>>(
    `/api/payments?startDate=${today}&endDate=${today}`,
    () => apiGet<Payment[]>('/api/payments', { startDate: today, endDate: today })
  );

  return {
    payments: data?.data ?? [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}
