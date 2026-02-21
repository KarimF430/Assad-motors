import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function checkBrandStatuses() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gadizone';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }

        // Count brands by status
        const allBrands = await db.collection('brands').find({}).toArray();
        const activeBrands = allBrands.filter(b => b.status === 'active');
        const inactiveBrands = allBrands.filter(b => b.status === 'inactive');
        const noStatus = allBrands.filter(b => !b.status);

        console.log('📊 Brand Status Summary:');
        console.log(`   Total Brands: ${allBrands.length}`);
        console.log(`   Active: ${activeBrands.length}`);
        console.log(`   Inactive: ${inactiveBrands.length}`);
        console.log(`   No Status: ${noStatus.length}\n`);

        if (inactiveBrands.length > 0) {
            console.log('🔴 Inactive Brands:');
            inactiveBrands.forEach((brand, index) => {
                console.log(`   ${index + 1}. ${brand.name} (${brand.id}) - status: ${brand.status}`);
            });
        }

        if (noStatus.length > 0) {
            console.log('\n⚠️  Brands without status field:');
            noStatus.forEach((brand, index) => {
                console.log(`   ${index + 1}. ${brand.name} (${brand.id})`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
    }
}

checkBrandStatuses();
