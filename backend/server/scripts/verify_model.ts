
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Model } from '../db/schemas';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI not found');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);

        // Find a popular model
        const model = await Model.findOne({ name: { $regex: /Nexon/i } });

        if (!model) {
            console.log('❌ Tata Nexon not found, trying any model...');
            const anyModel = await Model.findOne();
            if (anyModel) printModel(anyModel);
        } else {
            printModel(model);
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

function printModel(model: any) {
    console.log('\n🔍 VERIFICATION RESULTS FOR:', model.name);
    console.log('----------------------------------------');
    console.log('📝 SUMMARY:');
    console.log(model.summary);
    console.log('\n📝 DESCRIPTION:');
    console.log(model.description ? model.description.substring(0, 300) + '...' : 'N/A');
    console.log('\n📝 INTERIOR COMFORT:');
    console.log(model.comfortConvenience ? model.comfortConvenience.substring(0, 300) + '...' : 'N/A');
}

run();
