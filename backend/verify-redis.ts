
import 'dotenv/config';
import Redis from 'ioredis';
import { getRedisClient, getRedisStatus, closeRedisConnection } from './server/config/redis-config';

// Helper to mask passwords in URLs
function maskUrl(url: string | undefined): string {
    if (!url) return 'undefined';
    try {
        // If it's a simple host or not a full URL, just return it (or part of it)
        if (!url.includes('://')) return url;

        // Attempt to mask password in redis://user:password@host:port
        return url.replace(/(:[^:@]+)@/, ':****@');
    } catch (e) {
        return 'Error masking URL';
    }
}

async function verifyRedis() {
    console.log('🔍 Starting Redis Deep Analysis...');
    console.log('-----------------------------------');

    // 1. Check Environment Variables
    console.log('1. Configuration Check:');
    console.log('   REDIS_URL:', maskUrl(process.env.REDIS_URL));
    console.log('   REDIS_FAILOVER_ENABLED:', process.env.REDIS_FAILOVER_ENABLED);
    console.log('   REDIS_BACKUP_URL:', maskUrl(process.env.REDIS_BACKUP_URL));
    console.log('   REDIS_HOST:', process.env.REDIS_HOST || 'Not set');
    console.log('-----------------------------------');

    try {
        // 2. Initialize Connection
        console.log('2. Connecting to Redis...');

        // Trigger initialization
        getRedisClient();

        // Poll for client to be initialized
        let client = getRedisClient();
        let attempts = 0;
        while (!client && attempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 500));
            client = getRedisClient();
            attempts++;
            if (!client) console.log('   Waiting for initialization...');
        }

        if (!client) {
            console.error('❌ Failed to initialize Redis client after waiting. Check configuration.');
            process.exit(1);
        }

        // Wait for connection to be ready via status check
        console.log('   Client initialized, waiting for connection...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        const status = getRedisStatus();
        console.log('   Connection Status:', status);

        if (!status.isReady) {
            console.error('❌ Redis is NOT ready.');
            // Wait a bit more just in case
            await new Promise(resolve => setTimeout(resolve, 3000));
            console.log('   Retrying Status:', getRedisStatus());
        }

        if (getRedisStatus().isReady) {
            console.log('✅ Redis Connected Successfully');
        } else {
            console.error('❌ Redis Connection Timed Out or Failed');
        }

        // 3. Operational Check
        if (getRedisStatus().isReady) {
            console.log('-----------------------------------');
            console.log('3. Operational Logic Check (SET/GET)...');
            const testKey = 'redis_deep_analysis_test_key';
            const testValue = 'working_perfectly_' + Date.now();

            console.log(`   Setting key: ${testKey} = ${testValue}`);
            await client.set(testKey, testValue, 'EX', 60); // Expire in 60s

            console.log('   Getting key...');
            const value = await client.get(testKey);

            if (value === testValue) {
                console.log('✅ Operation Successful: Retrieved value matches set value.');
            } else {
                console.error(`❌ Operation Failed: Expected ${testValue}, got ${value}`);
            }

            // 4. Replication Info (Config dependent)
            console.log('-----------------------------------');
            console.log('4. Replication/Server Info...');
            try {
                const info = await client.info('replication');
                console.log('   Replication Info:');
                // Filter intended lines to avoid spam
                const lines = info.split('\n').filter(l => l.includes('role') || l.includes('connected_slaves') || l.includes('master_repl_offset'));
                lines.forEach(l => console.log('   ' + l.trim()));
            } catch (e) {
                console.warn('   Could not retrieve replication info (might be restricted).');
            }

            // 5. Check Backup Connectivity Independently
            if (process.env.REDIS_FAILOVER_ENABLED === 'true' && process.env.REDIS_BACKUP_URL) {
                console.log('-----------------------------------');
                console.log('5. Verifying Backup Redis Connectivity (Independent Check)...');

                try {
                    console.log('   Connecting to Backup...');
                    const backupOptions: any = {
                        retryStrategy: () => null, // Don't retry heavily for this check
                        tls: process.env.REDIS_BACKUP_URL.startsWith('rediss') ? { rejectUnauthorized: false } : undefined
                    };

                    // Using a separate client just for this check
                    const tempBackup = new Redis(process.env.REDIS_BACKUP_URL, backupOptions);

                    await new Promise((resolve, reject) => {
                        tempBackup.once('ready', () => {
                            console.log('✅ Backup Redis is Reachable and Ready.');
                            tempBackup.quit();
                            resolve(null);
                        });
                        tempBackup.once('error', (err: any) => {
                            console.error('❌ Backup Redis Connection Failed:', err.message);
                            tempBackup.disconnect();
                            resolve(null); // Don't crash main script
                        });
                        // Timeout protection
                        setTimeout(() => {
                            if (tempBackup.status !== 'ready') {
                                console.error('❌ Backup Redis Connection Timed Out');
                                tempBackup.disconnect();
                                resolve(null);
                            }
                        }, 5000);
                    });

                } catch (err: any) {
                    console.error('❌ Backup Check Error:', err.message);
                }
            }
        }

    } catch (error) {
        console.error('❌ An error occurred during verification:', error);
    } finally {
        // 5. Cleanup
        console.log('-----------------------------------');
        console.log('5. Cleaning up...');
        await closeRedisConnection();
        console.log('Analysis Complete.');
        process.exit(0);
    }
}

verifyRedis();
