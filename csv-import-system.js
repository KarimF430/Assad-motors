#!/usr/bin/env node

/**
 * CSV Import System for gadizone
 * Imports brands and models from user-provided CSV files
 * Ensures accurate, current, and duplicate-free data
 */

const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:5001/api';

// CSV Parser function
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }
  
  return data;
}

// Create semantic ID
function createSemanticId(type, name) {
  const slug = name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-')         // Replace spaces with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
  
  return `${type}-${slug}`;
}

// Import brands from CSV
async function importBrandsFromCSV(csvFilePath, token) {
  console.log('📋 Importing brands from CSV...\n');
  
  try {
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }
    
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const brandData = parseCSV(csvContent);
    
    console.log(`📊 Found ${brandData.length} brands in CSV`);
    
    // Process and validate brand data
    const processedBrands = brandData.map((row, index) => {
      // Auto-assign ranking based on CSV order (first row = rank 1)
      const ranking = index + 1;
      const name = row.name || row.brand_name || row.brandName;
      const summary = row.summary || row.description || `${name} is a leading automotive manufacturer known for quality vehicles and innovative technology.`;
      
      if (!name) {
        throw new Error(`Brand name missing in row ${index + 1}`);
      }
      
      return {
        name: name.trim(),
        ranking: ranking,
        summary: summary.trim(),
        status: 'active'
      };
    });
    
    // Remove duplicates based on name
    const uniqueBrands = [];
    const seenNames = new Set();
    
    for (const brand of processedBrands) {
      if (!seenNames.has(brand.name.toLowerCase())) {
        seenNames.add(brand.name.toLowerCase());
        uniqueBrands.push(brand);
      } else {
        console.log(`⚠️ Duplicate brand removed: ${brand.name}`);
      }
    }
    
    console.log(`✅ Processed ${uniqueBrands.length} unique brands`);
    
    // Import brands
    const response = await fetch(`${baseUrl}/bulk/brands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ brands: uniqueBrands })
    });
    
    const result = await response.json();
    console.log(`📊 Import result: ${result.summary.success}/${result.summary.total} brands imported`);
    
    if (result.summary.errors > 0) {
      console.log('❌ Errors:');
      result.results.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.brand}: ${r.error}`);
      });
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ Brand import failed:', error.message);
    throw error;
  }
}

// Import models from CSV
async function importModelsFromCSV(csvFilePath, token) {
  console.log('\n📋 Importing models from CSV...\n');
  
  try {
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }
    
    const csvContent = fs.readFileSync(csvFilePath, 'utf8');
    const modelData = parseCSV(csvContent);
    
    console.log(`📊 Found ${modelData.length} models in CSV`);
    
    // Get brand mapping
    const brandsResponse = await fetch(`${baseUrl}/brands`);
    const brands = await brandsResponse.json();
    const brandMap = {};
    
    brands.forEach(brand => {
      brandMap[brand.name.toLowerCase()] = brand.id;
    });
    
    console.log(`🔗 Found ${brands.length} brands for mapping`);
    
    // Process and validate model data
    const processedModels = [];
    const skippedModels = [];
    
    for (const [index, row] of modelData.entries()) {
      const brandName = (row.brand || row.brand_name || row.brandName || '').trim();
      const modelName = (row.model || row.model_name || row.modelName || row.name || '').trim();
      const bodyType = (row.body_type || row.bodyType || row.type || 'SUV').trim();
      const seating = parseInt(row.seating || row.seats || 5);
      const fuelTypes = (row.fuel_types || row.fuelTypes || row.fuel || 'petrol').split(',').map(f => f.trim().toLowerCase());
      const transmissions = (row.transmissions || row.transmission || 'manual,automatic').split(',').map(t => t.trim().toLowerCase());
      
      if (!brandName || !modelName) {
        console.log(`⚠️ Skipping row ${index + 1}: Missing brand or model name`);
        skippedModels.push({ row: index + 1, reason: 'Missing brand or model name' });
        continue;
      }
      
      const brandId = brandMap[brandName.toLowerCase()];
      if (!brandId) {
        console.log(`⚠️ Skipping ${modelName}: Brand "${brandName}" not found`);
        skippedModels.push({ row: index + 1, reason: `Brand "${brandName}" not found` });
        continue;
      }
      
      processedModels.push({
        brandName: brandName,
        brandId: brandId,
        name: modelName,
        bodyType: bodyType,
        seating: seating,
        fuelTypes: fuelTypes,
        transmissions: transmissions,
        description: `The ${brandName} ${modelName} is a ${bodyType.toLowerCase()} offering excellent performance and features.`,
        pros: 'Good build quality, reliable performance, modern features',
        cons: 'Could be more fuel efficient, premium pricing',
        summary: `Premium ${bodyType.toLowerCase()} with modern technology and reliable performance.`,
        status: 'active'
      });
    }
    
    // Remove duplicates based on brand + model name
    const uniqueModels = [];
    const seenModels = new Set();
    
    for (const model of processedModels) {
      const key = `${model.brandName.toLowerCase()}-${model.name.toLowerCase()}`;
      if (!seenModels.has(key)) {
        seenModels.add(key);
        uniqueModels.push(model);
      } else {
        console.log(`⚠️ Duplicate model removed: ${model.brandName} ${model.name}`);
      }
    }
    
    console.log(`✅ Processed ${uniqueModels.length} unique models`);
    console.log(`⚠️ Skipped ${skippedModels.length} invalid rows`);
    
    if (skippedModels.length > 0) {
      console.log('\n📋 Skipped rows:');
      skippedModels.forEach(skip => {
        console.log(`   Row ${skip.row}: ${skip.reason}`);
      });
    }
    
    // Import models in batches
    const batchSize = 50;
    let totalImported = 0;
    
    for (let i = 0; i < uniqueModels.length; i += batchSize) {
      const batch = uniqueModels.slice(i, i + batchSize);
      
      const response = await fetch(`${baseUrl}/bulk/models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ models: batch })
      });
      
      const result = await response.json();
      totalImported += result.summary.success;
      
      console.log(`📦 Batch ${Math.floor(i/batchSize) + 1}: ${result.summary.success}/${batch.length} models imported`);
      
      // Wait between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n✅ Total models imported: ${totalImported}/${uniqueModels.length}`);
    
    return { imported: totalImported, total: uniqueModels.length };
    
  } catch (error) {
    console.error('❌ Model import failed:', error.message);
    throw error;
  }
}

