import express, { Router } from 'express';
import { getRedisClient } from '../middleware/redis-cache';
import { getRedisStatus } from '../config/redis-config';

const router = Router();

// Get Redis client instance
const redis = getRedisClient();

/**
 * System Diagnostics
 * GET /api/diagnostics
 */
router.get('/', async (req, res) => {
    const isProd = process.env.NODE_ENV === 'production' || !!process.env.RENDER;
    const isGadizoneDomain = isProd && (
        process.env.FRONTEND_URL?.includes('gadizone.com') ||
        process.env.BACKEND_URL?.includes('gadizone.com')
    );

    // Check Redis Cache Connection
    let redisCacheStatus = 'disconnected';
    try {
        if (redis) {
            await redis.ping();
            redisCacheStatus = 'connected';
        }
    } catch (e) {
        redisCacheStatus = 'error';
    }

    // Check Session Store (Redis)
    // We can't easily check the session store client directly here as it's in index.ts scope,
    // but we can check if the session middleware is working by checking req.session
    const sessionStatus = req.session ? 'active' : 'inactive';
    const sessionID = req.sessionID;

    const diagnostics = {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        isProd,
        isRender: !!process.env.RENDER,
        trustProxy: req.app.get('trust proxy'),

        // CRITICAL: Domain configuration for cookies
        domainConfig: {
            FRONTEND_URL: process.env.FRONTEND_URL || '(not set)',
            BACKEND_URL: process.env.BACKEND_URL || '(not set)',
            isGadizoneDomain,
            expectedCookieDomain: isGadizoneDomain ? '.gadizone.com' : '(not set - defaults to host)',
        },

        redis: {
            cache: redisCacheStatus,
            url_configured: !!process.env.REDIS_URL,
            host_configured: !!process.env.REDIS_HOST
        },
        session: {
            status: sessionStatus,
            id: sessionID,
            cookieConfig: req.session?.cookie,
            hasUser: !!(req.session as any)?.userId,
            userId: (req.session as any)?.userId || null,
            userEmail: (req.session as any)?.userEmail || null
        },
        // We can't access `isProd` directly from index.ts but we can check the cookie property to guess
        actualCookieSettings: {
            secure: req.session?.cookie.secure,
            sameSite: req.session?.cookie.sameSite,
            httpOnly: req.session?.cookie.httpOnly,
            path: req.session?.cookie.path,
            domain: req.session?.cookie.domain
        },
        headers: {
            host: req.get('host'),
            origin: req.get('origin'),
            'x-forwarded-proto': req.get('x-forwarded-proto'),
            'x-forwarded-for': req.get('x-forwarded-for'),
            'cookie-present': !!req.get('cookie'),
            'cookie-header': req.get('cookie') ? 'sid=' + (req.get('cookie')?.includes('sid=') ? 'present' : 'missing') : 'no cookies'
        }
    };

    res.json(diagnostics);
});

/**
 * Redis Failover Status
 * GET /api/diagnostics/redis
 */
router.get('/redis', async (req, res) => {
    const status = getRedisStatus();

    // Try to ping active connection
    let pingResult = 'failed';
    try {
        const client = getRedisClient();
        if (client) {
            const pong = await client.ping();
            pingResult = pong === 'PONG' ? 'success' : 'failed';
        }
    } catch (e) {
        pingResult = 'error: ' + (e as Error).message;
    }

    res.json({
        ...status,
        ping: pingResult,
        timestamp: new Date().toISOString(),
    });
});

/**
 * Test Session Storage
 * GET /api/diagnostics/test-session
 * This endpoint tests if sessions are being saved to Redis correctly
 */
router.get('/test-session', (req, res) => {
    const session = req.session as any;

    // Check if test value was previously set
    const previousValue = session.testValue;
    const previousTimestamp = session.testTimestamp;

    // Set new test value
    session.testValue = 'session_test_' + Date.now();
    session.testTimestamp = new Date().toISOString();

    // Save session explicitly
    req.session.save((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: 'Failed to save session: ' + err.message,
                sessionId: req.sessionID
            });
        }

        res.json({
            success: true,
            message: 'Session test - refresh this page to verify persistence',
            sessionId: req.sessionID,
            currentValue: session.testValue,
            previousValue: previousValue || '(none - first visit)',
            previousTimestamp: previousTimestamp || '(none)',
            cookieDomain: req.session.cookie.domain,
            instruction: 'If previousValue shows the value from your last request, sessions are working correctly!'
        });
    });
});

/**
 * Clear Test Session
 * GET /api/diagnostics/clear-test
 */
router.get('/clear-test', (req, res) => {
    const session = req.session as any;
    delete session.testValue;
    delete session.testTimestamp;

    req.session.save((err) => {
        res.json({
            success: !err,
            message: err ? 'Failed to clear: ' + err.message : 'Test session data cleared'
        });
    });
});

/**
 * Test Email Service
 * GET /api/diagnostics/test-email?email=test@example.com
 */
router.get('/test-email', async (req, res) => {
    const emailTo = req.query.email as string || process.env.GMAIL_USER || 'test@example.com';

    // Import dynamically to avoid circular dependencies if any
    const { sendEmail } = await import('../services/email.service');

    try {
        const result = await sendEmail(
            emailTo,
            'welcome', // Use welcome template as it's simple
            { name: 'Test User' }
        );

        if (result.success) {
            res.json({
                success: true,
                message: `Email sent successfully to ${emailTo}`,
                timestamp: new Date().toISOString(),
                config: {
                    user: process.env.GMAIL_USER ? 'Set' : 'Missing',
                    pass: process.env.GMAIL_APP_PASSWORD ? 'Set (length: ' + process.env.GMAIL_APP_PASSWORD.length + ')' : 'Missing'
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to send email',
                error: result.error,
                config: {
                    user: process.env.GMAIL_USER ? 'Set' : 'Missing',
                    pass: process.env.GMAIL_APP_PASSWORD ? 'Set (length: ' + process.env.GMAIL_APP_PASSWORD.length + ')' : 'Missing'
                }
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Unexpected error testing email',
            error: error.message
        });
    }
});

export default router;
