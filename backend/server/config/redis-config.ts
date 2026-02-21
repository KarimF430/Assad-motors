import Redis from 'ioredis';

/**
 * Redis Failover Configuration
 * Supports primary + backup Redis with automatic failover
 * When primary fails, automatically switches to backup Redis
 */

// Redis client instances
let primaryClient: Redis | null = null;
let backupClient: Redis | null = null;
let activeClient: Redis | null = null;
let isUsingBackup = false;
let isConnecting = false;
let healthCheckInterval: NodeJS.Timeout | null = null;

const MAX_CONNECTION_ATTEMPTS = 3;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
const FAILOVER_ENABLED = process.env.REDIS_FAILOVER_ENABLED === 'true';

/**
 * Common Redis options
 */
function getCommonOptions(label: string) {
    return {
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
        lazyConnect: true,
        showFriendlyErrorStack: true,
        keepAlive: 30000,
        family: 4,
        enableAutoPipelining: true, // Batch multiple commands automatically
        commandTimeout: 5000,       // 5 seconds timeout for commands
        connectTimeout: 10000,      // 10 seconds timeout for connection
        retryStrategy: (times: number) => {
            if (times > MAX_CONNECTION_ATTEMPTS) {
                console.error(`❌ ${label} Redis failed after ${MAX_CONNECTION_ATTEMPTS} attempts`);
                return null;
            }
            return Math.min(times * 100, 3000);
        },
        reconnectOnError: (err: Error) => {
            const retryErrors = ['READONLY', 'ECONNRESET', 'ETIMEDOUT', 'EPIPE'];
            return retryErrors.some(e => err.message.includes(e));
        },
    };
}

/**
 * Get TLS options if enabled
 */
function getTlsOptions() {
    return process.env.REDIS_TLS === 'true' ? {
        tls: { rejectUnauthorized: false, minVersion: 'TLSv1.2' as const }
    } : {};
}

/**
 * Create Redis client from URL
 */
function createClientFromUrl(url: string, label: string): Redis | null {
    try {
        const client = new Redis(url, {
            ...getCommonOptions(label),
            ...getTlsOptions(),
        });

        client.on('connect', () => console.log(`🔌 ${label} Redis connecting...`));
        client.on('ready', () => console.log(`✅ ${label} Redis ready`));
        client.on('error', (err) => console.warn(`⚠️ ${label} Redis error:`, err.message));
        client.on('close', () => console.log(`🔌 ${label} Redis closed`));

        return client;
    } catch (error) {
        console.error(`❌ Failed to create ${label} Redis:`, error);
        return null;
    }
}

/**
 * Initialize Redis with failover support
 */
async function initializeRedis(): Promise<Redis | null> {
    const primaryUrl = process.env.REDIS_URL;
    const backupUrl = process.env.REDIS_BACKUP_URL;
    const hasHost = !!process.env.REDIS_HOST;

    // No Redis configured
    if (!primaryUrl && !hasHost) {
        console.log('ℹ️  Redis not configured. Running without Redis.');
        return null;
    }

    // Create primary client
    if (primaryUrl) {
        primaryClient = createClientFromUrl(primaryUrl, 'PRIMARY');
    } else if (hasHost) {
        // Legacy host-based config
        primaryClient = new Redis({
            host: process.env.REDIS_HOST!,
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD,
            ...getCommonOptions('PRIMARY'),
            ...getTlsOptions(),
        });
    }

    // Create backup client if failover enabled
    if (FAILOVER_ENABLED && backupUrl) {
        backupClient = createClientFromUrl(backupUrl, 'BACKUP');
        console.log('🔄 Redis failover: ENABLED');
    }

    // Try connecting to primary first
    if (primaryClient) {
        try {
            await primaryClient.connect();
            activeClient = primaryClient;
            isUsingBackup = false;
            console.log('✅ Using PRIMARY Redis');

            // Start health check if failover enabled
            if (FAILOVER_ENABLED && backupClient) {
                startHealthCheck();
            }

            return activeClient;
        } catch (err) {
            console.error('❌ Primary Redis connection failed:', (err as Error).message);

            // Try backup if available
            if (backupClient) {
                return await switchToBackup();
            }
        }
    }

    return null;
}

/**
 * Switch to backup Redis
 */