// Verify import
async function verifyImport() {
  console.log('\n🔍 Verifying import...\n');
  
  try {
    const brandsResponse = await fetch(`${baseUrl}/brands`);
    const brands = await brandsResponse.json();
    
    const modelsResponse = await fetch(`${baseUrl}/models`);
    const models = await modelsResponse.json();
    
    console.log('📊 Final Database State:');
    console.log(`   📋 Brands: ${brands.length}`);
    console.log(`   📋 Models: ${models.length}`);
    console.log(`   📋 Variants: 0 (ready for manual creation)`);
    
    if (brands.length > 0) {
      console.log('\n📋 Sample Brands:');
      brands.slice(0, 5).forEach(brand => {
        console.log(`   ${brand.ranking}. ${brand.name}`);
      });
    }
    
    if (models.length > 0) {
      console.log('\n📋 Sample Models:');
      models.slice(0, 5).forEach(model => {
        const brandName = brands.find(b => b.id === model.brandId)?.name || 'Unknown';
        console.log(`   ${brandName} ${model.name} (${model.bodyType})`);
      });
    }
    
    // Check for orphaned models
    const orphanedModels = models.filter(model => 
      !brands.find(brand => brand.id === model.brandId)
    );
    
    if (orphanedModels.length > 0) {
      console.log(`\n⚠️ Found ${orphanedModels.length} orphaned models (models without valid brand)`);
    } else {
      console.log('\n✅ All models have valid brand relationships');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 CSV Import System for gadizone\n');
  
  const token = process.argv[2];
  const brandsCSV = process.argv[3];
  const modelsCSV = process.argv[4];
  
  if (!token) {
    console.log('❌ Authentication token required');
    console.log('\n📝 Usage:');
    console.log('node csv-import-system.js <auth-token> <brands.csv> [models.csv]');
    console.log('📋 CSV Format Examples:');
    console.log('\nBrands CSV (ranking auto-assigned by order):');
    console.log('name,summary');
    console.log('Maruti Suzuki,"India\'s largest car manufacturer"');
    console.log('Hyundai,"Premium South Korean brand"');
    console.log('\nModels CSV:');
    console.log('brand,model,body_type,seating,fuel_types,transmissions');
    console.log('Maruti Suzuki,Swift,Hatchback,5,"petrol,cng","manual,automatic"');
    console.log('Hyundai,Creta,SUV,5,"petrol,diesel","manual,automatic"');
    return;
  }
  
  if (!brandsCSV) {
    console.log('❌ Brands CSV file path required');
    return;
  }
  
  try {
    // Import brands
    await importBrandsFromCSV(brandsCSV, token);
    
    // Import models if provided
    if (modelsCSV) {
      await importModelsFromCSV(modelsCSV, token);
    }
    
    // Verify final state
    await verifyImport();
    
    console.log('\n🎉 CSV import completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = { importBrandsFromCSV, importModelsFromCSV, verifyImport };
