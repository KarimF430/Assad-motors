import { PriceHistory } from '../db/models/price-history.model';
import { emailScheduler } from './email-scheduler.service';
import { User } from '../db/schemas';

/**
 * Price Monitoring Service
 * Tracks price changes and sends alerts
 */

class PriceMonitoringService {
    /**
     * Record a price change in history
     */
    async recordPriceChange(variantData: {
        variantId: string;
        modelId: string;
        brandId: string;
        variantName: string;
        modelName: string;
        brandName: string;
        previousPrice: number;
        newPrice: number;
    }) {
        try {
            const priceChange = variantData.newPrice - variantData.previousPrice;
            const priceChangePercent = ((priceChange / variantData.previousPrice) * 100);

            const history = await PriceHistory.create({
                ...variantData,
                priceChange,
                priceChangePercent,
                changedAt: new Date()
            });

            console.log(`💰 Price change recorded: ${variantData.variantName} - ${priceChangePercent > 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%`);

            // If it's a significant price drop (>5%), send alerts
            if (priceChangePercent < -5) {
                await this.sendPriceDropAlerts(variantData, priceChangePercent);
            }

            return history;
        } catch (error) {
            console.error('Error recording price change:', error);
            throw error;
        }
    }

    /**
     * Send price drop alerts to interested users
     */
    private async sendPriceDropAlerts(variantData: any, priceChangePercent: number) {
        try {
            // Find users who have this variant saved or viewed recently
            // For now, send to all users with price drop alerts enabled
            const users = await User.find({
                'emailPreferences.priceDrops': true,
                'emailPreferences.unsubscribedAt': null
            }).select('email name');

            console.log(`📉 Sending price drop alerts for ${variantData.variantName} to ${users.length} users`);

            const savings = variantData.previousPrice - variantData.newPrice;

            for (const user of users) {
                try {
                    await emailScheduler.sendPriceDropAlert(user, {
                        name: variantData.variantName,
                        brand: variantData.brandName,
                        oldPrice: `₹${(variantData.previousPrice / 100000).toFixed(2)} Lakh`,
                        newPrice: `₹${(variantData.newPrice / 100000).toFixed(2)} Lakh`,
                        savings: `₹${(savings / 100000).toFixed(2)} Lakh`,
                        discount: `${Math.abs(priceChangePercent).toFixed(1)}%`,
                        url: `${process.env.FRONTEND_URL}/${variantData.brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${variantData.modelName.toLowerCase().replace(/\s+/g, '-')}`
                    });
                } catch (error) {
                    console.error(`Failed to send price drop alert to ${user.email}:`, error);
                }
            }

            console.log(`✅ Price drop alerts sent for ${variantData.variantName}`);
        } catch (error) {
            console.error('Error sending price drop alerts:', error);
        }
    }

    /**
     * Get price history for a variant
     */
    async getVariantPriceHistory(variantId: string, limit: number = 10) {
        try {
            return await PriceHistory.find({ variantId })
                .sort({ changedAt: -1 })
                .limit(limit);
        } catch (error) {
            console.error('Error fetching price history:', error);
            return [];
        }
    }

    /**
     * Get recent price drops across all variants
     */
    async getRecentPriceDrops(days: number = 7, limit: number = 20) {
        try {
            const since = new Date();
            since.setDate(since.getDate() - days);

            return await PriceHistory.find({
                changedAt: { $gte: since },
                priceChangePercent: { $lt: 0 }  // Only drops
            })
                .sort({ priceChangePercent: 1 })  // Biggest drops first
                .limit(limit);
        } catch (error) {
            console.error('Error fetching recent price drops:', error);
            return [];
        }
    }

    /**
     * Check for price drops (called by cron job)
     */
    async checkPriceDrops() {
        try {
            console.log('💰 Checking for price drops...');

            // Get recent price drops from last 24 hours
            const recentDrops = await this.getRecentPriceDrops(1, 50);

            console.log(`📊 Found ${recentDrops.length} price drops in last 24 hours`);

            // Price drop alerts are already sent when price changes are recorded
            // This is just for monitoring and logging

            return recentDrops;
        } catch (error) {
            console.error('Error checking price drops:', error);
            return [];
        }
    }
}

export const priceMonitoringService = new PriceMonitoringService();
