
import mongoose from 'mongoose';
import { Review } from './server/db/schemas';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const calculateOverallRating = (starRatings: any): number => {
    if (!starRatings) return 0;
    const values = Object.values(starRatings).filter(val => typeof val === 'number') as number[];
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Number((sum / values.length).toFixed(1));
};

async function migrateReviews() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        console.log('📊 Fetching all reviews...');
        const reviews = await Review.find({});
        console.log(`found ${reviews.length} reviews`);

        let updatedCount = 0;

        for (const review of reviews) {
            const newRating = calculateOverallRating(review.starRatings);

            // Update if rating is different or 0/undefined
            // Force update if it's 0 to ensure it's set
            if (review.overallRating !== newRating || review.overallRating === 0) {
                review.overallRating = newRating;
                await review.save();
                updatedCount++;
                process.stdout.write('.');
            }
        }

        console.log(`\n✅ Migration completed. Updated ${updatedCount} reviews.`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateReviews();
