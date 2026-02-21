import { z } from "zod";

// MongoDB-compatible validation schemas

export const insertBrandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  logo: z.string().optional(),
  status: z.string().default("active"),
  summary: z.string().optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).default([])
});

export const insertModelSchema = z.object({
  name: z.string().min(1, "Model name is required"),
  brandId: z.string().min(1, "Brand ID is required"),
  status: z.string().default("active"),
  isPopular: z.boolean().default(false),
  isNew: z.boolean().default(false),
  popularRank: z.number().nullable().optional(),
  newRank: z.number().nullable().optional(),
  bodyType: z.union([z.string(), z.null()]).optional(),
  subBodyType: z.union([z.string(), z.null()]).optional(),
  launchDate: z.union([z.string(), z.null()]).optional(),
  seating: z.number().default(5),
  fuelTypes: z.array(z.string()).default([]),
  transmissions: z.array(z.string()).default([]),
  brochureUrl: z.union([z.string(), z.null()]).optional(),
  headerSeo: z.union([z.string(), z.null()]).optional(),
  pros: z.union([z.string(), z.null()]).optional(),
  cons: z.union([z.string(), z.null()]).optional(),
  description: z.union([z.string(), z.null()]).optional(),
  exteriorDesign: z.union([z.string(), z.null()]).optional(),
  comfortConvenience: z.union([z.string(), z.null()]).optional(),
  summary: z.union([z.string(), z.null()]).optional(),
  engineSummaries: z.array(z.object({
    title: z.string(),
    summary: z.string(),
    transmission: z.string(),
    power: z.string(),
    torque: z.string(),
    speed: z.string()
  })).default([]),
  mileageData: z.array(z.object({
    engineName: z.string(),
    companyClaimed: z.string(),
    cityRealWorld: z.string(),
    highwayRealWorld: z.string()
  })).default([]),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).default([]),
  heroImage: z.union([z.string(), z.null()]).optional(),
  galleryImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([]),
  keyFeatureImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([]),
  spaceComfortImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([]),
  storageConvenienceImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([]),
  colorImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([])
});

export const insertUpcomingCarSchema = z.object({
  name: z.string().min(1, "Car name is required"),
  brandId: z.string().min(1, "Brand ID is required"),
  status: z.string().default("active"),
  isPopular: z.boolean().default(false),
  isNew: z.boolean().default(false),
  popularRank: z.number().nullable().optional(),
  newRank: z.number().nullable().optional(),
  bodyType: z.union([z.string(), z.null()]).optional(),
  subBodyType: z.union([z.string(), z.null()]).optional(),
  expectedLaunchDate: z.union([z.string(), z.null()]).optional(),
  seating: z.number().default(5),
  fuelTypes: z.array(z.string()).default([]),
  transmissions: z.array(z.string()).default([]),
  brochureUrl: z.union([z.string(), z.null()]).optional(),

  // Price Range
  expectedPriceMin: z.number().min(0, "Minimum price must be positive").nullable().optional(),
  expectedPriceMax: z.number().min(0, "Maximum price must be positive").nullable().optional(),

  headerSeo: z.union([z.string(), z.null()]).optional(),
  pros: z.union([z.string(), z.null()]).optional(),
  cons: z.union([z.string(), z.null()]).optional(),
  description: z.union([z.string(), z.null()]).optional(),
  exteriorDesign: z.union([z.string(), z.null()]).optional(),
  comfortConvenience: z.union([z.string(), z.null()]).optional(),
  summary: z.union([z.string(), z.null()]).optional(),
  engineSummaries: z.array(z.object({
    title: z.string(),
    summary: z.string(),
    transmission: z.string(),
    power: z.string(),
    torque: z.string(),
    speed: z.string()
  })).default([]),
  mileageData: z.array(z.object({
    engineName: z.string(),
    companyClaimed: z.string(),
    cityRealWorld: z.string(),
    highwayRealWorld: z.string()
  })).default([]),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).default([]),
  heroImage: z.union([z.string(), z.null()]).optional(),
  galleryImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([]),
  keyFeatureImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([]),
  spaceComfortImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([]),
  storageConvenienceImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([]),
  colorImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([])
}).refine(
  (data) => {
    // Validate that expectedPriceMax >= expectedPriceMin when both are provided
    if (data.expectedPriceMin != null && data.expectedPriceMax != null) {
      return data.expectedPriceMax >= data.expectedPriceMin;
    }
    return true;
  },
  {
    message: "Expected maximum price must be greater than or equal to minimum price",
    path: ["expectedPriceMax"]
  }
);

