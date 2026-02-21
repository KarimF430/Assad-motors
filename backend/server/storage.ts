import type { Brand, InsertBrand, Model, InsertModel, UpcomingCar, InsertUpcomingCar, Variant, InsertVariant, PopularComparison, InsertPopularComparison, AdminUser, InsertAdminUser, ConsultationLead, InsertConsultationLead } from "@shared/schema";
import fs from "fs";
import path from "path";
import { hashPassword } from "./auth";

export interface IStorage {
  // Brands
  getBrands(includeInactive?: boolean, onlyVisible?: boolean): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: string): Promise<boolean>;
  getAvailableRankings(excludeBrandId?: string): Promise<number[]>;

  // Models
  getModels(brandId?: string, includeInactive?: boolean): Promise<Model[]>;
  getModelsWithPricing(brandId?: string, onlyVisible?: boolean): Promise<any[]>;
  getModel(id: string): Promise<Model | undefined>;
  createModel(model: InsertModel): Promise<Model>;
  updateModel(id: string, model: Partial<InsertModel>): Promise<Model | undefined>;
  deleteModel(id: string): Promise<boolean>;
  getPopularModels(limit?: number): Promise<Model[]>;

  // Upcoming Cars
  getUpcomingCars(brandId?: string, onlyVisible?: boolean): Promise<UpcomingCar[]>;
  getUpcomingCar(id: string): Promise<UpcomingCar | undefined>;
  createUpcomingCar(car: InsertUpcomingCar): Promise<UpcomingCar>;
  updateUpcomingCar(id: string, car: Partial<InsertUpcomingCar>): Promise<UpcomingCar | undefined>;
  deleteUpcomingCar(id: string): Promise<boolean>;

  // Variants
  getVariants(modelId?: string, brandId?: string): Promise<Variant[]>;
  getVariant(id: string): Promise<Variant | undefined>;
  createVariant(variant: InsertVariant): Promise<Variant>;
  updateVariant(id: string, variant: Partial<InsertVariant>): Promise<Variant | undefined>;
  deleteVariant(id: string): Promise<boolean>;

  // Popular Comparisons
  getPopularComparisons(): Promise<PopularComparison[]>;
  savePopularComparisons(comparisons: InsertPopularComparison[]): Promise<PopularComparison[]>;

  // Admin Users
  getAdminUser(email: string): Promise<AdminUser | undefined>;
  getAdminUserById(id: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUserLogin(id: string): Promise<void>;

  // Session Management
  createSession(userId: string, token: string): Promise<void>;
  getActiveSession(userId: string): Promise<string | null>;
  invalidateSession(userId: string): Promise<void>;
  isSessionValid(userId: string, token: string): Promise<boolean>;

  // YouTube Cache
  getYouTubeCache(): Promise<{ data: any; timestamp: number } | null>;
  saveYouTubeCache(data: any, timestamp: number): Promise<void>;

  // Stats
  getStats(): Promise<{
    totalBrands: number;
    totalModels: number;
    totalVariants: number;
  }>;

  // Consultation Leads
  createConsultationLead(lead: InsertConsultationLead): Promise<ConsultationLead>;
  getConsultationLeads(filters?: { status?: string }): Promise<ConsultationLead[]>;
  updateConsultationLeadStatus(id: string, status: string): Promise<ConsultationLead | undefined>;
}

export class PersistentStorage implements IStorage {
  private brands: Brand[] = [];
  private models: Model[] = [];
  private upcomingCars: UpcomingCar[] = [];
  private variants: Variant[] = [];
  private popularComparisons: PopularComparison[] = [];
  private adminUsers: AdminUser[] = [];
  private activeSessions: Map<string, string> = new Map(); // userId -> token
  private youtubeCache: { data: any; timestamp: number } | null = null;
  private dataDir: string;
  private brandsFile: string;
  private modelsFile: string;
  private variantsFile: string;
  private popularComparisonsFile: string;
  private adminUsersFile: string;
  private youtubeCacheFile: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
    this.brandsFile = path.join(this.dataDir, 'brands.json');
    this.modelsFile = path.join(this.dataDir, 'models.json');
    this.variantsFile = path.join(this.dataDir, 'variants.json');
    this.popularComparisonsFile = path.join(this.dataDir, 'popular-comparisons.json');
    this.adminUsersFile = path.join(this.dataDir, 'admin-users.json');
    this.youtubeCacheFile = path.join(this.dataDir, 'youtube-cache.json');

