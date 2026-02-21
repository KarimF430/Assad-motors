require('dotenv').config();
const mongoose = require('mongoose');

async function testDelete() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Get the Variant model
    const Variant = mongoose.model('Variant', new mongoose.Schema({}, { strict: false }));
    
    // Find the variant
    const variantId = 'variant-brand-hyundai-model-brand-hyundai-venue-s';
    console.log(`\n🔍 Looking for variant: ${variantId}`);
    
    const variant = await Variant.findOne({ id: variantId });
    if (!variant) {
      console.log('❌ Variant not found');
      process.exit(1);
    }
    
    console.log('✅ Found variant:', {
      id: variant.id,
      name: variant.name,
      _id: variant._id
    });
    
    // Try to delete
    console.log('\n🗑️ Attempting to delete...');
    const result = await Variant.deleteOne({ id: variantId });
    
    console.log('📊 Delete result:', {
      deletedCount: result.deletedCount,
      acknowledged: result.acknowledged
    });
    
    if (result.deletedCount > 0) {
      console.log('✅ DELETE SUCCESSFUL!');
      
      // Verify it's gone
      const check = await Variant.findOne({ id: variantId });
      if (check) {
        console.log('⚠️ WARNING: Variant still exists after delete!');
      } else {
        console.log('✅ Verified: Variant is gone from database');
      }
    } else {
      console.log('❌ DELETE FAILED: No documents deleted');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

testDelete();
