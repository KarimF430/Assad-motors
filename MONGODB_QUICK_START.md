# 🚀 MongoDB Migration - Quick Start Guide

## ✅ **What's Been Done:**

1. ✅ Installed MongoDB dependencies (`mongodb`, `mongoose`)
2. ✅ Created MongoDB schemas (`server/db/schemas.ts`)
3. ✅ Created MongoDB storage implementation (`server/db/mongodb-storage.ts`)
4. ✅ Updated server to use MongoDB (`server/index.ts`)
5. ✅ Updated routes to accept storage parameter (`server/routes.ts`)
6. ✅ Created migration script (`migrate-to-mongodb.ts`)
7. ✅ Updated `.env` file with MongoDB URI
8. ✅ Added `npm run migrate` script

---

## 🎯 **Next Steps:**

### **Option A: Use Local MongoDB (Recommended for Development)**

#### **Step 1: Install MongoDB**
```bash
# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify it's running
brew services list | grep mongodb
# Should show: mongodb-community started
```

#### **Step 2: Run Migration**
```bash
cd /Applications/WEBSITE-23092025-101/backend
npm run migrate
```

**Expected Output:**
```
🚀 Starting MongoDB migration...
📡 Connecting to MongoDB: mongodb://localhost:27017/gadizone
✅ Connected to MongoDB

📦 Found X brands
📦 Found X models
📦 Found X variants
📦 Found X admin users
📦 Found X popular comparisons

🗑️  Clearing existing MongoDB data...
✅ Existing data cleared

📥 Inserting data into MongoDB...

✅ Migrated X brands
✅ Migrated X models
✅ Migrated X variants
✅ Migrated X admin users
✅ Migrated X popular comparisons

🎉 Migration completed successfully!
```

#### **Step 3: Start Server**
```bash
npm run dev
```

**Expected Output:**
```
✅ Connected to MongoDB
🔐 Registering authentication routes...
Loaded X brands from storage
Loaded X models from storage
...
serving on port 5001
```

---

### **Option B: Use MongoDB Atlas (Cloud - FREE)**

#### **Step 1: Create MongoDB Atlas Account**
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google
4. Create a free M0 cluster (512MB storage - FREE forever)

#### **Step 2: Get Connection String**
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://username:<password>@cluster.mongodb.net/gadizone
   ```
4. Replace `<password>` with your actual password

#### **Step 3: Update .env File**
```bash
# Edit backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gadizone
```

#### **Step 4: Whitelist Your IP**
1. In MongoDB Atlas dashboard
2. Go to "Network Access"
3. Click "Add IP Address"
4. Choose "Allow Access from Anywhere" (for development)
5. Click "Confirm"

#### **Step 5: Run Migration & Start Server**
```bash
cd /Applications/WEBSITE-23092025-101/backend
npm run migrate
npm run dev
```

---

## 🔍 **Troubleshooting:**

### **Error: Connection Refused**
```
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
brew services list

# Start MongoDB
brew services start mongodb-community

# If still not working, try restarting
brew services restart mongodb-community
```

---

### **Error: Authentication Failed**
```
MongoServerError: Authentication failed
```

**Solution:**
- Check username/password in connection string
- For Atlas: Make sure IP is whitelisted
- For local: MongoDB usually doesn't require auth by default

---

### **Error: Migration Script Fails**
```
Cannot find module './server/db/schemas'
```

**Solution:**
```bash
# Make sure you're in the backend directory
cd /Applications/WEBSITE-23092025-101/backend

# Run migration
npm run migrate
```

---

### **Error: Server Won't Start**
```
Failed to connect to MongoDB
```

**Solution:**
1. Check `.env` file has correct `MONGODB_URI`
2. Make sure MongoDB is running (local) or accessible (Atlas)
3. Check network connection
4. Verify connection string format

---

## 📊 **Verify Migration:**

### **1. Check MongoDB Data**

**Using MongoDB Compass (GUI):**
```bash
# Install MongoDB Compass
brew install --cask mongodb-compass

# Open and connect to:
mongodb://localhost:27017

# Browse database: gadizone
# Check collections: brands, models, variants, etc.
```

**Using MongoDB Shell:**
```bash
# Connect to MongoDB
mongosh

# Use database
use gadizone

# Count documents
db.brands.countDocuments()
db.models.countDocuments()
db.variants.countDocuments()

# View sample data
db.brands.findOne()
```

### **2. Test API Endpoints**

```bash
# Test brands endpoint
curl http://localhost:5001/api/brands

# Test models endpoint
curl http://localhost:5001/api/models

# Test variants endpoint
curl http://localhost:5001/api/variants
```

---

## ✅ **Success Checklist:**

- [ ] MongoDB installed and running
- [ ] Migration script completed successfully
- [ ] Server starts without errors
- [ ] Can see "✅ Connected to MongoDB" message
- [ ] API endpoints return data
- [ ] Admin panel works
- [ ] Login works
- [ ] Can create/edit/delete brands/models/variants

---

## 🎯 **What Changed:**

### **Before (JSON Files):**
```
Express → Storage Layer → JSON Files
```

### **After (MongoDB):**
```
Express → Storage Layer → MongoDB
```

### **API Endpoints (NO CHANGE):**
- ✅ `/api/brands` - Same
- ✅ `/api/models` - Same
- ✅ `/api/variants` - Same
- ✅ `/api/auth/*` - Same
- ✅ All other endpoints - Same

**Frontend/Admin Panel:** ZERO changes needed!

---

## 🔄 **Rollback Plan:**

If something goes wrong, you can easily rollback:

### **Option 1: Keep JSON Files (Backup)**
Your JSON files are still intact in `backend/data/`:
- `brands.json`
- `models.json`
- `variants.json`
- `admin-users.json`
- `popular-comparisons.json`

### **Option 2: Switch Back to JSON Storage**
```bash
# In server/index.ts, replace:
import { MongoDBStorage } from "./db/mongodb-storage";
const storage = new MongoDBStorage();

# With:
import { PersistentStorage } from "./storage";
const storage = new PersistentStorage();
```

---

## 📝 **Summary:**

**Current Status:**
- ✅ MongoDB dependencies installed
- ✅ MongoDB schemas created
- ✅ MongoDB storage implementation ready
- ✅ Server configured to use MongoDB
- ✅ Migration script ready

**Next Action:**
1. **Install MongoDB** (local or Atlas)
2. **Run migration:** `npm run migrate`
3. **Start server:** `npm run dev`
4. **Test everything works!**

---

**Ready to migrate? Run these commands:**

```bash
# For local MongoDB:
brew services start mongodb-community
cd /Applications/WEBSITE-23092025-101/backend
npm run migrate
npm run dev

# For MongoDB Atlas:
# 1. Create cluster at mongodb.com/cloud/atlas
# 2. Update MONGODB_URI in .env
# 3. Run migration and start server
cd /Applications/WEBSITE-23092025-101/backend
npm run migrate
npm run dev
```

**That's it! Your app is now using MongoDB!** 🎉