    // Create data directory if it doesn't exist
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    // Load existing data
    this.loadData();
  }

  private loadData(): void {
    try {
      // Load brands
      if (fs.existsSync(this.brandsFile)) {
        const brandsData = fs.readFileSync(this.brandsFile, 'utf-8');
        this.brands = JSON.parse(brandsData);
        console.log(`Loaded ${this.brands.length} brands from storage`);
      }

      // Load models
      if (fs.existsSync(this.modelsFile)) {
        const modelsData = fs.readFileSync(this.modelsFile, 'utf-8');
        this.models = JSON.parse(modelsData);
        console.log(`Loaded ${this.models.length} models from storage`);
      }

      // Load variants
      if (fs.existsSync(this.variantsFile)) {
        const variantsData = fs.readFileSync(this.variantsFile, 'utf-8');
        this.variants = JSON.parse(variantsData);
        console.log(`Loaded ${this.variants.length} variants from storage`);
      }

      // Load popular comparisons
      if (fs.existsSync(this.popularComparisonsFile)) {
        const comparisonsData = fs.readFileSync(this.popularComparisonsFile, 'utf-8');
        this.popularComparisons = JSON.parse(comparisonsData);
        console.log(`Loaded ${this.popularComparisons.length} popular comparisons from storage`);
      }

      // Load admin users
      if (fs.existsSync(this.adminUsersFile)) {
        const usersData = fs.readFileSync(this.adminUsersFile, 'utf-8');
        this.adminUsers = JSON.parse(usersData);
        console.log(`Loaded ${this.adminUsers.length} admin users from storage`);
      } else {
        // Create default admin user if none exists
        this.createDefaultAdmin();
      }

      // Load YouTube cache
      if (fs.existsSync(this.youtubeCacheFile)) {
        const cacheData = fs.readFileSync(this.youtubeCacheFile, 'utf-8');
        this.youtubeCache = JSON.parse(cacheData);
        console.log(`Loaded YouTube cache from storage (age: ${Math.floor((Date.now() - (this.youtubeCache?.timestamp || 0)) / 1000 / 60 / 60)} hours)`);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Initialize with empty arrays if loading fails
      this.brands = [];
      this.models = [];
      this.variants = [];
      this.popularComparisons = [];
      this.adminUsers = [];
      this.youtubeCache = null;
    }
  }

  private async createDefaultAdmin(): Promise<void> {
    try {
      const defaultAdmin: InsertAdminUser = {
        email: 'admin@gadizone.com',
        password: await hashPassword('Admin@123'),
        name: 'Admin',
        role: 'super_admin',
        isActive: true,
      };

      await this.createAdminUser(defaultAdmin);
      console.log('✅ Default admin user created: admin@gadizone.com / Admin@123');
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  }

  private saveData(): void {
    try {
      // Save brands
      fs.writeFileSync(this.brandsFile, JSON.stringify(this.brands, null, 2));

      // Save models
      fs.writeFileSync(this.modelsFile, JSON.stringify(this.models, null, 2));

      // Save variants
      fs.writeFileSync(this.variantsFile, JSON.stringify(this.variants, null, 2));

      // Save popular comparisons
      fs.writeFileSync(this.popularComparisonsFile, JSON.stringify(this.popularComparisons, null, 2));

      // Save admin users
      fs.writeFileSync(this.adminUsersFile, JSON.stringify(this.adminUsers, null, 2));

      // Save YouTube cache (saved separately via saveYouTubeCache)

      console.log('Data saved to persistent storage');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Helper to generate 10-digit brand ID
  private generateBrandId(): string {
    const id = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    // Check if ID exists, regenerate if it does
    if (this.brands.some(b => b.id === id)) {
      return this.generateBrandId();
    }
    return id;
  }

  // Helper to generate model ID in format: BRANDCODE+MODELCODE+4digits
  private generateModelId(brandName: string, modelName: string): string {
    const brandCode = brandName.substring(0, 2).toUpperCase();
    const modelCode = modelName.substring(0, 2).toUpperCase();
    const digits = Math.floor(1000 + Math.random() * 9000).toString();
    return `${brandCode}${modelCode}${digits}`;
  }

  // Brands
  async getBrands(includeInactive = false): Promise<Brand[]> {
    let brands = [...this.brands];
    if (!includeInactive) {
      brands = brands.filter(brand => brand.status === 'active');
    }
    return brands.sort((a, b) => a.ranking - b.ranking);
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    return this.brands.find(b => b.id === id);
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    // Check if brand name already exists
    const existingBrandWithName = this.brands.find(b => b.name.toLowerCase() === brand.name.toLowerCase());
    if (existingBrandWithName) {
      throw new Error(`Brand "${brand.name}" already exists. Please use a different name.`);
    }

    // Auto-assign ranking based on creation order (next available position)
    const maxRanking = this.brands.length > 0
      ? Math.max(...this.brands.map(b => b.ranking))
      : 0;
    const autoRanking = maxRanking + 1;

    const newBrand: Brand = {
      id: this.generateBrandId(),
      name: brand.name,
      logo: brand.logo || null,
      ranking: autoRanking, // Auto-assigned based on creation order
      status: brand.status || "active",
      summary: brand.summary || null,
      faqs: (brand.faqs as { question: string; answer: string }[] | null) || null,
      createdAt: new Date(),
    };
    this.brands.push(newBrand);
    this.saveData(); // Save to persistent storage
    return newBrand;
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    const index = this.brands.findIndex(b => b.id === id);
    if (index === -1) return undefined;

    // Don't allow manual ranking changes - ranking is auto-managed by creation order
    const updateData = { ...brand };
    // ranking is not in InsertBrand, so no need to delete it

    this.brands[index] = { ...this.brands[index], ...updateData };
    this.saveData(); // Save to persistent storage
    return this.brands[index];
  }

  async deleteBrand(id: string): Promise<boolean> {
    const index = this.brands.findIndex(b => b.id === id);
    if (index === -1) return false;

    this.brands.splice(index, 1);
    // Also delete related models
    this.models = this.models.filter(m => m.brandId !== id);
    this.saveData(); // Save to persistent storage
    return true;
  }

  // Models
  async getModels(brandId?: string, includeInactive: boolean = false): Promise<Model[]> {
    let filtered = this.models;

    if (brandId) {
      filtered = filtered.filter(m => m.brandId === brandId);
    }

    if (!includeInactive) {
      filtered = filtered.filter(m => m.status === 'active');
    }

    return filtered;
  }

  async getModel(id: string): Promise<Model | undefined> {
    return this.models.find(m => m.id === id);
  }

  async createModel(model: InsertModel): Promise<Model> {
    const brand = await this.getBrand(model.brandId);
    const newModel: Model = {
      id: this.generateModelId(brand?.name || 'BR', model.name),
      brandId: model.brandId,
      name: model.name,
      isPopular: model.isPopular || null,
      isNew: model.isNew || null,
      popularRank: model.popularRank || null,
      newRank: model.newRank || null,
      topRank: model.topRank || null,
      bodyType: model.bodyType || null,
      subBodyType: model.subBodyType || null,
      launchDate: model.launchDate || null,
      fuelTypes: model.fuelTypes || null,
      transmissions: model.transmissions || null,
      brochureUrl: model.brochureUrl || null,
      status: model.status || "active",
      headerSeo: model.headerSeo || null,
      pros: model.pros || null,
      cons: model.cons || null,
      description: model.description || null,
      exteriorDesign: model.exteriorDesign || null,
      comfortConvenience: model.comfortConvenience || null,
      engineSummaries: (model.engineSummaries as any) || null,
      mileageData: (model.mileageData as any) || null,
      faqs: (model.faqs as any) || null,
      heroImage: model.heroImage || null,
      galleryImages: (model.galleryImages as any) || null,
      keyFeatureImages: (model.keyFeatureImages as any) || null,
      spaceComfortImages: (model.spaceComfortImages as any) || null,
      storageConvenienceImages: (model.storageConvenienceImages as any) || null,
      colorImages: (model.colorImages as any) || null,
      keySpecs: (model.keySpecs as any) || [],
      createdAt: new Date(),
    };
    this.models.push(newModel);
    this.saveData(); // Save to persistent storage
    return newModel;
  }

  async updateModel(id: string, model: Partial<InsertModel>): Promise<Model | undefined> {
    const index = this.models.findIndex(m => m.id === id);
    if (index === -1) return undefined;

    this.models[index] = { ...this.models[index], ...model };
    this.saveData(); // Save to persistent storage
    return this.models[index];
  }

  async deleteModel(id: string): Promise<boolean> {
    const index = this.models.findIndex(m => m.id === id);
    if (index === -1) return false;

    this.models.splice(index, 1);
    this.saveData(); // Save to persistent storage
    return true;
  }

  async getPopularModels(limit: number = 20): Promise<Model[]> {
    return this.models
      .filter(m => m.isPopular)
      .sort((a, b) => (a.popularRank || 999) - (b.popularRank || 999))
      .slice(0, limit);
  }

  async getModelsWithPricing(brandId?: string): Promise<any[]> {
    let models = await this.getModels(brandId);
    const results = [];

    for (const model of models) {
      const variants = await this.getVariants(model.id);
      const prices = variants.map(v => v.price).filter(p => p > 0);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

      results.push({
        ...model,
        priceRange: {
          min: minPrice,
          max: maxPrice
        }
      });
    }

    return results;
  }

  // Upcoming Cars methods (stub implementation for PersistentStorage)
  async getUpcomingCars(brandId?: string, onlyVisible?: boolean): Promise<UpcomingCar[]> {
    let filtered = this.upcomingCars;
    if (brandId) {
      filtered = filtered.filter(c => c.brandId === brandId);
    }
    if (onlyVisible) {
      filtered = filtered.filter(c => (c.expectedPriceMin || 0) >= 100000);
    }
    return filtered;
  }

  async getUpcomingCar(id: string): Promise<UpcomingCar | undefined> {
    return this.upcomingCars.find(c => c.id === id);
  }

  async createUpcomingCar(car: InsertUpcomingCar): Promise<UpcomingCar> {
    const newCar: UpcomingCar = {
      ...car as any,
      id: `upcoming-${Date.now()}`,
      createdAt: new Date()
    };
    this.upcomingCars.push(newCar);
    this.saveData();
    return newCar;
  }

  async updateUpcomingCar(id: string, car: Partial<InsertUpcomingCar>): Promise<UpcomingCar | undefined> {
    const index = this.upcomingCars.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    this.upcomingCars[index] = { ...this.upcomingCars[index], ...car };
    this.saveData();
    return this.upcomingCars[index];
  }

  async deleteUpcomingCar(id: string): Promise<boolean> {
    const index = this.upcomingCars.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.upcomingCars.splice(index, 1);
    this.saveData();
    return true;
  }

  // Variant methods
  async getVariants(modelId?: string, brandId?: string): Promise<Variant[]> {
    let filtered = this.variants;

    if (modelId) {
      filtered = filtered.filter(v => v.modelId === modelId);
    }

    if (brandId) {
      filtered = filtered.filter(v => v.brandId === brandId);
    }

    return filtered;
  }

  async getVariant(id: string): Promise<Variant | undefined> {
    return this.variants.find(v => v.id === id);
  }

  // Helper to generate variant ID: HOCIVX00001 (Brand+Model+Variant+Counter)
  private generateVariantId(brandId: string, modelId: string, variantName: string): string {
    // Get brand and model
    const brand = this.brands.find(b => b.id === brandId);
    const model = this.models.find(m => m.id === modelId);

    if (!brand || !model) {
      throw new Error('Brand or Model not found');
    }

    // Extract first 2 letters of brand name (e.g., "Honda" -> "HO")
    const brandPrefix = brand.name.substring(0, 2).toUpperCase();

    // Extract first 2 letters of model name (e.g., "City" -> "CI")
    const modelPrefix = model.name.substring(0, 2).toUpperCase();

    // Extract first 2 letters of variant name (e.g., "VXI" -> "VX")
    const variantPrefix = variantName.substring(0, 2).toUpperCase();

    // Count existing variants for this model to generate counter
    const existingVariants = this.variants.filter(v =>
      v.brandId === brandId && v.modelId === modelId
    );
    const counter = (existingVariants.length + 1).toString().padStart(5, '0');

    return `${brandPrefix}${modelPrefix}${variantPrefix}${counter}`;
  }

  async createVariant(variant: InsertVariant): Promise<Variant> {
    const id = this.generateVariantId(variant.brandId, variant.modelId, variant.name);

    const newVariant: Variant = {
      ...(variant as any),
      id,
      status: variant.status || 'active',
      highlightImages: (variant.highlightImages as any) || null,
      createdAt: new Date(),
    };
    this.variants.push(newVariant);
    this.saveData(); // Save to persistent storage
    return newVariant;
  }

  async updateVariant(id: string, variant: Partial<InsertVariant>): Promise<Variant | undefined> {
    const index = this.variants.findIndex(v => v.id === id);
    if (index === -1) return undefined;

    this.variants[index] = { ...this.variants[index], ...variant };
    this.saveData(); // Save to persistent storage
    return this.variants[index];
  }

  async deleteVariant(id: string): Promise<boolean> {
    const index = this.variants.findIndex(v => v.id === id);
    if (index === -1) return false;

    this.variants.splice(index, 1);
    this.saveData(); // Save to persistent storage
    return true;
  }

  // Get available rankings (1-50 minus already taken ones)
  async getAvailableRankings(excludeBrandId?: string): Promise<number[]> {
    const takenRankings = this.brands
      .filter(b => excludeBrandId ? b.id !== excludeBrandId : true)
      .map(b => b.ranking);

    const allRankings = Array.from({ length: 50 }, (_, i) => i + 1);
    return allRankings.filter(ranking => !takenRankings.includes(ranking));
  }

  // Popular Comparisons
  async getPopularComparisons(): Promise<PopularComparison[]> {
    return this.popularComparisons.filter(c => c.isActive).sort((a, b) => a.order - b.order);
  }

  async savePopularComparisons(comparisons: InsertPopularComparison[]): Promise<PopularComparison[]> {
    // Clear existing comparisons
    this.popularComparisons = [];

    // Create new comparisons with IDs
    const newComparisons: PopularComparison[] = comparisons.map((comp, index) => ({
      id: `comparison-${Date.now()}-${index}`,
      model1Id: comp.model1Id,
      model2Id: comp.model2Id,
      order: comp.order || index + 1,
      isActive: comp.isActive ?? true,
      createdAt: new Date(),
    }));

    this.popularComparisons = newComparisons;
    this.saveData();
    return this.popularComparisons;
  }

  // Admin Users
  async getAdminUser(email: string): Promise<AdminUser | undefined> {
    return this.adminUsers.find(u => u.email === email && u.isActive);
  }

  async getAdminUserById(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.find(u => u.id === id && u.isActive);
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const newUser: AdminUser = {
      id: `admin-${Date.now()}`,
      email: user.email,
      password: user.password, // Should already be hashed
      name: user.name,
      role: user.role || 'admin',
      isActive: user.isActive ?? true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.adminUsers.push(newUser);
    this.saveData();
    return newUser;
  }

  async updateAdminUserLogin(id: string): Promise<void> {
    const user = this.adminUsers.find(u => u.id === id);
    if (user) {
      user.lastLogin = new Date();
      user.updatedAt = new Date();
      this.saveData();
    }
  }

  // Session Management
  async createSession(userId: string, token: string): Promise<void> {
    this.activeSessions.set(userId, token);
  }

  async getActiveSession(userId: string): Promise<string | null> {
    return this.activeSessions.get(userId) || null;
  }

  async invalidateSession(userId: string): Promise<void> {
    this.activeSessions.delete(userId);
  }

  async isSessionValid(userId: string, token: string): Promise<boolean> {
    const activeToken = this.activeSessions.get(userId);
    return activeToken === token;
  }

  // YouTube Cache
  async getYouTubeCache(): Promise<{ data: any; timestamp: number } | null> {
    return this.youtubeCache;
  }

  async saveYouTubeCache(data: any, timestamp: number): Promise<void> {
    this.youtubeCache = { data, timestamp };
    try {
      fs.writeFileSync(this.youtubeCacheFile, JSON.stringify(this.youtubeCache, null, 2));
      console.log('✅ YouTube cache saved to persistent storage');
    } catch (error) {
      console.error('Error saving YouTube cache:', error);
    }
  }

  // Stats
  async getStats(): Promise<{ totalBrands: number; totalModels: number; totalVariants: number }> {
    return {
      totalBrands: this.brands.length,
      totalModels: this.models.length,
      totalVariants: this.variants.length,
    };
  }
  // Consultation Leads (Stub for PersistentStorage)
  async createConsultationLead(lead: InsertConsultationLead): Promise<ConsultationLead> {
    const newLead: ConsultationLead = {
      id: `lead-${Date.now()}`,
      name: lead.name,
      phone: lead.phone,
      email: lead.email || null,
      city: lead.city || null,
      budget: lead.budget || null,
      carInterest: lead.carInterest || null,
      plannedPurchaseDate: lead.plannedPurchaseDate || null,
      message: lead.message || null,
      status: 'new',
      source: lead.source || 'website',
      paymentStatus: lead.paymentStatus || 'pending',
      razorpayOrderId: lead.razorpayOrderId || null,
      razorpayPaymentId: lead.razorpayPaymentId || null,
      planDetails: lead.planDetails || null,
      totalAmount: lead.totalAmount || 0,
      createdAt: new Date(),
    };
    return newLead;
  }

  async getConsultationLeads(filters?: { status?: string }): Promise<ConsultationLead[]> {
    return [];
  }

  async updateConsultationLeadStatus(id: string, status: string): Promise<ConsultationLead | undefined> {
    return undefined;
  }
}


export const storage = new PersistentStorage();
