
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";

async function checkReviews() {
    try {
        console.log('Connecting to MongoDB...', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const reviewsCollection = mongoose.connection.collection('reviews');
        const count = await reviewsCollection.countDocuments();
        console.log(`Total reviews in DB: ${count}`);

        if (count > 0) {
            const reviews = await reviewsCollection.find({}).toArray();
            console.log('Sample review:', JSON.stringify(reviews[0], null, 2));
        } else {
            console.log('No reviews found in the "reviews" collection.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

checkReviews();
