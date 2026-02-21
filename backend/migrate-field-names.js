#!/usr/bin/env node

/**
 * Database Migration Script
 * Renames isNewModel field to isNew in all existing models
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function migrateFieldNames() {
  let client;
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    console.log('✅ Connected to MongoDB successfully');
    
    // Get models collection
    const modelsCollection = db.collection('models');
    
    // Count models with old field name
    const modelsWithOldField = await modelsCollection.countDocuments({ isNewModel: { $exists: true } });
    console.log(`📊 Found ${modelsWithOldField} models with old field name 'isNewModel'`);
    
    if (modelsWithOldField === 0) {
      console.log('✅ No migration needed. All models already use correct field names.');
      return;
    }
    
    console.log('🔄 Starting field name migration...');
    
    // Update all documents: rename isNewModel to isNew
    const result = await modelsCollection.updateMany(
      { isNewModel: { $exists: true } },
      { 
        $rename: { isNewModel: "isNew" }
      }
    );
    
    console.log(`✅ Migration completed successfully!`);
    console.log(`📊 Updated ${result.modifiedCount} models`);
    
    // Verify migration
    const modelsWithNewField = await modelsCollection.countDocuments({ isNew: { $exists: true } });
    const remainingOldField = await modelsCollection.countDocuments({ isNewModel: { $exists: true } });
    
    console.log('🔍 Migration verification:');
    console.log(`   - Models with 'isNew' field: ${modelsWithNewField}`);
    console.log(`   - Models with old 'isNewModel' field: ${remainingOldField}`);
    
    if (remainingOldField === 0) {
      console.log('🎉 Migration successful! All models now use correct field names.');
    } else {
      console.log('⚠️ Some models still have old field names. Manual intervention may be needed.');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔗 MongoDB connection closed');
    }
  }
}

// Run the migration
console.log('🚀 Starting database field name migration...');
console.log('📝 This will rename "isNewModel" to "isNew" in all model documents');
console.log('');

migrateFieldNames();
