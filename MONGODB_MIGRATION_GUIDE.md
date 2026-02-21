# 🔄 MongoDB Migration Guide

## 📊 **Current vs New Architecture**

### **Current (File-based):**
```
Express API → Storage Layer → JSON Files
```

### **New (MongoDB):**
```
Express API → Storage Layer → MongoDB
```

**Key Point:** Storage layer interface stays THE SAME!

---

## 🚀 **Migration Steps**

### **Step 1: Install MongoDB Dependencies**

```bash
cd /Applications/WEBSITE-23092025-101/backend
npm install mongodb mongoose
npm install --save-dev @types/mongodb
```

**Packages:**
- `mongodb` - Official MongoDB driver
- `mongoose` - ODM (Object Document Mapper)
- `@types/mongodb` - TypeScript types

---

### **Step 2: Setup MongoDB Connection**

**Options:**

#### **Option A: Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb-community
brew services start mongodb-community

# Connection string:
mongodb://localhost:27017/gadizone
```

#### **Option B: MongoDB Atlas (Cloud - FREE)**
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Get connection string:
   mongodb+srv://username:password@cluster.mongodb.net/gadizone
```

**Recommended:** MongoDB Atlas (easier, free, no local setup)

---

### **Step 3: Environment Variables**

Create `.env` file:
```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/gadizone
# OR for Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gadizone

JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
PORT=5001
```

---

### **Step 4: Create MongoDB Schemas**

File: `backend/server/db/schemas.ts`

```typescript
import mongoose from 'mongoose';

// Brand Schema
const brandSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String, default: null },
  ranking: { type: Number, required: true },
  status: { type: String, default: 'active' },
  summary: { type: String, default: null },
  faqs: [{ question: String, answer: String }],
  createdAt: { type: Date, default: Date.now }
});

// Model Schema
const modelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brandId: { type: String, required: true },
  status: { type: String, default: 'active' },
  // ... all other fields
  createdAt: { type: Date, default: Date.now }
});

// Variant Schema
const variantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  brandId: { type: String, required: true },
  modelId: { type: String, required: true },
  price: { type: Number, required: true },
  // ... all other fields
  createdAt: { type: Date, default: Date.now }
});

// Admin User Schema
const adminUserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Popular Comparison Schema
const popularComparisonSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  model1Id: { type: String, required: true },
  model2Id: { type: String, required: true },
  order: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Brand = mongoose.model('Brand', brandSchema);
export const Model = mongoose.model('Model', modelSchema);
export const Variant = mongoose.model('Variant', variantSchema);
export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
export const PopularComparison = mongoose.model('PopularComparison', popularComparisonSchema);
```

---

### **Step 5: Create MongoDB Storage Implementation**

File: `backend/server/db/mongodb-storage.ts`

