import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { registerRoutes } from "./routes";
// log utility (extracted from vite.ts to avoid importing vite in production)
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
import { MongoDBStorage } from "./db/mongodb-storage";
import type { IStorage } from "./storage";
import { createBackupService } from "./backup-service";
import { newsStorage } from "./db/news-storage";
import monitoringRoutes from "./routes/monitoring";
import dotenv from "dotenv";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimiter";
import { botDetector } from "./middleware/security";
import { warmUpCache } from "./middleware/redis-cache";
import compression from "compression";
import pinoHttp from "pino-http";
import session from "express-session";
import RedisStore from "connect-redis";
import { init as sentryInit, setupExpressErrorHandler } from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { register, httpRequestDurationMicroseconds, frontendWebVitals } from "./monitoring/metrics";
import { getSessionRedisClient, isRedisReady, connectRedis } from './config/redis-config';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (force backend/.env to override any pre-set vars)
const rootEnv = path.resolve(process.cwd(), '.env');
const backendEnv = path.resolve(__dirname, '../.env');
dotenv.config({ path: rootEnv });
dotenv.config({ path: backendEnv, override: true });

// Initialize Sentry (only if DSN is configured)
const sentryEnabled = !!process.env.SENTRY_DSN;
if (sentryEnabled) {
  try {
    sentryInit({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        nodeProfilingIntegration(),
      ],
      // Tracing
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      environment: process.env.NODE_ENV || 'development',
    });
    console.log('✅ Sentry initialized');
  } catch (error) {
    console.error('⚠️ Failed to initialize Sentry:', error);
  }
} else {
  console.log('ℹ️ Sentry not configured (set SENTRY_DSN to enable error tracking)');
}

const app = express();

// Sentry v8+ handles request isolation automatically
// No need for requestHandler or tracingHandler

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.disable('x-powered-by');
app.use(pinoHttp({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers.set-cookie'],
    remove: true,
  },
}));
app.use(compression());
// Force production mode if running on Render (to ensure secure cookies work)
const isRender = !!process.env.RENDER || !!process.env.RENDER_EXTERNAL_URL;
const isProd = process.env.NODE_ENV === 'production' || isRender;

// Build a production-safe, permissive CSP to support admin app uploads (R2/S3), images and APIs
const accountId = process.env.R2_ACCOUNT_ID;
const r2Endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
const extraConnect: string[] = [
  process.env.FRONTEND_URL || '',
  process.env.NEXT_PUBLIC_API_URL || '',
  r2Endpoint || '',
].filter(Boolean) as string[];

app.use(helmet({
  // Disable CSP in development to allow dev toolchains (Vite/Next) to inject preambles
  contentSecurityPolicy: isProd
    ? {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'https:', 'http:', ...extraConnect],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        mediaSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https:'],
        frameSrc: ["'self'", 'https:'],
      },
    }
    : false,
  // COEP can interfere with dev HMR; disable in dev
  crossOriginEmbedderPolicy: isProd ? undefined : false,
  // Allow cross-origin embedding of resources (images) in development
  crossOriginResourcePolicy: isProd ? undefined : { policy: 'cross-origin' },
}));

// Apply Bot Detection to all API routes (except internal ones if needed)
app.use('/api', botDetector);

