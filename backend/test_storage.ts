import mongoose from 'mongoose';
import { UpcomingCar } from './server/db/schemas';
import { MongoDBStorage } from './server/db/mongodb-storage';
import * as dotenv from 'dotenv';

dotenv.config();

async function testStorage() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);

        const storage = new MongoDBStorage();

        console.log('\n--- Test 1: storage.getUpcomingCars() ---');
        const cars1 = await storage.getUpcomingCars();
        console.log('Result:', cars1.length, 'cars');
        cars1.forEach(c => console.log(`- ${c.name}`));

        console.log('\n--- Test 2: storage.getUpcomingCars(undefined) ---');
        const cars2 = await storage.getUpcomingCars(undefined);
        console.log('Result:', cars2.length, 'cars');
        cars2.forEach(c => console.log(`- ${c.name}`));

        console.log('\n--- Test 3: storage.getUpcomingCars("all") ---');
        const cars3 = await storage.getUpcomingCars("all" as any);
        console.log('Result:', cars3.length, 'cars');
        cars3.forEach(c => console.log(`- ${c.name}`));

        await mongoose.disconnect();

    } catch (error) {
        console.error('Error:', error);
    }
}

testStorage();
