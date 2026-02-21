# News Admin Dashboard API Documentation

## Overview
Complete backend API for News Management System with authentication, articles, categories, tags, authors, media, and analytics.

---

## 🔐 Authentication

### Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@gadizone.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@gadizone.com",
    "role": "admin",
    "profileImage": "/path/to/image.jpg"
  }
}
```

### Get Profile
```http
GET /api/admin/profile
Authorization: Bearer {token}

Response:
{
  "id": "uuid",
  "name": "Admin User",
  "email": "admin@gadizone.com",
  "role": "admin",
  "bio": "...",
  "profileImage": "...",
  "socialLinks": {...}
}
```

### Update Profile
```http
PUT /api/admin/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "bio": "New bio",
  "profileImage": "/path/to/new-image.jpg",
  "socialLinks": {
    "twitter": "https://twitter.com/username",
    "linkedin": "https://linkedin.com/in/username"
  }
}
```

### Change Password
```http
POST /api/admin/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 📰 Articles Management

### Get All Articles
```http
GET /api/admin/articles?category=uuid&status=published&search=keyword&page=1&limit=20
Authorization: Bearer {token}

Response:
{
  "articles": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5
}
```

### Get Single Article
```http
GET /api/admin/articles/:id
Authorization: Bearer {token}
```

### Create Article
```http
POST /api/admin/articles
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Article Title",
  "slug": "article-title",
  "excerpt": "Short description",
  "content": "Full article content in HTML",
  "categoryId": "category-uuid",
  "tags": ["tag-id-1", "tag-id-2"],
  "linkedCars": ["model-id-1", "model-id-2"],
  "featuredImage": "/path/to/image.jpg",
  "gallery": ["/path/1.jpg", "/path/2.jpg"],
  "seoTitle": "SEO Title",
  "seoDescription": "SEO Description",
  "seoKeywords": ["keyword1", "keyword2"],
  "status": "draft",
  "publishDate": "2024-01-01T00:00:00Z",
  "isFeatured": false,
  "isBreaking": false
}
```

### Update Article
```http
PUT /api/admin/articles/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "published"
}
```

### Delete Article
```http
DELETE /api/admin/articles/:id
Authorization: Bearer {token}
```

### Bulk Update Status
```http
POST /api/admin/articles/bulk/update-status
Authorization: Bearer {token}
Content-Type: application/json

{
  "articleIds": ["id1", "id2", "id3"],
  "status": "published"
}
```

### Bulk Delete
```http
POST /api/admin/articles/bulk/delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "articleIds": ["id1", "id2", "id3"]
}
```

---

## 📁 Categories

### Get All Categories
```http
GET /api/admin/categories
Authorization: Bearer {token}
```

### Create Category
```http
POST /api/admin/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Category Name",
  "slug": "category-name",
  "description": "Category description",
  "isFeatured": true
}
```

### Update Category
```http
PUT /api/admin/categories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "isFeatured": false
}
```

### Delete Category
```http
DELETE /api/admin/categories/:id
Authorization: Bearer {token}
```

---

## 🏷️ Tags

### Get All Tags
```http
GET /api/admin/tags?type=brand
Authorization: Bearer {token}
```

### Create Tag
```http
POST /api/admin/tags
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tag Name",
  "slug": "tag-name",
  "type": "brand"
}
```

### Update Tag
```http
PUT /api/admin/tags/:id
Authorization: Bearer {token}
```

### Delete Tag
```http
DELETE /api/admin/tags/:id
Authorization: Bearer {token}
```

---

## 👥 Authors (Admin Only)

### Get All Authors
```http
GET /api/admin/authors?role=editor&isActive=true
Authorization: Bearer {token}
```

### Create Author
```http
POST /api/admin/authors
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Author Name",
  "email": "author@example.com",
  "password": "password123",
  "role": "author",
  "bio": "Author bio",
  "profileImage": "/path/to/image.jpg",
  "socialLinks": {},
  "isActive": true
}
```

### Update Author
```http
PUT /api/admin/authors/:id
Authorization: Bearer {token}
```

### Reset Author Password
```http
POST /api/admin/authors/:id/reset-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "newPassword": "newpassword123"
}
```

### Delete Author
```http
DELETE /api/admin/authors/:id
Authorization: Bearer {token}
```

---

## 🖼️ Media Manager

### Get All Media
```http
GET /api/admin/media?type=image&uploader=user-id
Authorization: Bearer {token}
```

### Upload Single File
```http
POST /api/admin/media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (binary)

Response:
{
  "id": "uuid",
  "filename": "unique-filename.jpg",
  "originalName": "original.jpg",
  "url": "/uploads/news/unique-filename.jpg",
  "type": "image",
  "size": 123456,
  "uploaderId": "user-id",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Upload Multiple Files
```http
POST /api/admin/media/upload-multiple
Authorization: Bearer {token}
Content-Type: multipart/form-data

