
import 'dotenv/config';
import Redis from 'ioredis';
import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { getRedisClient } from './server/config/redis-config';

const compress = promisify(gzip);
const decompress = promisify(gunzip);

async function testCompression() {
    console.log('🧪 Starting Redis Compression Test...');

    // Trigger initialization
    getRedisClient();

    // Poll for client
    let client = getRedisClient();
    let attempts = 0;
    while (!client && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        client = getRedisClient();
        attempts++;
    }

    if (!client) {
        console.error('❌ Redis client not initialized after waiting');
        return;
    }

    // Wait for connection ready state
    console.log('⏳ Waiting for Redis connection...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        // 1. Create large dummy data
        const largeData = {
            name: 'Test Dataset',
            items: Array.from({ length: 1000 }, (_, i) => ({
                id: i,
                title: `Item ${i}`,
                description: `This is a long description for item ${i} to generate some repetitive text that compresses well.`
            }))
        };

        const jsonStr = JSON.stringify(largeData);
        const originalSize = Buffer.byteLength(jsonStr);
        console.log(`📊 Original Data Size: ${(originalSize / 1024).toFixed(2)} KB`);

        // 2. Compress manually
        const compressedBuffer = await compress(Buffer.from(jsonStr));
        const compressedSize = compressedBuffer.length;
        console.log(`📊 Compressed Data Size: ${(compressedSize / 1024).toFixed(2)} KB`);
        console.log(`📉 Reduction: ${((1 - compressedSize / originalSize) * 100).toFixed(2)}%`);

        // 3. Store in Redis
        const key = 'test:compression:v1';
        await client.setex(key, 60, compressedBuffer);
        console.log(`💾 Stored compressed data in Redis key: ${key}`);

        // 4. Retrieve and Decompress
        const storedBuffer = await client.getBuffer(key);

        if (!storedBuffer) {
            throw new Error('Failed to retrieve buffer from Redis');
        }

        console.log(`📥 Retrieved buffer size: ${storedBuffer.length} bytes`);

        const decompressedBuffer = await decompress(storedBuffer);
        const decompressedJson = decompressedBuffer.toString();
        const decompressedData = JSON.parse(decompressedJson);

        // 5. Verify integrity
        if (decompressedData.items.length === 1000 && decompressedData.name === 'Test Dataset') {
            console.log('✅ Data integrity verified: Decompressed matches original.');
        } else {
            console.error('❌ Data integrity verify FAILED.');
        }

    } catch (err) {
        console.error('❌ Test failed:', err);
    } finally {
        process.exit(0);
    }
}

testCompression();
