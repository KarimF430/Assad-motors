#!/usr/bin/env node

/**
 * R2 Status Checker
 * Quickly diagnose R2 configuration and upload issues
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 R2 STATUS CHECKER\n');

// Check environment variables
console.log('📋 Environment Variables:');
const r2Config = {
  bucket: process.env.R2_BUCKET,
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  endpoint: process.env.R2_ENDPOINT,
  publicBaseUrl: process.env.R2_PUBLIC_BASE_URL,
  region: process.env.R2_REGION
};

console.log(`   R2_BUCKET: ${r2Config.bucket || '❌ NOT SET'}`);
console.log(`   R2_ACCOUNT_ID: ${r2Config.accountId || '❌ NOT SET'}`);
console.log(`   R2_ACCESS_KEY_ID: ${r2Config.accessKeyId ? '✅ SET' : '❌ NOT SET'}`);
console.log(`   R2_SECRET_ACCESS_KEY: ${r2Config.secretAccessKey ? '✅ SET' : '❌ NOT SET'}`);
console.log(`   R2_ENDPOINT: ${r2Config.endpoint || '❌ NOT SET (will be auto-generated)'}`);
console.log(`   R2_PUBLIC_BASE_URL: ${r2Config.publicBaseUrl || '❌ NOT SET'}`);
console.log(`   R2_REGION: ${r2Config.region || 'auto (default)'}`);

// Generate derived values (same logic as routes.ts)
const derivedEndpoint = r2Config.endpoint || (r2Config.accountId ? `https://${r2Config.accountId}.r2.cloudflarestorage.com` : undefined);
const derivedPublicBase = r2Config.publicBaseUrl || (derivedEndpoint && r2Config.bucket ? `${derivedEndpoint}/${r2Config.bucket}` : '');

console.log('\n🔧 Derived Configuration:');
console.log(`   Computed Endpoint: ${derivedEndpoint || '❌ CANNOT GENERATE'}`);
console.log(`   Computed Public Base: ${derivedPublicBase || '❌ CANNOT GENERATE'}`);

// Analyze configuration
console.log('\n🎯 Configuration Analysis:');

const issues = [];
const warnings = [];

if (!r2Config.bucket) {
  issues.push('R2_BUCKET is not set');
}

if (!r2Config.accountId) {
  issues.push('R2_ACCOUNT_ID is not set');
}

if (!r2Config.accessKeyId || !r2Config.secretAccessKey) {
  issues.push('R2 credentials (ACCESS_KEY_ID/SECRET_ACCESS_KEY) are not set');
}

if (!r2Config.publicBaseUrl && !derivedPublicBase) {
  issues.push('R2_PUBLIC_BASE_URL cannot be determined');
}

if (!derivedEndpoint) {
  issues.push('R2 endpoint cannot be determined');
}

if (r2Config.publicBaseUrl && !r2Config.publicBaseUrl.startsWith('https://')) {
  warnings.push('R2_PUBLIC_BASE_URL should start with https://');
}

// Report results
if (issues.length === 0) {
  console.log('✅ R2 configuration appears complete');
  
  // Simulate URL generation
  console.log('\n🔗 Sample URL Generation:');
  const sampleKey = 'uploads/images/202511/uuid-sample-image.webp';
  const sampleR2Url = `${derivedPublicBase}/${sampleKey}`;
  const sampleLocalUrl = '/uploads/sample-image.webp';
  
  console.log(`   R2 URL: ${sampleR2Url}`);
  console.log(`   Local fallback: ${sampleLocalUrl}`);
  
  console.log('\n🧪 Next Steps:');
  console.log('1. Upload a test image through admin panel');
  console.log('2. Check server logs for upload success/failure');
  console.log('3. Verify the returned URL matches R2 URL pattern above');
  console.log('4. Test the URL directly in browser');
  
} else {
  console.log('❌ R2 configuration issues found:');
  issues.forEach(issue => console.log(`   • ${issue}`));
  
  console.log('\n🛠️ Required Actions:');
  console.log('1. Set missing environment variables');
  console.log('2. Restart the server');
  console.log('3. Test upload again');
}

if (warnings.length > 0) {
  console.log('\n⚠️  Configuration warnings:');
  warnings.forEach(warning => console.log(`   • ${warning}`));
}

// Show what upload behavior to expect
console.log('\n📊 Expected Upload Behavior:');
if (issues.length === 0) {
  console.log('✅ R2 uploads should succeed');
  console.log('✅ Images should return R2 URLs');
  console.log('✅ Images should persist across deployments');
} else {
  console.log('❌ R2 uploads will fail');
  console.log('❌ Images will use local URLs');
  console.log('❌ Images will be lost on deployment/restart');
  console.log('❌ Frontend will show broken images');
}

console.log('\n🔍 To check current upload behavior:');
console.log('1. Upload an image and check the JSON response');
console.log('2. Look for "url" field in response:');
console.log('   - R2 URL: https://pub-a4a4bb84fc2d41cba103f4e2a8b5d185.r2.dev/...');
console.log('   - Local URL: /uploads/filename.webp (❌ PROBLEM)');
console.log('3. Check server logs for detailed error messages');
