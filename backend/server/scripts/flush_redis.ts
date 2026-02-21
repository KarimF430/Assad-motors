
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { clearAllCache, getRedisClient } from '../middleware/redis-cache';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    console.log('🧹 Flushing Redis Cache...');

    // Wait for connection
    const redis = getRedisClient();
    if (!redis) {
        console.log('❌ Redis not configured/connected.');
        process.exit(1);
    }

    await clearAllCache();

    console.log('✅ Cache flushed successfully.');
    process.exit(0);
}

run();
