import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Determine API base dynamically
export const API_BASE = (() => {
  const envBase = (import.meta as any)?.env?.VITE_API_BASE as string | undefined;
  if (envBase) return envBase.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return 'http://localhost:5001';
})();

type UnauthorizedBehavior = "returnNull" | "throw";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status}`);
  }
}

export async function apiRequest(method: string, url: string, data?: any) {
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    // Always include cookies (HttpOnly auth tokens)
    credentials: 'include',
  };

  // Do NOT add Authorization header; rely on HttpOnly cookies for auth

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${url}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.error || `HTTP ${response.status}`) as any;
      error.status = response.status;
      throw error;
    }

    // Handle 204 No Content responses (e.g., successful DELETE operations)
    if (response.status === 204) {
      return null;
    }

    // For other successful responses, parse JSON
    return response.json();
  } catch (error: any) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error - server may be down:', error);
      throw new Error('Unable to connect to server. Please check if the server is running.');
    }
    throw error;
  }
}

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(`${API_BASE}${queryKey.join("/") as string}`.replace(`${API_BASE}//`, `${API_BASE}/`), {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
