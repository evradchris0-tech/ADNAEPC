import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { apiGet, apiPost, apiPatch, apiDelete, type ApiResponse } from '@/lib/api/client';

interface Member {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE';
  phone?: string;
  email?: string;
  category: string;
  situation: string;
  primaryAssociation?: {
    id: string;
    name: string;
  };
}

interface MemberFilters {
  search?: string;
  category?: string;
  situation?: string;
  associationId?: string;
  page?: number;
  limit?: number;
}

/**
 * Hook to fetch members list with filters
 */
export function useMembers(filters: MemberFilters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Member[]>>(
    `/api/members?${params.toString()}`,
    () => apiGet<Member[]>('/api/members', filters as Record<string, string | number | boolean>)
  );

  return {
    members: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch a single member
 */
export function useMember(id: string | null) {
  const fetcher = id ? () => apiGet<Member>(`/api/members/${id}`) : null;

  const { data, error, isLoading, mutate } = useSWR<ApiResponse<Member>>(
    id ? `/api/members/${id}` : null,
    fetcher
  );

  return {
    member: data?.data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook to create a member
 */
export function useCreateMember() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/members',
    async (url: string, { arg }: { arg: unknown }) => {
      return apiPost(url, arg);
    }
  );

  return {
    createMember: trigger,
    isCreating: isMutating,
    error,
  };
}

/**
 * Hook to update a member
 */
export function useUpdateMember(id: string) {
  const { trigger, isMutating, error } = useSWRMutation(
    `/api/members/${id}`,
    async (url: string, { arg }: { arg: unknown }) => {
      return apiPatch(url, arg);
    }
  );

  return {
    updateMember: trigger,
    isUpdating: isMutating,
    error,
  };
}

/**
 * Hook to delete a member
 */
export function useDeleteMember() {
  const { trigger, isMutating, error } = useSWRMutation(
    '/api/members',
    async (url: string, { arg }: { arg: { id: string } }) => {
      return apiDelete(`${url}/${arg.id}`);
    }
  );

  return {
    deleteMember: (id: string) => trigger({ id }),
    isDeleting: isMutating,
    error,
  };
}
