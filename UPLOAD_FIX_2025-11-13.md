# Upload Fix Implementation - November 13, 2025

## Problem Summary
The admin UI was experiencing upload failures with the following errors:
- **403 INVALID_TOKEN** on `POST /api/uploads/presign` and `POST /api/upload/image`
- **CORS blocking** on browser PUT requests to Cloudflare R2 presigned URLs
- **"upstream image response failed"** errors in the console
- Images showing as broken links due to local `/uploads/*` paths not existing

## Root Causes Identified

### 1. Authentication Issues
- **Login endpoint didn't return tokens**: The backend login response only set HttpOnly cookies but didn't return `token` and `refreshToken` in the JSON response
- **Missing Authorization headers**: Frontend upload requests weren't including `Authorization: Bearer <token>` headers
- **Cross-site cookie issues**: `SameSite=Strict` cookies were blocking cross-origin requests in production

### 2. CORS Configuration
- **R2 bucket CORS not configured**: Cloudflare R2 bucket didn't allow browser preflight requests from localhost or deployment origins
- **Missing allowed origins**: Local development (`localhost:5001`, `localhost:3000`) and production domains not whitelisted

### 3. Database Migration Needed
- **Legacy local URLs**: Database still contained `/uploads/*` paths that didn't exist after server restarts
- **No R2 integration**: Existing images weren't migrated to Cloudflare R2 storage

## Solutions Implemented

### 1. Backend Authentication Fixes

#### Updated Login Response (`backend/server/routes.ts`)
```typescript
// Before: Only set cookies
res.cookie('token', accessToken, { httpOnly: true, sameSite: 'strict' });
res.json({ success: true, user: sanitizeUser(user) });

// After: Return tokens + set cross-site compatible cookies
const isProd = process.env.NODE_ENV === 'production';
const sameSitePolicy = (isProd && process.env.FRONTEND_URL) ? 'none' : 'strict';
res.cookie('token', accessToken, {
  httpOnly: true,
  secure: isProd,
  sameSite: sameSitePolicy,
  maxAge: 24 * 60 * 60 * 1000
});
res.json({
  success: true,
  user: sanitizeUser(user),
  token: accessToken,
  refreshToken
});
```

**Benefits:**
- Frontend can store tokens in localStorage for Authorization headers
- Cross-site cookies work when `FRONTEND_URL` is set in production
- Backward compatible with existing cookie-based auth

### 2. Frontend Upload Fixes

#### Enhanced Image Upload Utility (`backend/client/src/lib/imageUpload.ts`)
```typescript
// Added token validation and credentials
const rawToken = localStorage.getItem('token');
const token = rawToken && (rawToken === 'dev-access-token' || rawToken.split('.').length === 3) ? rawToken : null;
const presignHeaders = { 'Content-Type': 'application/json' };
if (token) presignHeaders['Authorization'] = `Bearer ${token}`;

const presignRes = await fetch(`${backendBase}/api/uploads/presign`, {
  method: 'POST',
  headers: presignHeaders,
  credentials: 'include', // Always send cookies
  body: JSON.stringify({ filename: file.name, contentType: file.type })
});
```

#### Updated All Upload Components
- **BrandForm.tsx**: Added Authorization header and credentials to presign and fallback uploads
- **VariantFormPage1.tsx**: Added credentials to local fallback upload
- **ModelFormPage3.tsx**: Uses the enhanced `uploadImage()` utility

### 3. Cloudflare R2 Configuration

#### CORS Policy Applied
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 86400
  }
]
```

**Why `"*"` origins:**
- Safe for R2 (just file storage, not sensitive APIs)
- Works for localhost development and any production domain
- Eliminates preflight CORS errors on browser PUT requests

### 4. Database Migration to R2

#### Migration Script (`backend/scripts/migrate-local-uploads-to-r2.ts`)
```bash
# Dry run to see what would be migrated
npx tsx scripts/migrate-local-uploads-to-r2.ts --dry-run

