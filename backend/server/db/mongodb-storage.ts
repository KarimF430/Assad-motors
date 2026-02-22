import mongoose from 'mongoose';
import { IStorage } from '../storage';
import { Brand as MongoBrand, Model as MongoModel, UpcomingCar as MongoUpcomingCar, Variant as MongoVariant, AdminUser as MongoAdminUser, PopularComparison as MongoPopularComparison, ConsultationLead as MongoConsultationLead } from './schemas';
import type {
  Brand,
  Model,
  UpcomingCar,
  Variant,
  AdminUser,
  PopularComparison,
  InsertBrand,
  InsertModel,
  InsertUpcomingCar,
  InsertVariant,
  InsertPopularComparison,
  InsertAdminUser,
  ConsultationLead,
  InsertConsultationLead
} from '@shared/schema';

// Helper function to map Mongoose documents to shared types
function mapBrand(doc: any): Brand {
  return {
    id: doc.id,
    name: doc.name,
    logo: doc.logo || null,
    ranking: doc.ranking,
    status: doc.status,
    summary: doc.summary || null,
    faqs: doc.faqs || [],
    createdAt: doc.createdAt
  };
}

function mapModel(doc: any): Model {
  return {
    id: doc.id,
    brandId: doc.brandId,
    name: doc.name,
    isPopular: doc.isPopular || false,
    isNew: doc.isRecent || false,
    popularRank: doc.popularRank || null,
    newRank: doc.newRank || null,
    topRank: doc.topRank || null,
    bodyType: doc.bodyType || null,
    subBodyType: doc.subBodyType || null,
    launchDate: doc.launchDate || null,
    fuelTypes: doc.fuelTypes || [],
    transmissions: doc.transmissions || [],
    brochureUrl: doc.brochureUrl || null,
    status: doc.status,
    headerSeo: doc.headerSeo || null,
    pros: doc.pros || null,
    cons: doc.cons || null,
    description: doc.description || null,
    exteriorDesign: doc.exteriorDesign || null,
    comfortConvenience: doc.comfortConvenience || null,
    engineSummaries: doc.engineSummaries || [],
    mileageData: doc.mileageData || [],
    faqs: doc.faqs || [],
    keySpecs: doc.keySpecs || [],
    heroImage: doc.heroImage || null,
    galleryImages: doc.galleryImages || [],
    keyFeatureImages: doc.keyFeatureImages || [],
    spaceComfortImages: doc.spaceComfortImages || [],
    storageConvenienceImages: doc.storageConvenienceImages || [],
    colorImages: doc.colorImages || [],
    createdAt: doc.createdAt
  };
}

function mapUpcomingCar(doc: any): UpcomingCar {
  return {
    id: doc.id,
    brandId: doc.brandId,
    name: doc.name,
    isPopular: doc.isPopular || false,
    isNew: doc.isRecent || false,
    popularRank: doc.popularRank || null,
    newRank: doc.newRank || null,
    bodyType: doc.bodyType || null,
    subBodyType: doc.subBodyType || null,
    expectedLaunchDate: doc.expectedLaunchDate || null,
    expectedPriceMin: doc.expectedPriceMin || null,
    expectedPriceMax: doc.expectedPriceMax || null,
    fuelTypes: doc.fuelTypes || [],
    transmissions: doc.transmissions || [],
    brochureUrl: doc.brochureUrl || null,
    status: doc.status,
    headerSeo: doc.headerSeo || null,
    pros: doc.pros || null,
    cons: doc.cons || null,
    description: doc.description || null,
    exteriorDesign: doc.exteriorDesign || null,
    comfortConvenience: doc.comfortConvenience || null,
    summary: doc.summary || null,
    engineSummaries: doc.engineSummaries || [],
    mileageData: doc.mileageData || [],
    faqs: doc.faqs || [],
    heroImage: doc.heroImage || null,
    galleryImages: doc.galleryImages || [],
    keyFeatureImages: doc.keyFeatureImages || [],
    spaceComfortImages: doc.spaceComfortImages || [],
    storageConvenienceImages: doc.storageConvenienceImages || [],
    colorImages: doc.colorImages || [],
    createdAt: doc.createdAt
  };
}

