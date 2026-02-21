#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testUploadFlow() {
  const baseUrl = 'http://localhost:5001';
  
  console.log('🧪 Testing Upload Flow...\n');
  
  // Test 1: Check if backend is running
  console.log('1. Testing backend connectivity...');
  try {
    const response = await fetch(`${baseUrl}/api/brands`);
    if (response.ok) {
      console.log('✅ Backend is running on port 5001');
    } else {
      console.log('❌ Backend returned error:', response.status);
      return;
    }
  } catch (error) {
    console.log('❌ Backend not accessible:', error.message);
    return;
  }
  
  // Test 2: Check auth endpoint (should require token)
  console.log('\n2. Testing auth protection...');
  try {
    const response = await fetch(`${baseUrl}/api/uploads/presign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: 'test.png', contentType: 'image/png' })
    });
    const data = await response.json();
    
    if (response.status === 401 && data.code === 'NO_TOKEN') {
      console.log('✅ Auth protection working - requires token');
    } else {
      console.log('❌ Unexpected auth response:', response.status, data);
    }
  } catch (error) {
    console.log('❌ Auth test failed:', error.message);
  }
  
  // Test 3: Check R2 configuration
  console.log('\n3. Testing R2 configuration...');
  const r2Vars = [
    'R2_BUCKET',
    'R2_ACCOUNT_ID', 
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_ENDPOINT',
    'R2_PUBLIC_BASE_URL'
  ];
  
  // Load .env file
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.log('❌ Cannot read .env file');
    return;
  }
  
  const missingVars = [];
  r2Vars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length === 0) {
    console.log('✅ All R2 environment variables present');
  } else {
    console.log('❌ Missing R2 variables:', missingVars.join(', '));
  }
  
  // Test 4: Check brands have R2 URLs
  console.log('\n4. Testing R2 migration...');
  try {
    const response = await fetch(`${baseUrl}/api/brands`);
    const brands = await response.json();
    
    const r2Brands = brands.filter(b => b.logo && b.logo.includes('r2.cloudflarestorage.com'));
    const localBrands = brands.filter(b => b.logo && b.logo.startsWith('/uploads/'));
    
    console.log(`✅ ${r2Brands.length} brands using R2 URLs`);
    if (localBrands.length > 0) {
      console.log(`⚠️  ${localBrands.length} brands still using local URLs`);
    }
    
    // Show sample R2 URL
    if (r2Brands.length > 0) {
      console.log(`   Sample R2 URL: ${r2Brands[0].logo.substring(0, 80)}...`);
    }
  } catch (error) {
    console.log('❌ Brands test failed:', error.message);
  }
  
  // Test 5: Instructions for manual browser test
  console.log('\n5. Manual browser test required:');
  console.log('   📝 Go to http://localhost:5001');
  console.log('   📝 Log out and log back in');
  console.log('   📝 Check DevTools → Application → Local Storage for "token"');
  console.log('   📝 Try uploading an image');
  console.log('   📝 Check Network tab for successful requests');
  
  console.log('\n🎯 Backend is ready for testing!');
}

testUploadFlow().catch(console.error);
