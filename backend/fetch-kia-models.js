const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const modelSchema = new mongoose.Schema({}, { strict: false, collection: 'models' });
const Model = mongoose.model('Model', modelSchema);

async function fetchKiaModels() {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB\n');

        const kiaModels = await Model.find({ brandId: 'brand-kia' })
            .select('id name headerSeo summary description pros cons')
            .lean();

        console.log(`========== KIA MODELS (${kiaModels.length} found) ==========\n`);

        kiaModels.forEach((model, index) => {
            console.log(`${index + 1}. Model Name: ${model.name}`);
            console.log(`   Model ID: ${model.id}`);
            console.log(`   Header SEO: ${model.headerSeo ? 'EXISTS (' + model.headerSeo.length + ' chars)' : 'MISSING'}`);
            console.log(`   Summary: ${model.summary ? 'EXISTS (' + model.summary.length + ' chars)' : 'MISSING'}`);
            console.log(`   Description: ${model.description ? 'EXISTS (' + model.description.length + ' chars)' : 'MISSING'}`);
            console.log(`   Pros: ${model.pros ? 'EXISTS' : 'MISSING'}`);
            console.log(`   Cons: ${model.cons ? 'EXISTS' : 'MISSING'}`);
            console.log('   ---\n');
        });

        console.log(`========== SUMMARY ==========`);
        console.log(`Total Kia Models: ${kiaModels.length}\n`);
        console.log(`Model slugs for update scripts:`);
        kiaModels.forEach(model => {
            const slug = model.id.replace('model-brand-kia-', '');
            console.log(`  - ${model.name}: ${slug}`);
        });

        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

fetchKiaModels();