export const insertVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  brandId: z.string().min(1, "Brand ID is required"),
  modelId: z.string().min(1, "Model ID is required"),
  price: z.number().min(0, "Price must be a positive number"),
  status: z.string().default("active"),
  description: z.string().optional(),
  isValueForMoney: z.boolean().default(false),
  keyFeatures: z.string().optional(),
  headerSummary: z.string().optional(),
  exteriorDesign: z.string().optional(),
  comfortConvenience: z.string().optional(),

  // Engine & Performance
  engineName: z.string().optional(),
  engineSummary: z.string().optional(),
  engineTransmission: z.string().optional(),
  enginePower: z.string().optional(),
  engineTorque: z.string().optional(),
  engineSpeed: z.string().optional(),
  engineType: z.string().optional(),
  displacement: z.string().optional(),
  power: z.string().optional(),
  torque: z.string().optional(),
  transmission: z.string().optional(),
  driveType: z.string().optional(),
  fuelType: z.string().optional(),
  fuel: z.string().optional(),

  // Mileage
  mileageEngineName: z.string().optional(),
  mileageCompanyClaimed: z.string().optional(),
  mileageCityRealWorld: z.string().optional(),
  mileageHighwayRealWorld: z.string().optional(),
  mileageCity: z.string().optional(),
  mileageHighway: z.string().optional(),
  fuelTankCapacity: z.string().optional(),
  emissionStandard: z.string().optional(),

  // Dimensions
  groundClearance: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  wheelbase: z.string().optional(),
  turningRadius: z.string().optional(),
  kerbWeight: z.string().optional(),
  seatingCapacity: z.string().optional(),
  doors: z.string().optional(),

  // Safety Features
  globalNCAPRating: z.string().optional(),
  airbags: z.string().optional(),
  airbagsLocation: z.string().optional(),
  adasLevel: z.string().optional(),
  adasFeatures: z.string().optional(),
  reverseCamera: z.string().optional(),
  abs: z.string().optional(),
  ebd: z.string().optional(),
  esc: z.string().optional(),
  tractionControl: z.string().optional(),

  // Comfort & Convenience
  ventilatedSeats: z.string().optional(),
  sunroof: z.string().optional(),
  airPurifier: z.string().optional(),
  headsUpDisplay: z.string().optional(),
  cruiseControl: z.string().optional(),
  rainSensingWipers: z.string().optional(),
  automaticHeadlamp: z.string().optional(),
  keylessEntry: z.string().optional(),
  ignition: z.string().optional(),
  ambientLighting: z.string().optional(),
  steeringAdjustment: z.string().optional(),
  airConditioning: z.string().optional(),
  climateControl: z.string().optional(),
  pushButtonStart: z.string().optional(),
  powerWindows: z.string().optional(),
  powerSteering: z.string().optional(),

  // Infotainment
  touchScreenInfotainment: z.string().optional(),
  androidAppleCarplay: z.string().optional(),
  speakers: z.string().optional(),
  infotainmentScreen: z.string().optional(),
  bluetooth: z.string().optional(),
  usb: z.string().optional(),
  aux: z.string().optional(),
  androidAuto: z.string().optional(),
  appleCarPlay: z.string().optional(),

  // Images
  highlightImages: z.array(z.object({
    url: z.string(),
    caption: z.string()
  })).default([]),

  // Connected Car Tech
  connectedCarTech: z.string().optional(),

  // Warranty
  warranty: z.string().optional()
});

export const insertPopularComparisonSchema = z.object({
  model1Id: z.string().min(1, "Model 1 ID is required"),
  model2Id: z.string().min(1, "Model 2 ID is required"),
  order: z.number().min(1, "Order is required"),
  isActive: z.boolean().default(true)
});

export const insertAdminUserSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  role: z.string().default("admin"),
  isActive: z.boolean().default(true)
});

// Export types
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type InsertModel = z.infer<typeof insertModelSchema>;
export type InsertUpcomingCar = z.infer<typeof insertUpcomingCarSchema>;
export type InsertVariant = z.infer<typeof insertVariantSchema>;
export type InsertPopularComparison = z.infer<typeof insertPopularComparisonSchema>;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
