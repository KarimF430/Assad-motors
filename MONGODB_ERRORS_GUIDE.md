# ⚠️ MongoDB Migration - Common Errors & Solutions

## 🚨 **Top 10 Errors You'll Encounter**

### **1. Connection Errors**

#### **Error:**
```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Cause:** MongoDB server not running

**Solutions:**
```bash
# Check if MongoDB is running
brew services list

# Start MongoDB
brew services start mongodb-community

# Or use MongoDB Atlas (cloud - no local install needed)
```

---

#### **Error:**
```
MongooseError: Operation `brands.find()` buffering timed out
```

**Cause:** Can't connect to MongoDB server

**Solutions:**
```typescript
// 1. Check connection string
console.log(process.env.MONGODB_URI);

// 2. Increase timeout
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000
});

// 3. Check network/firewall
```

---

### **2. Authentication Errors**

#### **Error:**
```
MongoServerError: Authentication failed
```

**Cause:** Wrong username/password in connection string

**Solutions:**
```bash
# Correct format:
mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/gadizone

# Common mistakes:
# - Special characters in password (need URL encoding)
# - Wrong database name
# - User doesn't have permissions
```

**Fix:**
```javascript
// URL encode password if it has special characters
const password = encodeURIComponent('P@ssw0rd!');
const uri = `mongodb+srv://user:${password}@cluster.mongodb.net/gadizone`;
```

---

### **3. Duplicate Key Errors**

#### **Error:**
```
MongoServerError: E11000 duplicate key error collection: gadizone.brands index: id_1 dup key: { id: "brand-123" }
```

**Cause:** Trying to insert document with duplicate unique field

**Solutions:**
```typescript
// Option 1: Use upsert
await Brand.findOneAndUpdate(
  { id: brandId },
  { $set: brandData },
  { upsert: true, new: true }
);

// Option 2: Check before insert
const existing = await Brand.findOne({ id: brandId });
if (!existing) {
  await Brand.create(brandData);
}

// Option 3: Generate unique IDs
const id = `brand-${Date.now()}-${Math.random()}`;
```

---

### **4. Schema Validation Errors**

#### **Error:**
```
ValidationError: Brand validation failed: name: Path `name` is required.
```

**Cause:** Missing required field or wrong data type

**Solutions:**
```typescript
// 1. Check schema definition
const brandSchema = new mongoose.Schema({
  name: { type: String, required: true }  // ← Required field
});

// 2. Provide all required fields
await Brand.create({
  id: 'brand-123',
  name: 'Honda',  // ← Don't forget this!
  ranking: 1
});

// 3. Make fields optional
const brandSchema = new mongoose.Schema({
  name: { type: String, required: false, default: '' }
});
```

---

### **5. Type Casting Errors**

#### **Error:**
```
CastError: Cast to Number failed for value "abc" at path "ranking"
```

**Cause:** Wrong data type

**Solutions:**
```typescript
// Wrong:
await Brand.create({
  ranking: "1"  // ❌ String instead of Number
});

// Correct:
await Brand.create({
  ranking: 1  // ✅ Number
});

// Or convert:
const ranking = parseInt(req.body.ranking, 10);
```

---

### **6. Memory Errors**

#### **Error:**
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**Cause:** Loading too much data at once

**Solutions:**
```typescript
// ❌ Bad: Load all at once
const allVariants = await Variant.find();  // Could be 100k+ records

// ✅ Good: Use pagination
const variants = await Variant.find()
  .limit(100)
  .skip(page * 100)
  .lean();  // ← Important: returns plain objects

// ✅ Better: Use cursor/streaming
const cursor = Variant.find().cursor();
for await (const variant of cursor) {
  // Process one at a time
}
```

---

### **7. Index Errors**

#### **Error:**
```
MongoServerError: Index build failed
```

**Cause:** Index creation failed (duplicate values, etc.)

**Solutions:**
```typescript
// 1. Drop existing indexes
await Brand.collection.dropIndexes();

// 2. Create indexes properly
brandSchema.index({ id: 1 }, { unique: true });
brandSchema.index({ status: 1, ranking: 1 });

// 3. Ensure data is clean before creating unique index
await Brand.deleteMany({ id: null });  // Remove bad data
```

---

### **8. Transaction Errors**

#### **Error:**
```
MongoServerError: Transaction numbers are only allowed on a replica set member or mongos
```

**Cause:** Trying to use transactions on standalone MongoDB

**Solutions:**
```typescript
// Option 1: Don't use transactions (for simple operations)
await Brand.create(brandData);

