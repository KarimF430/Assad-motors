/**
 * Test script for MongoDB Backup Sync
 * Run: npx tsx test-backup-sync.ts
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function testBackup() {
    console.log('\n🧪 MongoDB Backup Sync Test\n');
    console.log('='.repeat(50));

    const primaryUri = process.env.MONGODB_URI;
    const backupUri = process.env.MONGODB_BACKUP_URI;

    if (!primaryUri) {
        console.error('❌ MONGODB_URI not configured');
        process.exit(1);
    }

    if (!backupUri) {
        console.error('❌ MONGODB_BACKUP_URI not configured');
        process.exit(1);
    }

    console.log('✓ Primary URI:', primaryUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    console.log('✓ Backup URI:', backupUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    console.log('='.repeat(50) + '\n');

    try {
        // Connect to primary DB
        console.log('🔌 Connecting to PRIMARY MongoDB...');
        await mongoose.connect(primaryUri);
        const primaryDb = mongoose.connection.db;
        if (!primaryDb) throw new Error('Primary DB connection failed');
        console.log('✅ Connected to PRIMARY MongoDB\n');

        // Connect to backup DB
        console.log('🔌 Connecting to BACKUP MongoDB...');
        const backupConnection = mongoose.createConnection(backupUri);
        await new Promise<void>((resolve, reject) => {
            backupConnection.once('open', resolve);
            backupConnection.once('error', reject);
        });
        const backupDb = backupConnection.db;
        if (!backupDb) throw new Error('Backup DB connection failed');
        console.log('✅ Connected to BACKUP MongoDB\n');

        // Collections to sync
        const collections = ['brands', 'models', 'variants', 'upcomingcars', 'popularcomparisons', 'news'];

        console.log('🔄 Starting sync...\n');
        console.log('Collection'.padEnd(25) + 'Primary'.padEnd(12) + 'Backup'.padEnd(12) + 'Status');
        console.log('-'.repeat(60));

        for (const collName of collections) {
            const primaryCount = await primaryDb.collection(collName).countDocuments();

            if (primaryCount === 0) {
                console.log(collName.padEnd(25) + '0'.padEnd(12) + 'skipped'.padEnd(12) + '⏭️  Empty');
                continue;
            }

            // Sync data
            const documents = await primaryDb.collection(collName).find({}).toArray();
            await backupDb.collection(collName).deleteMany({});
            await backupDb.collection(collName).insertMany(documents);

            const backupCount = await backupDb.collection(collName).countDocuments();
            console.log(
                collName.padEnd(25) +
                primaryCount.toString().padEnd(12) +
                backupCount.toString().padEnd(12) +
                (primaryCount === backupCount ? '✅ Synced' : '⚠️  Mismatch')
            );
        }

        console.log('-'.repeat(60));
        console.log('\n✅ Backup sync completed successfully!\n');

        await backupConnection.close();
        await mongoose.disconnect();

    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

testBackup();
