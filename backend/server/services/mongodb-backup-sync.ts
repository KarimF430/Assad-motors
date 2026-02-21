import mongoose, { Connection } from 'mongoose';
import cron from 'node-cron';

/**
 * MongoDB Backup Sync Service
 * Syncs data from primary MongoDB to backup MongoDB daily
 */

interface BackupStatus {
    lastSyncTime: Date | null;
    lastSyncStatus: 'success' | 'failed' | 'in-progress' | 'never';
    lastError?: string;
    documentsCopied?: {
        brands: number;
        models: number;
        variants: number;
        upcomingCars: number;
        popularComparisons: number;
        adminUsers: number;
        news: number;
    };
}

class MongoDBBackupSync {
    private primaryUri: string;
    private backupUri: string | null;
    private isEnabled: boolean;
    private backupConnection: Connection | null = null;
    private cronJob: cron.ScheduledTask | null = null;
    private status: BackupStatus = {
        lastSyncTime: null,
        lastSyncStatus: 'never',
    };

    // Collection names to sync (must match actual MongoDB collection names)
    private collectionsToSync = [
        'brands',
        'models',
        'variants',
        'upcomingcars',
        'popularcomparisons',
        'adminusers',
        'users',
        // News-related collections
        'newsarticles',
        'newstags',
        'newscategories',
        'newsauthors',
        'newsmedias',
        // AI/Analytics collections
        'aiinteractions',
        'learnedpatterns',
        'useractivities',
        'pricehistories',
        'reviews',
        'reviewcomments',
    ];

    constructor() {
        this.primaryUri = process.env.MONGODB_URI || '';
        this.backupUri = process.env.MONGODB_BACKUP_URI || null;
        this.isEnabled = process.env.BACKUP_SYNC_ENABLED === 'true' && !!this.backupUri;
    }

    /**
     * Initialize the backup sync service
     */
    async initialize(): Promise<void> {
        if (!this.isEnabled) {
            console.log('📦 MongoDB Backup Sync: DISABLED (set BACKUP_SYNC_ENABLED=true and MONGODB_BACKUP_URI)');
            return;
        }

        if (!this.backupUri) {
            console.log('⚠️  MongoDB Backup Sync: MONGODB_BACKUP_URI not configured');
            return;
        }

        console.log('📦 MongoDB Backup Sync: ENABLED');
        console.log('⏰ Daily backup scheduled at 12:00 AM IST (00:00)');

        // Start daily cron job at 12:00 AM IST (18:30 UTC previous day)
        // IST is UTC+5:30, so 00:00 IST = 18:30 UTC previous day
        this.cronJob = cron.schedule('30 18 * * *', async () => {
            console.log('🔄 Starting scheduled daily backup sync...');
            await this.syncToBackup();
        }, {
            timezone: 'UTC'
        });

        console.log('✅ MongoDB Backup Sync service initialized');
    }

    /**
     * Connect to backup MongoDB
     */
    private async connectToBackup(): Promise<Connection> {
        if (this.backupConnection && this.backupConnection.readyState === 1) {
            return this.backupConnection;
        }

        if (!this.backupUri) {
            throw new Error('MONGODB_BACKUP_URI not configured');
        }

        console.log('🔌 Connecting to backup MongoDB...');
        this.backupConnection = mongoose.createConnection(this.backupUri);

        await new Promise<void>((resolve, reject) => {
            this.backupConnection!.once('open', () => {
                console.log('✅ Connected to backup MongoDB');
                resolve();
            });
            this.backupConnection!.once('error', (err) => {
                console.error('❌ Failed to connect to backup MongoDB:', err);
                reject(err);
            });
        });

        return this.backupConnection;
    }

    /**
     * Sync all data to backup MongoDB
     */
    async syncToBackup(): Promise<BackupStatus> {
        if (!this.backupUri) {
            this.status = {
                lastSyncTime: new Date(),
                lastSyncStatus: 'failed',
                lastError: 'MONGODB_BACKUP_URI not configured',
            };
            return this.status;
        }

        this.status = {
            lastSyncTime: new Date(),
            lastSyncStatus: 'in-progress',
        };

        console.log('🔄 Starting backup sync to secondary MongoDB...');
        const startTime = Date.now();

        try {
            // Get backup connection
            const backupConn = await this.connectToBackup();

            // Get primary connection (default mongoose connection)
            const primaryDb = mongoose.connection.db;
            if (!primaryDb) {
                throw new Error('Primary MongoDB not connected');
            }

            const backupDb = backupConn.db;
            if (!backupDb) {
                throw new Error('Backup MongoDB not connected');
            }

            const documentsCopied: BackupStatus['documentsCopied'] = {
                brands: 0,
                models: 0,
                variants: 0,
                upcomingCars: 0,
                popularComparisons: 0,
                adminUsers: 0,
                news: 0,
            };

            // Sync each collection
            for (const collectionName of this.collectionsToSync) {
                try {
                    console.log(`  📄 Syncing ${collectionName}...`);

                    // Get all documents from primary
                    const documents = await primaryDb.collection(collectionName).find({}).toArray();

                    if (documents.length === 0) {
                        console.log(`     ⏭️  Skipping ${collectionName} (empty)`);
                        continue;
                    }

                    // Clear backup collection
                    await backupDb.collection(collectionName).deleteMany({});

                    // Insert all documents into backup
                    await backupDb.collection(collectionName).insertMany(documents);

                    console.log(`     ✅ Synced ${documents.length} documents`);

                    // Track counts for known collections
                    if (collectionName === 'brands') documentsCopied.brands = documents.length;
                    if (collectionName === 'models') documentsCopied.models = documents.length;
                    if (collectionName === 'variants') documentsCopied.variants = documents.length;
                    if (collectionName === 'upcomingcars') documentsCopied.upcomingCars = documents.length;
                    if (collectionName === 'popularcomparisons') documentsCopied.popularComparisons = documents.length;
                    if (collectionName === 'adminusers') documentsCopied.adminUsers = documents.length;
                    if (collectionName === 'news') documentsCopied.news = documents.length;
                } catch (collectionError) {
                    console.error(`     ❌ Failed to sync ${collectionName}:`, collectionError);
                }
            }

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`✅ Backup sync completed in ${duration}s`);

            this.status = {
                lastSyncTime: new Date(),
                lastSyncStatus: 'success',
                documentsCopied,
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ Backup sync failed:', errorMessage);

            this.status = {
                lastSyncTime: new Date(),
                lastSyncStatus: 'failed',
                lastError: errorMessage,
            };
        }

        return this.status;
    }

    /**
     * Get current backup status
     */
    getStatus(): BackupStatus {
        return this.status;
    }

    /**
     * Check if backup sync is enabled
     */
    isBackupEnabled(): boolean {
        return this.isEnabled;
    }

    /**
     * Stop the cron job
     */
    stop(): void {
        if (this.cronJob) {
            this.cronJob.stop();
            console.log('⏹️  MongoDB Backup Sync cron job stopped');
        }
        if (this.backupConnection) {
            this.backupConnection.close();
            console.log('🔌 Backup MongoDB connection closed');
        }
    }
}

// Singleton instance
export const mongoDBBackupSync = new MongoDBBackupSync();