// Option 2: Use replica set (MongoDB Atlas has this by default)
// Option 3: Use session only if needed
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Brand.create([brandData], { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

### **9. Lean vs Document Errors**

#### **Error:**
```
TypeError: brand.save is not a function
```

**Cause:** Using `.lean()` returns plain object, not Mongoose document

**Solutions:**
```typescript
// ❌ Wrong:
const brand = await Brand.findOne({ id }).lean();
brand.name = 'New Name';
await brand.save();  // ❌ Error: save is not a function

// ✅ Correct (without lean):
const brand = await Brand.findOne({ id });
brand.name = 'New Name';
await brand.save();  // ✅ Works

// ✅ Or use update:
await Brand.findOneAndUpdate(
  { id },
  { $set: { name: 'New Name' } }
);
```

---

### **10. Migration Data Errors**

#### **Error:**
```
TypeError: Cannot read property 'map' of undefined
```

**Cause:** JSON file doesn't exist or is empty

**Solutions:**
```typescript
// Add error handling
try {
  const brandsData = fs.readFileSync(brandsFile, 'utf-8');
  const brands = JSON.parse(brandsData);
  
  if (!Array.isArray(brands)) {
    throw new Error('Brands data is not an array');
  }
  
  await Brand.insertMany(brands);
} catch (error) {
  console.error('Migration error:', error);
  // Handle gracefully
}
```

---

## 🔧 **API-Specific Errors**

### **Error: API Returns 500**

**Cause:** MongoDB query failed

**Debug:**
```typescript
// Add try-catch to all routes
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await storage.getBrands();
    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      error: 'Failed to fetch brands',
      details: error.message
    });
  }
});
```

---

### **Error: Slow API Responses**

**Cause:** Missing indexes or inefficient queries

**Solutions:**
```typescript
// 1. Add indexes
brandSchema.index({ status: 1, ranking: 1 });
modelSchema.index({ brandId: 1, status: 1 });
variantSchema.index({ modelId: 1, brandId: 1 });

// 2. Use select() to limit fields
const brands = await Brand.find()
  .select('id name logo ranking')  // Only these fields
  .lean();

// 3. Use explain() to analyze queries
const explain = await Brand.find({ status: 'active' }).explain();
console.log(explain);
```

---

## 🛡️ **Prevention Best Practices**

### **1. Always Use Try-Catch**
```typescript
async getBrands(): Promise<Brand[]> {
  try {
    return await Brand.find({ status: 'active' }).lean();
  } catch (error) {
    console.error('getBrands error:', error);
    throw new Error('Failed to fetch brands');
  }
}
```

### **2. Validate Before Insert**
```typescript
async createBrand(data: InsertBrand): Promise<Brand> {
  // Validate
  if (!data.name) {
    throw new Error('Brand name is required');
  }
  
  // Check duplicates
  const existing = await Brand.findOne({ name: data.name });
  if (existing) {
    throw new Error('Brand already exists');
  }
  
  // Create
  const brand = await Brand.create(data);
  return brand.toObject();
}
```

### **3. Use Lean for Read-Only**
```typescript
// ✅ Good for API responses
const brands = await Brand.find().lean();  // Faster, less memory

// ❌ Don't use lean if you need to modify
const brand = await Brand.findOne({ id }).lean();
brand.save();  // ❌ Error!
```

### **4. Handle Connection Errors**
```typescript
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});
```

### **5. Use Environment Variables**
```typescript
// ❌ Never hardcode
mongoose.connect('mongodb://localhost:27017/gadizone');

// ✅ Use environment variables
mongoose.connect(process.env.MONGODB_URI!);
```

---

## 🎯 **Testing Checklist**

Before going live, test:

- [ ] Connection to MongoDB
- [ ] All CRUD operations
- [ ] Error handling
- [ ] Large dataset queries
- [ ] Concurrent requests
- [ ] Migration script
- [ ] Backup/restore
- [ ] Index performance
- [ ] Memory usage
- [ ] API response times

---

## 📊 **Error Monitoring**

```typescript
// Add logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    if (duration > 1000) {
      console.warn(`⚠️  Slow request: ${req.path} took ${duration}ms`);
    }
  });
  
  next();
});
```

---

## 🚨 **Emergency Rollback**

If MongoDB migration fails:

```bash
# 1. Stop server
# 2. Restore JSON storage
git checkout backend/server/storage.ts

# 3. Restart with JSON files
npm run dev

# Your data is safe in JSON files!
```

---

## 📝 **Summary**

**Most Common Errors:**
1. Connection issues (50%)
2. Schema validation (20%)
3. Duplicate keys (15%)
4. Type casting (10%)
5. Memory issues (5%)

**Prevention:**
- ✅ Use try-catch everywhere
- ✅ Validate data before insert
- ✅ Add proper indexes
- ✅ Use .lean() for reads
- ✅ Monitor performance
- ✅ Keep JSON backups

**Result:** Smooth migration with minimal downtime!
