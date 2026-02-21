import express, { Router } from 'express';
import { User } from '../db/schemas';

const router = Router();

/**
 * Export Users as CSV
 * GET /api/admin/users/export
 * 
 * Returns all FRONTEND users as downloadable CSV file
 * Note: This exports website visitors who registered, not admin users
 */
router.get('/export', async (req, res) => {
    try {
        // Fetch all frontend users from database
        const users = await User.find({}).sort({ createdAt: -1 }).lean();

        // CSV Header
        const csvHeader = 'ID,Email,First Name,Last Name,Phone,Date of Birth,Google ID,Active,Email Verified,Saved Cars Count,Created At,Last Login\n';

        // CSV Rows
        const csvRows = users.map(user => {
            return [
                user.id,
                user.email,
                user.firstName || '',
                user.lastName || '',
                user.phone || '',
                user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                user.googleId || '',
                user.isActive ? 'Yes' : 'No',
                user.isEmailVerified ? 'Yes' : 'No',
                user.savedCars?.length || 0,
                new Date(user.createdAt).toISOString(),
                user.lastLogin ? new Date(user.lastLogin).toISOString() : ''
            ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
        }).join('\n');

        const csv = csvHeader + csvRows;

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="users-${new Date().toISOString().split('T')[0]}.csv"`);
        res.status(200).send(csv);

        console.log(`✅ Admin exported ${users.length} users to CSV`);
    } catch (error) {
        console.error('CSV export error:', error);
        res.status(500).json({ message: 'Failed to export users' });
    }
});

/**
 * Get User Statistics
 * GET /api/admin/users/stats
 * Returns statistics about FRONTEND users (website visitors)
 */
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const activeUsers = await User.countDocuments({ isActive: true });
        const googleUsers = await User.countDocuments({ googleId: { $ne: null } });
        const emailUsers = await User.countDocuments({ password: { $ne: null } });
        const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

        // Users registered this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newThisMonth = await User.countDocuments({
            createdAt: { $gte: startOfMonth }
        });

        // Users logged in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const activeLastWeek = await User.countDocuments({
            lastLogin: { $gte: sevenDaysAgo }
        });

        res.json({
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            googleUsers,
            emailUsers,
            verifiedUsers,
            newThisMonth,
            activeLastWeek
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Failed to get statistics' });
    }
});

/**
 * Get Recent Users
 * GET /api/admin/users/recent?limit=10
 * Returns recent FRONTEND users (website visitors)
 */
router.get('/recent', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;

        const users = await User.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('-password')
            .lean();

        res.json({ users });
    } catch (error) {
        console.error('Recent users error:', error);
        res.status(500).json({ message: 'Failed to get recent users' });
    }
});

export default router;
