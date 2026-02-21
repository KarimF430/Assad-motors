import type { Express, Request, Response } from "express";
import { z } from "zod";
import express from "express";
import type { IStorage } from "./storage";
import type { BackupService } from "./backup-service";
import { insertBrandSchema, insertModelSchema } from "./validation/schemas";
import { insertConsultationLeadSchema } from "@shared/schema";
import { Review } from "./db/schemas";
import Papa from "papaparse";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
  isValidEmail,
  isStrongPassword,
  sanitizeUser,
  hashPassword
} from "./auth";
import {
  apiLimiter,
  authLimiter,
  modifyLimiter,
  publicLimiter,
  bulkLimiter
} from "./middleware/rateLimiter";
import { redisCacheMiddleware, invalidateRedisCache, CacheTTL as RedisCacheTTL } from "./middleware/redis-cache";
import { securityMiddleware, validateFileUpload } from "./middleware/sanitize";
import { ipWhitelist, botDetector, ddosShield } from "./middleware/security";
import { imageProcessingConfigs, ImageProcessor } from "./middleware/image-processor";
import multer from "multer";
import path from "path";
import fs from "fs";
import { readFileSync } from "fs";
import { randomUUID } from "crypto";
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Import news routes
import newsRoutes from "./routes/news";
import adminAuthRoutes from "./routes/admin-auth";
import adminArticlesRoutes from "./routes/admin-articles";
import adminCategoriesRoutes from "./routes/admin-categories";
import adminTagsRoutes from "./routes/admin-tags";
import adminAuthorsRoutes from "./routes/admin-authors";
import adminMediaRoutes from "./routes/admin-media";
import adminAnalyticsRoutes from "./routes/admin-analytics";
import aiChatHandler from "./routes/ai-chat";
import quirkyBitRoutes from "./routes/quirky-bit";
import createYouTubeRoutes from "./routes/youtube";
import aiFeedbackRoutes from "./routes/ai-feedback";
import reviewsRoutes from "./routes/reviews";
import adminReviewsRoutes from "./routes/admin-reviews";
import adminEmailRoutes from "./routes/admin-emails.routes";
import priceHistoryRoutes from "./routes/price-history.routes";
import adminHumanizeRoutes from "./routes/admin-humanize";
import { buildSearchIndex, searchFromIndex, invalidateSearchIndex, getSearchIndexStats, inMemoryCache, inMemoryCacheArray, type SearchResult } from "./services/search-index";
import aiHistoryRoutes from "./routes/ai-history";

