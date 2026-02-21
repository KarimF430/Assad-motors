import mongoose from 'mongoose';

// Brand Schema
const brandSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  logo: { type: String, default: null },
  ranking: { type: Number, required: true },
  status: { type: String, default: 'active' },
  summary: { type: String, default: null },
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for better performance
brandSchema.index({ id: 1 }, { unique: true });
brandSchema.index({ status: 1, ranking: 1 });
brandSchema.index({ name: 1 });

// Model Schema
const modelSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  brandId: { type: String, required: true },
  status: { type: String, default: 'active' },

  // Popularity & Rankings
  isPopular: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  popularRank: { type: Number, default: null },
  newRank: { type: Number, default: null },
  topRank: { type: Number, default: null }, // Ranking for Top Cars section (1-10)

  // Basic Info
  bodyType: { type: String, default: null },
  subBodyType: { type: String, default: null },
  launchDate: { type: String, default: null },
  seating: { type: Number, default: 5 },
  minPrice: { type: Number, default: null },
  maxPrice: { type: Number, default: null },
  fuelTypes: { type: [String], default: [] },
  transmissions: { type: [String], default: [] },
  brochureUrl: { type: String, default: null },

  // SEO & Content
  headerSeo: { type: String, default: null },
  pros: { type: String, default: null },
  cons: { type: String, default: null },
  description: { type: String, default: null },
  exteriorDesign: { type: String, default: null },
  comfortConvenience: { type: String, default: null },
  summary: { type: String, default: null },

  // Engine Summaries
  engineSummaries: [{
    title: { type: String },
    summary: { type: String },
    transmission: { type: String },
    power: { type: String },
    torque: { type: String },
    speed: { type: String }
  }],

  // Mileage Data
  mileageData: [{
    engineName: { type: String },
    companyClaimed: { type: String },
    cityRealWorld: { type: String },
    highwayRealWorld: { type: String }
  }],

  // FAQs
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],

  // Images
  heroImage: { type: String, default: null },
  galleryImages: [{
    url: { type: String },
    caption: { type: String }
  }],
  keyFeatureImages: [{
    url: { type: String },
    caption: { type: String }
  }],
  spaceComfortImages: [{
    url: { type: String },
    caption: { type: String }
  }],
  storageConvenienceImages: [{
    url: { type: String },
    caption: { type: String }
  }],
  colorImages: [{
    url: { type: String },
    caption: { type: String }
  }],

  createdAt: { type: Date, default: Date.now }
});

// Add foreign key validation for models
modelSchema.pre('save', async function () {
  const Brand = mongoose.model('Brand');
  const brand = await Brand.findOne({ id: this.brandId });
  if (!brand) {
    throw new Error(`Invalid brandId: ${this.brandId}. Brand does not exist.`);
  }
});

modelSchema.index({ id: 1 }, { unique: true });
modelSchema.index({ brandId: 1, status: 1 });
modelSchema.index({ name: 1 });
modelSchema.index({ isPopular: 1, popularRank: 1 });
modelSchema.index({ isNew: 1, newRank: 1 });
modelSchema.index({ bodyType: 1, status: 1 });
modelSchema.index({ brandId: 1, status: 1, name: 1 }); // Sort models within brand
modelSchema.index({ status: 1, launchDate: -1 }); // New launches