function mapVariant(doc: any): Variant {
  return {
    id: doc.id,
    brandId: doc.brandId,
    modelId: doc.modelId,
    name: doc.name,
    price: doc.price,
    status: doc.status,
    description: doc.description || null,
    exteriorDesign: doc.exteriorDesign || null,
    comfortConvenience: doc.comfortConvenience || null,
    // Maps to specific schema fields instead of grouped objects
    fuelType: doc.fuelType || doc.fuel || null,
    transmission: doc.transmission || null,
    fuel: doc.fuel || doc.fuelType || null,
    // Use enginePower/engineTorque as fallbacks for power/maxPower/torque
    power: doc.power || doc.maxPower || doc.enginePower || null,
    maxPower: doc.maxPower || doc.power || doc.enginePower || null,

    // Safety Features
    globalNCAPRating: doc.globalNCAPRating || null,
    airbags: doc.airbags || null,
    airbagsLocation: doc.airbagsLocation || null,
    adasLevel: doc.adasLevel || null,
    adasFeatures: doc.adasFeatures || null,
    reverseCamera: doc.reverseCamera || null,
    reverseCameraGuidelines: doc.reverseCameraGuidelines || null,
    tyrePressureMonitor: doc.tyrePressureMonitor || null,
    hillHoldAssist: doc.hillHoldAssist || null,
    hillDescentControl: doc.hillDescentControl || null,
    rollOverMitigation: doc.rollOverMitigation || null,
    parkingSensor: doc.parkingSensor || null,
    discBrakes: doc.discBrakes || null,
    electronicStabilityProgram: doc.electronicStabilityProgram || null,
    abs: doc.abs || null,
    ebd: doc.ebd || null,
    brakeAssist: doc.brakeAssist || null,
    isofixMounts: doc.isofixMounts || null,
    seatbeltWarning: doc.seatbeltWarning || null,
    speedAlertSystem: doc.speedAlertSystem || null,
    speedSensingDoorLocks: doc.speedSensingDoorLocks || null,
    immobiliser: doc.immobiliser || null,

    // Entertainment & Connectivity
    touchScreenInfotainment: doc.touchScreenInfotainment || null,
    androidAppleCarplay: doc.androidAppleCarplay || null,
    speakers: doc.speakers || null,
    tweeters: doc.tweeters || null,
    subwoofers: doc.subwoofers || null,
    usbCChargingPorts: doc.usbCChargingPorts || null,
    usbAChargingPorts: doc.usbAChargingPorts || null,
    twelvevChargingPorts: doc.twelvevChargingPorts || null,
    wirelessCharging: doc.wirelessCharging || null,
    connectedCarTech: doc.connectedCarTech || null,

    // Comfort & Convenience
    ventilatedSeats: doc.ventilatedSeats || null,
    sunroof: doc.sunroof || null,
    airPurifier: doc.airPurifier || null,
    headsUpDisplay: doc.headsUpDisplay || null,
    cruiseControl: doc.cruiseControl || null,
    rainSensingWipers: doc.rainSensingWipers || null,
    automaticHeadlamp: doc.automaticHeadlamp || null,
    followMeHomeHeadlights: doc.followMeHomeHeadlights || null,
    keylessEntry: doc.keylessEntry || null,
    ignition: doc.ignition || null,
    ambientLighting: doc.ambientLighting || null,
    steeringAdjustment: doc.steeringAdjustment || null,
    airConditioning: doc.airConditioning || null,
    climateZones: doc.climateZones || null,
    rearACVents: doc.rearACVents || null,
    frontArmrest: doc.frontArmrest || null,
    rearArmrest: doc.rearArmrest || null,
    insideRearViewMirror: doc.insideRearViewMirror || null,
    outsideRearViewMirrors: doc.outsideRearViewMirrors || null,
    steeringMountedControls: doc.steeringMountedControls || null,
    rearWindshieldDefogger: doc.rearWindshieldDefogger || null,
    frontWindshieldDefogger: doc.frontWindshieldDefogger || null,
    cooledGlovebox: doc.cooledGlovebox || null,

    // Engine Data
    engineName: doc.engineName || null,
    engineSummary: doc.engineSummary || null,
    engineTransmission: doc.engineTransmission || null,
    enginePower: doc.enginePower || null,
    engineTorque: doc.engineTorque || null,
    engineSpeed: doc.engineSpeed || null,
    torque: doc.torque || doc.engineTorque || null,

    // Mileage
    mileageEngineName: doc.mileageEngineName || null,
    mileageCompanyClaimed: doc.mileageCompanyClaimed || null,
    mileageCityRealWorld: doc.mileageCityRealWorld || null,
    mileageHighwayRealWorld: doc.mileageHighwayRealWorld || null,

    // Page 4 - Engine & Transmission (Additional fields)
    engineNamePage4: doc.engineNamePage4 || null,
    engineCapacity: doc.engineCapacity || null,
    noOfGears: doc.noOfGears || null,
    paddleShifter: doc.paddleShifter || null,
    zeroTo100KmphTime: doc.zeroTo100KmphTime || null,
    topSpeed: doc.topSpeed || null,
    evBatteryCapacity: doc.evBatteryCapacity || null,
    hybridBatteryCapacity: doc.hybridBatteryCapacity || null,
    batteryType: doc.batteryType || null,
    electricMotorPlacement: doc.electricMotorPlacement || null,
    evRange: doc.evRange || null,
    evChargingTime: doc.evChargingTime || null,
    maxElectricMotorPower: doc.maxElectricMotorPower || null,
    turboCharged: doc.turboCharged || null,
    hybridType: doc.hybridType || null,
    driveTrain: doc.driveTrain || null,
    drivingModes: doc.drivingModes || null,
    offRoadModes: doc.offRoadModes || null,
    differentialLock: doc.differentialLock || null,
    limitedSlipDifferential: doc.limitedSlipDifferential || null,

    // Page 4 - Seating Comfort
    seatUpholstery: doc.seatUpholstery || null,
    seatsAdjustment: doc.seatsAdjustment || null,
    driverSeatAdjustment: doc.driverSeatAdjustment || null,
    passengerSeatAdjustment: doc.passengerSeatAdjustment || null,
    rearSeatAdjustment: doc.rearSeatAdjustment || null,
    welcomeSeats: doc.welcomeSeats || null,
    memorySeats: doc.memorySeats || null,

    // Page 4 - Exteriors
    headLights: doc.headLights || null,
    tailLight: doc.tailLight || null,
    frontFogLights: doc.frontFogLights || null,
    roofRails: doc.roofRails || null,
    radioAntenna: doc.radioAntenna || null,
    outsideRearViewMirror: doc.outsideRearViewMirror || null,
    daytimeRunningLights: doc.daytimeRunningLights || null,
    sideIndicator: doc.sideIndicator || null,
    rearWindshieldWiper: doc.rearWindshieldWiper || null,

    // Page 5 - Dimensions
    groundClearance: doc.groundClearance || null,
    length: doc.length || null,
    width: doc.width || null,
    height: doc.height || null,
    wheelbase: doc.wheelbase || null,
    turningRadius: doc.turningRadius || null,
    kerbWeight: doc.kerbWeight || null,

    // Page 5 - Tyre & Suspension
    frontTyreProfile: doc.frontTyreProfile || null,
    rearTyreProfile: doc.rearTyreProfile || null,
    spareTyreProfile: doc.spareTyreProfile || null,
    spareWheelType: doc.spareWheelType || null,
    frontSuspension: doc.frontSuspension || null,
    rearSuspension: doc.rearSuspension || null,

    // Page 5 - Storage
    cupholders: doc.cupholders || null,
    fuelTankCapacity: doc.fuelTankCapacity || null,
    bootSpace: doc.bootSpace || null,
    bootSpaceAfterFoldingRearRowSeats: doc.bootSpaceAfterFoldingRearRowSeats || null,

    // Other
    keyFeatures: doc.keyFeatures || null,
    headerSummary: doc.headerSummary || null,
    isValueForMoney: doc.isValueForMoney || false,
    highlightImages: doc.highlightImages || [],
    createdAt: doc.createdAt
  };
}

