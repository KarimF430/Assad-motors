// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Debug log
console.log('🔧 API Configuration:', {
  API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
});

// API Response Types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface PaginationMeta {
  total: number;
  limit: number;
  offset: number;
  pages: number;
}

// Data Types
export interface Brand {
  id: string;
  public_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  summary?: string;
  description?: string;
  country?: string;
  founded_year?: number;
  website?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Model {
  id: string;
  public_id: string;
  brand_id: string;
  name: string;
  slug: string;
  hero_image?: string;
  gallery: string[];
  summary?: string;
  description?: string;
  launch_year?: number;
  body_type?: string;
  seating_capacity?: number;
  fuel_types: string[];
  transmission_types: string[];
  price_range_min?: number;
  price_range_max?: number;
  is_active: boolean;
  is_featured: boolean;
  brand?: Brand;
}

export interface Variant {
  id: string;
  public_id: string;
  model_id: string;
  name: string;
  slug: string;
  price_ex_showroom: number;
  price_original?: number;
  fuel_type: string;
  transmission_type: string;
  engine_displacement?: string;
  power?: string;
  torque?: string;
  mileage_city?: number;
  mileage_highway?: number;
  mileage_combined?: number;
  seating_capacity?: number;
  safety_rating?: number;
  airbags?: number;
  abs: boolean;
  ebd: boolean;
  esp: boolean;
  is_active: boolean;
  is_featured: boolean;
  model?: Model;
}

export interface City {
  id: string;
  name: string;
  state: string;
  rto_code?: string;
  road_tax_rate: number;
  rto_charges: number;
  insurance_rate: number;
  other_charges: number;
}

// API Client Class
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = 2
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`🚀 API Request (attempt ${attempt + 1}/${retries + 1}): ${url}`);

        const response = await fetch(url, {
          ...options,
          headers: {
            ...defaultHeaders,
            ...options.headers,
          },
          // Add timeout
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        console.log(`📡 API Response: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ API Error Response:`, errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ API Success:`, data);

        return data;
      } catch (error) {
        console.error(`❌ API Error (${endpoint}) - Attempt ${attempt + 1}:`, error);

        // If this is the last attempt, return the error
        if (attempt === retries) {
          console.error(`🔍 Final error details:`, {
            url,
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
          });

          return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch'
          };
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // This should never be reached, but TypeScript requires it
    return {
      success: false,
      error: 'Unexpected error in request method'
    };
  }

  // Brand API Methods
  async getBrands(params?: {
    limit?: number;
    offset?: number;
    search?: string;
    featured?: boolean;
  }): Promise<ApiResponse<{ brands: Brand[]; pagination: PaginationMeta }>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.featured) searchParams.append('featured', 'true');

    const query = searchParams.toString();
    return this.request<{ brands: Brand[]; pagination: PaginationMeta }>(
      `/api/brands${query ? `?${query}` : ''}`
    );
  }

  async getBrandBySlug(slug: string): Promise<ApiResponse<{ brand: Brand }>> {
    return this.request<{ brand: Brand }>(`/api/brands/${slug}`);
  }

  // Model API Methods
  async getModels(params?: {
    limit?: number;
    offset?: number;
    brand_id?: string;
    body_type?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<ApiResponse<{ models: Model[]; pagination: PaginationMeta }>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.brand_id) searchParams.append('brand_id', params.brand_id);
    if (params?.body_type) searchParams.append('body_type', params.body_type);
    if (params?.min_price) searchParams.append('min_price', params.min_price.toString());
    if (params?.max_price) searchParams.append('max_price', params.max_price.toString());

    const query = searchParams.toString();
    return this.request<{ models: Model[]; pagination: PaginationMeta }>(
      `/api/models${query ? `?${query}` : ''}`
    );
  }

  async getModelBySlug(slug: string): Promise<ApiResponse<{ model: Model }>> {
    return this.request<{ model: Model }>(`/api/models/${slug}`);
  }

  // Variant API Methods
  async getVariants(params?: {
    limit?: number;
    offset?: number;
    model_id?: string;
    fuel_type?: string;
    transmission_type?: string;
    min_price?: number;
    max_price?: number;
    city_id?: string;
  }): Promise<ApiResponse<{ variants: Variant[]; pagination: PaginationMeta }>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());
    if (params?.model_id) searchParams.append('model_id', params.model_id);
    if (params?.fuel_type) searchParams.append('fuel_type', params.fuel_type);
    if (params?.transmission_type) searchParams.append('transmission_type', params.transmission_type);
    if (params?.min_price) searchParams.append('min_price', params.min_price.toString());
    if (params?.max_price) searchParams.append('max_price', params.max_price.toString());
    if (params?.city_id) searchParams.append('city_id', params.city_id);

    const query = searchParams.toString();
    return this.request<{ variants: Variant[]; pagination: PaginationMeta }>(
      `/api/variants${query ? `?${query}` : ''}`
    );
  }

  async getVariantByPublicId(publicId: string): Promise<ApiResponse<{ variant: Variant }>> {
    return this.request<{ variant: Variant }>(`/api/variants/${publicId}`);
  }

  // City API Methods
  async getCities(): Promise<ApiResponse<{ cities: City[] }>> {
    return this.request<{ cities: City[] }>('/api/public/cities');
  }

  // Search API Methods
  async search(query: string, limit?: number): Promise<ApiResponse<{
    query: string;
    results: {
      brands: Brand[];
      models: Model[];
      variants: Variant[];
    };
    total: number;
  }>> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    if (limit) searchParams.append('limit', limit.toString());

    return this.request<{
      query: string;
      results: {
        brands: Brand[];
        models: Model[];
        variants: Variant[];
      };
      total: number;
    }>(`/api/public/search?${searchParams.toString()}`);
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<{
    status: string;
    timestamp: string;
    uptime: number;
    version: string;
    environment: string;
    database: string;
  }>> {
    return this.request<{
      status: string;
      timestamp: string;
      uptime: number;
      version: string;
      environment: string;
      database: string;
    }>('/health');
  }

  // Review API Methods
  async getModelReviews(modelSlug: string, params?: {
    sort?: 'recent' | 'helpful' | 'highest' | 'lowest';
    rating?: number;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{
    reviews: any[];
    total: number;
    overallRating: number;
    ratingBreakdown: { 1: number; 2: number; 3: number; 4: number; 5: number };
    pagination: PaginationMeta;
  }>> {
    const searchParams = new URLSearchParams();
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.rating) searchParams.append('rating', params.rating.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.offset) searchParams.append('offset', params.offset.toString());

    const query = searchParams.toString();
    return this.request(`/api/reviews/${modelSlug}${query ? `?${query}` : ''}`);
  }

  async voteReview(reviewId: string, type: 'like' | 'dislike', userEmail: string): Promise<ApiResponse<{
    likes: number;
    dislikes: number;
    userVote: 'like' | 'dislike' | null;
  }>> {
    return this.request(`/api/reviews/${reviewId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ type, userEmail })
    });
  }

  async addReviewComment(reviewId: string, data: {
    userName: string;
    userEmail: string;
    text: string;
    parentId?: string;
  }): Promise<ApiResponse<any>> {
    return this.request(`/api/reviews/${reviewId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

// Create and export API client instance
export const api = new ApiClient();

// Utility functions for data transformation
export const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  } else {
    return `₹${price.toLocaleString('en-IN')}`;
  }
};

export const formatMileage = (mileage?: number): string => {
  return mileage ? `${mileage} kmpl` : 'N/A';
};

export const getImageUrl = (imagePath?: string): string => {
  if (!imagePath) return '/api/placeholder/400/300';
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_BASE_URL}${imagePath}`;
};

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;
