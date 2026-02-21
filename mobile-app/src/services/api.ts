/**
 * gadizone Mobile App - API Service
 */

const BASE_URL = 'http://192.168.1.26:5001';

export interface Brand { id: string; name: string; logo?: string; slug: string; }
export interface BrandDetails extends Brand { summary?: string; faqs?: { question: string; answer: string }[]; }
export interface Model {
  id: string;
  name: string;
  brandId: string;
  heroImage: string;
  lowestPrice: number;
  highestPrice?: number;
  fuelTypes: string[];
  transmissions: string[];
  seating: number;
  isNew: boolean;
  isPopular: boolean;
  launchDate?: string;
  rating?: number;
  reviewCount?: number;
  variantCount?: number;
  slug?: string;
}
export interface UpcomingCar { id: string; name: string; brandId: string; brandName: string; image: string; expectedPriceMin: number; expectedPriceMax: number; fuelTypes: string[]; expectedLaunchDate: string; isNew: boolean; isPopular: boolean; }
export interface YouTubeVideo { id: string; title: string; thumbnail: string; duration: string; views: string; likes: string; publishedAt: string; channelName: string; }
export interface ModelDetails {
  id: string;
  name: string;
  brandId: string;
  heroImage: string;
  galleryImages?: string[];
  seoDescription?: string;
  lowestPrice?: number;
  highestPrice?: number;
  rating?: number;
  reviewCount?: number;
  variants?: any[];
  headerSeo?: string;
  keyFeatureImages?: { url: string; caption: string }[];
  spaceComfortImages?: { url: string; caption: string }[];
  storageConvenienceImages?: { url: string; caption: string }[];
  colorImages?: { url: string; caption: string }[];
  pros?: string[];
  cons?: string[];
  description?: string;
  exteriorDesign?: string;
  comfortConvenience?: string;
  engineSummaries?: { title: string; summary: string; transmission: string; power: string; torque: string; speed: string }[];
  mileageData?: { engineName: string; companyClaimed: string; cityRealWorld: string; highwayRealWorld: string }[];
  bodyType?: string;
  subBodyType?: string;
  faqs?: { question: string; answer: string }[];
}
export interface Variant {
  id: string;
  name: string;
  modelId: string;
  price: number;
  fuel?: string;
  fuelType?: string;
  transmission?: string;
}

export const api = {
  getBrands: async (): Promise<Brand[]> => {
    try { const r = await fetch(`${BASE_URL}/api/brands`); const d = await r.json(); return Array.isArray(d) ? d : []; }
    catch (e) { console.error('Error brands:', e); return []; }
  },
  getBrandById: async (brandId: string): Promise<BrandDetails | null> => {
    try { const r = await fetch(`${BASE_URL}/api/brands/${brandId}`); const d = await r.json(); return d; }
    catch (e) { console.error('Error brand:', e); return null; }
  },
  getModelsWithPricing: async (limit = 100): Promise<Model[]> => {
    try { const r = await fetch(`${BASE_URL}/api/models-with-pricing?limit=${limit}`); const d = await r.json(); const m = d.data || d || []; return Array.isArray(m) ? m : []; }
    catch (e) { console.error('Error models:', e); return []; }
  },
  getUpcomingCars: async (): Promise<UpcomingCar[]> => {
    try { const r = await fetch(`${BASE_URL}/api/upcoming-cars`); const d = await r.json(); return Array.isArray(d) ? d : []; }
    catch (e) { console.error('Error upcoming:', e); return []; }
  },
  getUpcomingCarsByBrand: async (brandId: string): Promise<UpcomingCar[]> => {
    try {
      const r = await fetch(`${BASE_URL}/api/upcoming-cars`);
      const d = await r.json();
      const all = Array.isArray(d) ? d : [];
      return all.filter((car: any) => car.brandId === brandId);
    }
    catch (e) { console.error('Error upcoming by brand:', e); return []; }
  },
  getPopularComparisons: async (): Promise<any[]> => {
    try { const r = await fetch(`${BASE_URL}/api/popular-comparisons`); const d = await r.json(); return Array.isArray(d) ? d : []; }
    catch (e) { console.error('Error comparisons:', e); return []; }
  },
  getNews: async (limit = 6, tag?: string): Promise<any[]> => {
    try {
      const tagParam = tag ? `&tag=${encodeURIComponent(tag)}` : '';
      const r = await fetch(`${BASE_URL}/api/news?limit=${limit}${tagParam}`);
      const d = await r.json();
      return d.articles || [];
    }
    catch (e) { console.error('Error news:', e); return []; }
  },
  getYouTubeVideos: async (): Promise<{ featuredVideo: YouTubeVideo | null; relatedVideos: YouTubeVideo[] }> => {
    try {
      const r = await fetch(`${BASE_URL}/api/youtube/videos`);
      const d = await r.json();
      return { featuredVideo: d.featuredVideo || null, relatedVideos: d.relatedVideos || [] };
    }
    catch (e) { console.error('Error youtube:', e); return { featuredVideo: null, relatedVideos: [] }; }
  },
  getYouTubeVideosByBrand: async (brandName: string): Promise<{ featuredVideo: YouTubeVideo | null; relatedVideos: YouTubeVideo[] }> => {
    try {
      const r = await fetch(`${BASE_URL}/api/youtube/videos?search=${encodeURIComponent(brandName)}`);
      const d = await r.json();
      return { featuredVideo: d.featuredVideo || null, relatedVideos: d.relatedVideos || [] };
    }
    catch (e) { console.error('Error youtube by brand:', e); return { featuredVideo: null, relatedVideos: [] }; }
  },
  search: async (query: string): Promise<any> => {
    try { const r = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`); return r.json(); }
    catch (e) { console.error('Error search:', e); return []; }
  },
  getModelsByBrand: async (brandId: string): Promise<Model[]> => {
    try {
      const r = await fetch(`${BASE_URL}/api/models-with-pricing?brandId=${encodeURIComponent(brandId)}&limit=100`);
      const d = await r.json();
      const m = d.data || d || [];
      return Array.isArray(m) ? m : [];
    }
    catch (e) { console.error('Error models by brand:', e); return []; }
  },
  getModelById: async (modelId: string): Promise<ModelDetails | null> => {
    try {
      const r = await fetch(`${BASE_URL}/api/models/${modelId}`);
      if (!r.ok) return null;
      const d = await r.json();
      return d;
    }
    catch (e) { console.error('Error model by id:', e); return null; }
  },
  getVariantsByModel: async (modelId: string): Promise<Variant[]> => {
    try {
      const r = await fetch(`${BASE_URL}/api/variants?modelId=${encodeURIComponent(modelId)}`);
      const d = await r.json();
      return Array.isArray(d) ? d : [];
    }
    catch (e) { console.error('Error variants:', e); return []; }
  },
};

export default api;
