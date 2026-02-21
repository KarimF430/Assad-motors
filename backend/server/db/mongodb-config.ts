import mongoose from 'mongoose';

/**
 * MongoDB Configuration for High-Performance (1M+ Daily Users)
 * 
 * This configuration optimizes MongoDB for:
 * - High read throughput
 * - Efficient querying
 * - Connection pooling
 * - Memory optimization
 * - Index optimization
 */

export const mongoConfig = {
  // OPTIMIZED: Connection pooling for high performance
  maxPoolSize: 200, // Increased from 100 for better concurrency
  minPoolSize: 20,  // Increased from 10 to keep more connections warm
  maxIdleTimeMS: 60000, // Increased from 30000 to keep connections alive longer
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,

  // Write Concern for Performance
  writeConcern: {
    w: 'majority' as const, // Use majority for Atlas reliability
    wtimeout: 5000 // Increased timeout
  },

  // Additional optimizations
  retryWrites: true, // Retry failed writes
  retryReads: true,  // Retry failed reads
  compressors: ['zlib' as const], // Compress network traffic
};

/**
 * Initialize MongoDB with optimized settings
 */
export async function initializeMongoDBOptimized(uri: string) {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', false);
    mongoose.set('autoIndex', false); // Don't build indexes on every connection
    mongoose.set('bufferCommands', false); // Disable mongoose buffering

    // Connect with optimized configuration
    await mongoose.connect(uri, mongoConfig);

    console.log('✅ MongoDB connected with high-performance configuration');

    // Setup connection event handlers
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Monitor connection pool
    mongoose.connection.on('connectionPoolCreated', () => {
      console.log('🏊 MongoDB connection pool created');
    });

    mongoose.connection.on('connectionPoolClosed', () => {
      console.log('🏊 MongoDB connection pool closed');
    });

    // Build indexes in background for production
    if (process.env.NODE_ENV === 'production') {
      await buildIndexesInBackground();
    }

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Build indexes in background for production
 */
async function buildIndexesInBackground() {
  try {
    console.log('🔨 Building indexes in background...');

    const db = mongoose.connection.db;

    // Build indexes for each collection
    await Promise.all([
      buildBrandIndexes(db),
      buildModelIndexes(db),
      buildVariantIndexes(db),
      buildAdminUserIndexes(db),
      buildPopularComparisonIndexes(db)
    ]);

    console.log('✅ All indexes built successfully');
  } catch (error) {
    console.error('❌ Error building indexes:', error);
  }
}

async function buildBrandIndexes(db: any) {
  const collection = db.collection('brands');
  await collection.createIndexes([
    { key: { id: 1 }, unique: true, background: true },
    { key: { status: 1, ranking: 1 }, background: true },
    { key: { name: 1 }, background: true },
    { key: { name: 'text', summary: 'text' }, background: true }
  ]);
}

async function buildModelIndexes(db: any) {
  const collection = db.collection('models');
  await collection.createIndexes([
    { key: { id: 1 }, unique: true, background: true },
    { key: { brandId: 1, status: 1 }, background: true },
    { key: { name: 1 }, background: true },
    { key: { isPopular: 1, popularRank: 1 }, background: true },
    { key: { isNew: 1, newRank: 1 }, background: true },
    { key: { bodyType: 1, status: 1 }, background: true },
    { key: { name: 'text', description: 'text' }, background: true }
  ]);
}

async function buildVariantIndexes(db: any) {
  const collection = db.collection('variants');
  await collection.createIndexes([
    { key: { id: 1 }, unique: true, background: true },
    { key: { modelId: 1, brandId: 1, status: 1 }, background: true },
    { key: { brandId: 1, status: 1, price: 1 }, background: true },
    { key: { price: 1, fuelType: 1, transmission: 1 }, background: true },
    { key: { isValueForMoney: 1, status: 1 }, background: true },
    { key: { fuelType: 1, status: 1 }, background: true },
    { key: { transmission: 1, status: 1 }, background: true },
    { key: { createdAt: -1 }, background: true },
    { key: { price: 1, status: 1 }, background: true },
    { key: { name: 'text', description: 'text' }, background: true }
  ]);
}

async function buildAdminUserIndexes(db: any) {
  const collection = db.collection('adminusers');
  await collection.createIndexes([
    { key: { email: 1 }, unique: true, background: true },
    { key: { id: 1 }, unique: true, background: true },
    { key: { isActive: 1 }, background: true }
  ]);
}

async function buildPopularComparisonIndexes(db: any) {
  const collection = db.collection('popularcomparisons');
  await collection.createIndexes([
    { key: { id: 1 }, unique: true, background: true },
    { key: { isActive: 1, order: 1 }, background: true },
    { key: { model1Id: 1, model2Id: 1 }, background: true }
  ]);
}

/**
 * Caching Configuration for High Performance
 */
export const cacheConfig = {
  // Redis configuration for caching
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: 0,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableOfflineQueue: false,
    lazyConnect: true,
  },

  // Cache TTL settings (in seconds)
  ttl: {
    brands: 3600, // 1 hour
    models: 1800, // 30 minutes
    variants: 900, // 15 minutes
    popularComparisons: 7200, // 2 hours
    stats: 300, // 5 minutes
  }
};

/**
 * Performance Monitoring Configuration
 */
export const performanceConfig = {
  // Enable slow query logging
  slowQueryThreshold: 100, // Log queries taking more than 100ms

  // Connection monitoring
  monitorConnections: true,

  // Query profiling
  enableProfiling: process.env.NODE_ENV === 'development',

  // Metrics collection
  collectMetrics: true,
};

/**
 * Database Optimization Tips for 1M+ Daily Users:
 * 
 * 1. **Indexing Strategy**:
 *    - Create compound indexes for common query patterns
 *    - Use partial indexes for filtered queries
 *    - Monitor index usage and remove unused indexes
 * 
 * 2. **Connection Pooling**:
 *    - Use connection pooling to reduce connection overhead
 *    - Set appropriate pool sizes based on server capacity
 *    - Monitor connection pool metrics
 * 
 * 3. **Read Replicas**:
 *    - Use read replicas to distribute read load
 *    - Configure read preference to use secondaries
 *    - Implement read/write splitting in application
 * 
 * 4. **Caching**:
 *    - Implement Redis caching for frequently accessed data
 *    - Use application-level caching for computed results
 *    - Cache database query results with appropriate TTL
 * 
 * 5. **Sharding** (for extreme scale):
 *    - Shard by brandId for even distribution
 *    - Use range-based sharding for time-series data
 *    - Monitor shard balance and performance
 * 
 * 6. **Query Optimization**:
 *    - Use projection to limit returned fields
 *    - Implement pagination for large result sets
 *    - Use aggregation pipeline for complex queries
 * 
 * 7. **Monitoring**:
 *    - Monitor query performance and slow queries
 *    - Track connection pool usage
 *    - Set up alerts for performance degradation
 */
