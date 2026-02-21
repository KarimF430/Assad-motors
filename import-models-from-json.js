#!/usr/bin/env node

/**
 * Import Models from JSON to Backend
 * 
 * Usage:
 * 1. Get model data from AI using MODEL_DATA_SCHEMA_FOR_AI.md
 * 2. Save as models_data.json
 * 3. Run: node import-models-from-json.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';
const AUTH_TOKEN = process.env.AUTH_TOKEN || ''; // Set your auth token here or in .env

// Read models data
const modelsDataPath = path.join(__dirname, 'models_data.json');

if (!fs.existsSync(modelsDataPath)) {
  console.error('❌ Error: models_data.json not found!');
  console.log('📝 Please create models_data.json with your model data');
  console.log('📚 Use MODEL_DATA_SCHEMA_FOR_AI.md as reference');
  process.exit(1);
}

let modelsData;
try {
  const fileContent = fs.readFileSync(modelsDataPath, 'utf8');
  modelsData = JSON.parse(fileContent);
} catch (error) {
  console.error('❌ Error reading models_data.json:', error.message);
  process.exit(1);
}

// Ensure it's an array
if (!Array.isArray(modelsData)) {
  modelsData = [modelsData];
}

console.log(`📊 Found ${modelsData.length} models to import\n`);

// Import function
async function importModel(modelData, index) {
  try {
    console.log(`\n[${index + 1}/${modelsData.length}] Importing: ${modelData.name} (${modelData.brandId})`);
    
    // Validate required fields
    if (!modelData.brandId || !modelData.name) {
      console.error('❌ Missing required fields: brandId or name');
      return { success: false, error: 'Missing required fields' };
    }

    // Make API request
    const response = await fetch(`${BACKEND_URL}/api/models`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(AUTH_TOKEN && { 'Authorization': `Bearer ${AUTH_TOKEN}` })
      },
      body: JSON.stringify(modelData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Failed: ${response.status} - ${errorText}`);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    console.log(`✅ Success: ${result.id || result._id}`);
    
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main import process
async function importAllModels() {
  console.log('🚀 Starting model import...');
  console.log(`📍 Backend URL: ${BACKEND_URL}`);
  console.log(`🔑 Auth Token: ${AUTH_TOKEN ? '✅ Set' : '❌ Not set'}\n`);

  const results = {
    total: modelsData.length,
    success: 0,
    failed: 0,
    errors: []
  };

  for (let i = 0; i < modelsData.length; i++) {
    const result = await importModel(modelsData[i], i);
    
    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push({
        model: modelsData[i].name,
        error: result.error
      });
    }

    // Add delay to avoid rate limiting
    if (i < modelsData.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Models: ${results.total}`);
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n❌ Failed Models:');
    results.errors.forEach(err => {
      console.log(`   - ${err.model}: ${err.error}`);
    });
  }
  
  console.log('='.repeat(60));
  
  // Save results to file
  const resultsPath = path.join(__dirname, 'import_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${resultsPath}`);
}

// Run import
importAllModels().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
