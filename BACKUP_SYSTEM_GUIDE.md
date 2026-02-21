# 📦 Automatic JSON Backup System

## 🎯 **Purpose:**

Keep your JSON files automatically synchronized with MongoDB as a backup. If anything happens to MongoDB, you can always restore from JSON files.

---

## ✅ **What's Implemented:**

### **1. Automatic Backup Service** ✅
- Backs up MongoDB data to JSON files automatically
- Runs every 30 minutes
- Backs up after every create/update/delete operation
- Stores backups in `backend/data/` directory

### **2. Backup Files Created:**
```
backend/data/
├── brands.json              ✅ Auto-updated
├── models.json              ✅ Auto-updated
├── variants.json            ✅ Auto-updated
├── popular-comparisons.json ✅ Auto-updated
└── backups/                 ✅ Timestamped backups
    ├── 2025-10-30T12-00-00/
    ├── 2025-10-30T12-30-00/
    └── ...
```

---

## 🔄 **How It Works:**

### **Automatic Backups:**
1. **On Server Start:** Initial backup created
2. **Every 30 Minutes:** Full backup runs automatically
3. **After Mutations:** Backup runs after create/update/delete

### **Backup Triggers:**
- ✅ Create brand → Backup brands.json
- ✅ Update brand → Backup brands.json
- ✅ Delete brand → Backup brands.json
- ✅ Create model → Backup models.json
- ✅ Update model → Backup models.json
- ✅ Delete model → Backup models.json
- ✅ Create variant → Backup variants.json
- ✅ Update variant → Backup variants.json
- ✅ Delete variant → Backup variants.json
- ✅ Update comparisons → Backup popular-comparisons.json

---

## 📝 **Configuration:**

### **Environment Variables:**

Add to `backend/.env`:
```bash
# Backup Configuration
ENABLE_JSON_BACKUP=true    # Enable/disable backups (default: true)
BACKUP_INTERVAL=30         # Backup interval in minutes (default: 30)
```

### **Disable Backups (if needed):**
```bash
ENABLE_JSON_BACKUP=false
```

---

## 🔍 **Backup Features:**

### **1. Clean Data:**
- Removes MongoDB-specific fields (`_id`, `__v`)
- Removes `_id` from nested arrays
- Pure JSON format (same as original)

### **2. Timestamped Backups:**
- Creates timestamped backup directories
- Keeps history of all changes
- Located in `backend/data/backups/`

### **3. Error Handling:**
- Backup failures don't affect API operations
- Errors logged but don't crash server
- Continues working even if backup fails

---

## 🚀 **Usage:**

### **Server Automatically Handles Backups:**

When you start the server:
```bash
cd backend
npm run dev
```

You'll see:
```
✅ Connected to MongoDB
📦 JSON Backup Service: ENABLED
📁 Backup Directory: /Applications/WEBSITE-23092025-101/backend/data
🔄 Starting full backup to JSON files...
✅ Backed up 6 brands to /Applications/WEBSITE-23092025-101/backend/data/brands.json
✅ Backed up 2 models to /Applications/WEBSITE-23092025-101/backend/data/models.json
✅ Backed up 35 variants to /Applications/WEBSITE-23092025-101/backend/data/variants.json
✅ Backed up 2 popular comparisons to /Applications/WEBSITE-23092025-101/backend/data/popular-comparisons.json
✅ Full backup completed successfully
⏰ Auto-backup scheduled every 30 minutes
```

### **Manual Backup (if needed):**

You can trigger a manual backup by restarting the server or waiting for the next scheduled backup.

---

## 🔄 **Restore from Backup:**

If you need to restore from JSON files:

### **Option 1: Re-run Migration**
```bash
cd backend
npm run migrate
```
This will restore all data from JSON files to MongoDB.

### **Option 2: Use Timestamped Backup**
```bash
# Copy timestamped backup to main data directory
cp -r data/backups/2025-10-30T12-00-00/* data/

# Then run migration
npm run migrate
```

---

## 📊 **Backup Schedule:**

| Event | Backup Trigger | Files Updated |
|-------|---------------|---------------|
| **Server Start** | Immediate | All files |
| **Every 30 min** | Automatic | All files |
| **Create Brand** | After operation | brands.json |
| **Update Brand** | After operation | brands.json |
| **Delete Brand** | After operation | brands.json |
| **Create Model** | After operation | models.json |
| **Update Model** | After operation | models.json |
| **Delete Model** | After operation | models.json |
| **Create Variant** | After operation | variants.json |
| **Update Variant** | After operation | variants.json |
| **Delete Variant** | After operation | variants.json |
| **Update Comparisons** | After operation | popular-comparisons.json |

