#!/usr/bin/env node

/**
 * Upload Debug Test
 * Tests what URLs are being returned by upload endpoints
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 UPLOAD DEBUG TEST\n');

// Check environment variables
console.log('📋 Environment Check:');
console.log(`   R2_BUCKET: ${process.env.R2_BUCKET || 'Not set'}`);
console.log(`   R2_ACCOUNT_ID: ${process.env.R2_ACCOUNT_ID || 'Not set'}`);
console.log(`   R2_PUBLIC_BASE_URL: ${process.env.R2_PUBLIC_BASE_URL || 'Not set'}`);
console.log(`   R2_ACCESS_KEY_ID: ${process.env.R2_ACCESS_KEY_ID ? 'Set' : 'Not set'}`);
console.log(`   R2_SECRET_ACCESS_KEY: ${process.env.R2_SECRET_ACCESS_KEY ? 'Set' : 'Not set'}`);

// Simulate the URL generation logic from routes.ts
console.log('\n🔗 URL Generation Logic:');

const bucket = process.env.R2_BUCKET;
const accountId = process.env.R2_ACCOUNT_ID;
const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint ? `${endpoint}/${bucket}` : '');

console.log(`   Bucket: ${bucket}`);
console.log(`   Account ID: ${accountId}`);
console.log(`   Endpoint: ${endpoint}`);
console.log(`   Public Base: ${publicBase}`);

// Simulate upload URL generation
const mockFilename = 'test-image-123.webp';
const mockKey = `uploads/images/202511/uuid-${mockFilename}`;

let fileUrl = `/uploads/${mockFilename}`;  // Default local URL
console.log(`   Default Local URL: ${fileUrl}`);

if (bucket && publicBase) {
  const r2Url = `${publicBase}/${mockKey}`;
  console.log(`   R2 URL (if successful): ${r2Url}`);
} else {
  console.log(`   R2 URL: Cannot generate (missing configuration)`);
}

console.log('\n🎯 Analysis:');

if (!bucket) {
  console.log('❌ R2_BUCKET not configured - uploads will use local storage');
} else if (!publicBase) {
  console.log('❌ R2_PUBLIC_BASE_URL not configured - R2 URLs cannot be generated');
} else {
  console.log('✅ R2 configuration appears complete');
  console.log('   If images are not showing, R2 uploads are likely failing');
}

console.log('\n🔧 Troubleshooting:');
console.log('1. Check server logs for R2 upload errors');
console.log('2. Test R2 connection manually');
console.log('3. Verify R2 bucket permissions');
console.log('4. Check if images exist in R2 dashboard');

// Check if local uploads directory exists
try {
  const uploadsDir = path.join(__dirname, 'uploads');
  const fs = await import('fs');
  const stats = fs.statSync(uploadsDir);
  console.log(`\n📁 Local uploads directory: ${uploadsDir} (exists)`);
} catch (error) {
  console.log(`\n📁 Local uploads directory: Not found or inaccessible`);
}

console.log('\n🚀 Next Steps:');
console.log('1. Upload a test image through admin panel');
console.log('2. Check server logs for detailed error messages');
console.log('3. Verify the returned URL in the response');
console.log('4. Test if the URL is accessible from browser');
