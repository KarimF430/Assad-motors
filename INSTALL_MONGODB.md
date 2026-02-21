# 🚀 MongoDB Installation Guide

## ✅ **Step 1: Install MongoDB (Already Done)**

You've already tapped the MongoDB repository:
```bash
brew tap mongodb/brew  ✅ DONE
```

---

## 📦 **Step 2: Install MongoDB Community**

Run this command in your terminal:

```bash
brew install mongodb-community@8.0
```

This will take a few minutes to download and install.

---

## 🚀 **Step 3: Start MongoDB Service**

After installation completes, start MongoDB:

```bash
brew services start mongodb-community@8.0
```

---

## ✅ **Step 4: Verify MongoDB is Running**

Check if MongoDB is running:

```bash
brew services list | grep mongodb
```

You should see:
```
mongodb-community@8.0  started
```

---

## 🔄 **Step 5: Run Migration**

Once MongoDB is running, migrate your data:

```bash
cd /Applications/WEBSITE-23092025-101/backend
npm run migrate
```

Expected output:
```
🚀 Starting MongoDB migration...
✅ Connected to MongoDB
📦 Found X brands
📦 Found X models
📦 Found X variants
✅ Migrated X brands
✅ Migrated X models
✅ Migrated X variants
🎉 Migration completed successfully!
```

---

## 🎯 **Step 6: Start Your Server**

```bash
npm run dev
```

Expected output:
```
✅ Connected to MongoDB
🔐 Registering authentication routes...
serving on port 5001
```

---

## 🛠️ **Alternative: Use MongoDB Atlas (Cloud - No Installation)**

If you prefer not to install MongoDB locally, use MongoDB Atlas (free):

### **1. Create Account:**
- Go to: https://www.mongodb.com/cloud/atlas
- Click "Try Free"
- Sign up with email or Google

### **2. Create Cluster:**
- Choose "M0 Free" tier
- Select region closest to you
- Click "Create Cluster"

### **3. Create Database User:**
- Go to "Database Access"
- Click "Add New Database User"
- Choose "Password" authentication
- Username: `username`
- Password: (generate strong password)
- User Privileges: "Read and write to any database"
- Click "Add User"

### **4. Whitelist IP:**
- Go to "Network Access"
- Click "Add IP Address"
- Choose "Allow Access from Anywhere" (for development)
- Click "Confirm"

### **5. Get Connection String:**
- Go back to "Database"
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string:
  ```
  mongodb+srv://username:<password>@cluster.mongodb.net/gadizone
  ```
- Replace `<password>` with your actual password

### **6. Update .env File:**
```bash
# Edit: /Applications/WEBSITE-23092025-101/backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gadizone
```

### **7. Run Migration:**
```bash
cd /Applications/WEBSITE-23092025-101/backend
npm run migrate
npm run dev
```

---

## 🔍 **Troubleshooting:**

### **MongoDB Won't Start:**
```bash
# Check logs
brew services info mongodb-community@8.0

# Restart service
brew services restart mongodb-community@8.0
```

### **Connection Refused:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Check MongoDB logs
tail -f /usr/local/var/log/mongodb/mongo.log
```

### **Port Already in Use:**
```bash
# Check what's using port 27017
lsof -i :27017

# Kill the process if needed
kill -9 <PID>
```

---

## 📝 **Quick Commands Summary:**

```bash
# Install MongoDB (run in terminal)
brew install mongodb-community@8.0

# Start MongoDB
brew services start mongodb-community@8.0

# Verify it's running
brew services list | grep mongodb

# Run migration
cd /Applications/WEBSITE-23092025-101/backend
npm run migrate

# Start server
npm run dev
```

---

## ✅ **Success Indicators:**

You'll know it's working when you see:

1. **MongoDB Running:**
   ```
   mongodb-community@8.0  started
   ```

2. **Migration Success:**
   ```
   🎉 Migration completed successfully!
   ```

3. **Server Connected:**
   ```
   ✅ Connected to MongoDB
   serving on port 5001
   ```

---

## 🎯 **Next Steps After Installation:**

1. ✅ Install MongoDB (brew install)
2. ✅ Start MongoDB service
3. ✅ Run migration script
4. ✅ Start your server
5. ✅ Test API endpoints
6. ✅ Verify admin panel works

**That's it! Your app will be running with MongoDB!** 🚀
