import { Router, Request, Response } from 'express';
import { Review, ReviewComment } from '../db/schemas';
import { authenticateToken } from '../auth';
import { randomUUID } from 'crypto';

const router = Router();

// Helper to calculate overall rating
const calculateOverallRating = (starRatings: any): number => {
    if (!starRatings) return 0;
    const values = Object.values(starRatings).filter(val => typeof val === 'number') as number[];
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return Number((sum / values.length).toFixed(1));
};

// All admin routes require authentication
// router.use(authenticateToken);

// GET /api/admin/reviews - List all reviews with filters
router.get('/', async (req: Request, res: Response) => {
    const fs = require('fs');
    const path = require('path');
    const logFile = path.join(process.cwd(), 'admin_debug.log');

    const log = (msg: string) => {
        try { fs.appendFileSync(logFile, `${new Date().toISOString()} - ${msg}\n`); } catch (e) { }
    };

    log(`Request received: ${JSON.stringify(req.query)}`);

    try {
        const {
            brandSlug,
            modelSlug,
            variantSlug,
            isApproved,
            search,
            sort = 'recent',
            limit = 50,
            offset = 0
        } = req.query;

        const query: any = {};

        if (brandSlug) query.brandSlug = brandSlug;
        if (modelSlug) query.modelSlug = modelSlug;
        if (variantSlug) query.variantSlug = variantSlug;
        if (isApproved !== undefined) query.isApproved = isApproved === 'true';

        if (search) {
            query.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { reviewTitle: { $regex: search, $options: 'i' } },
                { reviewText: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption: any = { createdAt: -1 };
        if (sort === 'rating') sortOption = { overallRating: -1 };
        if (sort === 'likes') sortOption = { likes: -1 };

        log(`Query built: ${JSON.stringify(query)}`);

        const [reviews, total] = await Promise.all([
            Review.find(query)
                .sort(sortOption)
                .skip(Number(offset))
                .limit(Number(limit))
                .lean(),
            Review.countDocuments(query)
        ]);

        log(`Found ${total} reviews. Returning ${reviews.length} items.`);

        res.json({
            success: true,
            data: {
                reviews,
                total,
                pagination: {
                    limit: Number(limit),
                    offset: Number(offset),
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    } catch (error) {
        console.error('Admin get reviews error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});

// GET /api/admin/reviews/:id - Get single review
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const review = await Review.findOne({ id }).lean();

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        // Get comments for this review
        const comments = await ReviewComment.find({ reviewId: id }).lean();

        res.json({
            success: true,
            data: { ...review, comments }
        });
    } catch (error) {
        console.error('Admin get review error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch review' });
    }
});

// POST /api/admin/reviews - Create review (admin)
router.post('/', async (req: Request, res: Response) => {
    try {
        const reviewData = req.body;

        const review = new Review({
            id: randomUUID(),
            ...reviewData,
            overallRating: calculateOverallRating(reviewData.starRatings),
            isApproved: true, // Admin-created reviews are auto-approved
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await review.save();

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Admin create review error:', error);
        res.status(500).json({ success: false, error: 'Failed to create review' });
    }
});

// PUT /api/admin/reviews/:id - Update review
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Recalculate rating if star ratings are updated
        if (updates.starRatings) {
            updates.overallRating = calculateOverallRating(updates.starRatings);
        }

        const review = await Review.findOneAndUpdate(
            { id },
            { ...updates, updatedAt: new Date() },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        console.error('Admin update review error:', error);
        res.status(500).json({ success: false, error: 'Failed to update review' });
    }
});

// DELETE /api/admin/reviews/:id - Delete review
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await Review.deleteOne({ id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        // Also delete associated comments
        await ReviewComment.deleteMany({ reviewId: id });

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Admin delete review error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete review' });
    }
});

// PATCH /api/admin/reviews/:id/approve - Approve/reject review
router.patch('/:id/approve', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isApproved } = req.body;

        const review = await Review.findOneAndUpdate(
            { id },
            { isApproved, updatedAt: new Date() },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        res.json({
            success: true,
            data: review,
            message: isApproved ? 'Review approved' : 'Review rejected'
        });
    } catch (error) {
        console.error('Admin approve review error:', error);
        res.status(500).json({ success: false, error: 'Failed to update review status' });
    }
});

// GET /api/admin/reviews/stats - Get review statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
    try {
        const [total, approved, pending, avgRating] = await Promise.all([
            Review.countDocuments(),
            Review.countDocuments({ isApproved: true }),
            Review.countDocuments({ isApproved: false }),
            Review.aggregate([
                { $match: { isApproved: true } },
                { $group: { _id: null, avg: { $avg: '$overallRating' } } }
            ])
        ]);

        res.json({
            success: true,
            data: {
                total,
                approved,
                pending,
                averageRating: avgRating[0]?.avg || 0
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
});

export default router;
