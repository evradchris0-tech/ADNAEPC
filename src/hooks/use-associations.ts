import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiGet, apiPost, apiPatch, apiDelete, type ApiResponse } from '@/lib/api/client';

interface Association {
  id: string;
  name: string;
  createdAt: string;
  _count?: {
    members: number;
  };
}

/**
 * Hook to fetch associations list
 */
export function useAssociations() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Association[]>>(
    '/api/associations',
    () => apiGet<Association[]>('/api/associations')
  );

  return {
    associations: data?.data ?? [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch a single association
 */
export function useAssociation(id: string | null) {
  const fetcher = id ? () => apiGet<Association>(`/api/associations/${id}`) : null;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Association>>(
    id ? `/api/associations/${id}` : null,
    fetcher
  );

  return {
    association: data?.data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook to create an association
 */
export function useCreateAssociation() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/associations',
    async (url: string, { arg }: { arg: unknown }) => {
      return apiPost(url, arg);
    }
  );

  return {
    createAssociation: trigger,
    isCreating: isMutating,
    error,
  };
}

/**
 * Hook to update an association
 */
export function useUpdateAssociation(id: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    `/api/associations/${id}`,
    async (url: string, { arg }: { arg: unknown }) => {
      return apiPatch(url, arg);
    }
  );

  return {
    updateAssociation: trigger,
    isUpdating: isMutating,
    error,
  };
}

/**
 * Hook to delete an association
 */
export function useDeleteAssociation() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/associations',
    async (url: string, { arg }: { arg: { id: string } }) => {
      return apiDelete(`${url}/${arg.id}`);
    }
  );

  return {
    deleteAssociation: (id: string) => trigger({ id }),
    isDeleting: isMutating,
    error,
  };
}
