import mongoose from 'mongoose';

/**
 * Price History Schema
 * Tracks price changes for variants over time
 * TTL: 90 days (automatic cleanup)
 */

const priceHistorySchema = new mongoose.Schema({
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant',
        required: true,
        index: true
    },
    modelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model',
        required: true,
        index: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    variantName: {
        type: String,
        required: true
    },
    modelName: {
        type: String,
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    previousPrice: {
        type: Number,
        required: true
    },
    newPrice: {
        type: Number,
        required: true
    },
    priceChange: {
        type: Number,
        required: true  // Negative for drops, positive for increases
    },
    priceChangePercent: {
        type: Number,
        required: true
    },
    changedAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// TTL index - automatically delete records older than 90 days
priceHistorySchema.index({ changedAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Compound index for efficient queries
priceHistorySchema.index({ variantId: 1, changedAt: -1 });
priceHistorySchema.index({ modelId: 1, changedAt: -1 });

export const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);