async function switchToBackup(): Promise<Redis | null> {
    if (!backupClient || isUsingBackup) return activeClient;

    console.log('🔄 Switching to BACKUP Redis...');

    try {
        if (backupClient.status !== 'ready') {
            await backupClient.connect();
        }
        activeClient = backupClient;
        isUsingBackup = true;
        console.log('✅ Now using BACKUP Redis');
        return activeClient;
    } catch (err) {
        console.error('❌ Backup Redis also failed:', (err as Error).message);
        return null;
    }
}

/**
 * Switch back to primary Redis
 */
async function switchToPrimary(): Promise<Redis | null> {
    if (!primaryClient || !isUsingBackup) return activeClient;

    console.log('🔄 Attempting to switch back to PRIMARY Redis...');

    try {
        if (primaryClient.status !== 'ready') {
            await primaryClient.connect();
        }
        activeClient = primaryClient;
        isUsingBackup = false;
        console.log('✅ Restored to PRIMARY Redis');
        return activeClient;
    } catch (err) {
        console.log('⚠️ Primary still unavailable, staying on BACKUP');
        return activeClient;
    }
}

/**
 * Health check - monitors primary and switches if needed
 */
function startHealthCheck() {
    if (healthCheckInterval) return;

    console.log(`⏰ Redis health check started (every ${HEALTH_CHECK_INTERVAL / 1000}s)`);

    healthCheckInterval = setInterval(async () => {
        try {
            // Check current active client
            if (activeClient) {
                const pong = await activeClient.ping();
                if (pong !== 'PONG') throw new Error('Ping failed');
            }

            // If using backup, try to restore primary
            if (isUsingBackup && primaryClient) {
                try {
                    const primaryPong = await primaryClient.ping();
                    if (primaryPong === 'PONG') {
                        await switchToPrimary();
                    }
                } catch {
                    // Primary still down, stay on backup
                }
            }
        } catch (err) {
            console.warn('⚠️ Active Redis health check failed:', (err as Error).message);

            // Active client failed - try failover
            if (isUsingBackup) {
                // Backup failed, try primary
                await switchToPrimary();
            } else {
                // Primary failed, try backup
                await switchToBackup();
            }
        }
    }, HEALTH_CHECK_INTERVAL);
}

/**
 * Get Redis client instance (singleton with failover)
 */
export function getRedisClient(): Redis | null {
    if (!activeClient && !isConnecting) {
        isConnecting = true;
        initializeRedis()
            .then(client => {
                activeClient = client;
                isConnecting = false;
            })
            .catch(err => {
                console.error('Redis init error:', err);
                isConnecting = false;
            });
    }
    return activeClient;
}

/**
 * Check if Redis is connected and ready
 */
export function isRedisReady(): boolean {
    return activeClient?.status === 'ready';
}

/**
 * Get current Redis status
 */
export function getRedisStatus() {
    return {
        active: isUsingBackup ? 'backup' : 'primary',
        primaryStatus: primaryClient?.status || 'not-configured',
        backupStatus: backupClient?.status || 'not-configured',
        failoverEnabled: FAILOVER_ENABLED,
        isReady: activeClient?.status === 'ready',
    };
}

/**
 * Gracefully close Redis connections
 */
export async function closeRedisConnection(): Promise<void> {
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
        healthCheckInterval = null;
    }

    const closeClient = async (client: Redis | null, label: string) => {
        if (client) {
            try {
                await client.quit();
                console.log(`✅ ${label} Redis closed`);
            } catch {
                client.disconnect();
            }
        }
    };

    await closeClient(primaryClient, 'PRIMARY');
    await closeClient(backupClient, 'BACKUP');

    primaryClient = null;
    backupClient = null;
    activeClient = null;
    isConnecting = false;
}

/**
 * Get Redis client for session store
 */
export function getSessionRedisClient(): Redis | null {
    return getRedisClient();
}

/**
 * Get Redis client for caching
 */
export function getCacheRedisClient(): Redis | null {
    return getRedisClient();
}

// Export the singleton instance getter as default
export default getRedisClient;

/**
 * Explicitly connect to Redis and wait for completion
 */
export async function connectRedis(): Promise<Redis | null> {
    if (activeClient) return activeClient;
    if (isConnecting) {
        // Wait for existing connection attempt
        return new Promise((resolve) => {
            const check = setInterval(() => {
                if (!isConnecting) {
                    clearInterval(check);
                    resolve(activeClient);
                }
            }, 100);
        });
    }

    isConnecting = true;
    try {
        const client = await initializeRedis();
        activeClient = client;
        isConnecting = false;
        return client;
    } catch (err) {
        console.error('Redis init error:', err);
        isConnecting = false;
        return null;
    }
}
