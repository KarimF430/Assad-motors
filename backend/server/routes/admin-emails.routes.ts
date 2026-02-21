import { Router } from 'express';
import { emailScheduler } from '../services/email-scheduler.service';
import { User } from '../db/schemas';

const router = Router();

/**
 * Admin routes for email management
 * TODO: Add authentication middleware to protect these routes
 */

/**
 * Manually trigger weekly digest for all users or specific user
 * POST /api/admin/emails/send-weekly-digest
 * Body: { userId?: string }
 */
router.post('/send-weekly-digest', async (req, res) => {
    try {
        const { userId } = req.body;

        if (userId) {
            // Send to specific user
            await emailScheduler.triggerWeeklyDigest(userId);
            res.json({
                success: true,
                message: `Weekly digest sent to user ${userId}`
            });
        } else {
            // Send to all users
            await emailScheduler.triggerWeeklyDigest();
            res.json({
                success: true,
                message: 'Weekly digest job triggered for all users'
            });
        }
    } catch (error: any) {
        console.error('Error sending weekly digest:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Send test email to a specific user
 * POST /api/admin/emails/test-email/:userId
 */
router.post('/test-email/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        await emailScheduler.triggerWeeklyDigest(userId);

        res.json({
            success: true,
            message: `Test email sent to user ${userId}`
        });
    } catch (error: any) {
        console.error('Error sending test email:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

/**
 * Get email scheduler status
 * GET /api/admin/emails/scheduler-status
 */
router.get('/scheduler-status', (req, res) => {
    const isEnabled = process.env.EMAIL_SCHEDULER_ENABLED === 'true';

    res.json({
        success: true,
        scheduler: {
            enabled: isEnabled,
            weeklyDigestCron: process.env.WEEKLY_DIGEST_CRON || '0 9 * * 1',
            priceCheckCron: process.env.PRICE_CHECK_CRON || '0 8 * * *',
            batchSize: parseInt(process.env.EMAIL_BATCH_SIZE || '50'),
            rateLimit: parseInt(process.env.EMAIL_RATE_LIMIT || '10')
        }
    });
});

/**
 * Get email statistics
 * GET /api/admin/emails/stats
 */
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const weeklyDigestEnabled = await User.countDocuments({
            'emailPreferences.weeklyDigest': true,
            'emailPreferences.unsubscribedAt': null
        });
        const newLaunchesEnabled = await User.countDocuments({
            'emailPreferences.newLaunches': true,
            'emailPreferences.unsubscribedAt': null
        });
        const priceDropsEnabled = await User.countDocuments({
            'emailPreferences.priceDrops': true,
            'emailPreferences.unsubscribedAt': null
        });
        const unsubscribed = await User.countDocuments({
            'emailPreferences.unsubscribedAt': { $ne: null }
        });

        res.json({
            success: true,
            stats: {
                totalUsers,
                emailPreferences: {
                    weeklyDigest: weeklyDigestEnabled,
                    newLaunches: newLaunchesEnabled,
                    priceDrops: priceDropsEnabled,
                    unsubscribed
                }
            }
        });
    } catch (error: any) {
        console.error('Error fetching email stats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