// Upcoming Car Schema - Similar to Model but with expected launch date and price range
const upcomingCarSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  brandId: { type: String, required: true },
  status: { type: String, default: 'active' },

  // Popularity & Rankings
  isPopular: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  popularRank: { type: Number, default: null },
  newRank: { type: Number, default: null },

  // Basic Info
  bodyType: { type: String, default: null },
  subBodyType: { type: String, default: null },
  expectedLaunchDate: { type: String, default: null }, // Different from model
  seating: { type: Number, default: 5 },
  fuelTypes: { type: [String], default: [] },
  transmissions: { type: [String], default: [] },
  brochureUrl: { type: String, default: null },

  // Price Range (Different from model)
  expectedPriceMin: { type: Number, default: null },
  expectedPriceMax: { type: Number, default: null },

  // SEO & Content
  headerSeo: { type: String, default: null },
  pros: { type: String, default: null },
  cons: { type: String, default: null },
  description: { type: String, default: null },
  exteriorDesign: { type: String, default: null },
  comfortConvenience: { type: String, default: null },
  summary: { type: String, default: null },

  // Engine Summaries
  engineSummaries: [{
    title: { type: String },
    summary: { type: String },
    transmission: { type: String },
    power: { type: String },
    torque: { type: String },
    speed: { type: String }
  }],

  // Mileage Data
  mileageData: [{
    engineName: { type: String },
    companyClaimed: { type: String },
    cityRealWorld: { type: String },
    highwayRealWorld: { type: String }
  }],

  // FAQs
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],

  // Images
  heroImage: { type: String, default: null },
  galleryImages: [{
    url: { type: String },
    caption: { type: String }
  }],
  keyFeatureImages: [{
    url: { type: String },
    caption: { type: String }
  }],
  spaceComfortImages: [{
    url: { type: String },
    caption: { type: String }
  }],
  storageConvenienceImages: [{
    url: { type: String },
    caption: { type: String }
  }],
  colorImages: [{
    url: { type: String },
    caption: { type: String }
  }],

  createdAt: { type: Date, default: Date.now }
});

// Add foreign key validation for upcoming cars
upcomingCarSchema.pre('save', async function () {
  const Brand = mongoose.model('Brand');
  const brand = await Brand.findOne({ id: this.brandId });
  if (!brand) {
    throw new Error(`Invalid brandId: ${this.brandId}. Brand does not exist.`);
  }
});

upcomingCarSchema.index({ id: 1 }, { unique: true });
upcomingCarSchema.index({ brandId: 1, status: 1 });
upcomingCarSchema.index({ name: 1 });
upcomingCarSchema.index({ isPopular: 1, popularRank: 1 });
upcomingCarSchema.index({ isNew: 1, newRank: 1 });
upcomingCarSchema.index({ bodyType: 1, status: 1 });
upcomingCarSchema.index({ brandId: 1, status: 1, name: 1 });
upcomingCarSchema.index({ status: 1, expectedLaunchDate: 1 }); // Upcoming launches