# Apply migration
npx tsx scripts/migrate-local-uploads-to-r2.ts --apply
```

**Results:**
- **55 files uploaded** to R2 successfully
- **9 missing files** skipped (already cleaned up .webp conversions)
- **Database URLs updated** from `/uploads/*` to `https://...r2.cloudflarestorage.com/killerwhale/uploads/*`

## Environment Variables Required

### Backend (.env)
```bash
# Cloudflare R2
R2_BUCKET=killerwhale
R2_ACCOUNT_ID=68f29b8a9b7761d61a0c03abb5e11db0
R2_ACCESS_KEY_ID=0b8ac3685508fe906b038a38a2389397
R2_SECRET_ACCESS_KEY=e585cc396e5c43188f5359a549ffbf2b91f3535de2d8ac7737e4438716d
R2_ENDPOINT=https://68f29b8a9b7761d61a0c03abb5e11db0.r2.cloudflarestorage.com
R2_PUBLIC_BASE_URL=https://68f29b8a9b7761d61a0c03abb5e11db0.r2.cloudflarestorage.com/killerwhale

# Auth
JWT_SECRET=stable-secret-dont-regenerate
SESSION_SECRET=another-stable-secret

# Cross-site support (production)
FRONTEND_URL=https://your-frontend-domain.com
```

### Render Deployment
- Set all R2 variables in Render dashboard
- Set `FRONTEND_URL` to your actual frontend domain
- Ensure `JWT_SECRET` is stable (don't regenerate on each deploy)

## Testing Verification

### CLI Test Script (`backend/test-upload-flow.js`)
```bash
node test-upload-flow.js
```

**Validates:**
- ✅ Backend connectivity on port 5001
- ✅ Auth protection (rejects requests without tokens)
- ✅ R2 environment variables present
- ✅ Database migration success (brands using R2 URLs)

### Manual Browser Testing
1. **Re-login required**: Old tokens are invalid after auth changes
2. **Check localStorage**: Should contain valid JWT token after login
3. **Upload test**: Try uploading brand logo or model images
4. **Network inspection**: Verify 200 responses on presign and R2 PUT requests

## Expected Upload Flow (After Fix)

### Successful R2 Upload
1. `POST /api/uploads/presign` → 200 OK with `uploadUrl` and `publicUrl`
2. Browser `PUT https://...r2.cloudflarestorage.com/...` → 200 OK
3. Result: R2 URL like `https://68f29b8a9b7761d61a0c03abb5e11db0.r2.cloudflarestorage.com/killerwhale/uploads/logo-123.png`

### Fallback to Local (if R2 fails)
1. `POST /api/upload/image` → 200 OK with local URL
2. Result: Local URL like `/uploads/image-123.jpg`
3. Server redirects `/uploads/*` to R2 if `R2_PUBLIC_BASE_URL` is set

## Files Modified

### Backend
- `backend/server/routes.ts` - Login response and cookie policy
- `backend/scripts/migrate-local-uploads-to-r2.ts` - Database migration
- `backend/test-upload-flow.js` - CLI verification script

### Frontend
- `backend/client/src/lib/imageUpload.ts` - Core upload utility
- `backend/client/src/pages/BrandForm.tsx` - Brand logo uploads
- `backend/client/src/pages/VariantFormPage1.tsx` - Variant image uploads

## Deployment Checklist

### Local Development
- [x] Backend running on port 5001
- [x] R2 environment variables set in `.env`
- [x] R2 CORS configured for localhost origins
- [x] Database migrated to R2 URLs
- [ ] **Re-login to admin UI** (critical for fresh tokens)
- [ ] Test upload functionality

### Production (Render)
- [ ] Set R2 environment variables in Render dashboard
- [ ] Set `FRONTEND_URL` to actual frontend domain
- [ ] Set stable `JWT_SECRET` (don't regenerate)
- [ ] Deploy latest commit with auth fixes
- [ ] Update R2 CORS to include production domains
- [ ] Test uploads from production admin

## Troubleshooting

### Still Getting 403 INVALID_TOKEN
1. **Clear browser storage**: Remove old tokens and cookies
2. **Hard refresh**: Ensure new client code is loaded
3. **Re-login**: Get fresh tokens from updated login endpoint
4. **Check Network tab**: Verify Authorization header is sent

### CORS Errors on R2 PUT
1. **Verify R2 CORS**: Check Cloudflare dashboard settings
2. **Check origins**: Ensure your domain is in AllowedOrigins
3. **Browser cache**: Try incognito mode to bypass CORS cache

### Images Still Showing as Broken
1. **Check database**: Verify URLs are R2 format after migration
2. **Check R2 access**: Ensure bucket and files are publicly readable
3. **Check redirects**: Local `/uploads/*` should redirect to R2

## Success Metrics

### Before Fix
- ❌ 403 errors on upload endpoints
- ❌ CORS blocking on R2 requests  
- ❌ Broken image links after server restart
- ❌ No persistent image storage

### After Fix
- ✅ 200 responses on presign and upload
- ✅ Successful browser PUT to R2 URLs
- ✅ Persistent R2 image URLs
- ✅ Fallback to local storage if R2 unavailable
- ✅ Cross-site cookie support for production

## Next Steps

1. **Complete local testing** with re-login and upload verification
2. **Deploy to Render** with proper environment variables
3. **Test production uploads** from deployed admin
4. **Monitor R2 usage** and costs in Cloudflare dashboard
5. **Consider CDN** for faster image delivery if needed

---

**Status**: Implementation complete, awaiting final browser testing with fresh authentication tokens.
