'use client';

import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiGet, apiPost, apiPatch, apiDelete, type ApiResponse } from '@/lib/api/client';
import type { CommitmentFilterInput, CreateCommitmentInput, UpdateCommitmentInput } from '@/lib/validations/commitment';

// Types
interface Commitment {
  id: string;
  memberId: string;
  year: number;
  titheAmount: number;
  constructionAmount: number;
  debtAmount: number;
  totalCommitment: number;
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    firstName: string;
    lastName: string;
    matricule: string;
  };
}

/**
 * Hook pour lister les engagements avec pagination et filtres
 */
export function useCommitments(filters: Partial<CommitmentFilterInput> = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Commitment[]>>(
    `/api/commitments?${params.toString()}`,
    () => apiGet<Commitment[]>('/api/commitments', filters as Record<string, string | number | boolean>)
  );

  return {
    commitments: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook pour récupérer un engagement spécifique
 */
export function useCommitment(id: string | null) {
  const fetcher = id ? () => apiGet<Commitment>(`/api/commitments/${id}`) : null;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Commitment>>(
    id ? `/api/commitments/${id}` : null,
    fetcher
  );

  return {
    commitment: data?.data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook pour récupérer l'engagement d'un membre pour une année
 */
export function useMemberCommitment(memberId: string | null, year: number) {
  const params = new URLSearchParams();
  if (memberId) params.set('memberId', memberId);
  params.set('year', year.toString());

  const { data, error, isLoading } = useSWR<ApiResponse<Commitment[]>>(
    memberId ? `/api/commitments?${params.toString()}` : null,
    memberId ? () => apiGet<Commitment[]>('/api/commitments', { memberId, year }) : null
  );

  return {
    commitment: data?.data?.[0] ?? null,
    isLoading,
    isError: error,
  };
}

/**
 * Hook pour créer un engagement
 */
export function useCreateCommitment() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/commitments',
    async (url: string, { arg }: { arg: CreateCommitmentInput }) => {
      return apiPost(url, arg);
    }
  );

  return {
    createCommitment: trigger,
    isCreating: isMutating,
    error,
  };
}

/**
 * Hook pour mettre à jour un engagement
 */
export function useUpdateCommitment(id: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    `/api/commitments/${id}`,
    async (url: string, { arg }: { arg: UpdateCommitmentInput }) => {
      return apiPatch(url, arg);
    }
  );

  return {
    updateCommitment: trigger,
    isUpdating: isMutating,
    error,
  };
}

/**
 * Hook pour supprimer un engagement
 */
export function useDeleteCommitment() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/commitments',
    async (url: string, { arg }: { arg: { id: string } }) => {
      return apiDelete(`${url}/${arg.id}`);
    }
  );

  return {
    deleteCommitment: (id: string) => trigger({ id }),
    isDeleting: isMutating,
    error,
  };
}