files: (multiple files)

Response: [...]
```

### Delete Media
```http
DELETE /api/admin/media/:id
Authorization: Bearer {token}
```

---

## 📊 Analytics

### Get Dashboard Analytics
```http
GET /api/admin/analytics/dashboard
Authorization: Bearer {token}

Response:
{
  "totalArticles": 100,
  "publishedArticles": 80,
  "draftArticles": 15,
  "scheduledArticles": 5,
  "totalViews": 50000,
  "categoryStats": [...],
  "authorStats": [...],
  "topArticles": [...]
}
```

### Get Articles by Month
```http
GET /api/admin/analytics/articles-by-month
Authorization: Bearer {token}

Response: [
  { "month": "2024-01", "count": 10 },
  { "month": "2024-02", "count": 15 }
]
```

### Get Top Articles
```http
GET /api/admin/analytics/top-articles?limit=10
Authorization: Bearer {token}
```

### Get Articles by Category
```http
GET /api/admin/analytics/articles-by-category
Authorization: Bearer {token}
```

### Get Author Performance
```http
GET /api/admin/analytics/author-performance
Authorization: Bearer {token}
```

### Export Data
```http
GET /api/admin/analytics/export?type=articles
Authorization: Bearer {token}

Response: CSV file download
```

---

## 🌐 Public News API (No Auth Required)

### Get Published Articles
```http
GET /api/news?category=uuid&tag=tag-id&search=keyword&page=1&limit=10

Response:
{
  "articles": [...],
  "total": 50,
  "page": 1,
  "totalPages": 5
}
```

### Get Article by Slug
```http
GET /api/news/:slug

Response: {article object}
```

### Get Featured Articles
```http
GET /api/news/featured/list
```

### Get Trending Articles
```http
GET /api/news/trending/list
```

### Get Categories
```http
GET /api/news/categories/list
```

### Get Tags
```http
GET /api/news/tags/list
```

---

## 🔑 User Roles & Permissions

### Admin
- Full access to all features
- Can manage authors
- Can delete any article
- Can access all analytics

### Editor
- Can create/edit/delete own articles
- Can publish articles
- Can manage categories and tags
- Can access analytics

### Author
- Can create/edit own articles
- Cannot publish (needs editor/admin approval)
- Limited analytics access

---

## 📦 Data Storage

All data is stored in JSON files in `/backend/data/`:
- `news-articles.json` - All articles
- `news-categories.json` - Categories
- `news-tags.json` - Tags
- `news-authors.json` - Authors (with hashed passwords)
- `news-media.json` - Media metadata

Uploaded files are stored in `/backend/uploads/news/`

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install bcryptjs jsonwebtoken multer
```

### 2. Create Default Admin User
Run this script to create your first admin:

```typescript
import bcrypt from 'bcryptjs'
import { newsStorage } from './server/db/news-storage'

async function createAdmin() {
  await newsStorage.initialize()
  
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await newsStorage.createAuthor({
    name: 'Admin User',
    email: 'admin@gadizone.com',
    password: hashedPassword,
    role: 'admin',
    bio: 'System Administrator',
    profileImage: '',
    socialLinks: {},
    isActive: true
  })
  
  console.log('Admin user created!')
}

createAdmin()
```

### 3. Start Server
```bash
npm start
```

### 4. Test Login
```bash
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gadizone.com","password":"admin123"}'
```

---

## 🎨 Frontend Integration

Use the token in all authenticated requests:

```typescript
const token = localStorage.getItem('adminToken')

fetch('/api/admin/articles', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## ✅ Complete Feature List

- ✅ JWT Authentication
- ✅ Role-based Access Control (Admin/Editor/Author)
- ✅ Articles CRUD with rich text support
- ✅ Categories & Tags Management
- ✅ Authors Management
- ✅ Media Upload & Management
- ✅ Dashboard Analytics
- ✅ Search & Filtering
- ✅ Pagination
- ✅ Bulk Operations
- ✅ SEO Fields
- ✅ Featured & Breaking News
- ✅ Article Scheduling
- ✅ View Tracking
- ✅ Data Export (CSV)
- ✅ Public API for Frontend

---

## 📝 Next Steps

1. Build the admin frontend dashboard
2. Integrate with existing car models
3. Add comment system
4. Add email notifications
5. Add image optimization
6. Add caching layer
7. Add full-text search
8. Add revision history

---

**Your News Admin Dashboard backend is now complete and ready to use!** 🎉