```typescript
import mongoose from 'mongoose';
import { IStorage } from '../storage';
import { Brand, Model, Variant, AdminUser, PopularComparison } from './schemas';
import type { 
  Brand as BrandType, 
  InsertBrand,
  Model as ModelType,
  InsertModel,
  // ... import all types
} from '@shared/schema';

export class MongoDBStorage implements IStorage {
  private activeSessions: Map<string, string> = new Map();

  async connect(uri: string): Promise<void> {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  }

  // Brands
  async getBrands(includeInactive?: boolean): Promise<BrandType[]> {
    const filter = includeInactive ? {} : { status: 'active' };
    return await Brand.find(filter).sort({ ranking: 1 }).lean();
  }

  async getBrand(id: string): Promise<BrandType | undefined> {
    const brand = await Brand.findOne({ id }).lean();
    return brand || undefined;
  }

  async createBrand(brand: InsertBrand): Promise<BrandType> {
    const newBrand = new Brand({
      id: `brand-${Date.now()}`,
      ...brand,
      createdAt: new Date()
    });
    await newBrand.save();
    return newBrand.toObject();
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<BrandType | undefined> {
    const updated = await Brand.findOneAndUpdate(
      { id },
      { $set: brand },
      { new: true }
    ).lean();
    return updated || undefined;
  }

  async deleteBrand(id: string): Promise<boolean> {
    const result = await Brand.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Models
  async getModels(brandId?: string): Promise<ModelType[]> {
    const filter = brandId ? { brandId, status: 'active' } : { status: 'active' };
    return await Model.find(filter).lean();
  }

  async getModel(id: string): Promise<ModelType | undefined> {
    const model = await Model.findOne({ id }).lean();
    return model || undefined;
  }

  async createModel(model: InsertModel): Promise<ModelType> {
    const newModel = new Model({
      id: `model-${Date.now()}`,
      ...model,
      createdAt: new Date()
    });
    await newModel.save();
    return newModel.toObject();
  }

  async updateModel(id: string, model: Partial<InsertModel>): Promise<ModelType | undefined> {
    const updated = await Model.findOneAndUpdate(
      { id },
      { $set: model },
      { new: true }
    ).lean();
    return updated || undefined;
  }

  async deleteModel(id: string): Promise<boolean> {
    const result = await Model.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Variants
  async getVariants(modelId?: string, brandId?: string): Promise<VariantType[]> {
    const filter: any = { status: 'active' };
    if (modelId) filter.modelId = modelId;
    if (brandId) filter.brandId = brandId;
    return await Variant.find(filter).lean();
  }

  async getVariant(id: string): Promise<VariantType | undefined> {
    const variant = await Variant.findOne({ id }).lean();
    return variant || undefined;
  }

  async createVariant(variant: InsertVariant): Promise<VariantType> {
    const newVariant = new Variant({
      id: `variant-${Date.now()}`,
      ...variant,
      createdAt: new Date()
    });
    await newVariant.save();
    return newVariant.toObject();
  }

  async updateVariant(id: string, variant: Partial<InsertVariant>): Promise<VariantType | undefined> {
    const updated = await Variant.findOneAndUpdate(
      { id },
      { $set: variant },
      { new: true }
    ).lean();
    return updated || undefined;
  }

  async deleteVariant(id: string): Promise<boolean> {
    const result = await Variant.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Admin Users
  async getAdminUser(email: string): Promise<AdminUserType | undefined> {
    const user = await AdminUser.findOne({ email, isActive: true }).lean();
    return user || undefined;
  }

  async getAdminUserById(id: string): Promise<AdminUserType | undefined> {
    const user = await AdminUser.findOne({ id, isActive: true }).lean();
    return user || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUserType> {
    const newUser = new AdminUser({
      id: `admin-${Date.now()}`,
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await newUser.save();
    return newUser.toObject();
  }

  async updateAdminUserLogin(id: string): Promise<void> {
    await AdminUser.findOneAndUpdate(
      { id },
      { 
        $set: { 
          lastLogin: new Date(),
          updatedAt: new Date()
        }
      }
    );
  }

  // Session Management (in-memory, same as before)
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

  // Popular Comparisons
  async getPopularComparisons(): Promise<PopularComparisonType[]> {
    return await PopularComparison.find({ isActive: true })
      .sort({ order: 1 })
      .lean();
  }

  async savePopularComparisons(comparisons: InsertPopularComparison[]): Promise<PopularComparisonType[]> {
    // Clear existing
    await PopularComparison.deleteMany({});
    
    // Create new
    const newComparisons = comparisons.map((comp, index) => ({
      id: `comparison-${Date.now()}-${index}`,
      ...comp,
      order: comp.order || index + 1,
      isActive: comp.isActive ?? true,
      createdAt: new Date()
    }));
    
    await PopularComparison.insertMany(newComparisons);
    return await this.getPopularComparisons();
  }

  // Stats
  async getStats(): Promise<{ totalBrands: number; totalModels: number; totalVariants: number }> {
    const [totalBrands, totalModels, totalVariants] = await Promise.all([
      Brand.countDocuments(),
      Model.countDocuments(),
      Variant.countDocuments()
    ]);
    
    return { totalBrands, totalModels, totalVariants };
  }

  async getAvailableRankings(excludeBrandId?: string): Promise<number[]> {
    const filter = excludeBrandId ? { id: { $ne: excludeBrandId } } : {};
    const brands = await Brand.find(filter).select('ranking').lean();
    const takenRankings = brands.map(b => b.ranking);
    
    const allRankings = Array.from({ length: 50 }, (_, i) => i + 1);
    return allRankings.filter(ranking => !takenRankings.includes(ranking));
  }
}
```

---

### **Step 6: Update Server to Use MongoDB**

File: `backend/server/index.ts`

```typescript
import { MongoDBStorage } from './db/mongodb-storage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
// ... existing middleware

(async () => {
  // Initialize MongoDB storage
  const storage = new MongoDBStorage();
  await storage.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gadizone');
  
  // Register routes (same as before)
  registerRoutes(app, storage);
  
  // ... rest of server setup
})();
```

---

### **Step 7: Data Migration Script**

File: `backend/migrate-to-mongodb.ts`

