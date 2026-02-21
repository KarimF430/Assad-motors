import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// ==========================================
// IP Whitelisting
// ==========================================
const ALLOWED_IPS = [
    '127.0.0.1',           // Localhost IPv4
    '::1',                 // Localhost IPv6
    '27.107.129.231',      // Your current IP
    // Add more trusted IPs below:
    // '203.0.113.5',      // Office IP
    // '198.51.100.10',    // Admin IP
];

export const ipWhitelist = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress;

    // Allow if in development
    if (process.env.NODE_ENV === 'development') {
        return next();
    }

    if (clientIp && ALLOWED_IPS.includes(clientIp)) {
        next();
    } else {
        console.warn(`🚫 Blocked access to admin route from IP: ${clientIp}`);
        res.status(403).json({ message: 'Access denied: IP not whitelisted' });
    }
};

// ==========================================
// Bot Detection
// ==========================================
const BAD_BOT_SIGNATURES = [
    'headless',
    'selenium',
    'puppeteer',
    'playwright',
    'curl',
    'wget',
    'python-requests',
    'scrapy',
    'bot',
    'crawler',
    'spider'
];

// Allow good bots (Google, Bing, etc.) if needed, but for API we might want to block most
const GOOD_BOTS = [
    'googlebot',
    'bingbot',
    'duckduckbot',
    'slurp', // Yahoo
    'facebot',
    'twitterbot'
];

export const botDetector = (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.get('User-Agent')?.toLowerCase() || '';

    // Check for bad bots
    const isBadBot = BAD_BOT_SIGNATURES.some(sig => userAgent.includes(sig));
    const isGoodBot = GOOD_BOTS.some(sig => userAgent.includes(sig));

    if (isBadBot && !isGoodBot) {
        console.warn(`🤖 Blocked bot access: ${userAgent}`);
        return res.status(403).json({ message: 'Access denied: Bot detected' });
    }

    next();
};

// ==========================================
// DDoS Protection (Strict Rate Limiting)
// ==========================================
// This is a stricter limiter for specific sensitive endpoints or when under attack
export const ddosShield = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per minute
    message: {
        error: 'DDoS protection activated. Too many requests.',
        retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