// Function to format brand summary with proper sections
function formatBrandSummary(summary: string, brandName: string): {
  sections: Array<{
    title: string;
    content: string;
  }>;
  priceInfo?: string;
} {
  if (!summary) {
    return { sections: [] };
  }

  const sections: Array<{ title: string; content: string }> = [];
  let priceInfo = '';

  // Split by common section indicators
  const lines = summary.split('\n').filter(line => line.trim());
  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check for section headers
    if (trimmedLine.includes('Start of operations in India:') ||
      trimmedLine.includes('Market Share:') ||
      trimmedLine.includes('Key Aspects:') ||
      trimmedLine.includes('Competitors:')) {

      // Save previous section if exists
      if (currentSection && currentContent.length > 0) {
        sections.push({
          title: currentSection,
          content: currentContent.join(' ').trim()
        });

      }

      // Start new section
      currentSection = trimmedLine.replace(':', '');
      currentContent = [];
    } else if (trimmedLine.includes('car price starts at') ||
      trimmedLine.includes('cheapest model') ||
      trimmedLine.includes('most expensive model')) {
      // Extract price information
      priceInfo = trimmedLine;
    } else if (currentSection) {
      // Add to current section content
      currentContent.push(trimmedLine);
    } else {
      // First paragraph (overview)
      if (!sections.length) {
        sections.push({
          title: `${brandName} Cars`,
          content: trimmedLine
        });
      }
    }
  }

  // Add final section
  if (currentSection && currentContent.length > 0) {
    sections.push({
      title: currentSection,
      content: currentContent.join(' ').trim()
    });
  }

  return { sections, priceInfo };
}

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allow all image types for model images, PNG only for logos
    if (req.path === '/api/upload/logo') {
      if (file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error('Only PNG files are allowed for brand logos'));
      }
    } else {
      // Allow common image formats for model images
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export function registerRoutes(app: Express, storage: IStorage, backupService?: BackupService) {
  console.log('🔨 Initializing search index...');
  buildSearchIndex().catch(err => console.error('❌ Failed to build initial search index:', err));

  console.log('🔐 Registering authentication routes...');

  // Helper function to trigger backup after mutations
  const triggerBackup = async (type: string) => {
    if (backupService) {
      try {
        switch (type) {
          case 'brands':
            await backupService.backupBrands();
            break;
          case 'models':
            await backupService.backupModels();
            break;
          case 'variants':
            await backupService.backupVariants();
            break;
          case 'comparisons':
            await backupService.backupPopularComparisons();
            break;
          case 'all':
            await backupService.backupAll();
            break;
        }
      } catch (error) {
        console.error(`⚠️  Backup failed for ${type}:`, error);
      }
    }
  };

  // R2 diagnostics endpoint (auth required) to verify storage config
  app.get('/api/uploads/diagnostics', authenticateToken, modifyLimiter, async (req: Request, res: Response) => {
    try {
      const bucket = process.env.R2_BUCKET as string | undefined;
      const accountId = process.env.R2_ACCOUNT_ID as string | undefined;
      const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
      const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint && bucket ? `${endpoint}/${bucket}` : '');
      const hasCredentials = !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);

      const summary: Record<string, any> = {
        configured: !!(bucket && endpoint && hasCredentials),
        bucket: bucket || null,
        endpoint: endpoint || null,
        publicBase: publicBase || null,
        hasCredentials,
      };

      if (!summary.configured) {
        return res.json(summary);
      }

      const client = new S3Client({
        region: process.env.R2_REGION || 'auto',
        endpoint,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        },
        forcePathStyle: true,
      });

      try {
        await client.send(new ListObjectsV2Command({ Bucket: bucket as string, MaxKeys: 1 }));
        summary.r2Ok = true;
      } catch (error: any) {
        summary.r2Ok = false;
        summary.error = error?.message || String(error);
      }

      return res.json(summary);
    } catch (error) {
      return res.status(500).json({ error: 'Diagnostics failed' });
    }
  });

  const buildPublicAssetUrl = (assetPath: string | null | undefined, req: Request): string | null => {
    if (!assetPath) return null
    if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
      return assetPath
    }
    const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`
    const publicBase =
      process.env.R2_PUBLIC_BASE_URL ||
      process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ||
      (process.env.R2_PUBLIC_BASE_HOST ? `https://${process.env.R2_PUBLIC_BASE_HOST}` : '')
    if (publicBase) {
      return `${publicBase.replace(/\/$/, '')}${normalized}`
    }
    const backendOrigin =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.BACKEND_URL ||
      `${req.protocol}://${req.get('host')}`
    return `${(backendOrigin || '').replace(/\/$/, '')}${normalized}`
  }

  // ============================================
  // AUTHENTICATION ROUTES (Public)
  // ============================================

  // Login endpoint - with strict rate limiting
  app.post("/api/auth/login", authLimiter, async (req: Request, res: Response) => {
    console.log('📝 Login attempt:', req.body.email);
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: "Email and password are required",
          code: "MISSING_CREDENTIALS"
        });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({
          error: "Invalid email format",
          code: "INVALID_EMAIL"
        });
      }

      // Find user
      const user = await storage.getAdminUser(email);
      if (!user) {
        return res.status(401).json({
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Verify password
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid email or password",
          code: "INVALID_CREDENTIALS"
        });
      }

      // Check if user already has an active session
      const existingSession = await storage.getActiveSession(user.id);
      if (existingSession) {
        // Invalidate previous session (force logout other devices)
        await storage.invalidateSession(user.id);
        console.log('⚠️  Previous session invalidated for:', user.email);
      }

      // Update last login
      await storage.updateAdminUserLogin(user.id);

      // Generate tokens
      const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });
      const refreshToken = generateRefreshToken(user.id);

      // Create new session
      await storage.createSession(user.id, accessToken);

      // Set cookies
      const isProd = process.env.NODE_ENV === 'production';
      const sameSitePolicy: any = (isProd && process.env.FRONTEND_URL) ? 'none' : 'strict';
      res.cookie('token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: sameSitePolicy,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: sameSitePolicy,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Return tokens as well for clients that use Authorization header (cross-site frontends)
      res.json({
        success: true,
        user: sanitizeUser(user),
        token: accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", authenticateToken, async (req: Request, res: Response) => {
    try {
      if (req.user) {
        // Invalidate session
        await storage.invalidateSession(req.user.id);
        console.log('👋 User logged out:', req.user.email);
      }

      res.clearCookie('token');
      res.clearCookie('refreshToken');
      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error('Logout error:', error);
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      res.json({ success: true, message: "Logged out successfully" });
    }
  });

  // Bulk import brands endpoint - with strict bulk rate limiting + IP whitelist
  app.post("/api/bulk/brands", ipWhitelist, bulkLimiter, authenticateToken, async (req: Request, res: Response) => {
    try {
      console.log('📦 Starting bulk brand import...');
      const { brands } = req.body;

      if (!Array.isArray(brands)) {
        return res.status(400).json({ error: 'Brands must be an array' });
      }

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const brandData of brands) {
        try {
          const validatedData = insertBrandSchema.parse(brandData);
          const brand = await storage.createBrand(validatedData);
          results.push({ success: true, brand: brand.name, id: brand.id });
          successCount++;
          console.log(`✅ Created brand: ${brand.name}`);
        } catch (error) {
          console.error(`❌ Failed to create brand ${brandData.name}:`, error);
          const errMsg = error instanceof Error ? error.message : String(error);
          results.push({ success: false, brand: brandData.name, error: errMsg });
          errorCount++;
        }
      }

      console.log(`📊 Bulk brand import completed: ${successCount} success, ${errorCount} errors`);
      await triggerBackup('brands');

      res.json({
        success: true,
        summary: { total: brands.length, success: successCount, errors: errorCount },
        results
      });
    } catch (error) {
      console.error('❌ Bulk brand import error:', error);
      res.status(500).json({ error: 'Failed to import brands' });
    }
  });

  // Bulk import variants endpoint - with strict bulk rate limiting + IP whitelist
  app.post("/api/bulk/variants", ipWhitelist, bulkLimiter, authenticateToken, async (req: Request, res: Response) => {
    try {
      console.log('📦 Starting bulk variant import...');
      const { variants } = req.body;

      if (!Array.isArray(variants)) {
        return res.status(400).json({ error: 'Variants must be an array' });
      }

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const variantData of variants) {
        try {
          const variant = await storage.createVariant(variantData);
          results.push({ success: true, variant: variant.name, id: variant.id, model: variant.modelId });
          successCount++;
          console.log(`✅ Created variant: ${variant.name} (${variant.modelId})`);
        } catch (error) {
          console.error(`❌ Failed to create variant ${variantData.name}:`, error);
          const errMsg = error instanceof Error ? error.message : String(error);
          results.push({ success: false, variant: variantData.name, error: errMsg });
          errorCount++;
        }
      }

      console.log(`📊 Bulk variant import completed: ${successCount} success, ${errorCount} errors`);
      await triggerBackup('variants');

      res.json({
        success: true,
        summary: { total: variants.length, success: successCount, errors: errorCount },
        results
      });
    } catch (error) {
      console.error('❌ Bulk variant import error:', error);
      res.status(500).json({ error: 'Failed to import variants' });
    }
  });

  // Bulk import models endpoint - with strict bulk rate limiting + IP whitelist
  app.post("/api/bulk/models", ipWhitelist, bulkLimiter, authenticateToken, async (req: Request, res: Response) => {
    try {
      console.log('📦 Starting bulk model import...');
      const { models } = req.body;

      if (!Array.isArray(models)) {
        return res.status(400).json({ error: 'Models must be an array' });
      }

      const results = [];
      let successCount = 0;
      let errorCount = 0;

      for (const modelData of models) {
        try {
          const validatedData = insertModelSchema.parse(modelData);
          const model = await storage.createModel(validatedData);
          results.push({ success: true, model: model.name, id: model.id, brand: model.brandId });
          successCount++;
          console.log(`✅ Created model: ${model.name} (${model.brandId})`);
        } catch (error) {
          console.error(`❌ Failed to create model ${modelData.name}:`, error);
          const errMsg = error instanceof Error ? error.message : String(error);
          results.push({ success: false, model: modelData.name, error: errMsg });
          errorCount++;
        }
      }

      console.log(`📊 Bulk model import completed: ${successCount} success, ${errorCount} errors`);
      await triggerBackup('models');

      res.json({
        success: true,
        summary: { total: models.length, success: successCount, errors: errorCount },
        results
      });
    } catch (error) {
      console.error('❌ Bulk model import error:', error);
      res.status(500).json({ error: 'Failed to import models' });
    }
  });

  // Clear models only endpoint
  app.post("/api/cleanup/clear-models", ipWhitelist, authenticateToken, modifyLimiter, async (req: Request, res: Response) => {
    try {
      console.log('🧹 Starting models cleanup...');

      // Delete all variants first (cascade)
      const variants = await storage.getVariants();
      let deletedVariants = 0;
      for (const variant of variants) {
        await storage.deleteVariant(variant.id);
        deletedVariants++;
      }

      // Delete all models
      const models = await storage.getModels();
      let deletedModels = 0;
      for (const model of models) {
        await storage.deleteModel(model.id);
        deletedModels++;
      }

      console.log(`✅ Models cleanup completed: ${deletedModels} models, ${deletedVariants} variants deleted`);
      await triggerBackup('models');

      res.json({
        success: true,
        deleted: { models: deletedModels, variants: deletedVariants },
        message: `Models cleared: ${deletedModels} models, ${deletedVariants} variants`
      });
    } catch (error) {
      console.error('❌ Models cleanup error:', error);
      res.status(500).json({ error: 'Failed to clear models' });
    }
  });

  // Clear all data endpoint
  app.post("/api/cleanup/clear-all", ipWhitelist, authenticateToken, modifyLimiter, async (req: Request, res: Response) => {
    try {
      console.log('🧹 Starting complete database cleanup...');

      // Delete all variants
      const variants = await storage.getVariants();
      let deletedVariants = 0;
      for (const variant of variants) {
        const success = await storage.deleteVariant(variant.id);
        if (success) deletedVariants++;
      }

      // Delete all models
      const models = await storage.getModels();
      let deletedModels = 0;
      for (const model of models) {
        const success = await storage.deleteModel(model.id);
        if (success) deletedModels++;
      }

      // Delete all brands
      const brands = await storage.getBrands();
      let deletedBrands = 0;
      for (const brand of brands) {
        const success = await storage.deleteBrand(brand.id);
        if (success) deletedBrands++;
      }

      console.log(`✅ Cleanup completed: ${deletedBrands} brands, ${deletedModels} models, ${deletedVariants} variants deleted`);

      res.json({
        success: true,
        deleted: {
          brands: deletedBrands,
          models: deletedModels,
          variants: deletedVariants
        },
        message: `Database cleared: ${deletedBrands} brands, ${deletedModels} models, ${deletedVariants} variants`
      });
    } catch (error) {
      console.error('❌ Clear all error:', error);
      res.status(500).json({ error: 'Failed to clear database' });
    }
  });

  // Cleanup orphaned data endpoint
  app.post("/api/cleanup/orphaned-data", ipWhitelist, authenticateToken, modifyLimiter, async (req: Request, res: Response) => {
    try {
      console.log('🧹 Starting orphaned data cleanup...');

      // Get all data
      const brands = await storage.getBrands();
      const models = await storage.getModels();
      const variants = await storage.getVariants();

      const brandIds = brands.map(b => b.id);
      const modelIds = models.map(m => m.id);

      // Find orphaned data
      const orphanedModels = models.filter(m => !brandIds.includes(m.brandId));
      const orphanedVariants = variants.filter(v =>
        !modelIds.includes(v.modelId) || !brandIds.includes(v.brandId)
      );

      console.log(`📊 Found ${orphanedModels.length} orphaned models, ${orphanedVariants.length} orphaned variants`);

      let deletedModels = 0;
      let deletedVariants = 0;

      // Delete orphaned models
      for (const model of orphanedModels) {
        console.log(`🗑️ Deleting orphaned model: ${model.name} (${model.id})`);
        const success = await storage.deleteModel(model.id);
        if (success) deletedModels++;
      }

      // Delete orphaned variants
      for (const variant of orphanedVariants) {
        console.log(`🗑️ Deleting orphaned variant: ${variant.name} (${variant.id})`);
        const success = await storage.deleteVariant(variant.id);
        if (success) deletedVariants++;
      }

      console.log(`✅ Cleanup completed: ${deletedModels} models, ${deletedVariants} variants deleted`);

      res.json({
        success: true,
        deleted: {
          models: deletedModels,
          variants: deletedVariants
        },
        message: `Cleaned up ${deletedModels} orphaned models and ${deletedVariants} orphaned variants`
      });
    } catch (error) {
      console.error('❌ Cleanup error:', error);
      res.status(500).json({ error: 'Failed to cleanup orphaned data' });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticateToken, async (req: Request, res: Response) => {
    try {
      // Dev bypass: trust the injected req.user
      if (process.env.AUTH_BYPASS === 'true') {
        return res.json({
          success: true,
          user: {
            id: req.user?.id || 'dev-admin',
            email: req.user?.email || 'dev@local',
            name: req.user?.name || 'Developer',
            role: req.user?.role || 'super_admin',
          }
        });
      }
      if (!req.user) {
        return res.status(401).json({
          error: "Not authenticated",
          code: "NOT_AUTHENTICATED"
        });
      }

      const user = await storage.getAdminUserById(req.user.id);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND"
        });
      }

      res.json({
        success: true,
        user: sanitizeUser(user)
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  });

  // Change password
  app.post("/api/auth/change-password", authenticateToken, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: "Current password and new password are required",
          code: "MISSING_FIELDS"
        });
      }

      // Validate new password strength
      const passwordValidation = isStrongPassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: "Password does not meet requirements",
          code: "WEAK_PASSWORD",
          details: passwordValidation.errors
        });
      }

      // Get user
      const user = await storage.getAdminUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({
          error: "User not found",
          code: "USER_NOT_FOUND"
        });
      }

      // Verify current password
      const isValid = await comparePassword(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({
          error: "Current password is incorrect",
          code: "INVALID_PASSWORD"
        });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password (you'll need to add this method to storage)
      // For now, we'll return success
      res.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        error: "Internal server error",
        code: "SERVER_ERROR"
      });
    }
  });

  // ============================================
  // FILE UPLOAD ROUTES
  // ============================================

  // File upload endpoint for logos with WebP conversion and R2 support
  app.post("/api/upload/logo",
    authenticateToken,
    modifyLimiter,
    upload.single('logo'),
    validateFileUpload,
    imageProcessingConfigs.logo,
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const processedImages = (req as any).processedImages || [];
      const compressionInfo = processedImages.length > 0 ? {
        originalSize: processedImages[0].originalSize,
        compressedSize: processedImages[0].compressedSize,
        compressionRatio: processedImages[0].compressionRatio,
        format: processedImages[0].format
      } : null;

      // Default to local URL (same pattern as model images)
      let fileUrl = `/uploads/${req.file.filename}`;

      // Upload to R2 if configured (mirror /api/upload/image behaviour)
      const bucket = process.env.R2_BUCKET;
      const requireR2 = process.env.REQUIRE_R2 === 'true' || process.env.NODE_ENV === 'production';

      if (bucket) {
        const accountId = process.env.R2_ACCOUNT_ID;
        const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

        try {
          // Use server-side S3 client (no CORS issues)
          const client = new S3Client({
            region: process.env.R2_REGION || 'auto',
            endpoint,
            credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            } : undefined,
            forcePathStyle: true,
          });

          const now = new Date();
          const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
          const key = `uploads/logos/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}/${randomUUID()}-${safeName.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
          const body = readFileSync(req.file.path);

          // Server-side upload (bypasses CORS completely)
          const metadata: Record<string, string> = {
            'original-name': req.file.originalname,
            'upload-date': now.toISOString(),
          };

          if (compressionInfo) {
            if (typeof compressionInfo.originalSize === 'number') {
              metadata['original-size'] = compressionInfo.originalSize.toString();
            }
            if (typeof compressionInfo.compressedSize === 'number') {
              metadata['compressed-size'] = compressionInfo.compressedSize.toString();
            }
            if (typeof compressionInfo.compressionRatio === 'number') {
              metadata['compression-ratio'] = compressionInfo.compressionRatio.toString();
            }
          }

          await client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable',
            Metadata: metadata
          }));

          const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint ? `${endpoint}/${bucket}` : '');
          if (publicBase) {
            fileUrl = `${publicBase}/${key}`;
          } else {
            throw new Error('R2_PUBLIC_BASE_URL not configured - cannot generate public URL');
          }

          // Clean up temp file
          fs.unlinkSync(req.file.path);

          console.log(`✅ Logo uploaded to R2 successfully: ${fileUrl}`);
        } catch (error) {
          console.error('❌ R2 logo upload failed:', {
            error: error instanceof Error ? error.message : String(error),
            bucket: bucket,
            endpoint: endpoint,
            hasCredentials: !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY)
          });
          console.error('📋 Full error details:', error);

          // In production or when R2 is required, fail the upload
          if (requireR2) {
            const message = error instanceof Error ? error.message : String(error);
            return res.status(500).json({
              error: 'Cloud storage upload failed. Logo not saved.',
              details: message,
              suggestion: 'Please check R2 configuration or try again later.'
            });
          }

          console.warn('⚠️  Logo upload falling back to local storage (will be lost on restart!)');
          // Fall through to local storage (development only)
        }
      } else {
        if (requireR2) {
          return res.status(500).json({
            error: 'Cloud storage not configured. Cannot upload logo.',
            suggestion: 'Please configure R2_BUCKET and related environment variables.'
          });
        }
        console.warn('⚠️  R2 not configured for logo upload, using local storage (files will be lost on restart!)');
      }

      // Final response mirrors /api/upload/image
      res.json({
        url: fileUrl,
        processed: true,
        format: 'webp',
        compression: compressionInfo,
        storage: fileUrl.startsWith('http') ? 'r2' : 'local'
      });
    }
  );

  // ...
  // Generic image upload endpoint for model images with WebP conversion and R2 support
  app.post("/api/upload/image",
    authenticateToken,
    modifyLimiter,
    upload.single('image'),
    validateFileUpload,
    imageProcessingConfigs.gallery,
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const processedImages = (req as any).processedImages || [];
      const compressionInfo = processedImages.length > 0 ? {
        originalSize: processedImages[0].originalSize,
        webpSize: processedImages[0].webpSize,
        compressionRatio: processedImages[0].compressionRatio
      } : null;

      // Default to local URL
      let fileUrl = `/uploads/${req.file.filename}`;

      // Upload to R2 if configured (server-side upload to avoid CORS issues)
      const bucket = process.env.R2_BUCKET;
      if (bucket) {
        const accountId = process.env.R2_ACCOUNT_ID;
        const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

        try {

          // Use server-side S3 client (no CORS issues)
          const client = new S3Client({
            region: process.env.R2_REGION || 'auto',
            endpoint,
            credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
              accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
            } : undefined,
            forcePathStyle: true,
          });

          const now = new Date();
          const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
          const key = `uploads/images/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}/${randomUUID()}-${safeName.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`;
          const body = readFileSync(req.file.path);

          // Server-side upload (bypasses CORS completely)
          await client.send(new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
            ContentType: req.file.mimetype || 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable',
            Metadata: {
              'original-name': req.file.originalname,
              'upload-date': new Date().toISOString(),
              ...(compressionInfo && {
                'original-size': compressionInfo.originalSize.toString(),
                'webp-size': compressionInfo.webpSize.toString(),
                'compression-ratio': compressionInfo.compressionRatio.toString()
              })
            }
          }));

          const publicBase = process.env.R2_PUBLIC_BASE_URL || (endpoint ? `${endpoint}/${bucket}` : '');
          if (publicBase) {
            fileUrl = `${publicBase}/${key}`;
          }

          // Clean up temp file
          fs.unlinkSync(req.file.path);

          console.log(`✅ Image uploaded to R2 (server-side): ${fileUrl}`);
        } catch (error: any) {
          console.error('❌ R2 image upload failed:', {
            error: error.message,
            bucket: bucket,
            endpoint: endpoint,
            hasCredentials: !!(process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY)
          });
          console.error('📋 Full error details:', error);
          // In production, optionally fail hard instead of falling back to local storage
          if (process.env.REQUIRE_R2 === 'true') {
            return res.status(500).json({ error: 'Cloud storage unavailable. Please try again later.' });
          }
          // Keep local URL as fallback but warn user
          console.warn(`⚠️  Using local fallback URL: ${fileUrl} (will be lost on restart!)`);
        }
      } else {
        console.warn('⚠️  R2 not configured, using local storage (files will be lost on restart!)');
      }

      res.json({
        url: fileUrl,
        filename: req.file.filename,
        processed: true,
        format: 'webp',
        compression: compressionInfo
      });
    }
  );

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Presigned upload (R2/S3) - secure direct uploads
  app.post('/api/uploads/presign', authenticateToken, modifyLimiter, async (req, res) => {
    try {
      const { filename, contentType } = req.body as { filename?: string; contentType?: string };
      if (!filename || !contentType) {
        return res.status(400).json({ error: 'filename and contentType are required' });
      }

      const bucket = process.env.R2_BUCKET;
      if (!bucket) {
        return res.status(500).json({ error: 'R2 bucket not configured' });
      }

      // Lazily init S3 client for R2
      const accountId = process.env.R2_ACCOUNT_ID;
      const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
      const client = new S3Client({
        region: process.env.R2_REGION || 'auto',
        endpoint,
        credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
          accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        } : undefined,
        forcePathStyle: true,
      });

      const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      const now = new Date();
      const key = `uploads/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}/${randomUUID()}-${safeName}`;

      const cmd = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      });
      const uploadUrl = await getSignedUrl(client, cmd, { expiresIn: 600 }); // 10 minutes

      const publicBase = process.env.R2_PUBLIC_BASE_URL || `${endpoint}/${bucket}`;
      const publicUrl = `${publicBase}/${key}`;

      return res.json({ uploadUrl, publicUrl, key });
    } catch (error) {
      console.error('presign error:', error);
      return res.status(500).json({ error: 'Failed to generate presigned URL' });
    }
  });

  // Delete object from R2/S3
  app.delete('/api/uploads/object', authenticateToken, modifyLimiter, async (req, res) => {
    try {
      const { key, url } = req.body as { key?: string; url?: string };
      if (!key && !url) {
        return res.status(400).json({ error: 'key or url is required' });
      }

      const bucket = process.env.R2_BUCKET as string;
      if (!bucket) {
        return res.status(500).json({ error: 'R2 bucket not configured' });
      }

      const accountId = process.env.R2_ACCOUNT_ID;
      const endpoint = process.env.R2_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
      const client = new S3Client({
        region: process.env.R2_REGION || 'auto',
        endpoint,
        credentials: process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY ? {
          accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
        } : undefined,
        forcePathStyle: true,
      });

      let objectKey = key;
      if (!objectKey && url) {
        const publicBase = process.env.R2_PUBLIC_BASE_URL || '';
        if (publicBase && url.startsWith(publicBase)) {
          objectKey = url.slice(publicBase.length).replace(/^\//, '');
        } else if (endpoint) {
          const apiBase = `${endpoint}/${bucket}/`;
          if (url.startsWith(apiBase)) {
            objectKey = url.slice(apiBase.length);
          }
        }
      }

      if (!objectKey) {
        return res.status(400).json({ error: 'Unable to derive object key from url' });
      }

      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: objectKey }));
      return res.json({ success: true, key: objectKey });
    } catch (error) {
      console.error('delete object error:', error);
      return res.status(500).json({ error: 'Failed to delete object' });
    }
  });

  // Stats (with Redis caching)
  app.get("/api/stats", redisCacheMiddleware(RedisCacheTTL.STATS), async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Brands - with active/inactive filter for frontend (public endpoint + Redis caching)
  app.get("/api/brands", publicLimiter, redisCacheMiddleware(RedisCacheTTL.BRANDS), async (req, res) => {
    try {
      // Set browser cache headers (1 hour)
      res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');

      const includeInactive = req.query.includeInactive === 'true';
      const brands = await storage.getBrands(includeInactive, !includeInactive);
      const transformed = brands.map(brand => ({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req)
      }));
      res.json(transformed);
    } catch (error) {
      console.error('Error getting brands:', error);
      res.status(500).json({ error: "Failed to get brands" });
    }
  });

  app.get("/api/brands/available-rankings", redisCacheMiddleware(RedisCacheTTL.STATS), async (req, res) => {
    const excludeBrandId = req.query.excludeBrandId as string | undefined;
    const availableRankings = await storage.getAvailableRankings(excludeBrandId);
    res.json(availableRankings);
  });

  // Get formatted brand summary with proper sections
  app.get("/api/brands/:id/formatted", redisCacheMiddleware(RedisCacheTTL.BRANDS), async (req, res) => {
    try {
      const brand = await storage.getBrand(req.params.id);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      // Format the summary with proper sections
      const formattedSummary = formatBrandSummary(brand.summary || '', brand.name);

      res.json({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req),
        formattedSummary
      });
    } catch (error) {
      console.error('Error getting formatted brand:', error);
      res.status(500).json({ error: "Failed to get formatted brand" });
    }
  });

  app.get("/api/brands/:id", redisCacheMiddleware(RedisCacheTTL.BRANDS), async (req, res) => {
    const brand = await storage.getBrand(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json({
      ...brand,
      logo: buildPublicAssetUrl(brand.logo, req)
    });
  });

  app.post("/api/brands", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('Received brand data:', JSON.stringify(req.body, null, 2));
      const validatedData = insertBrandSchema.parse(req.body);
      console.log('Validated data:', JSON.stringify(validatedData, null, 2));
      const brand = await storage.createBrand(validatedData);

      // Backup after create
      await triggerBackup('brands');
      await invalidateRedisCache('/api/brands');

      res.status(201).json({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req)
      });
    } catch (error) {
      console.error('Brand creation error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid brand data" });
      }
    }
  });

  app.patch("/api/brands/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      const brandId = req.params.id;
      const updateData = req.body;

      // If status is being changed, cascade to models and variants
      if (updateData.status) {
        const newStatus = updateData.status;
        console.log(`🔄 Changing brand ${brandId} status to ${newStatus} - cascading to models and variants`);

        // Get MongoDB connection for bulk updates
        const mongoose = (await import('mongoose')).default;
        const db = mongoose.connection.db;

        if (db) {
          // Update all models for this brand
          const modelsResult = await db.collection('models').updateMany(
            { brandId: brandId },
            { $set: { status: newStatus, updatedAt: new Date() } }
          );

          // Update all variants for this brand
          const variantsResult = await db.collection('variants').updateMany(
            { brandId: brandId },
            { $set: { status: newStatus, updatedAt: new Date() } }
          );

          console.log(`✅ Status cascade complete: ${modelsResult.modifiedCount} models and ${variantsResult.modifiedCount} variants updated to ${newStatus}`);
        }
      }

      // Update the brand itself
      const brand = await storage.updateBrand(brandId, updateData);
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }

      // Backup after update
      await triggerBackup('brands');

      // Invalidate all relevant caches
      await invalidateRedisCache('/api/brands');
      await invalidateRedisCache('/api/models');
      await invalidateRedisCache('/api/variants');

      // Rebuild search index to reflect status changes
      invalidateSearchIndex().catch(err => console.error('Search index invalidation failed:', err));

      res.json({
        ...brand,
        logo: buildPublicAssetUrl(brand.logo, req)
      });
    } catch (error) {
      console.error('Brand update error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Failed to update brand" });
      }
    }
  });

  app.delete("/api/brands/:id", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log(`🗑️ DELETE request for brand: ${req.params.id}`);
      const success = await storage.deleteBrand(req.params.id);
      if (!success) {
        console.log(`❌ Brand not found: ${req.params.id}`);
        return res.status(404).json({ error: "Brand not found" });
      }
      console.log(`✅ Brand deleted successfully: ${req.params.id}`);
      await triggerBackup('brands');
      await invalidateRedisCache('/api/brands');
      res.status(204).send();
    } catch (error) {
      console.error(`❌ Error deleting brand ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete brand" });
    }
  });

  // Models (public endpoint + caching + NO PAGINATION)
  app.get("/api/models", publicLimiter, redisCacheMiddleware(RedisCacheTTL.MODELS), async (req, res) => {
    // Set browser cache headers (30 minutes)
    res.set('Cache-Control', 'public, max-age=1800, s-maxage=1800, stale-while-revalidate=3600');

    const brandId = req.query.brandId as string | undefined;
    const fields = req.query.fields as string | undefined;
    const includeInactive = req.query.includeInactive === 'true';

    // Get all models for the brand
    const allModels = await storage.getModels(brandId, includeInactive);

    // Field projection optimization
    if (fields) {
      const fieldList = fields.split(',').map(f => f.trim());
      const projectedModels = allModels.map(m => {
        const projected: any = {};
        const modelAny = m as any;
        fieldList.forEach(field => {
          if (modelAny.hasOwnProperty(field)) {
            projected[field] = modelAny[field];
          }
        });
        return projected;
      });
      return res.json(projectedModels);
    }

    // Return all models directly as an array
    res.json(allModels);
  });

  // Optimized endpoint: Models with aggregated pricing data + PAGINATION
  app.get("/api/models-with-pricing", publicLimiter, redisCacheMiddleware(RedisCacheTTL.MODELS), async (req, res) => {
    try {
      const brandId = req.query.brandId as string | undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 250);
      const skip = (page - 1) * limit;

      // Use optimized MongoDB aggregation with $lookup sub-pipeline
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;

      if (!db) {
        throw new Error('Database connection not established');
      }

      // Get total count first - using aggregation to account for price filter
      const countPipeline = [
        { $match: brandId ? { brandId, status: 'active' } : { status: 'active' } },
        {
          $lookup: {
            from: 'variants',
            localField: 'id',
            foreignField: 'modelId',
            pipeline: [
              { $match: { status: 'active', price: { $gte: 100000 } } },
              { $limit: 1 }
            ],
            as: 'qualifyingVariants'
          }
        },
        { $match: { 'qualifyingVariants.0': { $exists: true } } },
        { $count: 'total' }
      ];

      const countResult = await db.collection('models').aggregate(countPipeline).toArray();
      const totalCount = countResult.length > 0 ? countResult[0].total : 0;

      // Single optimized aggregation pipeline with pagination
      const modelsWithPricing = await db.collection('models').aggregate([
        // Filter by brandId if provided
        ...(brandId ? [{ $match: { brandId, status: 'active' } }] : [{ $match: { status: 'active' } }]),

        // Lookup variants and calculate pricing in one operation
        {
          $lookup: {
            from: 'variants',
            localField: 'id',
            foreignField: 'modelId',
            pipeline: [
              { $match: { status: 'active' } },
              {
                $group: {
                  _id: null,
                  lowestPrice: { $min: '$price' },
                  count: { $sum: 1 }
                }
              }
            ],
            as: 'pricing'
          }
        },

        // Add pricing fields to model document
        {
          $addFields: {
            lowestPrice: {
              $ifNull: [{ $arrayElemAt: ['$pricing.lowestPrice', 0] }, 0]
            },
            variantCount: {
              $ifNull: [{ $arrayElemAt: ['$pricing.count', 0] }, 0]
            }
          }
        },

        // Filter by price (>= 100,000)
        { $match: { lowestPrice: { $gte: 100000 } } },

        // Pagination: Skip and Limit (AFTER price filtering)
        { $skip: skip },
        { $limit: limit },

        // Project only necessary fields to reduce payload size
        {
          $project: {
            _id: 0,
            id: 1,
            name: 1,
            brandId: 1,
            heroImage: 1,
            lowestPrice: 1,
            variantCount: 1,
            fuelTypes: 1,
            transmissions: 1,
            seating: 1,
            launchDate: 1,
            isNew: 1,
            isPopular: 1,
            status: 1,
            popularRank: 1,
            newRank: 1,
            topRank: 1,
            bodyType: 1
          }
        }
      ]).toArray();

      // Return with pagination metadata
      res.json({
        data: modelsWithPricing,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: skip + limit < totalCount
        }
      });
    } catch (error) {
      console.error('Error getting models with pricing:', error);
      res.status(500).json({ error: "Failed to get models with pricing" });
    }
  });

  // ZERO-DB SEARCH API - Uses Redis/Memory index, no MongoDB queries
  // Build search index on startup (called after routes are registered)
  setTimeout(() => {
    buildSearchIndex().catch(err =>
      console.error('❌ Failed to build initial search index:', err)
    );
  }, 5000); // Wait 5s for DB connection

  app.get("/api/search", publicLimiter, async (req, res) => {
    try {
      const startTime = Date.now();
      const query = (req.query.q as string || '').trim();
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);

      if (!query || query.length < 2) {
        return res.json({ results: [], count: 0, took: 0, source: 'none' });
      }

      // 1. Try instant search index (Redis/Memory - 0 DB hits)
      const indexResult = await searchFromIndex(query, limit);

      if (indexResult && indexResult.results.length > 0) {
        return res.json({
          results: indexResult.results,
          count: indexResult.results.length,
          took: Date.now() - startTime,
          query,
          source: indexResult.source,
          matchType: 'index'
        });
      }

      // 2. Try Fuzzy Searching (0 DB hits if matches index terms)
      const { findBestCarMatches } = await import('./ai-engine/fuzzy-match');
      const allIndexResults = inMemoryCacheArray;
      const carNames = allIndexResults.map((r: SearchResult) => r.name);
      const fuzzyMatches = findBestCarMatches(query, carNames, 2);

      if (fuzzyMatches.length > 0 && fuzzyMatches[0].similarity > 0.8) {
        const bestMatchName = fuzzyMatches[0].car;
        const results = allIndexResults.filter((r: SearchResult) => r.name === bestMatchName).slice(0, limit);

        if (results.length > 0) {
          return res.json({
            results,
            count: results.length,
            took: Date.now() - startTime,
            query,
            source: 'memory-fuzzy',
            matchType: 'fuzzy'
          });
        }
      }

      // 3. Try Semantic Search (0 DB hits if cached in vector-store-cache.json)
      const { semanticCarSearch } = await import('./ai-engine/vector-store');
      try {
        const semanticResults = await semanticCarSearch(query, {}, limit);
        if (semanticResults.length > 0) {
          // Map semantic results to standard SearchResult format
          const results = semanticResults.map(item => ({
            id: item.id,
            name: item.name,
            brandName: item.brandName,
            brandSlug: item.brandSlug,
            modelSlug: item.modelSlug,
            slug: item.slug,
            heroImage: item.heroImage || ''
          }));

          return res.json({
            results,
            count: results.length,
            took: Date.now() - startTime,
            query,
            source: 'vector-cache',
            matchType: 'semantic'
          });
        }
      } catch (e) {
        console.warn('Semantic search failed in route, continuing...', e);
      }

      // 4. Fallback to MongoDB (Absolute Last Resort)
      console.log(`⚠️ Search index miss for "${query}", falling back to MongoDB`);

      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not established');

      const searchRegex = new RegExp(query.split(' ').join('.*'), 'i');
      const [models, brands] = await Promise.all([
        db.collection('models').find({
          $or: [{ name: searchRegex }, { brandId: searchRegex }],
          status: 'active'
        }).limit(limit).toArray(),
        db.collection('brands').find({}, { projection: { _id: 0, id: 1, name: 1 } }).toArray()
      ]);

      const brandMap = brands.reduce((acc: any, b: any) => { acc[b.id] = b.name; return acc; }, {});
      const results = models.map((model: any) => {
        const brandName = brandMap[model.brandId] || 'Unknown';
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');
        const modelSlug = model.name.toLowerCase().replace(/\s+/g, '-');
        return {
          id: model.id,
          name: model.name,
          brandName,
          brandSlug,
          modelSlug,
          slug: `${brandSlug}-${modelSlug}`,
          heroImage: model.heroImage || ''
        };
      });

      res.json({
        results,
        count: results.length,
        took: Date.now() - startTime,
        query,
        source: 'mongodb',
        matchType: 'fallback'
      });
    } catch (error) {
      console.error('Error in search:', error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // Search index stats endpoint (for debugging)
  app.get("/api/search/stats", async (req, res) => {
    const stats = getSearchIndexStats();
    res.json(stats);
  });

  // OPTIMIZED CARS BY BUDGET API - Server-side filtering with pagination and caching
  app.get("/api/cars-by-budget/:budget", publicLimiter, redisCacheMiddleware(RedisCacheTTL.MODELS), async (req, res) => {
    try {
      const startTime = Date.now();
      const budget = req.query.budget as string || req.params.budget;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const skip = (page - 1) * limit;

      // Set browser cache headers (5 minutes)
      res.set('Cache-Control', 'public, max-age=300, s-maxage=300, stale-while-revalidate=600');

      // Define budget ranges (same as frontend)
      const budgetRanges: Record<string, { min: number; max: number; label: string }> = {
        'under-5-lakh': { min: 0, max: 500000, label: 'Under ₹5 Lakh' },
        'under-8-lakh': { min: 0, max: 800000, label: 'Under ₹8 Lakh' },
        'under-8': { min: 0, max: 800000, label: 'Under ₹8 Lakh' },
        'under-10': { min: 0, max: 1000000, label: 'Under ₹10 Lakh' },
        'under-15': { min: 0, max: 1500000, label: 'Under ₹15 Lakh' },
        'under-20': { min: 0, max: 2000000, label: 'Under ₹20 Lakh' },
        'under-25': { min: 0, max: 2500000, label: 'Under ₹25 Lakh' },
        'under-30': { min: 0, max: 3000000, label: 'Under ₹30 Lakh' },
        'under-40': { min: 0, max: 4000000, label: 'Under ₹40 Lakh' },
        'under-50': { min: 0, max: 5000000, label: 'Under ₹50 Lakh' },
        'under-60': { min: 0, max: 6000000, label: 'Under ₹60 Lakh' },
        'under-80': { min: 0, max: 8000000, label: 'Under ₹80 Lakh' },
        'under-100': { min: 0, max: 10000000, label: 'Under ₹1 Crore' },
        'above-50': { min: 5000001, max: 999999999, label: 'Above ₹50 Lakh' },
        'above-100': { min: 10000001, max: 999999999, label: 'Above ₹1 Crore' }
      };

      const currentBudget = budgetRanges[budget] || budgetRanges['under-8'];

      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;

      if (!db) {
        throw new Error('Database connection not established');
      }

      // Get brands for mapping
      const brands = await db.collection('brands').find({}, {
        projection: { _id: 0, id: 1, name: 1 }
      }).toArray();

      const brandMap = brands.reduce((acc: any, brand: any) => {
        acc[brand.id] = brand.name;
        return acc;
      }, {});

      // Optimized aggregation pipeline with budget filtering
      const pipeline = [
        { $match: { status: 'active' } },

        // Lookup variants to get pricing
        {
          $lookup: {
            from: 'variants',
            localField: 'id',
            foreignField: 'modelId',
            pipeline: [
              { $match: { status: 'active' } },
              {
                $group: {
                  _id: null,
                  lowestPrice: { $min: '$price' },
                  fuelTypes: { $addToSet: '$fuel' },
                  transmissions: { $addToSet: '$transmission' },
                  count: { $sum: 1 }
                }
              }
            ],
            as: 'variantData'
          }
        },

        // Add computed fields
        {
          $addFields: {
            startingPrice: {
              $ifNull: [{ $arrayElemAt: ['$variantData.lowestPrice', 0] }, 0]
            },
            variantCount: {
              $ifNull: [{ $arrayElemAt: ['$variantData.count', 0] }, 0]
            },
            fuelTypes: {
              $ifNull: [{ $arrayElemAt: ['$variantData.fuelTypes', 0] }, []]
            },
            transmissions: {
              $ifNull: [{ $arrayElemAt: ['$variantData.transmissions', 0] }, []]
            }
          }
        },

        // Filter by budget range and minimum price (100,000)
        {
          $match: {
            startingPrice: {
              $gte: Math.max(currentBudget.min, 100000),
              $lte: currentBudget.max
            }
          }
        },

        // Sort by price (ascending)
        { $sort: { startingPrice: 1 } }
      ];

      // Get total count for pagination
      const countPipeline = [...pipeline, { $count: 'total' }];
      const countResult = await db.collection('models').aggregate(countPipeline).toArray();
      const totalCount = countResult.length > 0 ? countResult[0].total : 0;

      // Get paginated results
      const resultsPipeline = [
        ...pipeline,
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            variantData: 0,
            _id: 0
          }
        }
      ];

      const cars = await db.collection('models').aggregate(resultsPipeline).toArray();

      // Process cars to match frontend format
      const processedCars = cars.map((car: any) => {
        const brandName = brandMap[car.brandId] || 'Unknown';
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');
        const modelSlug = car.name.toLowerCase().replace(/\s+/g, '-');

        // Resolve image URL
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
        const heroImage = car.heroImage
          ? (car.heroImage.startsWith('http') ? car.heroImage : `${backendUrl}${car.heroImage}`)
          : '';

        return {
          id: car.id,
          name: car.name,
          brand: car.brandId,
          brandId: car.brandId,
          brandName,
          image: heroImage,
          startingPrice: car.startingPrice || 0,
          fuelTypes: car.fuelTypes && car.fuelTypes.length > 0 ? car.fuelTypes : ['Petrol'],
          transmissions: car.transmissions && car.transmissions.length > 0 ? car.transmissions : ['Manual'],
          seating: car.seating || 5,
          launchDate: car.launchDate || '',
          slug: `${brandSlug}-${modelSlug}`,
          isNew: car.isNew || false,
          isPopular: car.isPopular || false,
          rating: 0,
          reviews: 0,
          variants: car.variantCount || 0
        };
      });

      const took = Date.now() - startTime;

      res.json({
        data: processedCars,
        budget: {
          slug: budget,
          label: currentBudget.label,
          min: currentBudget.min,
          max: currentBudget.max
        },
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: skip + limit < totalCount
        },
        performance: {
          took,
          cached: false
        }
      });
    } catch (error) {
      console.error('Error in cars-by-budget:', error);
      res.status(500).json({ error: "Failed to get cars by budget" });
    }
  });

  // OPTIMIZED COMPARE API - Server-side data aggregation for comparison pages
  app.get("/api/compare/:slug", publicLimiter, redisCacheMiddleware(RedisCacheTTL.MODELS), async (req, res) => {
    try {
      const startTime = Date.now();
      const slug = req.params.slug;

      // Set browser cache headers (10 minutes)
      res.set('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=1200');

      // Parse slug (e.g., "tata-nexon-vs-hyundai-creta")
      const parts = slug.split('-vs-');
      if (parts.length < 2) {
        return res.status(400).json({ error: "Invalid comparison slug. Format: model1-vs-model2" });
      }

      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;

      if (!db) {
        throw new Error('Database connection not established');
      }

      // Get all brands for mapping
      const brands = await db.collection('brands').find({}, {
        projection: { _id: 0, id: 1, name: 1 }
      }).toArray();

      const brandMap = brands.reduce((acc: any, brand: any) => {
        acc[brand.id] = brand.name;
        return acc;
      }, {});

      // Get all models to find the comparison models
      const models = await db.collection('models').find(
        { status: 'active' },
        { projection: { _id: 0 } }
      ).toArray();

      // Function to find model by slug
      const findModelBySlug = (targetSlug: string) => {
        return models.find((m: any) => {
          const brandName = brandMap[m.brandId] || '';
          const modelSlug = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${m.name.toLowerCase().replace(/\s+/g, '-')}`;
          return modelSlug === targetSlug;
        });
      };

      // Find the comparison models
      const comparisonModels = [];
      const modelIds = [];

      for (const part of parts) {
        const model = findModelBySlug(part);
        if (model) {
          comparisonModels.push(model);
          modelIds.push(model.id);
        }
      }

      if (comparisonModels.length < 2) {
        return res.status(404).json({ error: "One or more comparison models not found" });
      }

      // Get variants for the comparison models
      const variants = await db.collection('variants').find({
        modelId: { $in: modelIds },
        status: 'active'
      }, {
        projection: { _id: 0 }
      }).toArray();

      // Organize variants by model
      const variantsByModel: Record<string, any[]> = {};
      modelIds.forEach(id => { variantsByModel[id] = []; });
      variants.forEach((v: any) => {
        if (variantsByModel[v.modelId]) {
          variantsByModel[v.modelId].push(v);
        }
      });

      // Build comparison data
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:5001';
      const comparisonData = comparisonModels.map((model: any) => {
        const modelVariants = variantsByModel[model.id] || [];
        const lowestVariant = modelVariants.length > 0
          ? modelVariants.reduce((prev, curr) =>
            (curr.price < prev.price && curr.price > 0) ? curr : prev
          )
          : null;

        const heroImage = model.heroImage
          ? (model.heroImage.startsWith('http') ? model.heroImage : `${backendUrl}${model.heroImage}`)
          : '';

        return {
          model: {
            id: model.id,
            name: model.name,
            brandId: model.brandId,
            brandName: brandMap[model.brandId] || 'Unknown',
            heroImage,
            slug: `${(brandMap[model.brandId] || '').toLowerCase().replace(/\s+/g, '-')}-${model.name.toLowerCase().replace(/\s+/g, '-')}`,
            isNew: model.isNew || false,
            isPopular: model.isPopular || false
          },
          variants: modelVariants,
          lowestVariant: lowestVariant || (modelVariants.length > 0 ? modelVariants[0] : null)
        };
      });

      // Get similar cars (same price range, exclude comparison models)
      // Get similar cars based on body type and sub-body type of BOTH compared cars
      const avgPrice = comparisonData.reduce((sum, item) => {
        return sum + (item.lowestVariant?.price || 0);
      }, 0) / comparisonData.length;

      const priceMin = avgPrice * 0.7;
      const priceMax = avgPrice * 1.3;

      const bodyTypes = comparisonModels.map((m: any) => m.bodyType).filter(Boolean);
      const subBodyTypes = comparisonModels.map((m: any) => m.subBodyType).filter(Boolean);


      const similarCars = await db.collection('models').aggregate([
        {
          $match: {
            status: 'active',
            id: { $nin: modelIds },
            // Match if bodyType or subBodyType matches ANY of the compared cars
            $or: [
              { bodyType: { $in: bodyTypes } },
              { subBodyType: { $in: subBodyTypes } }
            ]
          }
        },
        {
          $lookup: {
            from: 'variants',
            localField: 'id',
            foreignField: 'modelId',
            pipeline: [
              { $match: { status: 'active' } },
              {
                $group: {
                  _id: null,
                  lowestPrice: { $min: '$price' },
                  lowestPriceFuelType: { $first: '$fuel' }
                }
              }
            ],
            as: 'pricing'
          }
        },
        {
          $addFields: {
            startingPrice: {
              $ifNull: [{ $arrayElemAt: ['$pricing.lowestPrice', 0] }, 0]
            },
            lowestPriceFuelType: {
              $ifNull: [{ $arrayElemAt: ['$pricing.lowestPriceFuelType', 0] }, 'Petrol']
            }
          }
        },
        // Filter by price range (±30% of average) and minimum price (100,000)
        {
          $match: {
            startingPrice: {
              $gte: Math.max(priceMin, 100000),
              $lte: priceMax
            }
          }
        },
        // Sort by popularity and new launches
        { $sort: { isPopular: -1, isNew: -1, popularRank: 1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            pricing: 0
          }
        }
      ]).toArray();

      const similarCarsFormatted = similarCars.map((car: any) => {
        const brandName = brandMap[car.brandId] || 'Unknown';
        const heroImage = car.heroImage
          ? (car.heroImage.startsWith('http') ? car.heroImage : `${backendUrl}${car.heroImage}`)
          : '';

        return {
          id: car.id,
          name: car.name,
          brand: car.brandId,
          brandName: brandName,
          image: heroImage,
          startingPrice: car.startingPrice || 0,
          lowestPriceFuelType: car.lowestPriceFuelType || 'Petrol',
          fuelTypes: car.fuelTypes || ['Petrol'],
          transmissions: car.transmissions || ['Manual'],
          seating: car.seating || 5,
          launchDate: car.launchDate || new Date().toISOString(),
          slug: `${brandName.toLowerCase().replace(/\s+/g, '-')}-${car.name.toLowerCase().replace(/\s+/g, '-')}`,
          isNew: car.isNew || false,
          isPopular: car.isPopular || false,
          bodyType: car.bodyType,
          subBodyType: car.subBodyType
        };
      });

      const took = Date.now() - startTime;

      res.json({
        slug,
        comparison: comparisonData,
        similarCars: similarCarsFormatted,
        brands,
        performance: {
          took,
          cached: false
        }
      });
    } catch (error) {
      console.error('Error in compare endpoint:', error);
      res.status(500).json({ error: "Failed to get comparison data" });
    }
  });

  // Get model by ID with Redis caching
  app.get("/api/models/:id",
    redisCacheMiddleware(RedisCacheTTL.MODEL_DETAILS), // ✅ 1-hour cache
    async (req, res) => {
      // Set browser cache headers
      res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');

      const model = await storage.getModel(req.params.id);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      res.json(model);
    }
  );

  app.post("/api/models", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('Received model data:', JSON.stringify(req.body, null, 2));
      const validatedData = insertModelSchema.parse(req.body);
      console.log('Validated data:', JSON.stringify(validatedData, null, 2));
      const model = await storage.createModel(validatedData);

      // Invalidate both lists
      await invalidateRedisCache('/api/models');
      await invalidateRedisCache('/api/models-with-pricing');

      // Rebuild search index with new model
      invalidateSearchIndex().catch(err => console.error('Search index invalidation failed:', err));

      // Send new launch alert emails (async, don't block response)
      if (process.env.EMAIL_SCHEDULER_ENABLED === 'true') {
        import('./services/email-scheduler.service').then(({ emailScheduler }) => {
          // Get brand name for the email
          storage.getBrand(validatedData.brandId).then(brand => {
            const modelWithBrand = {
              ...model,
              brandName: brand?.name || 'Unknown',
              startingPrice: (req.body as any).price || 0
            };
            emailScheduler.sendNewLaunchAlert(modelWithBrand).catch(err => {
              console.error('Failed to send new launch alert:', err);
            });
          });
        }).catch(err => {
          console.error('Failed to load email scheduler:', err);
        });
      }

      res.status(201).json(model);
    } catch (error) {
      console.error('Model creation error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid model data" });
      }
    }
  });

  // PUT route for model updates (used by progressive saving)
  app.put("/api/models/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('🔄 PUT - Updating model:', req.params.id);
      console.log('📊 Update data received:', JSON.stringify(req.body, null, 2));

      const model = await storage.updateModel(req.params.id, req.body);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }

      console.log('✅ Model updated successfully via PUT');

      // Invalidate models cache so frontend sees updated data
      await invalidateRedisCache('/api/models');
      await invalidateRedisCache('/api/models-with-pricing');
      console.log('🗑️ Models cache invalidated');

      // Rebuild search index with updated model
      invalidateSearchIndex().catch(err => console.error('Search index invalidation failed:', err));

      res.json(model);
    } catch (error) {
      console.error('❌ Model PUT update error:', error);
      res.status(500).json({ error: "Failed to update model" });
    }
  });

  app.patch("/api/models/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('🔄 PATCH - Updating model:', req.params.id);
      console.log('📊 Update data received:', JSON.stringify(req.body, null, 2));
      console.log('🎨 Color Images in request:', req.body.colorImages);
      console.log('🎨 Color Images length:', req.body.colorImages?.length || 0);

      const model = await storage.updateModel(req.params.id, req.body);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }

      console.log('✅ Model updated successfully via PATCH');
      console.log('📊 Updated model image data:');
      console.log('- Hero Image:', model.heroImage);
      console.log('- Gallery Images:', model.galleryImages?.length || 0, 'images');
      console.log('- Key Feature Images:', model.keyFeatureImages?.length || 0, 'images');
      console.log('- Space Comfort Images:', model.spaceComfortImages?.length || 0, 'images');
      console.log('- Storage Convenience Images:', model.storageConvenienceImages?.length || 0, 'images');
      console.log('- Color Images:', model.colorImages?.length || 0, 'images');
      console.log('🎨 Color Images saved:', JSON.stringify(model.colorImages, null, 2));

      // Invalidate models cache
      await invalidateRedisCache('/api/models');
      console.log('🗑️ Models cache invalidated');

      // Rebuild search index with updated model
      invalidateSearchIndex().catch(err => console.error('Search index invalidation failed:', err));

      res.json(model);
    } catch (error) {
      console.error('❌ Model PATCH update error:', error);
      res.status(500).json({ error: "Failed to update model" });
    }
  });

  app.delete("/api/models/:id", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log(`🗑️ DELETE request for model: ${req.params.id}`);
      const success = await storage.deleteModel(req.params.id);
      if (!success) {
        console.log(`❌ Model not found: ${req.params.id}`);
        return res.status(404).json({ error: "Model not found" });
      }
      console.log(`✅ Model deleted successfully: ${req.params.id}`);
      await triggerBackup('models');

      // Rebuild search index without deleted model
      invalidateSearchIndex().catch(err => console.error('Search index invalidation failed:', err));

      res.status(204).send();
    } catch (error) {
      console.error(`❌ Error deleting model ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete model" });
    }
  });

  // ============================================
  // UPCOMING CARS ROUTES
  // ============================================

  // Get all upcoming cars (public endpoint with caching)
  app.get("/api/upcoming-cars", publicLimiter, redisCacheMiddleware(RedisCacheTTL.MODELS), async (req, res) => {
    try {
      // Set browser cache headers (15 minutes)
      res.set('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=1800');

      const brandId = req.query.brandId as string | undefined;
      const upcomingCars = await storage.getUpcomingCars(brandId, true);
      res.json(upcomingCars);
    } catch (error) {
      console.error('Get upcoming cars error:', error);
      res.status(500).json({ error: "Failed to fetch upcoming cars" });
    }
  });

  // Get single upcoming car by ID (public endpoint with caching)
  app.get("/api/upcoming-cars/:id",
    redisCacheMiddleware(RedisCacheTTL.MODEL_DETAILS),
    async (req, res) => {
      // Set browser cache headers (1 hour)
      res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');

      const upcomingCar = await storage.getUpcomingCar(req.params.id);
      if (!upcomingCar) {
        return res.status(404).json({ error: "Upcoming car not found" });
      }
      res.json(upcomingCar);
    }
  );

  // Create upcoming car (authenticated)
  app.post("/api/upcoming-cars", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('Received upcoming car data:', JSON.stringify(req.body, null, 2));
      const { insertUpcomingCarSchema } = await import('./validation/schemas');
      const validatedData = insertUpcomingCarSchema.parse(req.body);
      console.log('Validated data:', JSON.stringify(validatedData, null, 2));
      const upcomingCar = await storage.createUpcomingCar(validatedData);

      // Invalidate cache
      // Key format: cache:v2:upcoming-cars:/api/upcoming-cars:...
      await invalidateRedisCache('v2:upcoming-cars');

      res.status(201).json(upcomingCar);
    } catch (error) {
      console.error('Upcoming car creation error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: "Invalid upcoming car data" });
      }
    }
  });

  // PUT route for upcoming car updates (used by progressive saving)
  app.put("/api/upcoming-cars/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('🔄 PUT - Updating upcoming car:', req.params.id);
      console.log('📊 Update data received:', JSON.stringify(req.body, null, 2));

      const upcomingCar = await storage.updateUpcomingCar(req.params.id, req.body);
      if (!upcomingCar) {
        return res.status(404).json({ error: "Upcoming car not found" });
      }

      console.log('✅ Upcoming car updated successfully via PUT');

      // Invalidate cache
      await invalidateRedisCache('v2:upcoming-cars');
      console.log('🗑️ Upcoming cars cache invalidated');

      res.json(upcomingCar);
    } catch (error) {
      console.error('❌ Upcoming car PUT update error:', error);
      res.status(500).json({ error: "Failed to update upcoming car" });
    }
  });

  // PATCH route for partial upcoming car updates
  app.patch("/api/upcoming-cars/:id", authenticateToken, modifyLimiter, securityMiddleware, async (req, res) => {
    try {
      console.log('🔄 PATCH - Updating upcoming car:', req.params.id);
      console.log('📊 Update data received:', JSON.stringify(req.body, null, 2));

      const upcomingCar = await storage.updateUpcomingCar(req.params.id, req.body);
      if (!upcomingCar) {
        return res.status(404).json({ error: "Upcoming car not found" });
      }

      console.log('✅ Upcoming car updated successfully via PATCH');

      // Invalidate cache
      await invalidateRedisCache('v2:upcoming-cars');
      console.log('🗑️ Upcoming cars cache invalidated');

      res.json(upcomingCar);
    } catch (error) {
      console.error('❌ Upcoming car PATCH update error:', error);
      res.status(500).json({ error: "Failed to update upcoming car" });
    }
  });

  // Delete upcoming car (authenticated)
  app.delete("/api/upcoming-cars/:id", authenticateToken, modifyLimiter, async (req, res) => {
    try {
      console.log(`🗑️ DELETE request for upcoming car: ${req.params.id}`);
      const success = await storage.deleteUpcomingCar(req.params.id);
      if (!success) {
        console.log(`❌ Upcoming car not found: ${req.params.id}`);
        return res.status(404).json({ error: "Upcoming car not found" });
      }
      console.log(`✅ Upcoming car deleted successfully: ${req.params.id}`);
      await invalidateRedisCache('v2:upcoming-cars');
      await triggerBackup('upcoming-cars');
      res.status(204).send();
    } catch (error) {
      console.error(`❌ Error deleting upcoming car ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to delete upcoming car" });
    }
  });

  // Get popular cars (optimized endpoint)
  app.get("/api/cars/popular", publicLimiter, redisCacheMiddleware(RedisCacheTTL.POPULAR_CARS), async (req: Request, res: Response) => {
    try {
      // Set browser cache headers (1 hour)
      res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');

      const limit = parseInt(req.query.limit as string) || 20;

      // ✅ OPTIMIZED: Use MongoDB aggregation instead of fetching all variants
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;

      if (!db) {
        throw new Error('Database connection not established');
      }

      // Fetch brands for mapping
      const brands = await storage.getBrands(false, true);
      const brandMap = new Map(brands.map(b => [b.id, b.name]));

      // Single optimized aggregation pipeline
      const popularCarsWithPricing = await db.collection('models').aggregate([
        // Filter for popular cars only
        { $match: { isPopular: true, status: 'active' } },

        // Sort by popularRank
        { $sort: { popularRank: 1 } },

        // Limit results
        { $limit: limit },

        // Lookup variants and calculate pricing in one operation
        {
          $lookup: {
            from: 'variants',
            localField: 'id',
            foreignField: 'modelId',
            pipeline: [
              { $match: { status: 'active' } },
              { $sort: { price: 1 } },  // Sort by price ascending
              {
                $group: {
                  _id: null,
                  lowestPrice: { $min: '$price' },
                  lowestPriceFuelType: { $first: '$fuel' },  // Get fuel type of cheapest variant
                  count: { $sum: 1 }
                }
              }
            ],
            as: 'pricing'
          }
        },

        // Add pricing fields to model document
        {
          $addFields: {
            lowestPrice: {
              $ifNull: [{ $arrayElemAt: ['$pricing.lowestPrice', 0] }, 0]
            },
            lowestPriceFuelType: {
              $ifNull: [{ $arrayElemAt: ['$pricing.lowestPriceFuelType', 0] }, 'Petrol']
            },
            variantCount: {
              $ifNull: [{ $arrayElemAt: ['$pricing.count', 0] }, 0]
            }
          }
        },

        // Filter by price (>= 1,000,00)
        { $match: { lowestPrice: { $gte: 100000 } } },

        // Remove the pricing array (no longer needed)
        {
          $project: {
            pricing: 0,
            _id: 0
          }
        }
      ]).toArray();

      // Format response
      const enrichedModels = popularCarsWithPricing.map((model: any) => {
        const brand = brands.find(b => b.id === model.brandId);
        const fuelTypes = model.fuelTypes && model.fuelTypes.length > 0 ? model.fuelTypes : ['Petrol'];
        const transmissions = model.transmissions && model.transmissions.length > 0 ? model.transmissions : ['Manual'];

        return {
          id: model.id,
          name: model.name,
          brand: brand?.name || 'Unknown',
          brandName: brand?.name || 'Unknown',
          image: model.heroImage || '/placeholder-car.jpg',
          startingPrice: model.lowestPrice || 0,
          lowestPriceFuelType: model.lowestPriceFuelType || 'Petrol',
          fuelTypes: fuelTypes,
          transmissions: transmissions,
          seating: 5,
          launchDate: model.launchDate || new Date().toISOString(),
          // Use model's database slug if available, otherwise generate from name
          slug: model.slug || model.name.toLowerCase().replace(/\s+/g, '-'),
          isNew: model.isNew || false,
          isPopular: model.isPopular || false,
          popularRank: model.popularRank || null,
          newRank: model.newRank || null
        };
      });

      res.json(enrichedModels);
    } catch (error) {
      console.error('Get popular cars error:', error);
      res.status(500).json({ error: "Failed to fetch popular cars" });
    }
  });

  // Get single car by ID (for Favourites)
  app.get("/api/cars/:id", publicLimiter, redisCacheMiddleware(RedisCacheTTL.CAR_DETAILS), async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      let model = await storage.getModel(id);

      // If not found by ID, try finding by slug
      if (!model) {
        const allModels = await storage.getModels();

        // To match by slug, we need brand names
        const brands = await storage.getBrands(false, true);
        const brandMap = new Map(brands.map(b => [b.id, b.name]));

        model = allModels.find(m => {
          // Direct ID match
          if (m.id === id) return true;

          // Construct slug: brand-model
          const brandName = brandMap.get(m.brandId);
          if (!brandName) return false;

          const slug = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${m.name.toLowerCase().replace(/\s+/g, '-')}`;
          return slug === id;
        });
      }

      if (!model) {
        return res.status(404).json({ error: "Car not found" });
      }

      const brand = await storage.getBrand(model.brandId);
      // Use getVariants(modelId) instead of getVariantsByModelId
      const variants = await storage.getVariants(model.id);

      const lowestPrice = variants.length > 0
        ? Math.min(...variants.map((v: any) => v.price || 0))
        : 0;

      // Extract fuel types and transmissions
      const fuelTypes = Array.from(new Set(variants.map((v: any) => v.fuelType).filter(Boolean)));
      const transmissions = Array.from(new Set(variants.map((v: any) => v.transmission).filter(Boolean)));

      const carData = {
        id: model.id,
        name: model.name,
        brand: brand?.name || 'Unknown',
        brandName: brand?.name || 'Unknown',
        image: model.heroImage || '/placeholder-car.jpg',
        startingPrice: lowestPrice,
        fuelTypes: fuelTypes.length > 0 ? fuelTypes : ['Petrol'],
        transmissions: transmissions.length > 0 ? transmissions : ['Manual'],
        seating: 5, // Default
        launchDate: model.launchDate || new Date().toISOString(),
        slug: model.id, // Use ID as slug
        isNew: model.isNew || false,
        isPopular: model.isPopular || false
      };

      res.json(carData);
    } catch (error) {
      console.error(`Error fetching car ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to fetch car details" });
    }
  });

  // Variants (public endpoint + caching + NO PAGINATION)
  app.get("/api/variants", publicLimiter, redisCacheMiddleware(RedisCacheTTL.VARIANTS), async (req, res) => {
    // Set browser cache headers (15 minutes)
    res.set('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=1800');

    const modelId = req.query.modelId as string | undefined;
    const brandId = req.query.brandId as string | undefined;
    const fields = req.query.fields as string | undefined;

    try {
      let allVariants = await storage.getVariants(modelId);

      // Filter by brand if provided
      if (brandId) {
        const models = await storage.getModels(brandId);
        const modelIds = new Set(models.map(m => m.id));
        allVariants = allVariants.filter(v => modelIds.has(v.modelId));
      }

      // Field projection optimization
      if (fields) {
        if (fields === 'minimal') {
          // Minimal fields for list views - expanded to include all display fields
          const minimalVariants = allVariants.map(v => ({
            id: v.id,
            name: v.name,
            price: v.price,
            fuelType: v.fuelType,
            fuel: v.fuel,
            transmission: v.transmission,
            modelId: v.modelId,
            keyFeatures: v.keyFeatures,
            headerSummary: v.headerSummary,
            power: v.power,
            maxPower: v.maxPower,
            enginePower: v.enginePower,
            isValueForMoney: v.isValueForMoney,
            mileage: v.mileageCompanyClaimed,
            mileageCompanyClaimed: v.mileageCompanyClaimed,

            // Comfort & Convenience
            ventilatedSeats: v.ventilatedSeats,
            sunroof: v.sunroof,
            airPurifier: v.airPurifier,
            headsUpDisplay: v.headsUpDisplay,
            cruiseControl: v.cruiseControl,
            rainSensingWipers: v.rainSensingWipers,
            automaticHeadlamp: v.automaticHeadlamp,
            followMeHomeHeadlights: v.followMeHomeHeadlights,
            keylessEntry: v.keylessEntry,
            ignition: v.ignition,
            ambientLighting: v.ambientLighting,
            steeringAdjustment: v.steeringAdjustment,
            airConditioning: v.airConditioning,
            climateZones: v.climateZones,
            rearACVents: v.rearACVents,
            frontArmrest: v.frontArmrest,
            rearArmrest: v.rearArmrest,
            insideRearViewMirror: v.insideRearViewMirror,
            outsideRearViewMirrors: v.outsideRearViewMirrors,
            steeringMountedControls: v.steeringMountedControls,
            rearWindshieldDefogger: v.rearWindshieldDefogger,
            frontWindshieldDefogger: v.frontWindshieldDefogger,
            cooledGlovebox: v.cooledGlovebox,

            // Safety Features
            globalNCAPRating: v.globalNCAPRating,
            airbags: v.airbags,
            airbagsLocation: v.airbagsLocation,
            adasLevel: v.adasLevel,
            adasFeatures: v.adasFeatures,
            reverseCamera: v.reverseCamera,
            reverseCameraGuidelines: v.reverseCameraGuidelines,
            tyrePressureMonitor: v.tyrePressureMonitor,
            hillHoldAssist: v.hillHoldAssist,
            hillDescentControl: v.hillDescentControl,
            rollOverMitigation: v.rollOverMitigation,
            parkingSensor: v.parkingSensor,
            discBrakes: v.discBrakes,
            electronicStabilityProgram: v.electronicStabilityProgram,
            abs: v.abs,
            ebd: v.ebd,
            brakeAssist: v.brakeAssist,
            isofixMounts: v.isofixMounts,
            seatbeltWarning: v.seatbeltWarning,
            speedAlertSystem: v.speedAlertSystem,
            speedSensingDoorLocks: v.speedSensingDoorLocks,
            immobiliser: v.immobiliser,

            // Entertainment & Connectivity
            touchScreenInfotainment: v.touchScreenInfotainment,
            androidAppleCarplay: v.androidAppleCarplay,
            speakers: v.speakers,
            tweeters: v.tweeters,
            subwoofers: v.subwoofers,
            usbCChargingPorts: v.usbCChargingPorts,
            usbAChargingPorts: v.usbAChargingPorts,
            twelvevChargingPorts: v.twelvevChargingPorts,
            wirelessCharging: v.wirelessCharging,
            connectedCarTech: v.connectedCarTech,

            // Engine Data
            engineName: v.engineName,
            engineSummary: v.engineSummary,
            engineTransmission: v.engineTransmission,
            engineTorque: v.engineTorque,
            engineSpeed: v.engineSpeed,
            torque: v.torque,

            // Mileage
            mileageEngineName: v.mileageEngineName,
            mileageCityRealWorld: v.mileageCityRealWorld,
            mileageHighwayRealWorld: v.mileageHighwayRealWorld,

            // Other
            highlightImages: v.highlightImages,
            description: v.description,
            exteriorDesign: v.exteriorDesign,
            comfortConvenience: v.comfortConvenience
          }));
          return res.json(minimalVariants);
        } else {
          // Custom field selection (comma-separated)
          const fieldList = fields.split(',').map(f => f.trim());
          const projectedVariants = allVariants.map(v => {
            const projected: any = {};
            const variantAny = v as any;
            fieldList.forEach(field => {
              if (variantAny.hasOwnProperty(field)) {
                projected[field] = variantAny[field];
              }
            });
            return projected;
          });
          return res.json(projectedVariants);
        }
      }

      // Return all variants directly as an array
      res.json(allVariants);
    } catch (error) {
      console.error('Error fetching variants:', error);
      res.status(500).json({ error: "Failed to fetch variants" });
    }
  });

  app.get("/api/variants/:id", redisCacheMiddleware(RedisCacheTTL.VARIANTS), async (req, res) => {
    const variant = await storage.getVariant(req.params.id);
    if (!variant) {
      return res.status(404).json({ error: "Variant not found" });
    }
    res.json(variant);
  });

  app.post("/api/variants", async (req, res) => {
    try {
      console.log('🚗 Received variant data:', JSON.stringify(req.body, null, 2));

      // Validate required fields
      if (!req.body.brandId || !req.body.modelId || !req.body.name || !req.body.price) {
        console.error('❌ Missing required fields:', {
          brandId: !!req.body.brandId,
          modelId: !!req.body.modelId,
          name: !!req.body.name,
          price: !!req.body.price
        });
        return res.status(400).json({
          error: "Missing required fields: brandId, modelId, name, and price are required"
        });
      }

      const variant = await storage.createVariant(req.body);
      console.log('✅ Variant created successfully:', variant.id);

      // Invalidate variants cache
      await invalidateRedisCache('/api/variants');

      res.status(201).json(variant);
    } catch (error) {
      console.error('❌ Variant creation error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message, stack: error.stack });
      } else {
        res.status(400).json({ error: "Invalid variant data" });
      }
    }
  });

  app.patch("/api/variants/:id", async (req, res) => {
    try {
      console.log('🔄 Updating variant:', req.params.id);
      console.log('📊 Update data received:', JSON.stringify(req.body, null, 2));

      // Get old variant data before update for price comparison
      const oldVariant = await storage.getVariant(req.params.id);

      const variant = await storage.updateVariant(req.params.id, req.body);
      if (!variant) {
        return res.status(404).json({ error: "Variant not found" });
      }

      console.log('✅ Variant updated successfully');

      // Check for price changes and record in history
      if (oldVariant && req.body.price && oldVariant.price !== req.body.price) {
        console.log(`💰 Price change detected: ${oldVariant.price} → ${req.body.price}`);

        // Record price change (async, don't block response)
        if (process.env.EMAIL_SCHEDULER_ENABLED === 'true') {
          import('./services/price-monitoring.service').then(async ({ priceMonitoringService }) => {
            try {
              // Get model and brand info
              const model = await storage.getModel(variant.modelId);
              const brand = model ? await storage.getBrand(model.brandId) : null;

              await priceMonitoringService.recordPriceChange({
                variantId: variant.id,
                modelId: variant.modelId,
                brandId: variant.brandId,
                variantName: variant.name,
                modelName: model?.name || 'Unknown',
                brandName: brand?.name || 'Unknown',
                previousPrice: oldVariant.price,
                newPrice: req.body.price
              });
            } catch (error) {
              console.error('Failed to record price change:', error);
            }
          }).catch(err => {
            console.error('Failed to load price monitoring service:', err);
          });
        }
      }

      // Invalidate variants cache
      invalidateRedisCache('/api/variants');

      res.json(variant);
    } catch (error) {
      console.error('❌ Variant update error:', error);
      res.status(500).json({ error: "Failed to update variant" });
    }
  });

  app.delete("/api/variants/:id", async (req, res) => {
    try {
      console.log('🗑️ DELETE request for variant ID:', req.params.id);

      const success = await storage.deleteVariant(req.params.id);

      if (!success) {
        console.log('❌ Variant not found or delete failed');
        return res.status(404).json({ error: "Variant not found" });
      }

      console.log('✅ Variant deleted successfully, invalidating cache...');

      // Invalidate variants cache
      invalidateRedisCache('/api/variants');

      res.status(204).send();
    } catch (error) {
      console.error('❌ Delete variant route error:', error);
      res.status(500).json({ error: "Failed to delete variant" });
    }
  });

  // Frontend API endpoints
  app.get("/api/frontend/brands/:brandId/models",
    redisCacheMiddleware(RedisCacheTTL.BRAND_MODELS), // ✅ 30-minute cache
    async (req, res) => {
      try {
        const { brandId } = req.params;
        console.log('🚗 Frontend: Getting models for brand:', brandId);

        const models = await storage.getModelsWithPricing(brandId, true);
        const brand = await storage.getBrand(brandId);

        if (!brand) {
          return res.status(404).json({ error: "Brand not found" });
        }

        // Fetch aggregated ratings for this brand's models
        const ratingsAggregation = await Review.aggregate([
          { $match: { brandSlug: brand.name.toLowerCase().replace(/\s+/g, '-'), isApproved: true } },
          {
            $group: {
              _id: '$modelSlug',
              avgRating: { $avg: '$overallRating' },
              count: { $sum: 1 }
            }
          }
        ]);

        const ratingsMap = ratingsAggregation.reduce((acc, curr) => {
          acc[curr._id] = {
            rating: Number(curr.avgRating.toFixed(1)),
            count: curr.count
          };
          return acc;
        }, {} as Record<string, { rating: number, count: number }>);

        // Transform models for frontend display
        const frontendModels = models.map(model => {
          const slug = model.name.toLowerCase().replace(/\s+/g, '-');
          const ratingData = ratingsMap[slug] || { rating: 0, count: 0 };

          // Format price (e.g., 7.71 Lakh)
          const priceInLakhs = model.lowestPrice / 100000;
          const formattedPrice = `₹${priceInLakhs.toFixed(2)} Lakh`;

          return {
            id: model.id,
            name: model.name,
            price: formattedPrice,
            rating: ratingData.rating,
            reviews: ratingData.count,
            reviewCount: ratingData.count,
            power: "89 bhp", // Will be from engine data
            image: model.heroImage || '/cars/default-car.jpg',
            isNew: model.isNew || false,
            seating: `${model.seating || 5} seater`,
            fuelType: model.fuelTypes?.join('-') || 'Petrol',
            transmission: model.transmissions?.join('-') || 'Manual',
            mileage: "18.3 kmpl", // Will be from mileage data
            variants: model.variantCount || model.variants || 0,
            slug: slug,
            brandName: brand.name
          };
        });

        console.log('✅ Frontend: Returning', frontendModels.length, 'models for brand', brand.name);
        res.json({
          brand: {
            id: brand.id,
            name: brand.name,
            slug: brand.name.toLowerCase().replace(/\s+/g, '-')
          },
          models: frontendModels
        });
      } catch (error) {
        console.error('❌ Frontend models error:', error);
        res.status(500).json({ error: "Failed to fetch models" });
      }
    });

  app.get("/api/frontend/models/:slug", redisCacheMiddleware(RedisCacheTTL.MODEL_DETAILS), async (req, res) => {
    try {
      const { slug } = req.params;
      console.log('🚗 Frontend: Getting model by slug:', slug);

      const models = await storage.getModels();
      const model = models.find(m =>
        m.name.toLowerCase().replace(/\s+/g, '-') === slug
      );

      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }

      const brand = await storage.getBrand(model.brandId);

      // Transform model for frontend display
      const frontendModel = {
        id: model.id,
        name: model.name,
        brandName: brand?.name || 'Unknown',
        heroImage: model.heroImage,
        galleryImages: model.galleryImages || [],
        keyFeatureImages: model.keyFeatureImages || [],
        spaceComfortImages: model.spaceComfortImages || [],
        storageConvenienceImages: model.storageConvenienceImages || [],
        colorImages: model.colorImages || [],
        description: model.description,
        pros: model.pros,
        cons: model.cons,
        exteriorDesign: model.exteriorDesign,
        comfortConvenience: model.comfortConvenience,
        engineSummaries: model.engineSummaries || [],
        mileageData: model.mileageData || [],
        faqs: model.faqs || [],
        fuelTypes: model.fuelTypes || [],
        transmissions: model.transmissions || [],
        bodyType: model.bodyType,
        subBodyType: model.subBodyType,
        launchDate: model.launchDate,
        isPopular: model.isPopular,
        isNew: model.isNew
      };

      console.log('✅ Frontend: Returning model details for', model.name);
      res.json(frontendModel);
    } catch (error) {
      console.error('❌ Frontend model error:', error);
      res.status(500).json({ error: "Failed to fetch model" });
    }
  });

  // Popular Comparisons Routes
  app.get("/api/popular-comparisons", redisCacheMiddleware(RedisCacheTTL.COMPARISONS), async (req, res) => {
    try {
      // Set browser cache headers (2 hours)
      res.set('Cache-Control', 'public, max-age=7200, s-maxage=7200, stale-while-revalidate=86400');

      const comparisons = await storage.getPopularComparisons();
      res.json(comparisons);
    } catch (error) {
      console.error('Error fetching popular comparisons:', error);
      res.status(500).json({ error: "Failed to fetch popular comparisons" });
    }
  });

  app.post("/api/popular-comparisons", async (req, res) => {
    try {
      const comparisons = req.body;

      if (!Array.isArray(comparisons)) {
        return res.status(400).json({ error: "Expected array of comparisons" });
      }

      const savedComparisons = await storage.savePopularComparisons(comparisons);
      res.json({
        success: true,
        count: savedComparisons.length,
        comparisons: savedComparisons
      });
    } catch (error) {
      console.error('Error saving popular comparisons:', error);
      res.status(500).json({ error: "Failed to save popular comparisons" });
    }
  });


  // ==================== NEWS ROUTES ====================

  // Public news routes
  app.use('/api/news', newsRoutes);

  // AI Chat History Routes
  app.use("/api/chat", aiHistoryRoutes);

  // AI Chat endpoint
  app.post('/api/ai-chat', publicLimiter, aiChatHandler);

  // Quirky Bits endpoint (for floating AI bot)
  app.use('/api/quirky-bit', publicLimiter, quirkyBitRoutes);

  // AI Feedback & Learning Analytics endpoint
  app.use('/api/ai-feedback', publicLimiter, aiFeedbackRoutes);

  // YouTube endpoint
  app.use('/api/youtube', publicLimiter, createYouTubeRoutes(storage));


  // Admin news management routes (MUST come BEFORE /api/admin to avoid rate limiting)
  app.use('/api/admin/articles', adminArticlesRoutes);
  app.use('/api/admin/categories', adminCategoriesRoutes);
  app.use('/api/admin/tags', adminTagsRoutes);
  app.use('/api/admin/authors', adminAuthorsRoutes);
  app.use('/api/admin/media', adminMediaRoutes);
  app.use('/api/admin/reviews', adminReviewsRoutes);
  app.use('/api/admin/emails', adminEmailRoutes);

  // Price history routes (public)
  app.use('/api/price-history', publicLimiter, priceHistoryRoutes);

  // Public reviews routes
  app.use('/api/reviews', publicLimiter, reviewsRoutes);
  app.use('/api/admin/analytics', adminAnalyticsRoutes);

  // Admin authentication routes (with rate limiting) - MUST come AFTER specific routes
  app.use('/api/admin', authLimiter, adminAuthRoutes);

  // Compare cars endpoint
  app.get('/api/compare/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      console.log(`🔍 Compare API: Processing slug "${slug}"`);

      // Parse slug: "car1-brand-car1-model-vs-car2-brand-car2-model"
      // This is tricky because brand/model names can have hyphens.
      // We'll use a heuristic: split by "-vs-"
      const parts = slug.split('-vs-');

      if (parts.length < 2) {
        return res.status(400).json({ error: 'Invalid comparison slug format. Use "car1-vs-car2"' });
      }

      const comparisonData = [];

      for (const carSlug of parts) {
        // carSlug is like "tata-nexon" or "maruti-suzuki-brezza"
        // We need to find the model. 
        // Strategy: Try to match the longest suffix as model name, prefix as brand

        // Get all models to match against
        // In a real app with 1M users, we would NOT fetch all models here. 
        // We would use a slug lookup table or optimized query.
        // For now, we'll use the cache-friendly storage method
        const allModels = await storage.getModels();
        const allBrands = await storage.getBrands(false, true);

        let foundModel = null;
        let foundBrand = null;

        // Try to match model slug
        // We iterate through all models and check if the carSlug ends with the model slug
        // and starts with the brand slug

        for (const model of allModels) {
          const modelSlug = model.name.toLowerCase().replace(/\s+/g, '-');
          const brand = allBrands.find(b => b.id === model.brandId);
          if (!brand) continue;

          const brandSlug = brand.name.toLowerCase().replace(/\s+/g, '-');
          const constructedSlug = `${brandSlug}-${modelSlug}`;

          if (constructedSlug === carSlug) {
            foundModel = model;
            foundBrand = brand;
            break;
          }
        }

        if (foundModel && foundBrand) {
          // Fetch variants for this model
          const variants = await storage.getVariants(foundModel.id);

          // Find the "base" variant (lowest price) for comparison default
          const baseVariant = variants.reduce((prev, curr) =>
            (curr.price < prev.price && curr.price > 0) ? curr : prev
            , variants[0]);

          comparisonData.push({
            model: {
              ...foundModel,
              brandName: foundBrand.name,
              variants: variants // Include all variants for dropdown switching
            },
            variant: baseVariant
          });
        }
      }

      if (comparisonData.length === 0) {
        return res.status(404).json({ error: 'No valid cars found for comparison' });
      }

      res.json(comparisonData);
    } catch (error) {
      console.error('Compare API Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Humanize AI Content Routes
  app.use('/api/admin/humanize', adminHumanizeRoutes);

  // ============================================
  // CONSULTATION LEADS ROUTES
  // ============================================

  // Submit a new consultation lead
  app.post("/api/consultation-leads", publicLimiter, async (req: Request, res: Response) => {
    try {
      const leadData = insertConsultationLeadSchema.parse(req.body);
      const lead = await storage.createConsultationLead(leadData);

      // Optional: Send email notification to admin here

      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Create consultation lead error:', error);
      res.status(500).json({
        error: 'Failed to submit consultation request',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get all consultation leads (Admin only)
  app.get("/api/admin/leads", authenticateToken, async (req: Request, res: Response) => {
    try {
      const leads = await storage.getConsultationLeads();
      res.json(leads);
    } catch (error) {
      console.error('Get consultation leads error:', error);
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });

  // Export consultation leads as CSV (Admin only)
  app.get("/api/admin/leads/export", authenticateToken, async (req: Request, res: Response) => {
    try {
      const leads = await storage.getConsultationLeads();

      // Flatten data for CSV
      const csvData = leads.map(lead => ({
        ID: lead.id,
        Name: lead.name,
        Phone: lead.phone,
        Email: lead.email || '',
        City: lead.city || '',
        Budget: lead.budget || '',
        'Car Interest': lead.carInterest || '',
        'Planned Purchase': lead.plannedPurchaseDate || '',
        Message: lead.message || '',
        Status: lead.status,
        Source: lead.source,
        'Created At': new Date(lead.createdAt).toLocaleString()
      }));

      const csv = Papa.unparse(csvData);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=consultation-leads.csv');
      res.send(csv);
    } catch (error) {
      console.error('Export consultation leads error:', error);
      res.status(500).json({ error: 'Failed to export leads' });
    }
  });
}


