const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Brand Schema (simplified)
const brandSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  logo: { type: String, default: null },
  ranking: { type: Number, required: true },
  status: { type: String, default: 'active' },
  summary: { type: String, default: null },
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Brand = mongoose.model('Brand', brandSchema);

async function debugBrandCreation() {
  try {
    console.log('🔍 Debugging brand creation...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI;
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Check existing brands
    const existingBrands = await Brand.find().lean();
    console.log('📊 Existing brands:', existingBrands.length);
    existingBrands.forEach(brand => {
      console.log(`  - ${brand.name} (ID: ${brand.id}, Ranking: ${brand.ranking})`);
    });
    
    // Test brand data
    const testBrand = {
      name: "TestBrand",
      status: "active",
      summary: "A test brand for testing purposes."
    };
    
    console.log('\n🧪 Testing brand creation logic...');
    
    // Generate unique ID using brand name
    const slug = testBrand.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
    
    console.log('📝 Generated slug:', slug);
    
    // Create unique ID with slug
    const baseId = `brand-${slug}`;
    let uniqueId = baseId;
    let counter = 1;
    
    // Check for existing IDs and make it unique
    while (await Brand.findOne({ id: uniqueId })) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }
    
    console.log('🆔 Generated unique ID:', uniqueId);
    
    // Auto-assign ranking (find next available ranking)
    const existingBrandsForRanking = await Brand.find().select('ranking').sort({ ranking: 1 }).lean();
    const takenRankings = existingBrandsForRanking.map(b => b.ranking);
    let nextRanking = 1;
    while (takenRankings.includes(nextRanking)) {
      nextRanking++;
    }
    
    console.log('🏆 Assigned ranking:', nextRanking);
    console.log('📋 Taken rankings:', takenRankings);
    
    // Create the brand
    const newBrand = new Brand({
      id: uniqueId,
      ...testBrand,
      ranking: nextRanking,
      createdAt: new Date()
    });
    
    console.log('\n💾 Attempting to save brand...');
    console.log('📄 Brand data:', JSON.stringify(newBrand.toObject(), null, 2));
    
    await newBrand.save();
    console.log('✅ Brand created successfully!');
    
    // Verify creation
    const createdBrand = await Brand.findOne({ id: uniqueId }).lean();
    console.log('🔍 Verification - Created brand:', createdBrand);
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error('📋 Error details:');
    console.error('  - Message:', error.message);
    console.error('  - Code:', error.code);
    console.error('  - Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

debugBrandCreation();
