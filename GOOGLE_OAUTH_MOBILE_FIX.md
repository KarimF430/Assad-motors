# 🔧 Google OAuth Mobile Login Fix

## Quick Fix Guide

Your Google OAuth works on **desktop** but fails on **mobile** with:
```
Error 400: redirect_uri_mismatch
```

### Why This Happens

Mobile devices may access your app via different URLs than desktop, but Google OAuth requires **ALL possible callback URLs** to be pre-configured.

---

## ✅ Solution: Add Redirect URIs to Google Cloud Console

### Step 1: Find Your Backend URL

Check your Vercel/Render deployment to find your **BACKEND_URL**. This is where your API server runs.

**Common examples:**
- Render backend: `https://killer-whale-backend.onrender.com`
- Vercel deployment: `https://your-app.vercel.app`

### Step 2: Format Your Redirect URI

Your callback URL format is:
```
https://YOUR_BACKEND_URL/api/user/auth/google/callback
```

**Example:**
```
https://killer-whale-backend.onrender.com/api/user/auth/google/callback
```

### Step 3: Add to Google Cloud Console

1. Go to: [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Click your **OAuth 2.0 Client ID**
3. Find **"Authorized redirect URIs"** section
4. Click **"+ ADD URI"**
5. Add your redirect URI (step 2)
6. Click **"SAVE"**

### Step 4: Add ALL Environments

You should add redirect URIs for:

**Production:**
```
https://YOUR_PRODUCTION_BACKEND/api/user/auth/google/callback
```

**Localhost (for development):**
```
http://localhost:5001/api/user/auth/google/callback
```

**Staging (if applicable):**
```
https://YOUR_STAGING_BACKEND/api/user/auth/google/callback
```

---

## 📋 Checklist

- [ ] Find your production backend URL
- [ ] Format the complete callback URL
- [ ] Go to Google Cloud Console
- [ ] Add the redirect URI
- [ ] Save changes
- [ ] Wait 5 minutes for changes to propagate
- [ ] Test on mobile device

---

## 🔍 How to Find Your Backend URL

### Option 1: Check Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your project
3. Copy the deployment URL

### Option 2: Check Render Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Find your backend service
3. Copy the service URL

### Option 3: Check Environment Variables
Look at your deployment environment variables for:
- `BACKEND_URL`
- `API_URL`
- Or check the actual URL in your browser network tab

---

## ✨ Expected Result

After configuration:
- ✅ Desktop login: **Works**
- ✅ Mobile login: **Works**
- ✅ Any browser: **Works**
- ✅ Any device: **Works**

---

## ⚠️ Important Notes

> **Changes take 5-10 minutes to propagate.**  
> If it doesn't work immediately, wait and try again.

> **Use HTTPS in production.**  
> Only localhost can use HTTP.

> **The URI must match EXACTLY.**  
> Check protocol, domain, port, and path.

---

## 🐛 Still Not Working?

### Double Check These:

1. **Correct Client ID**  
   Make sure you're editing the correct OAuth client

2. **Exact Match**  
   The redirect URI must match character-for-character

3. **Environment Variable**  
   Verify `BACKEND_URL` or `RENDER_EXTERNAL_URL` is set correctly in production

4. **Clear Browser Cache**  
   Try in incognito/private mode

5. **Check Backend Logs**  
   Look for the actual callback URL being used

---

## 📞 Need Help Finding Your URLs?

Run this in your browser console while on your app:
```javascript
console.log(window.location.origin)
```

Or check your browser's network tab when the OAuth flow starts - you'll see the exact redirect_uri being used.

---

## Example Configuration

If your backend is at: `https://killer-whale-api.onrender.com`

**Add this exact URI to Google Cloud Console:**
```
https://killer-whale-api.onrender.com/api/user/auth/google/callback
```

**Screenshot Example:**
![Already included in implementation plan](/Users/rachitsimac/.gemini/antigravity/brain/2140d7bb-23ab-4295-9440-ef20300c7be3/uploaded_image_1764656381980.png)

✅ The screenshot shows the error - you need to configure Google Cloud Console with the redirect URIs shown above!
