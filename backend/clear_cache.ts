import { clearAllCache } from './server/middleware/redis-cache';
import * as dotenv from 'dotenv';

dotenv.config();

async function clearCache() {
    try {
        console.log('🗑️  Clearing ALL Redis cache...');

        // Clear entire Redis database
        await clearAllCache();

        console.log('✅ Cache cleared successfully!');
        console.log('');
        console.log('Please refresh the browser/admin panel now.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to clear cache:', error);
        process.exit(1);
    }
}

clearCache();
