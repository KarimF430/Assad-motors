import { Router, Request, Response } from 'express';
import { Review, ReviewComment } from '../db/schemas';
import { randomUUID } from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync } from 'fs';

const router = Router();

// Configure multer for review image uploads
const uploadDir = path.join(process.cwd(), 'uploads', 'reviews');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
    storage: multer.diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Max 5 images
    }
});

// Helper to upload to R2 if configured
async function uploadToR2(filePath: string, filename: string): Promise<string | null> {
    const bucket = process.env.R2_BUCKET;
    if (!bucket) return null;

    const accountId = process.env.R2_ACCOUNT_ID;
    const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

    if (!endpoint || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
        return null;
    }

    try {
        const client = new S3Client({
            region: process.env.R2_REGION || 'auto',
            endpoint,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            },
            forcePathStyle: true,
        });

        const now = new Date();
        const key = `uploads/reviews/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}/${filename}`;
        const body = readFileSync(filePath);

        await client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: 'image/jpeg',
            CacheControl: 'public, max-age=31536000, immutable',
        }));

        const publicBase = process.env.R2_PUBLIC_BASE_URL || `${endpoint}/${bucket}`;
        return `${publicBase}/${key}`;
    } catch (error) {
        console.error('R2 upload error:', error);
        return null;
    }
}

