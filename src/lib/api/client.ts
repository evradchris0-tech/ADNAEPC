/**
 * Centralized API client with error handling
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login on unauthorized
      window.location.href = '/login';
    }
    throw new ApiError(data.error || 'An error occurred', response.status, data.errors);
  }

  return data;
}

export async function apiGet<T>(
  url: string,
  params?: Record<string, string | number | boolean>
): Promise<ApiResponse<T>> {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<T>(response);
}

export async function apiPost<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<T>(response);
}

export async function apiPatch<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<T>(response);
}

export async function apiDelete<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<T>(response);
}

// SWR fetcher functions
export const fetcher = (url: string) => apiGet(url).then((res) => res.data);

export const postFetcher = (url: string, { arg }: { arg: unknown }) =>
  apiPost(url, arg).then((res) => res);

export const patchFetcher = (url: string, { arg }: { arg: unknown }) =>
  apiPatch(url, arg).then((res) => res);

export const deleteFetcher = (url: string, { arg }: { arg: { id: string } }) =>
  apiDelete(`${url}/${arg.id}`).then((res) => res);
