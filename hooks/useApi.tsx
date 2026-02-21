import { useState, useEffect, useCallback } from 'react';
import { api, Brand, Model, Variant, City } from '@/lib/api';

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<{ success: boolean; data?: T; error?: string }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Brands hooks
export function useBrands(params?: {
  limit?: number;
  offset?: number;
  search?: string;
  featured?: boolean;
}) {
  return useApi(
    () => api.getBrands(params),
    [params?.limit, params?.offset, params?.search, params?.featured]
  );
}

export function useBrand(slug: string) {
  return useApi(
    () => api.getBrandBySlug(slug),
    [slug]
  );
}

// Models hooks
export function useModels(params?: {
  limit?: number;
  offset?: number;
  brand_id?: string;
  body_type?: string;
  min_price?: number;
  max_price?: number;
}) {
  return useApi(
    () => api.getModels(params),
    [params?.limit, params?.offset, params?.brand_id, params?.body_type, params?.min_price, params?.max_price]
  );
}

export function useModel(slug: string) {
  return useApi(
    () => api.getModelBySlug(slug),
    [slug]
  );
}

// Variants hooks
export function useVariants(params?: {
  limit?: number;
  offset?: number;
  model_id?: string;
  fuel_type?: string;
  transmission_type?: string;
  min_price?: number;
  max_price?: number;
  city_id?: string;
}) {
  return useApi(
    () => api.getVariants(params),
    [params?.limit, params?.offset, params?.model_id, params?.fuel_type, params?.transmission_type, params?.min_price, params?.max_price, params?.city_id]
  );
}

export function useVariant(publicId: string) {
  return useApi(
    () => api.getVariantByPublicId(publicId),
    [publicId]
  );
}

// Cities hook
export function useCities() {
  return useApi(() => api.getCities(), []);
}

// Search hook
export function useSearch(query: string, limit?: number) {
  const [results, setResults] = useState<{
    brands: Brand[];
    models: Model[];
    variants: Variant[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.search(searchQuery, limit);
      
      if (response.success && response.data) {
        setResults(response.data.results);
      } else {
        setError(response.error || 'Search failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search error occurred');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, search]);

  return { results, loading, error, search };
}

// Health check hook
export function useHealthCheck() {
  return useApi(() => api.healthCheck(), []);
}

// Custom hook for pagination
export function usePagination(initialLimit = 20) {
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setOffset((page - 1) * limit);
  };

  const nextPage = () => {
    setCurrentPage(prev => prev + 1);
    setOffset(prev => prev + limit);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setOffset(prev => prev - limit);
    }
  };

  const reset = () => {
    setCurrentPage(1);
    setOffset(0);
  };

  return {
    limit,
    offset,
    currentPage,
    setLimit,
    goToPage,
    nextPage,
    prevPage,
    reset
  };
}

// Loading states component
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-red-600`}></div>
    </div>
  );
}

// Error display component
export function ErrorMessage({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <div className="text-red-800 mb-2">
        <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">Error</p>
      </div>
      <p className="text-red-700 text-sm mb-3">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

// Empty state component
export function EmptyState({ 
  title = 'No data found', 
  description = 'There are no items to display at the moment.',
  icon
}: { 
  title?: string; 
  description?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      {icon || (
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
