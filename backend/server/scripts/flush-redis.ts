import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const backendEnv = path.resolve(__dirname, '../../.env');
dotenv.config({ path: backendEnv });

async function flushRedis() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    console.log('Connecting to Redis at:', redisUrl);

    const redis = new Redis(redisUrl);

    try {
        console.log('Flushing all Redis keys...');
        await redis.flushdb();
        console.log('✅ Redis FLUSHDB completed.');

        // Explicitly check if keys exist just in case
        const keys = await redis.keys('cache:*');
        console.log('Remaining cache keys:', keys.length);

    } catch (error) {
        console.error('Error flushing Redis:', error);
    } finally {
        redis.disconnect();
        console.log('Disconnected.');
    }
}

flushRedis();
