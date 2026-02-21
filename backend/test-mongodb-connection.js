#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function testConnection() {
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }
  
  // Mask password in URI for logging
  const maskedUri = mongoUri.replace(/:[^:@]+@/, ':****@');
  console.log('🔍 Testing MongoDB connection...');
  console.log('📍 URI:', maskedUri);
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Host:', mongoose.connection.host);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).join(', ') || 'none');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('   Error:', error.message);
    if (error.code) console.error('   Code:', error.code);
    if (error.codeName) console.error('   Code Name:', error.codeName);
    process.exit(1);
  }
}

testConnection();
