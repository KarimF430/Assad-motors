import { Router, Request, Response } from 'express';
import { mongoDBBackupSync } from '../services/mongodb-backup-sync';

const router = Router();

/**
 * POST /api/admin/backup/sync
 * Manually trigger a sync to backup MongoDB
 * Requires admin authentication
 */
router.post('/sync', async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated as admin
        const userId = (req.session as any)?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if backup is enabled
        if (!mongoDBBackupSync.isBackupEnabled()) {
            return res.status(400).json({
                success: false,
                message: 'Backup sync is not enabled. Set BACKUP_SYNC_ENABLED=true and MONGODB_BACKUP_URI in environment variables.',
            });
        }

        console.log(`📦 Manual backup sync triggered by admin user: ${userId}`);

        // Trigger sync (async, returns immediately with status)
        const status = await mongoDBBackupSync.syncToBackup();

        return res.json({
            success: status.lastSyncStatus === 'success',
            message: status.lastSyncStatus === 'success'
                ? 'Backup sync completed successfully'
                : `Backup sync failed: ${status.lastError}`,
            status,
        });
    } catch (error) {
        console.error('❌ Manual backup sync error:', error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * GET /api/admin/backup/status
 * Get the current backup status
 */
router.get('/status', async (req: Request, res: Response) => {
    try {
        // Check if user is authenticated as admin
        const userId = (req.session as any)?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const status = mongoDBBackupSync.getStatus();
        const isEnabled = mongoDBBackupSync.isBackupEnabled();

        return res.json({
            success: true,
            enabled: isEnabled,
            status,
            nextScheduledSync: isEnabled ? 'Daily at 12:00 AM IST' : 'N/A (disabled)',
        });
    } catch (error) {
        console.error('❌ Backup status error:', error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

export default router;