// SECURE CORS configuration - MUST come before security middleware
const allowedOrigins = [
  'https://gadizone.com',
  'https://www.gadizone.com',
  'https://admin.gadizone.com',
  'https://killer-whale101.vercel.app',
  'https://killer-whale.onrender.com',
  'http://localhost:3000',
  'http://localhost:5001',
  process.env.FRONTEND_URL,
  process.env.NEXT_PUBLIC_API_URL
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Only allow whitelisted origins
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else if (process.env.NODE_ENV === 'development') {
    // In development, allow localhost
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  res.header('Access-Control-Expose-Headers', 'RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, X-Cache, X-Cache-TTL');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/api', apiLimiter);

// Serve uploaded files statically from a canonical path
const uploadsStaticPath = path.join(process.cwd(), 'uploads');

// Fallback: if a legacy .jpg/.png is requested but only a .webp exists, serve the .webp
app.get('/uploads/*', (req, res, next) => {
  try {
    const reqPath = req.path; // e.g., /uploads/image-123.jpg
    const relPath = reqPath.replace(/^\/+/, ''); // remove leading /
    const absPath = path.join(process.cwd(), relPath);
    fs.access(absPath, fs.constants.R_OK, (err) => {
      if (!err) return next(); // file exists; let static middleware handle it

      // If R2 public base is configured, redirect to it as a primary fallback
      const publicBase = process.env.R2_PUBLIC_BASE_URL;
      if (publicBase) {
        const target = `${publicBase}/${relPath}`;
        return res.redirect(302, target);
      }

      // Try .webp counterpart
      const webpRel = relPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      if (webpRel === relPath) return next();
      const webpAbs = path.join(process.cwd(), webpRel);
      fs.access(webpAbs, fs.constants.R_OK, (err2) => {
        if (!err2) {
          res.type('image/webp').sendFile(webpAbs);
        } else {
          next();
        }
      });
    });
  } catch {
    next();
  }
});
if (!isProd) {
  app.use(
    '/uploads',
    (req, res, next) => {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    },
    express.static(uploadsStaticPath, {
      etag: false,
      lastModified: false,
      maxAge: 0,
    })
  );
} else {
  app.use('/uploads', express.static(uploadsStaticPath));
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const shouldCapture = process.env.NODE_ENV !== 'production';
  let capturedJsonResponse: string | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    if (shouldCapture) {
      try {
        const preview = JSON.stringify(bodyJson);
        capturedJsonResponse = preview.length > 200 ? preview.slice(0, 200) + '…' : preview;
      } catch { }
    }
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (shouldCapture && capturedJsonResponse) {
        logLine += ` :: ${capturedJsonResponse}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// --- Prometheus Metrics Middleware ---
app.use((req, res, next) => {
  if (req.path === '/metrics') return next(); // Don't measure metrics endpoint itself

  const start = process.hrtime();
  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationSeconds = duration[0] + duration[1] / 1e9;

    // Record duration in histogram
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode
      },
      durationSeconds
    );
  });
  next();
});

// --- Prometheus Metrics Endpoint ---
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// --- Frontend Web Vitals Endpoint ---
app.post('/api/monitoring/vitals', (req, res) => {
  const { name, value } = req.body;

  if (name && value) {
    // Value typically comes in milliseconds, convert to seconds for consistency if needed, 
    // or keep as is. Core Web Vitals often use raw values. 
    // Usually LCP/FID are in ms. CLS is a score (unitless).
    // Let's store raw values but be mindful in Grafana.
    frontendWebVitals.observe({ metric_name: name }, value);
  }
  res.status(200).send('OK');
});

// Session configuration moved to async startup to wait for Redis connection

// Initialize services
(async () => {
  try {
    // Security: trusted proxies for cloud deployments
    if (isProd) {
      app.set('trust proxy', 1);
    }

    // Initialize Redis for sessions
    try {
      const redisClient = await connectRedis();
      if (redisClient) {
        console.log('✅ Redis connected successfully');
      } else {
        console.log('ℹ️  Running without Redis (not configured or unavailable)');
      }
    } catch (e) {
      console.error('❌ Redis connection failed:', e);
    }

    // Redis Client for Sessions
    const redisClient = getSessionRedisClient();

    // Session Middleware with enhanced cross-domain support
    const sessionSecret = process.env.SESSION_SECRET;
    if (isProd && !sessionSecret) {
      throw new Error('🚨 SECURITY CRITICAL: SESSION_SECRET must be set in production environment variables.');
    }

    // Determine if we're using gadizone.com domain
    const isGadizoneDomain = isProd && (
      process.env.FRONTEND_URL?.includes('gadizone.com') ||
      process.env.BACKEND_URL?.includes('gadizone.com')
    );

    console.log('🔧 Session Cookie Configuration:');
    console.log(`   - isProd: ${isProd}`);
    console.log(`   - isGadizoneDomain: ${isGadizoneDomain}`);

    const sessionConfig: any = {
      secret: sessionSecret || "gadizone_secret_key_2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProd,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: isProd ? 'none' : 'lax',
        domain: isGadizoneDomain ? '.gadizone.com' : undefined,
        path: '/',
      },
      name: 'sid',
      proxy: true,
    };

    // Only use RedisStore if Redis client is available and connected
    if (redisClient) {
      const redisStore = new RedisStore({
        client: redisClient,
        prefix: "sess:",
      });
      sessionConfig.store = redisStore;
      console.log('✅ Redis session store initialized');
    } else {
      console.warn('⚠️  Redis Client is null despite explicit connection wait. Using MemoryStore fallback.');
    }

    app.use(session(sessionConfig));

    console.log('✅ Session middleware configured');
    console.log(`   - Store: ${redisClient ? 'Redis (persistent)' : 'MemoryStore (fallback)'}`);

    // Debug middleware to log session info
    if (!isProd) {
      app.use((req, res, next) => {
        if (req.path.includes('/auth/')) {
          console.log('🔍 Session Debug:', {
            sessionID: req.sessionID,
            userId: (req.session as any)?.userId,
            cookie: req.session?.cookie,
          });
        }
        next();
      });
    }

    // Import and initialize Passport for OAuth
    const passportConfig = await import('./config/passport');
    const passport = passportConfig.default;

    // Initialize Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());
    console.log('✅ Passport.js initialized for OAuth');

    // Initialize MongoDB storage
    const storage = new MongoDBStorage();
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/gadizone";

    try {
      await storage.connect(mongoUri);
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB. Please check:');
      console.error('   1. MongoDB is running (brew services start mongodb-community)');
      console.error('   2. MONGODB_URI in .env file is correct');
      console.error('   3. Network connection is available');
      console.error('   3. Network connection is available');
      console.warn('⚠️  Continuing without MongoDB (AI Chat will use mock data)...');
      // process.exit(1); // Don't exit, allow server to run for AI Chat
    }

    // Initialize news storage
    await newsStorage.initialize();

    // Warm up Redis cache for hot endpoints
    try {
      await warmUpCache(storage);
    } catch (e) {
      console.warn('Cache warmup skipped:', e instanceof Error ? e.message : e);
    }

    // Initialize backup service (JSON file backup)
    if (isProd) {
      const backupService = createBackupService(storage);
      backupService.startAutoBackup(30);
    }

    // Initialize MongoDB backup sync service (secondary database sync)
    try {
      const { mongoDBBackupSync } = await import('./services/mongodb-backup-sync');
      await mongoDBBackupSync.initialize();
    } catch (error) {
      console.warn('⚠️  MongoDB backup sync initialization skipped:', error instanceof Error ? error.message : error);
    }

    // Register backup sync routes
    const backupSyncRoutes = (await import('./routes/backup-sync')).default;
    app.use('/api/admin/backup', backupSyncRoutes);
    console.log('✅ Backup sync routes registered at /api/admin/backup');

    // Register monitoring routes (no auth required)
    app.use('/api/monitoring', monitoringRoutes);

    // Register cache management routes
    const cacheRoutes = (await import('./routes/cache')).default;
    app.use('/api/cache', cacheRoutes);

    // Register user authentication routes (public)
    const userAuthRoutes = (await import('./routes/user-auth')).default;
    app.use('/api/user', userAuthRoutes);
    console.log('✅ User authentication routes registered at /api/user');

    // Register admin user management routes
    const adminUsersRoutes = (await import('./routes/admin-users')).default;
    app.use('/api/admin/users', adminUsersRoutes);
    console.log('✅ Admin users routes registered at /api/admin/users');

    // Register diagnostics route
    const diagnosticsRoutes = (await import('./routes/diagnostics')).default;
    app.use('/api/diagnostics', diagnosticsRoutes);
    console.log('✅ Diagnostics routes registered at /api/diagnostics');

    // Register recommendations routes (personalized car suggestions)
    const recommendationsRoutes = (await import('./routes/recommendations')).default;
    app.use('/api/recommendations', recommendationsRoutes);
    console.log('✅ Recommendations routes registered at /api/recommendations');

    // Register API routes FIRST before Vite
    registerRoutes(app, storage);


    const server = createServer(app);

    // Initialize Scheduled API Fetcher
    try {
      // Dynamic import to avoid circular dependencies if any
      // @ts-ignore
      const SchedulerIntegration = (await import('./schedulerIntegration')).default;
      const schedulerIntegration = new SchedulerIntegration(app);
      await schedulerIntegration.init();
      console.log('✅ Scheduled API fetcher initialized (1:00 PM & 8:00 PM IST)');
    } catch (error) {
      // console.error('❌ Failed to initialize scheduler:', error);
      console.warn('⚠️  Continuing without scheduler...');
    }

    // Initialize YouTube Scheduler
    try {
      const { startYouTubeScheduler } = await import('./scheduled-youtube-fetch');
      startYouTubeScheduler(storage);
    } catch (error) {
      console.error('❌ Failed to initialize YouTube scheduler:', error);
      console.warn('⚠️  Continuing without YouTube scheduler...');
    }

    // Sentry Error Handler must be before any other error middleware and after all controllers
    if (sentryEnabled) {
      try {
        setupExpressErrorHandler(app);
      } catch (error) {
        console.warn('⚠️ Sentry error handler not available:', error);
      }
    }

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error('Global error handler:', err);
      res.status(status).json({ message });
    });

    // Setup Vite or static serving
    if (app.get("env") === "development") {
      const { setupVite } = await import("./vite");
      await setupVite(app, server);
    } else {
      // Production: simple static file serving (inlined to avoid importing vite.ts which depends on 'vite' package)
      const distPath = path.resolve(import.meta.dirname || __dirname, "public");
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.use("*", (req, res, next) => {
          if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/uploads')) {
            return next();
          }
          res.sendFile(path.resolve(distPath, "index.html"));
        });
      } else {
        log("No public directory found — running API-only mode");
      }
    }

    // Start server
    const PORT = parseInt(process.env.PORT || "5001", 10);
    server.listen(PORT, "0.0.0.0", () => {
      log(`Server running on port ${PORT}`);

      // Start email scheduler if enabled
      if (process.env.EMAIL_SCHEDULER_ENABLED === 'true') {
        import('./services/email-scheduler.service').then(({ emailScheduler }) => {
          emailScheduler.start();
        }).catch((error) => {
          console.error('Failed to start email scheduler:', error);
        });
      } else {
        log('Email scheduler disabled (set EMAIL_SCHEDULER_ENABLED=true to enable)');
      }
    });

    // Graceful shutdown
    const shutdown = async () => {
      log('received shutdown signal, closing server');

      // Stop email scheduler
      if (process.env.EMAIL_SCHEDULER_ENABLED === 'true') {
        const { emailScheduler } = await import('./services/email-scheduler.service');
        emailScheduler.stop();
      }

      // Close Redis connection
      const { closeRedisConnection } = await import('./config/redis-config');
      await closeRedisConnection();

      server.close(() => {
        log('server closed');
        process.exit(0);
      });
      // Force exit if not closed in time
      setTimeout(() => process.exit(1), 10000).unref();
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
