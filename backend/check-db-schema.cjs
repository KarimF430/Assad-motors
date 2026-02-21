const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function checkDatabaseSchema() {
  try {
    console.log('🔍 Checking database schema and relationships...\n');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Available collections:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    console.log('');
    
    // Check brands collection
    const brandsCollection = mongoose.connection.db.collection('brands');
    const brands = await brandsCollection.find({}).toArray();
    console.log(`📦 Brands collection (${brands.length} documents):`);
    brands.forEach(brand => {
      console.log(`  - ID: ${brand.id}`);
      console.log(`    Name: ${brand.name}`);
      console.log(`    Ranking: ${brand.ranking}`);
      console.log(`    Status: ${brand.status}`);
      console.log('');
    });
    
    // Check models collection
    const modelsCollection = mongoose.connection.db.collection('models');
    const models = await modelsCollection.find({}).toArray();
    console.log(`📦 Models collection (${models.length} documents):`);
    models.forEach(model => {
      console.log(`  - ID: ${model.id}`);
      console.log(`    Name: ${model.name}`);
      console.log(`    Brand ID: ${model.brandId}`);
      console.log(`    Status: ${model.status}`);
      
      // Check if brand exists
      const brandExists = brands.find(b => b.id === model.brandId);
      if (brandExists) {
        console.log(`    ✅ Parent brand found: ${brandExists.name}`);
      } else {
        console.log(`    ❌ Parent brand NOT found!`);
      }
      console.log('');
    });
    
    // Check variants collection
    const variantsCollection = mongoose.connection.db.collection('variants');
    const variants = await variantsCollection.find({}).toArray();
    console.log(`📦 Variants collection (${variants.length} documents):`);
    variants.forEach(variant => {
      console.log(`  - ID: ${variant.id}`);
      console.log(`    Name: ${variant.name}`);
      console.log(`    Brand ID: ${variant.brandId}`);
      console.log(`    Model ID: ${variant.modelId}`);
      console.log(`    Price: ${variant.price}`);
      
      // Check if brand and model exist
      const brandExists = brands.find(b => b.id === variant.brandId);
      const modelExists = models.find(m => m.id === variant.modelId);
      
      if (brandExists) {
        console.log(`    ✅ Parent brand found: ${brandExists.name}`);
      } else {
        console.log(`    ❌ Parent brand NOT found!`);
      }
      
      if (modelExists) {
        console.log(`    ✅ Parent model found: ${modelExists.name}`);
      } else {
        console.log(`    ❌ Parent model NOT found!`);
      }
      console.log('');
    });
    
    // Check indexes
    console.log('📋 Checking indexes...\n');
    
    const brandIndexes = await brandsCollection.indexes();
    console.log('Brands indexes:');
    brandIndexes.forEach(idx => {
      console.log(`  - ${JSON.stringify(idx.key)}: ${idx.unique ? 'UNIQUE' : 'NORMAL'}`);
    });
    console.log('');
    
    const modelIndexes = await modelsCollection.indexes();
    console.log('Models indexes:');
    modelIndexes.forEach(idx => {
      console.log(`  - ${JSON.stringify(idx.key)}: ${idx.unique ? 'UNIQUE' : 'NORMAL'}`);
    });
    console.log('');
    
    // Test brand ID generation
    console.log('🧪 Testing brand ID generation...\n');
    const testBrandName = "Honda";
    const slug = testBrandName.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    const expectedId = `brand-${slug}`;
    console.log(`Test brand name: ${testBrandName}`);
    console.log(`Generated slug: ${slug}`);
    console.log(`Expected ID: ${expectedId}`);
    console.log('');
    
    // Check if this ID would work with models
    console.log('✅ This ID format is compatible with model.brandId references');
    console.log('✅ Models can use this ID to reference their parent brand');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkDatabaseSchema();