// Variant Schema - Complete with all fields
const variantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  brandId: { type: String, required: true },
  modelId: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  description: { type: String, default: null },

  // Key Features
  isValueForMoney: { type: Boolean, default: false },
  keyFeatures: { type: String, default: null },
  headerSummary: { type: String, default: null },

  // Design & Styling
  exteriorDesign: { type: String, default: null },
  comfortConvenience: { type: String, default: null },

  // Engine Specifications
  engineName: { type: String, default: null },
  engineSummary: { type: String, default: null },
  engineTransmission: { type: String, default: null },
  enginePower: { type: String, default: null },
  engineTorque: { type: String, default: null },
  engineSpeed: { type: String, default: null },
  engineType: { type: String, default: null },
  displacement: { type: String, default: null },
  power: { type: String, default: null },
  torque: { type: String, default: null },
  transmission: { type: String, default: null },
  driveType: { type: String, default: null },
  fuelType: { type: String, default: null },
  fuel: { type: String, default: null },

  // Mileage
  mileageEngineName: { type: String, default: null },
  mileageCompanyClaimed: { type: String, default: null },
  mileageCityRealWorld: { type: String, default: null },
  mileageHighwayRealWorld: { type: String, default: null },
  mileageCity: { type: String, default: null },
  mileageHighway: { type: String, default: null },
  fuelTankCapacity: { type: String, default: null },
  emissionStandard: { type: String, default: null },

  // Dimensions
  groundClearance: { type: String, default: null },
  length: { type: String, default: null },
  width: { type: String, default: null },
  height: { type: String, default: null },
  wheelbase: { type: String, default: null },
  turningRadius: { type: String, default: null },
  kerbWeight: { type: String, default: null },
  frontTyreProfile: { type: String, default: null },
  rearTyreProfile: { type: String, default: null },
  spareTyreProfile: { type: String, default: null },
  spareWheelType: { type: String, default: null },
  cupholders: { type: String, default: null },
  bootSpace: { type: String, default: null },
  bootSpaceAfterFoldingRearRowSeats: { type: String, default: null },
  seatingCapacity: { type: String, default: null },
  doors: { type: String, default: null },

  // Performance
  engineNamePage4: { type: String, default: null },
  engineCapacity: { type: String, default: null },
  noOfGears: { type: String, default: null },
  paddleShifter: { type: String, default: null },
  maxPower: { type: String, default: null },
  zeroTo100KmphTime: { type: String, default: null },
  topSpeed: { type: String, default: null },
  evBatteryCapacity: { type: String, default: null },
  hybridBatteryCapacity: { type: String, default: null },
  batteryType: { type: String, default: null },
  electricMotorPlacement: { type: String, default: null },
  evRange: { type: String, default: null },
  evChargingTime: { type: String, default: null },
  maxElectricMotorPower: { type: String, default: null },
  turboCharged: { type: String, default: null },
  hybridType: { type: String, default: null },
  driveTrain: { type: String, default: null },
  drivingModes: { type: String, default: null },
  offRoadModes: { type: String, default: null },
  differentialLock: { type: String, default: null },
  limitedSlipDifferential: { type: String, default: null },
  acceleration: { type: String, default: null },

  // Suspension & Brakes
  frontSuspension: { type: String, default: null },
  rearSuspension: { type: String, default: null },
  frontBrake: { type: String, default: null },
  rearBrake: { type: String, default: null },

  // Wheels & Tyres
  wheelSize: { type: String, default: null },
  tyreSize: { type: String, default: null },
  spareTyre: { type: String, default: null },

  // Safety Features
  globalNCAPRating: { type: String, default: null },
  airbags: { type: String, default: null },
  airbagsLocation: { type: String, default: null },
  adasLevel: { type: String, default: null },
  adasFeatures: { type: String, default: null },
  reverseCamera: { type: String, default: null },
  reverseCameraGuidelines: { type: String, default: null },
  tyrePressureMonitor: { type: String, default: null },
  hillHoldAssist: { type: String, default: null },
  hillDescentControl: { type: String, default: null },
  rollOverMitigation: { type: String, default: null },
  parkingSensor: { type: String, default: null },
  discBrakes: { type: String, default: null },
  electronicStabilityProgram: { type: String, default: null },
  abs: { type: String, default: null },
  ebd: { type: String, default: null },
  brakeAssist: { type: String, default: null },
  isofixMounts: { type: String, default: null },
  seatbeltWarning: { type: String, default: null },
  speedAlertSystem: { type: String, default: null },
  speedSensingDoorLocks: { type: String, default: null },
  immobiliser: { type: String, default: null },
  esc: { type: String, default: null },
  tractionControl: { type: String, default: null },
  hillAssist: { type: String, default: null },
  isofix: { type: String, default: null },
  parkingSensors: { type: String, default: null },
  parkingCamera: { type: String, default: null },
  blindSpotMonitor: { type: String, default: null },

  // Comfort & Convenience
  ventilatedSeats: { type: String, default: null },
  sunroof: { type: String, default: null },
  airPurifier: { type: String, default: null },
  headsUpDisplay: { type: String, default: null },
  cruiseControl: { type: String, default: null },
  rainSensingWipers: { type: String, default: null },
  automaticHeadlamp: { type: String, default: null },
  followMeHomeHeadlights: { type: String, default: null },
  keylessEntry: { type: String, default: null },
  ignition: { type: String, default: null },
  ambientLighting: { type: String, default: null },
  steeringAdjustment: { type: String, default: null },
  airConditioning: { type: String, default: null },
  climateZones: { type: String, default: null },
  climateControl: { type: String, default: null },
  rearACVents: { type: String, default: null },
  frontArmrest: { type: String, default: null },
  rearArmrest: { type: String, default: null },
  insideRearViewMirror: { type: String, default: null },
  outsideRearViewMirrors: { type: String, default: null },
  steeringMountedControls: { type: String, default: null },
  rearWindshieldDefogger: { type: String, default: null },
  frontWindshieldDefogger: { type: String, default: null },
  cooledGlovebox: { type: String, default: null },
  pushButtonStart: { type: String, default: null },
  powerWindows: { type: String, default: null },
  powerSteering: { type: String, default: null },

  // Infotainment
  touchScreenInfotainment: { type: String, default: null },
  androidAppleCarplay: { type: String, default: null },
  speakers: { type: String, default: null },
  tweeters: { type: String, default: null },
  subwoofers: { type: String, default: null },
  usbCChargingPorts: { type: String, default: null },
  usbAChargingPorts: { type: String, default: null },
  twelvevChargingPorts: { type: String, default: null },
  wirelessCharging: { type: String, default: null },
  infotainmentScreen: { type: String, default: null },
  bluetooth: { type: String, default: null },
  usb: { type: String, default: null },
  aux: { type: String, default: null },
  androidAuto: { type: String, default: null },
  appleCarPlay: { type: String, default: null },

  // Lighting
  headLights: { type: String, default: null },
  tailLight: { type: String, default: null },
  frontFogLights: { type: String, default: null },
  daytimeRunningLights: { type: String, default: null },
  headlights: { type: String, default: null },
  drl: { type: String, default: null },
  fogLights: { type: String, default: null },
  tailLights: { type: String, default: null },

  // Exterior
  roofRails: { type: String, default: null },
  radioAntenna: { type: String, default: null },
  outsideRearViewMirror: { type: String, default: null },
  sideIndicator: { type: String, default: null },
  rearWindshieldWiper: { type: String, default: null },
  orvm: { type: String, default: null },
  alloyWheels: { type: String, default: null },

  // Seating
  seatUpholstery: { type: String, default: null },
  seatsAdjustment: { type: String, default: null },
  driverSeatAdjustment: { type: String, default: null },
  passengerSeatAdjustment: { type: String, default: null },
  rearSeatAdjustment: { type: String, default: null },
  welcomeSeats: { type: String, default: null },
  memorySeats: { type: String, default: null },
  // seating already exists in model schema at line 40
  // seatingCapacity already exists above at line 168

  // Additional Missing Fields (only new ones, avoiding duplicates)
  // mileageCity already exists above at line 148
  // mileageHighway already exists above at line 149

  // Warranty
  warranty: { type: String, default: null },

  // Images
  highlightImages: [{
    url: { type: String },
    caption: { type: String }
  }],

  // Connected Car Tech
  connectedCarTech: { type: String, default: null },

  createdAt: { type: Date, default: Date.now }
});

