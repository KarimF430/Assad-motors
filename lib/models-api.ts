const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export interface FrontendModel {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  power: string;
  image: string;
  isNew: boolean;
  seating: string;
  fuelType: string;
  transmission: string;
  mileage: string;
  variants: number;
  slug: string;
  brandName: string;
}

export interface BrandModelsResponse {
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  models: FrontendModel[];
}

export interface ModelDetail {
  id: string;
  name: string;
  brandName: string;
  heroImage?: string;
  galleryImages: Array<{ url: string; caption: string }>;
  keyFeatureImages: Array<{ url: string; caption: string }>;
  spaceComfortImages: Array<{ url: string; caption: string }>;
  storageConvenienceImages: Array<{ url: string; caption: string }>;
  colorImages: Array<{ url: string; caption: string }>;
  description?: string;
  pros?: string;
  cons?: string;
  exteriorDesign?: string;
  comfortConvenience?: string;
  engineSummaries: Array<{
    title: string;
    summary: string;
    transmission: string;
    power: string;
    torque: string;
    speed: string;
  }>;
  mileageData: Array<{
    engineName: string;
    companyClaimed: string;
    cityRealWorld: string;
    highwayRealWorld: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
  fuelTypes: string[];
  transmissions: string[];
  bodyType?: string;
  subBodyType?: string;
  launchDate?: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export async function getModelsByBrand(brandId: string): Promise<BrandModelsResponse> {
  try {
    console.log('🔗 Fetching models for brand:', brandId);
    const url = `${API_BASE_URL}/api/frontend/brands/${brandId}/models`;
    console.log('🔗 Full URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(15000) // 15 second timeout
    });
    
    console.log('📡 Models response status:', response.status);
    console.log('📡 Models response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Models API error response:', errorText);
      throw new Error(`Failed to fetch models: ${response.status} - ${errorText}`);
    }
    
    const text = await response.text();
    console.log('📡 Models response length:', text.length, 'characters');
    console.log('📡 Models response preview:', text.substring(0, 200));
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error('❌ Models JSON parse error:', parseError);
      console.log('📡 Raw response:', text);
      throw new Error('Invalid JSON response from models API');
    }
    
    if (!data || typeof data !== 'object') {
      console.error('❌ Invalid models response format:', typeof data);
      throw new Error('Invalid models response format');
    }
    
    if (!data.models || !Array.isArray(data.models)) {
      console.error('❌ Models array missing or invalid:', data);
      throw new Error('Models array missing in response');
    }
    
    console.log('✅ Received models:', data.models.length);
    console.log('✅ Brand info:', data.brand);
    console.log('✅ Model names:', data.models.map((m: any) => m.name));
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching models:', error);
    throw error;
  }
}

export async function getModelBySlug(slug: string): Promise<ModelDetail> {
  try {
    console.log('🔗 Fetching model by slug:', slug);
    const response = await fetch(`${API_BASE_URL}/api/frontend/models/${slug}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch model: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Received model details for:', data.name);
    return data;
  } catch (error) {
    console.error('❌ Error fetching model:', error);
    throw error;
  }
}

// Helper function to get brand ID from brand slug/name
export async function getBrandIdFromSlug(brandSlug: string): Promise<string | null> {
  console.log('🔗 Getting brand ID for slug:', brandSlug);
  
  // First try fallback for known brands (faster and more reliable)
  const knownBrands: { [key: string]: string } = {
    'honda': '3445736621',
    'maruti-suzuki': '2909414098',
    'tata': '7756885863',
    'hyundai': '4741969225',
    'kia': '7908567021'
  };
  
  const fallbackId = knownBrands[brandSlug.toLowerCase()];
  if (fallbackId) {
    console.log('✅ Using known brand ID for', brandSlug, ':', fallbackId);
    return fallbackId;
  }
  
  // If not in known brands, try to fetch from API
  try {
    console.log('🔗 Fetching from API for unknown brand:', brandSlug);
    
    const response = await fetch(`${API_BASE_URL}/api/brands`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch brands: ${response.status}`);
    }
    
    const brands = await response.json();
    
    if (!Array.isArray(brands)) {
      throw new Error('Invalid brands response format');
    }
    
    const brand = brands.find((b: any) => {
      if (!b || !b.name) return false;
      
      const normalizedBrandName = b.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const normalizedSlug = brandSlug.toLowerCase();
      
      return normalizedBrandName === normalizedSlug ||
             b.name.toLowerCase() === normalizedSlug;
    });
    
    if (brand) {
      console.log('✅ Found brand ID from API:', brand.id, 'for', brand.name);
      return brand.id;
    }
    
    console.log('❌ Brand not found:', brandSlug);
    return null;
  } catch (error) {
    console.error('❌ Error fetching from API:', error);
    return null;
  }
}
