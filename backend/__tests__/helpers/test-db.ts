import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer | null = null

/**
 * Connect to in-memory MongoDB for testing
 */
export async function connectTestDB(): Promise<void> {
    // Close any existing connections
    await mongoose.disconnect()

    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()

    await mongoose.connect(mongoUri)
}

/**
 * Disconnect and stop MongoDB
 */
export async function disconnectTestDB(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect()
    }

    if (mongoServer) {
        await mongoServer.stop()
        mongoServer = null
    }
}

/**
 * Clear all collections in the database
 */
export async function clearTestDB(): Promise<void> {
    if (mongoose.connection.readyState === 0) {
        return
    }

    const collections = mongoose.connection.collections

    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany({})
    }
}

/**
 * Seed test database with sample data
 */
export async function seedTestDB() {
    // Add seed data as needed for tests
    // For now, this is a placeholder
    return {
        brands: [],
        models: [],
        variants: [],
    }
}