// Add foreign key validation for variants
variantSchema.pre('save', async function () {
  const Brand = mongoose.model('Brand');
  const Model = mongoose.model('Model');
  const UpcomingCar = mongoose.model('UpcomingCar');

  const brand = await Brand.findOne({ id: this.brandId });

  if (!brand) {
    throw new Error(`Invalid brandId: ${this.brandId}. Brand does not exist.`);
  }

  // Try to find in regular models first
  let model = await Model.findOne({ id: this.modelId });

  // If not found, try upcoming cars
  if (!model) {
    model = await UpcomingCar.findOne({ id: this.modelId });
  }

  if (!model) {
    throw new Error(`Invalid modelId: ${this.modelId}. Model does not exist.`);
  }

  if (model.brandId !== this.brandId) {
    throw new Error(`Model ${this.modelId} does not belong to brand ${this.brandId}.`);
  }
});

// Comprehensive indexes for 1M+ daily users
variantSchema.index({ id: 1 }, { unique: true });
variantSchema.index({ modelId: 1, brandId: 1, status: 1 });
variantSchema.index({ brandId: 1, status: 1, price: 1 });
variantSchema.index({ price: 1, fuelType: 1, transmission: 1 });
variantSchema.index({ isValueForMoney: 1, status: 1 });
variantSchema.index({ fuelType: 1, status: 1 });
variantSchema.index({ transmission: 1, status: 1 });
variantSchema.index({ createdAt: -1 }); // For latest variants
variantSchema.index({ name: 'text', description: 'text' }); // Text search
variantSchema.index({ price: 1, status: 1 }); // Price filtering
variantSchema.index({ modelId: 1, status: 1, price: 1 }); // Sort variants of a model
variantSchema.index({ brandId: 1, status: 1, bodyType: 1 }); // Filter by body type across brand

