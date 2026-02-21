require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkVariants() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db();
    const count = await db.collection('variants').countDocuments();
    console.log(`\n📊 Total variants in database: ${count}`);
    
    const sample = await db.collection('variants').find({})
      .limit(10)
      .project({ name: 1, modelId: 1, price: 1, fuel: 1, transmission: 1 })
      .toArray();
    
    console.log('\n📋 Sample variants:');
    sample.forEach((v, i) => {
      console.log(`  ${i+1}. ${v.name} - Model: ${v.modelId} - ₹${v.price}`);
    });
    
    // Group by modelId
    const pipeline = [
      { $group: { _id: '$modelId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ];
    const byModel = await db.collection('variants').aggregate(pipeline).toArray();
    
    console.log('\n📊 Variants by Model:');
    byModel.forEach(m => {
      console.log(`  ${m._id}: ${m.count} variants`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkVariants();
