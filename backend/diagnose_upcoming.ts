
import mongoose from 'mongoose';
import { UpcomingCar } from './server/db/schemas';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

async function diagnose() {
    try {
        console.log('🔍 Starting Diagnosis...');

        // 1. Check MongoDB
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found');
        }

        console.log('\n--- MongoDB Check ---');
        await mongoose.connect(process.env.MONGODB_URI);
        const dbCount = await UpcomingCar.countDocuments();
        console.log(`Total Upcoming Cars in DB: ${dbCount}`);

        if (dbCount > 0) {
            const cars = await UpcomingCar.find().lean();
            cars.forEach(c => console.log(`- [${c.id}] ${c.name} (Brand: ${c.brandId}, Status: ${c.status})`));
        }
        await mongoose.disconnect();

        // 2. Check API
        console.log('\n--- API Check ---');
        const apiUrl = 'http://localhost:5001/api/upcoming-cars';
        console.log(`Fetching from: ${apiUrl}`);

        try {
            const response = await fetch(apiUrl);
            console.log(`Status: ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data)) {
                console.log(`API returned ${data.length} items`);
                data.forEach((c: any) => console.log(`- [API] ${c.name}`));
            } else {
                console.log('API returned non-array:', data);
            }
        } catch (apiError) {
            console.error('API Fetch failed:', apiError.message);
        }

        // 3. Check API with limit=all (Frontend uses this)
        console.log('\n--- API Check (limit=all) ---');
        const apiUrlLimit = 'http://localhost:5001/api/upcoming-cars?limit=all';
        console.log(`Fetching from: ${apiUrlLimit}`);

        try {
            const response = await fetch(apiUrlLimit);
            console.log(`Status: ${response.status}`);
            const data = await response.json();

            // Handle potential paginated response structure if that's what it returns
            const items = Array.isArray(data) ? data : (data.data || []);
            console.log(`API returned ${items.length} items`);
            items.forEach((c: any) => console.log(`- [API limit=all] ${c.name}`));
        } catch (apiError) {
            console.error('API Fetch (limit=all) failed:', apiError.message);
        }

    } catch (error) {
        console.error('Diagnosis failed:', error);
    }
}

diagnose();
