import cron from 'node-cron';
import { User } from '../db/schemas';
import { sendEmail, emailTemplates } from './email.service';
import { getPersonalizedRecommendations } from './recommendation.service';

/**
 * Email Scheduler Service
 * Handles automated email sending for:
 * - Weekly digests (Monday 9 AM)
 * - Price drop monitoring (Daily 8 AM)
 */

class EmailSchedulerService {
    private weeklyDigestJob: cron.ScheduledTask | null = null;
    private priceMonitorJob: cron.ScheduledTask | null = null;
    private isEnabled: boolean = false;

    /**
     * Initialize and start all cron jobs
     */
    start() {
        if (this.isEnabled) {
            console.log('⚠️ Email scheduler already running');
            return;
        }

        // Skip if explicitly disabled
        if (process.env.EMAIL_SCHEDULER_ENABLED === 'false') {
            console.log('📧 Email scheduler disabled via env var');
            return;
        }

        console.log('📧 Starting email scheduler...');

        try {
            // Weekly Digest - Every Monday at 9 AM (node-cron 5-field format)
            // Get from env, strip quotes and extra whitespace
            let weeklyDigestCron = (process.env.WEEKLY_DIGEST_CRON || '0 9 * * 1').trim().replace(/^["']|["']$/g, '');

            // Validate the expression
            if (!cron.validate(weeklyDigestCron)) {
                console.warn(`⚠️ Invalid WEEKLY_DIGEST_CRON expression: "${weeklyDigestCron}", using default`);
                weeklyDigestCron = '0 9 * * 1';
            }

            this.weeklyDigestJob = cron.schedule(weeklyDigestCron, async () => {
                console.log('📨 Running weekly digest job...');
                await this.sendWeeklyDigests();
            });

            // Price Drop Monitor - Daily at 8 AM
            let priceCheckCron = (process.env.PRICE_CHECK_CRON || '0 8 * * *').trim().replace(/^["']|["']$/g, '');

            if (!cron.validate(priceCheckCron)) {
                console.warn(`⚠️ Invalid PRICE_CHECK_CRON expression: "${priceCheckCron}", using default`);
                priceCheckCron = '0 8 * * *';
            }

            this.priceMonitorJob = cron.schedule(priceCheckCron, async () => {
                console.log('💰 Running price drop monitor...');
                await this.checkPriceDrops();
            });

            this.isEnabled = true;
            console.log('✅ Email scheduler started');
            console.log(`   - Weekly digest: ${weeklyDigestCron}`);
            console.log(`   - Price monitor: ${priceCheckCron}`);
        } catch (error: any) {
            console.error('❌ Failed to start email scheduler:', error.message);
            console.error('   Scheduler will not run. Check cron expressions in environment variables.');
            // Don't throw - let the server continue without the scheduler
        }
    }

    /**
     * Stop all cron jobs
     */
    stop() {
        if (!this.isEnabled) {
            console.log('⚠️ Email scheduler not running');
            return;
        }

        console.log('📧 Stopping email scheduler...');

        if (this.weeklyDigestJob) {
            this.weeklyDigestJob.stop();
            this.weeklyDigestJob = null;
        }

        if (this.priceMonitorJob) {
            this.priceMonitorJob.stop();
            this.priceMonitorJob = null;
        }

        this.isEnabled = false;
        console.log('✅ Email scheduler stopped');
    }

    /**
     * Send weekly digest emails to all opted-in users
     */
    async sendWeeklyDigests() {
        try {
            // Find users who want weekly digests
            const users = await User.find({
                'emailPreferences.weeklyDigest': true,
                'emailPreferences.unsubscribedAt': null,
                $or: [
                    { 'emailPreferences.frequency': 'weekly' },
                    { 'emailPreferences.frequency': { $exists: false } }
                ]
            }).select('email firstName emailPreferences carPreferences');

            console.log(`📬 Found ${users.length} users for weekly digest`);

            const batchSize = parseInt(process.env.EMAIL_BATCH_SIZE || '50');
            let sentCount = 0;
            let errorCount = 0;

            // Process in batches
            for (let i = 0; i < users.length; i += batchSize) {
                const batch = users.slice(i, i + batchSize);

                await Promise.all(batch.map(async (user) => {
                    try {
                        // Check if we should send based on last email sent
                        const lastSent = user.emailPreferences?.lastEmailSent;
                        if (lastSent) {
                            const daysSinceLastEmail = (Date.now() - lastSent.getTime()) / (1000 * 60 * 60 * 24);
                            if (daysSinceLastEmail < 7) {
                                console.log(`⏭️  Skipping ${user.email} - email sent ${daysSinceLastEmail.toFixed(1)} days ago`);
                                return;
                            }
                        }

                        // Get personalized recommendations
                        const recommendations = await this.getPersonalizedRecommendations(user);

                        if (recommendations.length === 0) {
                            console.log(`⏭️  Skipping ${user.email} - no recommendations`);
                            return;
                        }

                        // Send email using 3-arg signature
                        const userName = (user as any).firstName || 'Car Enthusiast';
                        await sendEmail(
                            user.email,
                            'weeklyDigest',
                            {
                                userName: userName,
                                recommendations: recommendations.slice(0, 5)
                            }
                        );

                        // Update last email sent
                        await User.updateOne(
                            { _id: user._id },
                            { 'emailPreferences.lastEmailSent': new Date() }
                        );

                        sentCount++;
                        console.log(`✅ Sent weekly digest to ${user.email}`);

                    } catch (error) {
                        errorCount++;
                        console.error(`❌ Failed to send weekly digest to ${user.email}:`, error);
                    }
                }));

                // Rate limiting between batches
                if (i + batchSize < users.length) {
                    const rateLimit = parseInt(process.env.EMAIL_RATE_LIMIT || '10');
                    const delayMs = (batchSize / rateLimit) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }

            console.log(`📊 Weekly digest complete: ${sentCount} sent, ${errorCount} errors`);

        } catch (error) {
            console.error('❌ Weekly digest job failed:', error);
        }
    }

    /**
   * Check for price drops and send alerts
   */
    async checkPriceDrops() {
        try {
            const { priceMonitoringService } = await import('./price-monitoring.service');
            await priceMonitoringService.checkPriceDrops();
        } catch (error) {
            console.error('❌ Price drop monitor failed:', error);
        }
    }

    /**
     * Get personalized recommendations for a user
     */
    private async getPersonalizedRecommendations(user: any) {
        try {
            // Use user preferences if available
            const preferences = user.carPreferences || {};

            // Get recommendations using user ID
            const userId = user._id?.toString() || user.id;
            const recommendations = await getPersonalizedRecommendations(userId);

            return recommendations.map((rec: any) => ({
                name: rec.name,
                brand: rec.brandName,
                price: `₹${(rec.price / 100000).toFixed(2)} Lakh`,
                image: rec.heroImage,
                url: `${process.env.FRONTEND_URL}/${rec.brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${rec.name.toLowerCase().replace(/\s+/g, '-')}`,
                matchReason: rec.matchReasons?.[0] || 'Recommended for you'
            }));

        } catch (error) {
            console.error('Error getting personalized recommendations:', error);
            return [];
        }
    }

    /**
     * Send new launch alert to relevant users
     */
    async sendNewLaunchAlert(model: any) {
        try {
            // Find users interested in this type of car
            const users = await User.find({
                'emailPreferences.newLaunches': true,
                'emailPreferences.unsubscribedAt': null,
                $or: [
                    { 'carPreferences.preferredBrands': model.brandName },
                    { 'carPreferences.preferredBodyTypes': model.bodyType },
                    { 'carPreferences.preferredBrands': { $exists: false } }
                ]
            }).select('email firstName');

            console.log(`🚀 Sending new launch alert for ${model.name} to ${users.length} users`);

            let sentCount = 0;
            const batchSize = parseInt(process.env.EMAIL_BATCH_SIZE || '50');

            for (let i = 0; i < users.length; i += batchSize) {
                const batch = users.slice(i, i + batchSize);

                await Promise.all(batch.map(async (user) => {
                    try {
                        const userName = (user as any).firstName || 'Car Enthusiast';
                        await sendEmail(
                            user.email,
                            'newLaunchAlert',
                            {
                                userName: userName,
                                name: model.name,
                                brand: model.brandName,
                                price: `₹${(model.startingPrice / 100000).toFixed(2)} Lakh`,
                                image: model.heroImage,
                                url: `${process.env.FRONTEND_URL}/${model.brandName.toLowerCase().replace(/\s+/g, '-')}-cars/${model.name.toLowerCase().replace(/\s+/g, '-')}`
                            }
                        );

                        sentCount++;
                        console.log(`✅ Sent new launch alert to ${user.email}`);

                    } catch (error) {
                        console.error(`❌ Failed to send new launch alert to ${user.email}:`, error);
                    }
                }));

                // Rate limiting
                if (i + batchSize < users.length) {
                    const rateLimit = parseInt(process.env.EMAIL_RATE_LIMIT || '10');
                    const delayMs = (batchSize / rateLimit) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }

            console.log(`📊 New launch alerts sent: ${sentCount}/${users.length}`);

        } catch (error) {
            console.error('❌ New launch alert failed:', error);
        }
    }

    /**
     * Send price drop alert to a user
     */
    async sendPriceDropAlert(user: any, carData: any) {
        try {
            const userName = user.firstName || user.name || 'Car Enthusiast';
            await sendEmail(
                user.email,
                'priceDropAlert',
                {
                    userName: userName,
                    ...carData
                }
            );

            console.log(`✅ Sent price drop alert to ${user.email} for ${carData.name}`);

        } catch (error) {
            console.error(`❌ Failed to send price drop alert to ${user.email}:`, error);
        }
    }

    /**
     * Manual trigger for testing (admin only)
     */
    async triggerWeeklyDigest(userId?: string) {
        console.log('🧪 Manually triggering weekly digest...');

        if (userId) {
            const user = await User.findById(userId).select('email firstName emailPreferences carPreferences');
            if (!user) {
                throw new Error('User not found');
            }

            const recommendations = await this.getPersonalizedRecommendations(user);

            const userName = (user as any).firstName || 'Car Enthusiast';
            await sendEmail(
                user.email,
                'weeklyDigest',
                {
                    userName: userName,
                    recommendations: recommendations.slice(0, 5)
                }
            );

            console.log(`✅ Test email sent to ${user.email}`);
        } else {
            await this.sendWeeklyDigests();
        }
    }
}

// Export singleton instance
export const emailScheduler = new EmailSchedulerService();