---

## 🛡️ **Data Safety:**

### **Multiple Backup Layers:**

1. **Primary:** MongoDB Atlas (cloud database)
2. **Secondary:** JSON files in `backend/data/`
3. **Tertiary:** Timestamped backups in `backend/data/backups/`
4. **Quaternary:** Git version control

### **Backup Retention:**
- Main JSON files: Always up-to-date
- Timestamped backups: Kept indefinitely (manual cleanup)
- MongoDB Atlas: Automatic daily backups (cloud)

---

## 📁 **File Structure:**

```
backend/
├── data/
│   ├── brands.json                    ← Always current
│   ├── models.json                    ← Always current
│   ├── variants.json                  ← Always current
│   ├── popular-comparisons.json       ← Always current
│   ├── admin-users.json               ← Manual backup only
│   └── backups/                       ← Historical backups
│       ├── 2025-10-30T11-30-00/
│       │   ├── brands.json
│       │   ├── models.json
│       │   ├── variants.json
│       │   └── popular-comparisons.json
│       ├── 2025-10-30T12-00-00/
│       └── 2025-10-30T12-30-00/
└── server/
    └── backup-service.ts              ← Backup logic
```

---

## ⚙️ **Advanced Configuration:**

### **Change Backup Interval:**

Edit `backend/server/index.ts`:
```typescript
// Change from 30 minutes to 60 minutes
backupService.startAutoBackup(60);
```

### **Disable Auto-Backup:**

Set in `.env`:
```bash
ENABLE_JSON_BACKUP=false
```

Or comment out in `backend/server/index.ts`:
```typescript
// backupService.startAutoBackup(30);
```

---

## 🔍 **Monitoring Backups:**

### **Check Backup Logs:**
Look for these messages in server logs:
```
✅ Backed up 6 brands to ...
✅ Backed up 2 models to ...
✅ Backed up 35 variants to ...
⏰ Running scheduled backup...
```

### **Verify Backup Files:**
```bash
# Check main backup files
ls -lh backend/data/*.json

# Check timestamped backups
ls -lh backend/data/backups/
```

### **Compare Backup with MongoDB:**
```bash
# Count in MongoDB
curl http://localhost:5001/api/stats

# Count in JSON
cat backend/data/brands.json | grep '"id"' | wc -l
```

---

## 🚨 **Troubleshooting:**

### **Backup Not Running:**
```bash
# Check if backup is enabled
grep ENABLE_JSON_BACKUP backend/.env

# Check server logs for backup messages
# Should see: "📦 JSON Backup Service: ENABLED"
```

### **Backup Files Not Updating:**
```bash
# Check file permissions
ls -la backend/data/

# Check last modified time
ls -lt backend/data/*.json
```

### **Backup Errors:**
```bash
# Check server logs for errors
# Look for: "❌ Backup failed"
```

---

## ✅ **Benefits:**

1. **Automatic Protection:** No manual intervention needed
2. **Real-time Backup:** Data backed up immediately after changes
3. **Multiple Versions:** Timestamped backups keep history
4. **Easy Restore:** Simple migration script to restore
5. **No Performance Impact:** Backups run asynchronously
6. **Git-Friendly:** JSON files can be version controlled
7. **Portable:** Easy to move data between environments

---

## 📊 **Backup Status:**

**Current Configuration:**
- ✅ Backup Service: ENABLED
- ✅ Auto-Backup: Every 30 minutes
- ✅ Backup on Mutations: YES
- ✅ Timestamped Backups: YES
- ✅ Clean JSON Output: YES
- ✅ Error Handling: YES

**Backup Coverage:**
- ✅ Brands: 100%
- ✅ Models: 100%
- ✅ Variants: 100%
- ✅ Popular Comparisons: 100%
- ⚠️  Admin Users: Manual only

---

## 🎯 **Summary:**

**Your data is now protected with:**
1. ✅ MongoDB Atlas (primary database)
2. ✅ Automatic JSON backups (every 30 min)
3. ✅ Real-time backups (after mutations)
4. ✅ Timestamped backup history
5. ✅ Easy restore process

**You can safely work on your project knowing your data is backed up automatically!** 🎉

---

## 📝 **Quick Reference:**

```bash
# Start server (backups start automatically)
cd backend && npm run dev

# Restore from backup
npm run migrate

# Check backup files
ls -lh data/*.json

# Check backup history
ls -lh data/backups/

# Disable backups (if needed)
echo "ENABLE_JSON_BACKUP=false" >> .env
```

**Status:** ✅ **ACTIVE & WORKING**