function mapPopularComparison(doc: any): PopularComparison {
  return {
    id: doc.id,
    model1Id: doc.model1Id,
    model2Id: doc.model2Id,
    order: doc.order,
    isActive: doc.isActive,
    createdAt: doc.createdAt
  };
}

function mapAdminUser(doc: any): AdminUser {
  return {
    id: doc.id,
    email: doc.email,
    password: doc.password,
    name: doc.name,
    role: doc.role,
    isActive: doc.isActive,
    lastLogin: doc.lastLogin || null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export class MongoDBStorage implements IStorage {
  private activeSessions: Map<string, string> = new Map();

  async connect(uri: string): Promise<void> {
    const { initializeMongoDBOptimized } = await import('./mongodb-config');
    await initializeMongoDBOptimized(uri);
  }

  // ============================================
  // BRANDS
  // ============================================

  async getBrands(includeInactive?: boolean, onlyVisible?: boolean): Promise<Brand[]> {
    try {
      const matchStage: any = includeInactive ? {} : { status: 'active' };

      if (onlyVisible) {
        // If onlyVisible is true, we only return brands that have at least one active model
        // with at least one variant priced >= 100,000
        const result = await MongoBrand.aggregate([
          { $match: matchStage },
          {
            $lookup: {
              from: 'models',
              localField: 'id',
              foreignField: 'brandId',
              pipeline: [
                { $match: { status: 'active' } },
                {
                  $lookup: {
                    from: 'variants',
                    localField: 'id',
                    foreignField: 'modelId',
                    pipeline: [
                      { $match: { status: 'active', price: { $gte: 100000 } } },
                      { $limit: 1 }
                    ],
                    as: 'qualifyingVariants'
                  }
                },
                { $match: { 'qualifyingVariants.0': { $exists: true } } },
                { $limit: 1 }
              ],
              as: 'qualifyingModels'
            }
          },
          { $match: { 'qualifyingModels.0': { $exists: true } } },
          { $sort: { ranking: 1 } }
        ]);
        return result.map(mapBrand);
      }

      const brands = await MongoBrand.find(matchStage).sort({ ranking: 1 }).lean();
      return brands.map(mapBrand);
    } catch (error) {
      console.error('getBrands error:', error);
      throw new Error('Failed to fetch brands');
    }
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    try {
      const brand = await MongoBrand.findOne({ id }).lean();
      return brand ? mapBrand(brand) : undefined;
    } catch (error) {
      console.error('getBrand error:', error);
      throw new Error('Failed to fetch brand');
    }
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    try {
      console.log('🔍 createBrand called with:', { name: brand.name, logo: brand.logo, hasLogo: !!brand.logo });

      // Validate logo URL if provided
      if (brand.logo) {
        // Check if it's a full URL (R2 or external)
        if (brand.logo.startsWith('http://') || brand.logo.startsWith('https://')) {
          console.log('✅ Logo is a full URL (R2/external):', brand.logo);
        } else if (brand.logo.startsWith('/uploads/')) {
          console.warn('⚠️  Logo is a local path - may be lost on server restart:', brand.logo);
        } else {
          console.warn('⚠️  Unexpected logo format:', brand.logo);
        }
      }

      // Generate a unique brand ID (format: "brand-{name-slug}")
      const slug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const id = `brand-${slug}`;

      // Check if brand with this ID already exists
      const existing = await MongoBrand.findOne({ id }).lean();
      if (existing) {
        throw new Error(`Brand "${brand.name}" already exists.`);
      }

      // Auto-assign ranking based on creation order (next available position)
      const brands = await MongoBrand.find({}).select('ranking').lean();
      const maxRanking = brands.length > 0
        ? Math.max(...brands.map(b => b.ranking))
        : 0;
      const autoRanking = maxRanking + 1;

      console.log('✅ Creating brand with:', { id, ranking: autoRanking, logo: brand.logo });

      const newBrand = await MongoBrand.create({
        ...brand,
        id,
        ranking: autoRanking,
        createdAt: new Date()
      });

      console.log('✅ Brand created successfully:', { id: newBrand.id, logo: newBrand.logo });

      return mapBrand(newBrand.toObject());
    } catch (error) {
      console.error('createBrand error:', error);
      throw error instanceof Error ? error : new Error('Failed to create brand');
    }
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    try {
      const updatedBrand = await MongoBrand.findOneAndUpdate(
        { id },
        { $set: brand },
        { new: true }
      ).lean();
      return updatedBrand ? mapBrand(updatedBrand) : undefined;
    } catch (error) {
      console.error('updateBrand error:', error);
      throw new Error('Failed to update brand');
    }
  }

  async deleteBrand(id: string): Promise<boolean> {
    try {
      const result = await MongoBrand.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('deleteBrand error:', error);
      throw new Error('Failed to delete brand');
    }
  }

  async getAvailableRankings(excludeBrandId?: string): Promise<number[]> {
    try {
      const filter = excludeBrandId ? { id: { $ne: excludeBrandId } } : {};
      const brands = await MongoBrand.find(filter).select('ranking').lean();
      return brands.map(b => b.ranking).sort((a, b) => a - b);
    } catch (error) {
      console.error('getAvailableRankings error:', error);
      throw new Error('Failed to fetch available rankings');
    }
  }

  // ============================================
  // MODELS
  // ============================================

  async getModels(brandId?: string): Promise<Model[]> {
    try {
      const filter: any = {};
      if (brandId) filter.brandId = brandId;

      const models = await MongoModel.find(filter).sort({ name: 1 }).lean();
      return models.map(mapModel);
    } catch (error) {
      console.error('getModels error:', error);
      throw new Error('Failed to fetch models');
    }
  }

  async getModel(id: string): Promise<Model | undefined> {
    try {
      const model = await MongoModel.findOne({ id }).lean();
      return model ? mapModel(model) : undefined;
    } catch (error) {
      console.error('getModel error:', error);
      throw new Error('Failed to fetch model');
    }
  }

  async createModel(model: InsertModel): Promise<Model> {
    try {
      // Get brand to generate proper ID
      const brand = await MongoBrand.findOne({ id: model.brandId }).lean();
      if (!brand) {
        throw new Error(`Invalid brandId: ${model.brandId}. Brand does not exist.`);
      }

      // Generate model ID (format: "model-brand-{brand-slug}-{model-slug}")
      const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const modelSlug = model.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const id = `model-brand-${brandSlug}-${modelSlug}`;

      // Check if model with this ID already exists
      const existing = await MongoModel.findOne({ id }).lean();
      if (existing) {
        throw new Error(`Model "${model.name}" already exists for brand "${brand.name}".`);
      }

      const { isNew, ...modelData } = model;
      const newModel = await MongoModel.create({
        ...modelData,
        isRecent: isNew,
        id,
        createdAt: new Date()
      });

      return mapModel(newModel.toObject());
    } catch (error) {
      console.error('createModel error:', error);
      throw error instanceof Error ? error : new Error('Failed to create model');
    }
  }

  async updateModel(id: string, model: Partial<InsertModel>): Promise<Model | undefined> {
    try {
      const updateData: any = { ...model };
      if (updateData.isNew !== undefined) {
        updateData.isRecent = updateData.isNew;
        delete updateData.isNew;
      }
      const updatedModel = await MongoModel.findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true }
      ).lean();
      return updatedModel ? mapModel(updatedModel) : undefined;
    } catch (error) {
      console.error('updateModel error:', error);
      throw new Error('Failed to update model');
    }
  }

  async deleteModel(id: string): Promise<boolean> {
    try {
      // First delete all variants associated with this model
      await MongoVariant.deleteMany({ modelId: id });

      // Then delete the model
      const modelDeleteResult = await MongoModel.deleteOne({ id });

      return modelDeleteResult.deletedCount > 0;
    } catch (error) {
      console.error('deleteModel cascade error:', error);
      throw new Error('Failed to delete model and related variants');
    }
  }

  async getPopularModels(limit: number = 20): Promise<Model[]> {
    try {
      const models = await MongoModel.find({ isPopular: true, status: 'active' })
        .sort({ popularRank: 1 })
        .limit(limit)
        .lean();
      return models.map(mapModel);
    } catch (error) {
      console.error('getPopularModels error:', error);
      throw new Error('Failed to fetch popular models');
    }
  }

  async getModelsWithPricing(brandId?: string, onlyVisible?: boolean): Promise<any[]> {
    try {
      const matchStage: any = { status: 'active' };
      if (brandId) matchStage.brandId = brandId;

      const pipeline: any[] = [
        { $match: matchStage },
        { $sort: { name: 1 } },
        {
          $lookup: {
            from: 'variants',
            localField: 'id',
            foreignField: 'modelId',
            pipeline: [
              { $match: { status: 'active' } },
              { $project: { price: 1, fuel: 1, fuelType: 1 } }
            ],
            as: 'variants'
          }
        },
        {
          $addFields: {
            prices: {
              $filter: {
                input: { $map: { input: "$variants", as: "v", in: "$$v.price" } },
                as: "p",
                cond: { $gt: ["$$p", 0] }
              }
            }
          }
        },
        {
          $addFields: {
            startingPrice: { $min: "$prices" },
            lowestPrice: { $min: "$prices" },
            priceRange: {
              min: { $ifNull: [{ $min: "$prices" }, 0] },
              max: { $ifNull: [{ $max: "$prices" }, 0] }
            },
            // Find variant with lowest price to get fuel type
            lowestPriceVariant: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$variants",
                    as: "v",
                    cond: { $eq: ["$$v.price", { $min: "$prices" }] }
                  }
                },
                0
              ]
            }
          }
        },
        {
          $addFields: {
            lowestPriceFuelType: {
              $ifNull: ["$lowestPriceVariant.fuel", { $ifNull: ["$lowestPriceVariant.fuelType", "Petrol"] }]
            }
          }
        },
        {
          $project: {
            variants: 0,
            prices: 0,
            lowestPriceVariant: 0
          }
        }
      ];

      // Add price filter if onlyVisible is requested
      if (onlyVisible) {
        pipeline.push({
          $match: {
            startingPrice: { $gte: 100000 }
          }
        });
      }

      const results = await MongoModel.aggregate(pipeline);

      // Map results to ensure they match the expected Model structure + pricing fields
      return results.map(doc => ({
        ...mapModel(doc),
        startingPrice: doc.startingPrice || 0,
        lowestPrice: doc.lowestPrice || 0,
        lowestPriceFuelType: doc.lowestPriceFuelType,
        priceRange: doc.priceRange
      }));

    } catch (error) {
      console.error('getModelsWithPricing error:', error);
      throw new Error('Failed to fetch models with pricing');
    }
  }

  // ============================================
  // UPCOMING CARS
  // ============================================

  async getUpcomingCars(brandId?: string, onlyVisible?: boolean): Promise<UpcomingCar[]> {
    try {
      const filter: any = { status: 'active' };
      if (brandId) filter.brandId = brandId;
      if (onlyVisible) {
        filter.expectedPriceMin = { $gte: 100000 };
      }

      const upcomingCars = await MongoUpcomingCar.find(filter).sort({ name: 1 }).lean();
      return upcomingCars.map(mapUpcomingCar);
    } catch (error) {
      console.error('getUpcomingCars error:', error);
      throw new Error('Failed to fetch upcoming cars');
    }
  }

  async getUpcomingCar(id: string): Promise<UpcomingCar | undefined> {
    try {
      const upcomingCar = await MongoUpcomingCar.findOne({ id }).lean();
      return upcomingCar ? mapUpcomingCar(upcomingCar) : undefined;
    } catch (error) {
      console.error('getUpcomingCar error:', error);
      throw new Error('Failed to fetch upcoming car');
    }
  }

  async createUpcomingCar(car: InsertUpcomingCar): Promise<UpcomingCar> {
    try {
      // Get brand to generate proper ID
      const brand = await MongoBrand.findOne({ id: car.brandId }).lean();
      if (!brand) {
        throw new Error(`Invalid brandId: ${car.brandId}. Brand does not exist.`);
      }

      // Generate upcoming car ID (format: "upcoming-brand-{brand-slug}-{car-slug}")
      const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const carSlug = car.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const id = `upcoming-brand-${brandSlug}-${carSlug}`;

      // Check if upcoming car with this ID already exists
      const existing = await MongoUpcomingCar.findOne({ id }).lean();
      if (existing) {
        throw new Error(`Upcoming car "${car.name}" already exists for brand "${brand.name}".`);
      }

      const { isNew, ...carData } = car;
      const newUpcomingCar = await MongoUpcomingCar.create({
        ...carData,
        isRecent: isNew,
        id,
        createdAt: new Date()
      });

      return mapUpcomingCar(newUpcomingCar.toObject());
    } catch (error) {
      console.error('createUpcomingCar error:', error);
      throw error instanceof Error ? error : new Error('Failed to create upcoming car');
    }
  }

  async updateUpcomingCar(id: string, car: Partial<InsertUpcomingCar>): Promise<UpcomingCar | undefined> {
    try {
      const updateData: any = { ...car };
      if (updateData.isNew !== undefined) {
        updateData.isRecent = updateData.isNew;
        delete updateData.isNew;
      }
      const updatedUpcomingCar = await MongoUpcomingCar.findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true }
      ).lean();
      return updatedUpcomingCar ? mapUpcomingCar(updatedUpcomingCar) : undefined;
    } catch (error) {
      console.error('updateUpcomingCar error:', error);
      throw new Error('Failed to update upcoming car');
    }
  }

  async deleteUpcomingCar(id: string): Promise<boolean> {
    try {
      const result = await MongoUpcomingCar.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('deleteUpcomingCar error:', error);
      throw new Error('Failed to delete upcoming car');
    }
  }

  // ============================================
  // VARIANTS
  // ============================================

  async getVariants(modelId?: string, brandId?: string): Promise<Variant[]> {
    try {
      const filter: any = {};
      if (modelId) filter.modelId = modelId;
      if (brandId) filter.brandId = brandId;

      const variants = await MongoVariant.find(filter).sort({ price: 1 }).lean();
      return variants.map(mapVariant);
    } catch (error) {
      console.error('getVariants error:', error);
      throw new Error('Failed to fetch variants');
    }
  }

  async getVariant(id: string): Promise<Variant | undefined> {
    try {
      const variant = await MongoVariant.findOne({ id }).lean();
      return variant ? mapVariant(variant) : undefined;
    } catch (error) {
      console.error('getVariant error:', error);
      throw new Error('Failed to fetch variant');
    }
  }

  async createVariant(variant: InsertVariant): Promise<Variant> {
    try {
      // Get brand
      const brand = await MongoBrand.findOne({ id: variant.brandId }).lean();
      if (!brand) {
        throw new Error(`Invalid brandId: ${variant.brandId}. Brand does not exist.`);
      }

      // Try to find model in regular models
      console.log(`🔍 Looking up model: ${variant.modelId}`);
      let model: any = await MongoModel.findOne({ id: variant.modelId }).lean();
      let isUpcoming = false;

      // If not found, try upcoming cars
      if (!model) {
        console.log(`⚠️ Model not found in regular models, checking upcoming cars for: ${variant.modelId}`);
        const upcomingCar = await MongoUpcomingCar.findOne({ id: variant.modelId }).lean();
        if (upcomingCar) {
          console.log(`✅ Found upcoming car: ${upcomingCar.name}`);
          model = upcomingCar;
          isUpcoming = true;
        } else {
          console.log(`❌ Model not found in upcoming cars either: ${variant.modelId}`);
        }
      } else {
        console.log(`✅ Found regular model: ${model.name}`);
      }

      if (!model) {
        throw new Error(`Invalid modelId: ${variant.modelId}. Model does not exist.`);
      }

      if (model.brandId !== variant.brandId) {
        throw new Error(`Model ${variant.modelId} does not belong to brand ${variant.brandId}.`);
      }

      // Generate variant ID (format: "variant-brand-{brand-slug}-model-{model-slug}-{variant-slug}")
      const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const modelSlug = model.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const variantSlug = variant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Ensure unique ID by appending random string if needed, or just standard format
      // For upcoming cars, we might want to distinguish the ID, but the format seems generic enough
      const id = `variant-brand-${brandSlug}-model-${brandSlug}-${modelSlug}-${variantSlug}`;

      // Check if variant with this ID already exists
      const existing = await MongoVariant.findOne({ id }).lean();
      if (existing) {
        // If it exists, we might want to update it or throw error. 
        // For now, throwing error as per original logic, but maybe we should allow upsert?
        // Let's stick to original logic but maybe append a suffix if it's a different variant with same name?
        // No, name should be unique per model.
        throw new Error(`Variant "${variant.name}" already exists for model "${model.name}".`);
      }

      const newVariant = await MongoVariant.create({
        ...variant,
        id,
        createdAt: new Date()
      });

      return mapVariant(newVariant.toObject());
    } catch (error) {
      console.error('createVariant error:', error);
      throw error instanceof Error ? error : new Error('Failed to create variant');
    }
  }

  async updateVariant(id: string, variant: Partial<InsertVariant>): Promise<Variant | undefined> {
    try {
      const updatedVariant = await MongoVariant.findOneAndUpdate(
        { id },
        { $set: variant },
        { new: true }
      ).lean();
      return updatedVariant ? mapVariant(updatedVariant) : undefined;
    } catch (error) {
      console.error('updateVariant error:', error);
      throw new Error('Failed to update variant');
    }
  }


  async deleteVariant(id: string): Promise<boolean> {
    try {
      const result = await MongoVariant.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('deleteVariant error:', error);
      throw new Error('Failed to delete variant');
    }
  }


  // ============================================
  // POPULAR COMPARISONS
  // ============================================

  async getPopularComparisons(): Promise<PopularComparison[]> {
    try {
      const comparisons = await MongoPopularComparison.find({ isActive: true }).sort({ order: 1 }).lean();
      return comparisons.map(doc => ({
        id: doc.id,
        model1Id: doc.model1Id,
        model2Id: doc.model2Id,
        order: doc.order,
        isActive: doc.isActive,
        createdAt: doc.createdAt
      }));
    } catch (error) {
      console.error('getPopularComparisons error:', error);
      throw new Error('Failed to fetch popular comparisons');
    }
  }

  async savePopularComparisons(comparisons: InsertPopularComparison[]): Promise<PopularComparison[]> {
    try {
      // Clear existing comparisons
      await MongoPopularComparison.deleteMany({});

      // Create new comparisons
      const newComparisons = await MongoPopularComparison.create(comparisons.map((comp, index) => ({
        ...comp,
        id: `comparison-${Date.now()}-${index}`,
        order: comp.order || index + 1,
        isActive: comp.isActive ?? true,
        createdAt: new Date()
      })));

      return newComparisons.map(doc => ({
        id: doc.id,
        model1Id: doc.model1Id,
        model2Id: doc.model2Id,
        order: doc.order,
        isActive: doc.isActive,
        createdAt: doc.createdAt
      }));
    } catch (error) {
      console.error('savePopularComparisons error:', error);
      throw new Error('Failed to save popular comparisons');
    }
  }

  // ============================================
  // ADMIN USERS
  // ============================================

  async getAdminUser(email: string): Promise<AdminUser | undefined> {
    try {
      const user = await MongoAdminUser.findOne({ email, isActive: true }).lean();
      return user ? {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      } : undefined;
    } catch (error) {
      console.error('getAdminUser error:', error);
      throw new Error('Failed to fetch admin user');
    }
  }

  async getAdminUserById(id: string): Promise<AdminUser | undefined> {
    try {
      const user = await MongoAdminUser.findOne({ id, isActive: true }).lean();
      return user ? {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      } : undefined;
    } catch (error) {
      console.error('getAdminUserById error:', error);
      throw new Error('Failed to fetch admin user by ID');
    }
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    try {
      const newUser = await MongoAdminUser.create({
        ...user,
        id: `admin-${Date.now()}`,
        role: user.role || 'admin',
        isActive: user.isActive ?? true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return {
        id: newUser.id,
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        role: newUser.role,
        isActive: newUser.isActive,
        lastLogin: newUser.lastLogin || null,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };
    } catch (error) {
      console.error('createAdminUser error:', error);
      throw new Error('Failed to create admin user');
    }
  }

  async updateAdminUserLogin(id: string): Promise<void> {
    try {
      await MongoAdminUser.updateOne(
        { id },
        { $set: { lastLogin: new Date(), updatedAt: new Date() } }
      );
    } catch (error) {
      console.error('updateAdminUserLogin error:', error);
      throw new Error('Failed to update admin user login');
    }
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================

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

  // ============================================
  // YOUTUBE CACHE
  // ============================================

  async getYouTubeCache(): Promise<{ data: any; timestamp: number } | null> {
    // MongoDB implementation could leverage a separate collection, but for now returning null 
    // or we could implement a simple collection for caches.
    // Given the interface, let's keep it null or implement if needed. 
    // The previous implementation used file system. 
    // Let's rely on the fact that if this returns null, the fetcher will run.
    return null;
  }

  async saveYouTubeCache(data: any, timestamp: number): Promise<void> {
    // No-op for now unless we add a schema for it
  }

  // ============================================
  // STATS
  // ============================================

  async getStats(): Promise<{ totalBrands: number; totalModels: number; totalVariants: number }> {
    try {
      const totalBrands = await MongoBrand.countDocuments({ status: 'active' });
      const totalModels = await MongoModel.countDocuments({ status: 'active' });
      const totalVariants = await MongoVariant.countDocuments({ status: 'active' });

      return {
        totalBrands,
        totalModels,
        totalVariants
      };
    } catch (error) {
      console.error('getStats error:', error);
      throw new Error('Failed to fetch stats');
    }
  }

  // ============================================
  // CONSULTATION LEADS
  // ============================================

  async createConsultationLead(lead: InsertConsultationLead): Promise<ConsultationLead> {
    try {
      const newLead = await MongoConsultationLead.create({
        ...lead,
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: lead.status || 'new',
        createdAt: new Date(),
        email: lead.email || null,
        city: lead.city || null,
        budget: lead.budget || null,
        carInterest: lead.carInterest || null,
        plannedPurchaseDate: lead.plannedPurchaseDate || null,
        message: lead.message || null,
        source: lead.source || 'website',
        paymentStatus: lead.paymentStatus || 'pending',
        razorpayOrderId: lead.razorpayOrderId || null,
        razorpayPaymentId: lead.razorpayPaymentId || null,
        planDetails: lead.planDetails || null,
        totalAmount: lead.totalAmount || 0
      });

      return {
        id: newLead.id,
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email || null,
        city: newLead.city || null,
        budget: newLead.budget || null,
        carInterest: newLead.carInterest || null,
        plannedPurchaseDate: newLead.plannedPurchaseDate || null,
        message: newLead.message || null,
        status: newLead.status,
        source: newLead.source,
        paymentStatus: newLead.paymentStatus,
        razorpayOrderId: newLead.razorpayOrderId || null,
        razorpayPaymentId: newLead.razorpayPaymentId || null,
        planDetails: newLead.planDetails || null,
        totalAmount: newLead.totalAmount || null,
        createdAt: newLead.createdAt
      };
    } catch (error) {
      console.error('createConsultationLead error:', error);
      throw new Error('Failed to create consultation lead');
    }
  }

  async getConsultationLeads(filters?: { status?: string }): Promise<ConsultationLead[]> {
    try {
      const query: any = {};
      if (filters?.status) {
        query.status = filters.status;
      }

      const leads = await MongoConsultationLead.find(query).sort({ createdAt: -1 }).lean();

      return leads.map(doc => ({
        id: doc.id,
        name: doc.name,
        phone: doc.phone,
        email: doc.email || null,
        city: doc.city || null,
        budget: doc.budget || null,
        carInterest: doc.carInterest || null,
        plannedPurchaseDate: doc.plannedPurchaseDate || null,
        message: doc.message || null,
        status: doc.status,
        source: doc.source,
        paymentStatus: doc.paymentStatus,
        razorpayOrderId: doc.razorpayOrderId || null,
        razorpayPaymentId: doc.razorpayPaymentId || null,
        planDetails: doc.planDetails || null,
        totalAmount: doc.totalAmount || null,
        createdAt: doc.createdAt
      }));
    } catch (error) {
      console.error('getConsultationLeads error:', error);
      throw new Error('Failed to fetch consultation leads');
    }
  }

  async updateConsultationLeadStatus(id: string, status: string): Promise<ConsultationLead | undefined> {
    try {
      const updatedLead = await MongoConsultationLead.findOneAndUpdate(
        { id },
        { $set: { status } },
        { new: true }
      ).lean();

      if (!updatedLead) return undefined;

      return {
        id: updatedLead.id,
        name: updatedLead.name,
        phone: updatedLead.phone,
        email: updatedLead.email || null,
        city: updatedLead.city || null,
        budget: updatedLead.budget || null,
        carInterest: updatedLead.carInterest || null,
        plannedPurchaseDate: updatedLead.plannedPurchaseDate || null,
        message: updatedLead.message || null,
        status: updatedLead.status,
        source: updatedLead.source,
        paymentStatus: updatedLead.paymentStatus,
        razorpayOrderId: updatedLead.razorpayOrderId || null,
        razorpayPaymentId: updatedLead.razorpayPaymentId || null,
        planDetails: updatedLead.planDetails || null,
        totalAmount: updatedLead.totalAmount || null,
        createdAt: updatedLead.createdAt
      };
    } catch (error) {
      console.error('updateConsultationLeadStatus error:', error);
      throw new Error('Failed to update consultation lead status');
    }
  }

}
