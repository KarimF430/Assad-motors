#!/usr/bin/env node

/**
 * CarWale Variants Import - Complete 178 Fields
 * Imports 1196 variants with all specifications from CarWale
 */

const { generateCompleteCarWaleDataset } = require('./generate-carwale-complete.js');

const baseUrl = 'http://localhost:5001/api';

async function importCarWaleVariants(token) {
  console.log('🚀 CarWale Variants Import - 1196 variants with 178 fields\n');
  
  try {
    // Generate the complete dataset
    const { variants } = generateCompleteCarWaleDataset();
    console.log(`📊 Generated ${variants.length} variants with complete specifications\n`);
    
    // Get brand and model mappings
    console.log('🔍 Fetching brand and model mappings...');
    
    const brandsResponse = await fetch(`${baseUrl}/brands`);
    const brands = await brandsResponse.json();
    const brandMap = {};
    brands.forEach(brand => {
      brandMap[brand.name] = brand.id;
    });
    
    const modelsResponse = await fetch(`${baseUrl}/models`);
    const models = await modelsResponse.json();
    const modelMap = {};
    models.forEach(model => {
      const key = `${model.brandId}-${model.name}`;
      modelMap[key] = model.id;
    });
    
    console.log(`✅ Found ${brands.length} brands and ${models.length} models\n`);
    
    // Map variants to proper IDs
    console.log('🔗 Mapping variants to brand and model IDs...');
    
    const variantsWithIds = variants.map(variant => {
      const brandId = brandMap[variant.brandName];
      const modelKey = `${brandId}-${variant.modelName}`;
      const modelId = modelMap[modelKey];
      
      if (!brandId || !modelId) {
        console.warn(`⚠️ Missing mapping for variant: ${variant.name} (${variant.brandName} ${variant.modelName})`);
        return null;
      }
      
      return {
        ...variant,
        brandId: brandId,
        modelId: modelId
      };
    }).filter(v => v !== null);
    
    console.log(`✅ Successfully mapped ${variantsWithIds.length} variants\n`);
    
    // Import variants in batches
    console.log('📦 Starting variant import in batches...\n');
    
    const batchSize = 25; // Smaller batches for variants due to large data size
    let totalImported = 0;
    let totalErrors = 0;
    
    for (let i = 0; i < variantsWithIds.length; i += batchSize) {
      const batch = variantsWithIds.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(variantsWithIds.length / batchSize);
      
      console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} variants)...`);
      
      try {
        const response = await fetch(`${baseUrl}/bulk/variants`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ variants: batch })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        totalImported += result.summary.success;
        totalErrors += result.summary.errors;
        
        console.log(`   ✅ Batch ${batchNumber}: ${result.summary.success}/${batch.length} variants imported`);
        
        if (result.summary.errors > 0) {
          console.log(`   ⚠️ Batch ${batchNumber}: ${result.summary.errors} errors`);
        }
        
        // Wait between batches to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`   ❌ Batch ${batchNumber} failed:`, error.message);
        totalErrors += batch.length;
      }
    }
    
    // Final summary
    console.log('\n🎉 CarWale Variants Import Completed!\n');
    console.log('📊 Final Summary:');
    console.log(`   ✅ Total variants imported: ${totalImported}`);
    console.log(`   ❌ Total errors: ${totalErrors}`);
    console.log(`   📋 Success rate: ${((totalImported / variantsWithIds.length) * 100).toFixed(1)}%`);
    
    if (totalImported > 0) {
      console.log('\n🔍 Sample imported variant fields:');
      console.log('   • Basic: name, price, fuelType, transmission');
      console.log('   • Engine: displacement, power, torque, mileage');
      console.log('   • Dimensions: length, width, height, wheelbase');
      console.log('   • Safety: airbags, ABS, EBD, safety rating');
      console.log('   • Features: AC, touchscreen, connectivity');
      console.log('   • And 158+ more fields with complete specifications!');
    }
    
  } catch (error) {
    console.error('❌ Variant import failed:', error);
  }
}

// Verify import
async function verifyImport() {
  console.log('\n🔍 Verifying import...');
  
  try {
    const brandsResponse = await fetch(`${baseUrl}/brands`);
    const brands = await brandsResponse.json();
    
    const modelsResponse = await fetch(`${baseUrl}/models`);
    const models = await modelsResponse.json();
    
    const variantsResponse = await fetch(`${baseUrl}/variants`);
    const variants = await variantsResponse.json();
    
    console.log('\n📊 Current Database State:');
    console.log(`   📋 Brands: ${brands.length}`);
    console.log(`   📋 Models: ${models.length}`);
    console.log(`   📋 Variants: ${variants.length}`);
    
    if (variants.length > 0) {
      console.log('\n🔍 Sample variant data:');
      const sampleVariant = variants[0];
      console.log(`   • Name: ${sampleVariant.name}`);
      console.log(`   • Price: ₹${(sampleVariant.price / 100000).toFixed(2)} Lakh`);
      console.log(`   • Engine: ${sampleVariant.engine || 'N/A'}`);
      console.log(`   • Power: ${sampleVariant.power || 'N/A'}`);
      console.log(`   • Mileage: ${sampleVariant.mileage || 'N/A'}`);
      console.log(`   • Features: ${sampleVariant.features ? sampleVariant.features.length : 0} features`);
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

// Main execution
async function main() {
  const token = process.argv[2];
  
  if (!token) {
    console.log('❌ Authentication token required');
    console.log('\n📝 Usage:');
    console.log('node import-carwale-variants.js <auth-token>');
    return;
  }
  
  await importCarWaleVariants(token);
  await verifyImport();
}

if (require.main === module) {
  main();
}

module.exports = { importCarWaleVariants };
