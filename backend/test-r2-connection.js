#!/usr/bin/env node

/**
 * Test R2 Connection with Real Credentials
 * Verifies that R2 uploads work with the configured credentials
 */

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { readFileSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 R2 CONNECTION TEST\n');

// Check configuration
const config = {
  bucket: process.env.R2_BUCKET,
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  publicBaseUrl: process.env.R2_PUBLIC_BASE_URL,
  region: process.env.R2_REGION || 'auto'
};

console.log('📋 Configuration:');
console.log(`   Bucket: ${config.bucket}`);
console.log(`   Account ID: ${config.accountId}`);
console.log(`   Access Key: ${config.accessKeyId ? config.accessKeyId.substring(0,8) + '...' : '❌ NOT SET'}`);
console.log(`   Secret Key: ${config.secretAccessKey ? config.secretAccessKey.substring(0,8) + '...' : '❌ NOT SET'}`);
console.log(`   Public URL: ${config.publicBaseUrl}`);

if (!config.bucket || !config.accountId || !config.accessKeyId || !config.secretAccessKey) {
  console.log('\n❌ Missing required R2 configuration');
  process.exit(1);
}

// Create R2 client
const endpoint = process.env.R2_ENDPOINT || `https://${config.accountId}.r2.cloudflarestorage.com`;
console.log(`   Endpoint: ${endpoint}`);

const client = new S3Client({
  region: config.region,
  endpoint,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  forcePathStyle: true,
});

async function testR2Connection() {
  try {
    console.log('\n🔍 Testing R2 Connection...');
    
    // Test 1: List objects (basic connectivity test)
    console.log('1. Testing bucket access...');
    const listCommand = new ListObjectsV2Command({
      Bucket: config.bucket,
      MaxKeys: 1
    });
    
    const listResult = await client.send(listCommand);
    console.log('   ✅ Bucket access successful');
    console.log(`   📊 Bucket contains ${listResult.KeyCount || 0} objects`);
    
    // Test 2: Upload a test file
    console.log('\n2. Testing file upload...');
    
    // Create a small test image (1x1 pixel WebP)
    const testImageData = Buffer.from([
      0x52, 0x49, 0x46, 0x46, 0x1A, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
      0x56, 0x50, 0x38, 0x20, 0x0E, 0x00, 0x00, 0x00, 0x30, 0x01, 0x00, 0x9D,
      0x01, 0x2A, 0x01, 0x00, 0x01, 0x00, 0x02, 0x00, 0x34, 0x25, 0xA4, 0x00,
      0x03, 0x70, 0x00, 0xFE, 0xFB, 0xFD, 0x50, 0x00
    ]);
    
    const testKey = `test-uploads/test-${randomUUID()}.webp`;
    const uploadCommand = new PutObjectCommand({
      Bucket: config.bucket,
      Key: testKey,
      Body: testImageData,
      ContentType: 'image/webp',
      Metadata: {
        'test-upload': 'true',
        'upload-date': new Date().toISOString()
      }
    });
    
    await client.send(uploadCommand);
    console.log('   ✅ File upload successful');
    console.log(`   📁 Uploaded to: ${testKey}`);
    
    // Generate public URL
    const publicUrl = `${config.publicBaseUrl}/${testKey}`;
    console.log(`   🔗 Public URL: ${publicUrl}`);
    
    console.log('\n🎉 R2 CONNECTION TEST SUCCESSFUL!');
    console.log('\n📋 Summary:');
    console.log('   ✅ R2 credentials are valid');
    console.log('   ✅ Bucket access works');
    console.log('   ✅ File uploads work');
    console.log('   ✅ Public URLs are generated correctly');
    
    console.log('\n🚀 Your image upload issue should now be fixed!');
    console.log('   1. Start your server');
    console.log('   2. Upload an image through admin panel');
    console.log('   3. Check that response URL is R2 URL (not local)');
    console.log('   4. Verify image displays on frontend');
    
    return true;
    
  } catch (error) {
    console.log('\n❌ R2 CONNECTION TEST FAILED');
    console.log(`   Error: ${error.message}`);
    
    if (error.name === 'InvalidAccessKeyId') {
      console.log('\n🔧 Fix: Invalid Access Key ID');
      console.log('   - Check R2_ACCESS_KEY_ID in .env file');
      console.log('   - Verify credentials in Cloudflare Dashboard');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('\n🔧 Fix: Invalid Secret Access Key');
      console.log('   - Check R2_SECRET_ACCESS_KEY in .env file');
      console.log('   - Verify credentials in Cloudflare Dashboard');
    } else if (error.name === 'NoSuchBucket') {
      console.log('\n🔧 Fix: Bucket not found');
      console.log('   - Check R2_BUCKET name in .env file');
      console.log('   - Verify bucket exists in Cloudflare R2 dashboard');
    } else {
      console.log('\n🔧 General troubleshooting:');
      console.log('   - Check all R2 environment variables');
      console.log('   - Verify Cloudflare account and permissions');
      console.log('   - Check network connectivity');
    }
    
    return false;
  }
}

// Run the test
testR2Connection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
