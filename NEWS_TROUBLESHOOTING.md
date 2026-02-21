# News System - Troubleshooting Guide

## 🔧 Issue: "Unable to see articles in backend"

### **Solution Steps:**

### **1. Create Admin User**

First, you need to create an admin user to authenticate:

```bash
cd backend
npx ts-node scripts/create-news-admin.ts
```

This will create:
- **Email:** `admin@gadizone.com`
- **Password:** `admin123`

---

### **2. Login to Admin Panel**

1. Navigate to: `http://localhost:5001/login`
2. Enter credentials:
   - Email: `admin@gadizone.com`
   - Password: `admin123`
3. Click Login

The system will store a JWT token in `localStorage`

---

### **3. Check Backend is Running**

Make sure the backend server is running:

```bash
cd backend
npm start
```

You should see:
```
Loaded X brands from storage
Loaded X models from storage
Loaded X variants from storage
News storage initialized successfully
serving on port 5001
```

---

### **4. Verify API Endpoints**

Test the endpoints manually:

```bash
# Get auth token first (login)
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gadizone.com","password":"admin123"}'

# Copy the token from response

# Test get articles
curl http://localhost:5001/api/admin/articles \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test get categories
curl http://localhost:5001/api/admin/categories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### **5. Check Browser Console**

Open browser DevTools (F12) and check:

1. **Console Tab** - Look for errors
2. **Network Tab** - Check API calls:
   - `/api/admin/articles` should return 200
   - Check request headers have `Authorization: Bearer ...`
   - Check response data

Common errors:
- **401 Unauthorized** - Token missing or invalid (login again)
- **403 Forbidden** - User doesn't have permission
- **500 Server Error** - Backend issue (check server logs)

---

### **6. Verify Data Files**

Check if data files exist:

```bash
ls -la backend/data/

# You should see:
# news-articles.json
# news-categories.json
# news-tags.json
# news-authors.json
# news-media.json
```

If files don't exist, the backend will create them automatically.

---

### **7. Check Authentication Flow**

The authentication flow should be:

```
1. User logs in → POST /api/admin/login
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Frontend sends token with every request
5. Backend verifies token
6. Backend returns data
```

**Check localStorage:**
```javascript
// In browser console
localStorage.getItem('token')
// Should return a JWT token string
```

---

### **8. Create Test Article**

Try creating an article through the UI:

1. Go to `/news`
2. Click "Add New Article"
3. Fill in:
   - Title: "Test Article"
   - Excerpt: "This is a test"
   - Add at least one content block
   - Select a category
4. Click "Save Draft"

**Check browser console for:**
- POST request to `/api/admin/articles`
- Response status (should be 201)
- Success toast message

---

### **9. Common Issues & Fixes**

#### **Issue: "No token provided"**
**Fix:** Login again to get a fresh token

#### **Issue: "Invalid token"**
**Fix:** Token expired, login again

#### **Issue: "Categories not loading"**
**Fix:** Backend needs to initialize default categories:
```typescript
// Default categories are created automatically on first run
// Check backend/data/news-categories.json
```

#### **Issue: "CORS error"**
**Fix:** Backend CORS is already configured, but verify:
```typescript
// backend/server/index.ts
// CORS allows localhost:3000 and localhost:5001
```

#### **Issue: "Articles not appearing"**
**Possible causes:**
1. No articles created yet
2. Filter is hiding them (check "All Status" dropdown)
3. API call failing (check Network tab)
4. Token expired (login again)

---

### **10. Manual Data Check**

Check the JSON file directly:

```bash
cat backend/data/news-articles.json
```

Should show array of articles:
```json
[
  {
    "id": "uuid-here",
    "title": "Article Title",
    "contentBlocks": [...],
    "status": "draft",
    ...
  }
]
```

---

### **11. Reset Everything**

If all else fails, reset the news system:

```bash
# Delete data files
rm backend/data/news-*.json

# Restart backend
cd backend
npm start

# Create admin again
npx ts-node scripts/create-news-admin.ts

# Login again in browser
```

---

### **12. Debug Mode**

Enable detailed logging:

```typescript
// In NewsForm.tsx, check console.log output
console.log("Submitting article:", articleData);

// In News.tsx, check fetch response
console.log("Fetched articles:", data);
```

---

### **13. Verify Backend Routes**

Make sure routes are registered in `backend/server/routes.ts`:

```typescript
// Should have these lines:
app.use('/api/admin', authLimiter, adminAuthRoutes);
app.use('/api/admin/articles', apiLimiter, adminArticlesRoutes);
app.use('/api/admin/categories', apiLimiter, adminCategoriesRoutes);
```

---

### **14. Check Package Dependencies**

Make sure all packages are installed:

```bash
cd backend/client
npm install

# Check for missing packages
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

### **15. Test API with Postman/Insomnia**

1. **Login:**
   ```
   POST http://localhost:5001/api/admin/login
   Body: {"email":"admin@gadizone.com","password":"admin123"}
   ```

2. **Get Articles:**
   ```
   GET http://localhost:5001/api/admin/articles
   Headers: Authorization: Bearer YOUR_TOKEN
   ```

3. **Create Article:**
   ```
   POST http://localhost:5001/api/admin/articles
   Headers: 
     Authorization: Bearer YOUR_TOKEN
     Content-Type: application/json
   Body: {
     "title": "Test",
     "slug": "test",
     "excerpt": "Test excerpt",
     "contentBlocks": [
       {"id":"1","type":"paragraph","content":"Test content"}
     ],
     "categoryId": "category-id",
     "tags": [],
     "linkedCars": [],
     "featuredImage": "",
     "seoTitle": "Test",
     "seoDescription": "Test",
     "seoKeywords": [],
     "status": "draft",
     "publishDate": "2025-11-10",
     "isFeatured": false,
     "isBreaking": false
   }
   ```

---

## ✅ **Quick Checklist**

- [ ] Backend server running on port 5001
- [ ] Admin user created
- [ ] Logged in successfully
- [ ] Token stored in localStorage
- [ ] Categories exist in backend/data/news-categories.json
- [ ] API calls returning 200/201 (not 401/403/500)
- [ ] No errors in browser console
- [ ] No errors in server logs

---

## 🆘 **Still Having Issues?**

1. Check server logs for errors
2. Check browser console for errors
3. Verify all files exist in `backend/data/`
4. Try creating admin user again
5. Try logging in again
6. Clear browser cache and localStorage
7. Restart both frontend and backend

---

## 📞 **Common Error Messages**

| Error | Cause | Fix |
|-------|-------|-----|
| "No token provided" | Not logged in | Login again |
| "Invalid token" | Token expired | Login again |
| "Failed to fetch" | Backend not running | Start backend server |
| "CORS error" | Port mismatch | Check backend is on 5001 |
| "Category not found" | No categories | Backend creates default ones |
| "Validation Error" | Missing required fields | Fill all required fields |

---

**Your news system should now be fully functional!** 🎉