// Admin User Schema
const adminUserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

adminUserSchema.index({ email: 1 }, { unique: true });
adminUserSchema.index({ id: 1 }, { unique: true });

// Popular Comparison Schema
const popularComparisonSchema = new mongoose.Schema({
  id: { type: String, required: true },
  model1Id: { type: String, required: true },
  model2Id: { type: String, required: true },
  order: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

popularComparisonSchema.index({ id: 1 }, { unique: true });
popularComparisonSchema.index({ isActive: 1, order: 1 });

// ==================== NEWS SYSTEM SCHEMAS ====================

// News Article Schema
const newsArticleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  excerpt: { type: String, required: true },
  contentBlocks: [{
    id: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['paragraph', 'heading1', 'heading2', 'heading3', 'image', 'bulletList', 'numberedList', 'quote', 'code']
    },
    content: { type: String, required: true },
    imageUrl: { type: String, default: null },
    imageCaption: { type: String, default: null }
  }],
  categoryId: { type: String, required: true },
  tags: [{ type: String }],
  authorId: { type: String, required: true },
  linkedCars: [{ type: String }], // Array of car model IDs
  featuredImage: { type: String, required: true },
  seoTitle: { type: String, required: true },
  seoDescription: { type: String, required: true },
  seoKeywords: [{ type: String }],
  status: {
    type: String,
    required: true,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft'
  },
  publishDate: { type: Date, required: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isBreaking: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

newsArticleSchema.index({ id: 1 }, { unique: true });
newsArticleSchema.index({ slug: 1 }, { unique: true });
newsArticleSchema.index({ status: 1, publishDate: -1 });
newsArticleSchema.index({ categoryId: 1, status: 1 });
newsArticleSchema.index({ authorId: 1, status: 1 });
newsArticleSchema.index({ isFeatured: 1, status: 1 });
newsArticleSchema.index({ views: -1 }); // For trending articles
newsArticleSchema.index({ title: 'text', excerpt: 'text' }); // Text search
newsArticleSchema.index({ status: 1, publishDate: -1, isFeatured: 1 }); // Homepage news

// News Category Schema
const newsCategorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

newsCategorySchema.index({ id: 1 }, { unique: true });
newsCategorySchema.index({ slug: 1 }, { unique: true });
newsCategorySchema.index({ isFeatured: 1 });

// News Tag Schema
const newsTagSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['brand', 'segment', 'fuel', 'general']
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

newsTagSchema.index({ id: 1 }, { unique: true });
newsTagSchema.index({ slug: 1 }, { unique: true });
newsTagSchema.index({ type: 1 });

// News Author Schema
const newsAuthorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'editor', 'author'],
    default: 'author'
  },
  bio: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  socialLinks: {
    twitter: { type: String, default: null },
    linkedin: { type: String, default: null },
    facebook: { type: String, default: null }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

newsAuthorSchema.index({ id: 1 }, { unique: true });
newsAuthorSchema.index({ email: 1 }, { unique: true });
newsAuthorSchema.index({ isActive: 1 });

// News Media Schema
const newsMediaSchema = new mongoose.Schema({
  id: { type: String, required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['image', 'video']
  },
  size: { type: Number, required: true },
  uploaderId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

newsMediaSchema.index({ id: 1 }, { unique: true });
newsMediaSchema.index({ uploaderId: 1, createdAt: -1 });
newsMediaSchema.index({ type: 1 });

// ==================== FRONTEND USER SCHEMA ====================

// Frontend User Schema (for customer accounts)
const userSchema = new mongoose.Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, default: null }, // null for OAuth users
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, default: null },
  dateOfBirth: { type: Date, default: null },

  // OAuth Integration
  googleId: { type: String, default: null },
  profileImage: { type: String, default: null },

  // Verification & Status
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },

  // Email Verification
  emailVerificationToken: { type: String, default: null },
  emailVerificationExpires: { type: Date, default: null },

  // Password Reset
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },

  // Account Lockout (Security)
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },

  // OTP Authentication
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  otpAttempts: { type: Number, default: 0 },

  // User Data
  savedCars: [{ type: String }], // Array of variant IDs
  comparisonHistory: [{ type: String }], // Array of model IDs

  // Email Subscription Preferences
  emailPreferences: {
    newsletter: { type: Boolean, default: true },
    newLaunches: { type: Boolean, default: true },
    priceDrops: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false },
    comparisons: { type: Boolean, default: true },
    frequency: {
      type: String,
      enum: ['immediate', 'daily', 'weekly'],
      default: 'weekly'
    },
    lastEmailSent: { type: Date, default: null },
    unsubscribedAt: { type: Date, default: null }
  },

  // Auto-learned Car Preferences (from user activity)
  carPreferences: {
    budgetMin: { type: Number, default: null },
    budgetMax: { type: Number, default: null },
    preferredBodyTypes: [{ type: String }],     // ['SUV', 'Sedan']
    preferredBrands: [{ type: String }],        // ['Hyundai', 'Tata']
    preferredFuelTypes: [{ type: String }],     // ['Petrol', 'Electric']
    preferredTransmissions: [{ type: String }]  // ['Automatic']
  },

  // Timestamps
  lastLogin: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for User