```typescript
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Brand, Model, Variant, AdminUser, PopularComparison } from './server/db/schemas';

async function migrate() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gadizone');
    console.log('✅ Connected to MongoDB');

    // Read JSON files
    const dataDir = path.join(process.cwd(), 'data');
    
    const brands = JSON.parse(fs.readFileSync(path.join(dataDir, 'brands.json'), 'utf-8'));
    const models = JSON.parse(fs.readFileSync(path.join(dataDir, 'models.json'), 'utf-8'));
    const variants = JSON.parse(fs.readFileSync(path.join(dataDir, 'variants.json'), 'utf-8'));
    const adminUsers = JSON.parse(fs.readFileSync(path.join(dataDir, 'admin-users.json'), 'utf-8'));
    const comparisons = JSON.parse(fs.readFileSync(path.join(dataDir, 'popular-comparisons.json'), 'utf-8'));

    // Clear existing data
    await Promise.all([
      Brand.deleteMany({}),
      Model.deleteMany({}),
      Variant.deleteMany({}),
      AdminUser.deleteMany({}),
      PopularComparison.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Insert data
    await Brand.insertMany(brands);
    console.log(`✅ Migrated ${brands.length} brands`);

    await Model.insertMany(models);
    console.log(`✅ Migrated ${models.length} models`);

    await Variant.insertMany(variants);
    console.log(`✅ Migrated ${variants.length} variants`);

    await AdminUser.insertMany(adminUsers);
    console.log(`✅ Migrated ${adminUsers.length} admin users`);

    await PopularComparison.insertMany(comparisons);
    console.log(`✅ Migrated ${comparisons.length} popular comparisons`);

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

---

## ⚠️ **Potential Errors & Solutions**

### **Error 1: Connection Failed**
```
MongoServerError: connect ECONNREFUSED
```

**Cause:** MongoDB not running or wrong connection string

**Solution:**
```bash
# Check if MongoDB is running
brew services list

# Start MongoDB
brew services start mongodb-community

# Or check connection string in .env
```

---

### **Error 2: Authentication Failed**
```
MongoServerError: Authentication failed
```

**Cause:** Wrong username/password in connection string

**Solution:**
```bash
# Check .env file
# For Atlas: Get correct connection string from MongoDB Atlas dashboard
# For local: Remove auth or create user
```

---

### **Error 3: Duplicate Key Error**
```
MongoServerError: E11000 duplicate key error
```

**Cause:** Trying to insert document with existing unique field

**Solution:**
```typescript
// Use findOneAndUpdate with upsert
await Brand.findOneAndUpdate(
  { id: brand.id },
  { $set: brand },
  { upsert: true, new: true }
);
```

---

### **Error 4: Schema Validation Error**
```
ValidationError: Brand validation failed
```

**Cause:** Missing required fields or wrong data types

**Solution:**
```typescript
// Check schema matches your data structure
// Add default values for optional fields
// Validate data before insertion
```

---

### **Error 5: Timeout Error**
```
MongooseError: Operation timed out
```

**Cause:** Network issues or slow query

**Solution:**
```typescript
// Increase timeout
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
});

// Add indexes for better performance
brandSchema.index({ id: 1 });
brandSchema.index({ status: 1, ranking: 1 });
```

---

### **Error 6: Memory Leak**
```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Cause:** Loading too much data at once

**Solution:**
```typescript
// Use pagination
const brands = await Brand.find()
  .limit(100)
  .skip(page * 100)
  .lean();

// Use streams for large datasets
const stream = Brand.find().cursor();
for await (const doc of stream) {
  // Process doc
}
```

---

## 🔄 **API Compatibility**

### **✅ NO CHANGES NEEDED:**

All existing API endpoints work exactly the same:
```
GET    /api/brands
POST   /api/brands
GET    /api/brands/:id
PUT    /api/brands/:id
DELETE /api/brands/:id

GET    /api/models
POST   /api/models
... (all other endpoints)
```

**Why?** Because we're implementing the same `IStorage` interface!

---

## 📊 **Performance Comparison**

### **JSON Files:**
```
Read:   ~1ms (in-memory)
Write:  ~10ms (file I/O)
Search: O(n) - linear scan
```

### **MongoDB:**
```
Read:   ~2-5ms (network + query)
Write:  ~5-10ms (network + insert)
Search: O(log n) - indexed
```

**Advantages of MongoDB:**
- ✅ Better for large datasets
- ✅ Concurrent access
- ✅ ACID transactions
- ✅ Powerful queries
- ✅ Scalability
- ✅ Backup & replication

---

## 🎯 **Migration Checklist**

- [ ] Install MongoDB (local or Atlas)
- [ ] Install npm packages
- [ ] Create .env file
- [ ] Create MongoDB schemas
- [ ] Create MongoDBStorage class
- [ ] Update server.ts
- [ ] Test connection
- [ ] Run migration script
- [ ] Test all API endpoints
- [ ] Update documentation
- [ ] Backup JSON files
- [ ] Deploy

---

## 🚀 **Quick Start Commands**

```bash
# 1. Install dependencies
cd backend
npm install mongodb mongoose dotenv
npm install --save-dev @types/mongodb

# 2. Setup MongoDB Atlas (or local)
# Get connection string

# 3. Create .env file
echo "MONGODB_URI=your-connection-string" > .env

# 4. Run migration
npm run migrate

# 5. Start server
npm run dev
```

---

## 📝 **Summary**

**What Changes:**
- Storage implementation (JSON → MongoDB)
- Data persistence layer

**What Stays Same:**
- All API endpoints
- Request/response formats
- Frontend code
- Admin panel
- Authentication
- File uploads

**Result:** Drop-in replacement with better scalability!

---

**Next:** Shall I implement the MongoDB migration?