// GET /api/reviews/:modelSlug - Get reviews for a model
router.get('/:modelSlug', async (req: Request, res: Response) => {
    try {
        const { modelSlug } = req.params;
        const { sort = 'recent', rating, limit = 20, offset = 0 } = req.query;

        const query: any = {
            modelSlug,
            isApproved: true
        };

        // Filter by rating if specified
        if (rating && rating !== 'all') {
            query.overallRating = { $gte: Number(rating), $lt: Number(rating) + 1 };
        }

        // Sort options
        let sortOption: any = { createdAt: -1 }; // Default: most recent
        if (sort === 'helpful') {
            sortOption = { likes: -1 };
        } else if (sort === 'highest') {
            sortOption = { overallRating: -1 };
        } else if (sort === 'lowest') {
            sortOption = { overallRating: 1 };
        }

        const [reviews, total] = await Promise.all([
            Review.find(query)
                .sort(sortOption)
                .skip(Number(offset))
                .limit(Number(limit))
                .lean(),
            Review.countDocuments(query)
        ]);

        // Calculate rating breakdown
        const ratingBreakdown = await Review.aggregate([
            { $match: { modelSlug, isApproved: true } },
            {
                $group: {
                    _id: { $floor: '$overallRating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingBreakdown.forEach(r => {
            if (r._id >= 1 && r._id <= 5) {
                breakdown[r._id as keyof typeof breakdown] = r.count;
            }
        });

        // Calculate overall average
        const avgResult = await Review.aggregate([
            { $match: { modelSlug, isApproved: true } },
            { $group: { _id: null, avg: { $avg: '$overallRating' } } }
        ]);
        const overallAverage = avgResult[0]?.avg || 0;

        res.json({
            success: true,
            data: {
                reviews,
                total,
                overallRating: Math.round(overallAverage * 10) / 10,
                ratingBreakdown: breakdown,
                pagination: {
                    limit: Number(limit),
                    offset: Number(offset),
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});

// POST /api/reviews - Submit a new review
router.post('/', upload.array('images', 5), async (req: Request, res: Response) => {
    try {
        const {
            brandSlug,
            modelSlug,
            variantSlug,
            userName,
            userEmail,
            drivingExperience,
            emojiRatings,
            starRatings,
            reviewTitle,
            reviewText
        } = req.body;

        // Validate required fields
        if (!brandSlug || !modelSlug || !userName || !userEmail || !drivingExperience) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Parse ratings if they're strings
        const parsedEmojiRatings = typeof emojiRatings === 'string'
            ? JSON.parse(emojiRatings)
            : emojiRatings;
        const parsedStarRatings = typeof starRatings === 'string'
            ? JSON.parse(starRatings)
            : starRatings;

        // Validate review text length
        if (!reviewText || reviewText.length < 300) {
            return res.status(400).json({
                success: false,
                error: 'Review must be at least 300 characters'
            });
        }

        if (!reviewTitle || reviewTitle.length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Title must be at least 10 characters'
            });
        }

        // Helper to calculate overall rating
        const calculateOverallRating = (starRatings: any): number => {
            if (!starRatings) return 0;
            const values = Object.values(starRatings).filter(val => typeof val === 'number') as number[];
            if (values.length === 0) return 0;
            const sum = values.reduce((a, b) => a + b, 0);
            return Number((sum / values.length).toFixed(1));
        };

        // Upload images
        const imageUrls: string[] = [];
        const files = req.files as Express.Multer.File[];

        if (files && files.length > 0) {
            for (const file of files) {
                // Try R2 first, fallback to local
                const r2Url = await uploadToR2(file.path, file.filename);
                if (r2Url) {
                    imageUrls.push(r2Url);
                    // Clean up local file
                    fs.unlinkSync(file.path);
                } else {
                    imageUrls.push(`/uploads/reviews/${file.filename}`);
                }
            }
        }

        const review = new Review({
            id: randomUUID(),
            brandSlug,
            modelSlug,
            variantSlug: variantSlug || null,
            userName,
            userEmail,
            drivingExperience,
            emojiRatings: parsedEmojiRatings,
            starRatings: parsedStarRatings,
            overallRating: calculateOverallRating(parsedStarRatings),
            reviewTitle,
            reviewText,
            images: imageUrls,
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            isApproved: false, // Requires admin approval
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await review.save();

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully. It will be visible after moderation.',
            data: { id: review.id }
        });
    } catch (error) {
        console.error('Submit review error:', error);
        res.status(500).json({ success: false, error: 'Failed to submit review' });
    }
});

// POST /api/reviews/:id/vote - Like or dislike a review
router.post('/:id/vote', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { type, userEmail } = req.body; // type: 'like' or 'dislike'

        if (!type || !userEmail) {
            return res.status(400).json({
                success: false,
                error: 'Missing type or userEmail'
            });
        }

        // We use atomic updates to prevent race conditions on counters
        let updatedReview;

        if (type === 'like') {
            // 1. Try to un-like (toggle off) if user already liked
            updatedReview = await Review.findOneAndUpdate(
                { id, likedBy: userEmail },
                {
                    $pull: { likedBy: userEmail },
                    $inc: { likes: -1 }
                },
                { new: true }
            );

            // If we didn't toggle off (user hadn't liked yet), then add like
            if (!updatedReview) {
                // Remove dislike if it exists (atomic)
                await Review.findOneAndUpdate(
                    { id, dislikedBy: userEmail },
                    {
                        $pull: { dislikedBy: userEmail },
                        $inc: { dislikes: -1 }
                    }
                );

                // Add like (atomic, ensures we don't double count if race occurs)
                updatedReview = await Review.findOneAndUpdate(
                    { id, likedBy: { $ne: userEmail } },
                    {
                        $addToSet: { likedBy: userEmail },
                        $inc: { likes: 1 }
                    },
                    { new: true }
                );
            }
        } else if (type === 'dislike') {
            // 1. Try to un-dislike (toggle off)
            updatedReview = await Review.findOneAndUpdate(
                { id, dislikedBy: userEmail },
                {
                    $pull: { dislikedBy: userEmail },
                    $inc: { dislikes: -1 }
                },
                { new: true }
            );

            // If we didn't toggle off, add dislike
            if (!updatedReview) {
                // Remove like if it exists
                await Review.findOneAndUpdate(
                    { id, likedBy: userEmail },
                    {
                        $pull: { likedBy: userEmail },
                        $inc: { likes: -1 }
                    }
                );

                // Add dislike
                updatedReview = await Review.findOneAndUpdate(
                    { id, dislikedBy: { $ne: userEmail } },
                    {
                        $addToSet: { dislikedBy: userEmail },
                        $inc: { dislikes: 1 }
                    },
                    { new: true }
                );
            }
        }

        // If updatedReview is still null (e.g. race condition prevented add), fetch current state
        if (!updatedReview) {
            updatedReview = await Review.findOne({ id });
        }

        if (!updatedReview) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        res.json({
            success: true,
            data: {
                likes: updatedReview.likes,
                dislikes: updatedReview.dislikes,
                userVote: updatedReview.likedBy.includes(userEmail) ? 'like' :
                    updatedReview.dislikedBy.includes(userEmail) ? 'dislike' : null
            }
        });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ success: false, error: 'Failed to vote' });
    }
});

// GET /api/reviews/:id/comments - Get comments for a review
router.get('/:id/comments', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const comments = await ReviewComment.find({
            reviewId: id,
            isApproved: true
        }).sort({ createdAt: -1 }).lean();

        // Organize into nested structure
        const commentMap = new Map();
        const rootComments: any[] = [];

        comments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, replies: [] });
        });

        comments.forEach(comment => {
            const c = commentMap.get(comment.id);
            if (comment.parentId && commentMap.has(comment.parentId)) {
                commentMap.get(comment.parentId).replies.push(c);
            } else {
                rootComments.push(c);
            }
        });

        res.json({
            success: true,
            data: rootComments
        });
    } catch (error) {
        console.error('Get comments error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch comments' });
    }
});

// POST /api/reviews/:id/comments - Add a comment to a review
router.post('/:id/comments', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userName, userEmail, text, parentId } = req.body;

        if (!userName || !userEmail || !text) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Verify review exists
        const review = await Review.findOne({ id });
        if (!review) {
            return res.status(404).json({ success: false, error: 'Review not found' });
        }

        const comment = new ReviewComment({
            id: randomUUID(),
            reviewId: id,
            parentId: parentId || null,
            userName,
            userEmail,
            text,
            likes: 0,
            dislikes: 0,
            isApproved: true // Auto-approve comments for now
        });

        await comment.save();

        res.status(201).json({
            success: true,
            data: comment
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ success: false, error: 'Failed to add comment' });
    }
});

export default router;