userSchema.index({ id: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true }); // sparse allows null values
userSchema.index({ isActive: 1 });

// ==================== REVIEW SYSTEM SCHEMAS ====================

// Review Comment Schema (for nested comments)
const reviewCommentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  reviewId: { type: String, required: true },
  parentId: { type: String, default: null }, // For nested replies
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

reviewCommentSchema.index({ reviewId: 1, createdAt: -1 });
reviewCommentSchema.index({ parentId: 1 });
reviewCommentSchema.index({ id: 1 }, { unique: true });

// Review Schema
const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true },
  brandSlug: { type: String, required: true },
  modelSlug: { type: String, required: true },
  variantSlug: { type: String, default: null },

  // User Info
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },

  // Driving Experience
  drivingExperience: {
    type: String,
    enum: ['not_driven', 'short_drive', 'under_500km', 'over_500km', 'Owner'], // Added Owner
    required: true
  },

  // Emoji Ratings (Deprecated / Optional)
  emojiRatings: {
    mileage: { type: Number, min: 1, max: 5 },
    maintenanceCost: { type: Number, min: 1, max: 5 },
    safety: { type: Number, min: 1, max: 5 },
    featuresAndStyling: { type: Number, min: 1, max: 5 },
    comfort: { type: Number, min: 1, max: 5 },
    performance: { type: Number, min: 1, max: 5 }
  },

  // Star Ratings (Updated to match frontend)
  starRatings: {
    valueForMoney: { type: Number, min: 1, max: 5, required: true },
    drivingComfort: { type: Number, min: 1, max: 5, required: true },
    enginePerformance: { type: Number, min: 1, max: 5, required: true },
    maintenanceService: { type: Number, min: 1, max: 5, required: true },
    buildQuality: { type: Number, min: 1, max: 5, required: true },
    featuresTechnology: { type: Number, min: 1, max: 5, required: true }
  },

  // Review Content
  reviewTitle: { type: String, required: true, minlength: 10 },
  reviewText: { type: String, required: true, minlength: 300 },

  // Calculated Overall Rating (Average of star ratings)
  overallRating: { type: Number, default: 0, index: true },

  // Image URLs (max 5)
  images: [{ type: String }],

  // Voting
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },

  // Track who voted (to prevent duplicate votes)
  likedBy: [{ type: String }], // User emails
  dislikedBy: [{ type: String }],



  // Moderation
  isApproved: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }, // Verified owner

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculate overall rating before save
reviewSchema.pre('save', function () {
  const ratings = this.starRatings;
  if (ratings) {
    const sum = (
      (ratings.valueForMoney || 0) +
      (ratings.drivingComfort || 0) +
      (ratings.enginePerformance || 0) +
      (ratings.maintenanceService || 0) +
      (ratings.buildQuality || 0) +
      (ratings.featuresTechnology || 0)
    );
    this.overallRating = Math.round((sum / 6) * 10) / 10;
  } else {
    this.overallRating = 0;
  }
});

reviewSchema.index({ id: 1 }, { unique: true });
reviewSchema.index({ modelSlug: 1, isApproved: 1, createdAt: -1 });
reviewSchema.index({ brandSlug: 1, isApproved: 1 });
reviewSchema.index({ variantSlug: 1, isApproved: 1 });
reviewSchema.index({ userEmail: 1 });
reviewSchema.index({ overallRating: -1 });
reviewSchema.index({ likes: -1 }); // Most helpful
reviewSchema.index({ createdAt: -1 }); // Most recent

// Export models
export const Brand = mongoose.model('Brand', brandSchema);
export const Model = mongoose.model('Model', modelSchema);
export const UpcomingCar = mongoose.model('UpcomingCar', upcomingCarSchema);
export const Variant = mongoose.model('Variant', variantSchema);
export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export const PopularComparison = mongoose.model('PopularComparison', popularComparisonSchema);

// Export news models
export const NewsArticle = mongoose.model('NewsArticle', newsArticleSchema);
export const NewsCategory = mongoose.model('NewsCategory', newsCategorySchema);
export const NewsTag = mongoose.model('NewsTag', newsTagSchema);
export const NewsAuthor = mongoose.model('NewsAuthor', newsAuthorSchema);
export const NewsMedia = mongoose.model('NewsMedia', newsMediaSchema);

// Export user model
export const User = mongoose.model('User', userSchema);

// Export review models
export const Review = mongoose.model('Review', reviewSchema);
export const ReviewComment = mongoose.model('ReviewComment', reviewCommentSchema);

// Consultation Lead Schema
const consultationLeadSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, default: null },
  city: { type: String, default: null },
  budget: { type: String, default: null },
  carInterest: { type: String, default: null },
  plannedPurchaseDate: { type: String, default: null },
  message: { type: String, default: null },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed', 'junk'],
    default: 'new'
  },
  source: { type: String, default: 'website' },
  paymentStatus: { type: String, default: 'pending' },
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  planDetails: { type: mongoose.Schema.Types.Mixed, default: null },
  totalAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

consultationLeadSchema.index({ id: 1 }, { unique: true });
consultationLeadSchema.index({ status: 1, createdAt: -1 });
consultationLeadSchema.index({ phone: 1 });
consultationLeadSchema.index({ email: 1 });

// Export Models
export const ConsultationLead = mongoose.model('ConsultationLead', consultationLeadSchema);
