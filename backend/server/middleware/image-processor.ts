import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { Request, Response, NextFunction } from 'express';

interface ProcessedImage {
  originalPath: string;
  webpPath: string;
  thumbnailPath?: string;
  originalSize: number;
  webpSize: number;
  compressionRatio: number;
}

interface ImageProcessingOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  createThumbnail?: boolean;
  thumbnailSize?: number;
  keepOriginal?: boolean;
}

/**
 * Enhanced image processing middleware with WebP conversion
 * Automatically converts uploaded images to WebP format for better performance
 */
export class ImageProcessor {
  private static defaultOptions: ImageProcessingOptions = {
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    createThumbnail: true,
    thumbnailSize: 300,
    keepOriginal: false
  };

  /**
   * Process single uploaded image
   */
  static async processImage(
    filePath: string, 
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage> {
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      // Get original file info
      const originalStats = await fs.stat(filePath);
      const originalSize = originalStats.size;
      
      // Parse file path
      const parsedPath = path.parse(filePath);
      const webpPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`);
      const thumbnailPath = opts.createThumbnail 
        ? path.join(parsedPath.dir, `${parsedPath.name}_thumb.webp`)
        : undefined;

      // Create Sharp instance
      const image = sharp(filePath);
      const metadata = await image.metadata();

      console.log(`🖼️ Processing image: ${parsedPath.base}`);
      console.log(`📊 Original: ${metadata.width}x${metadata.height}, ${(originalSize / 1024).toFixed(1)}KB`);

      // Resize if needed
      let processedImage = image;
      if (metadata.width && metadata.height) {
        if (metadata.width > opts.maxWidth! || metadata.height > opts.maxHeight!) {
          processedImage = processedImage.resize(opts.maxWidth, opts.maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }
      }

      // Convert to WebP
      await processedImage
        .webp({ 
          quality: opts.quality,
          effort: 6 // Higher effort for better compression
        })
        .toFile(webpPath);

      // Create thumbnail if requested
      if (opts.createThumbnail && thumbnailPath) {
        await sharp(filePath)
          .resize(opts.thumbnailSize, opts.thumbnailSize, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: opts.quality })
          .toFile(thumbnailPath);
      }

      // Get WebP file size
      const webpStats = await fs.stat(webpPath);
      const webpSize = webpStats.size;
      const compressionRatio = ((originalSize - webpSize) / originalSize) * 100;

      console.log(`✅ WebP created: ${(webpSize / 1024).toFixed(1)}KB (${compressionRatio.toFixed(1)}% smaller)`);

      // Remove original if not keeping it
      if (!opts.keepOriginal) {
        await fs.unlink(filePath);
        console.log(`🗑️ Original file removed: ${parsedPath.base}`);
      }

      return {
        originalPath: filePath,
        webpPath,
        thumbnailPath,
        originalSize,
        webpSize,
        compressionRatio
      };

    } catch (error) {
      console.error(`❌ Error processing image ${filePath}:`, error);
      throw new Error(`Image processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process multiple images
   */
  static async processMultipleImages(
    filePaths: string[],
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImage[]> {
    const results: ProcessedImage[] = [];
    
    for (const filePath of filePaths) {
      try {
        const result = await this.processImage(filePath, options);
        results.push(result);
      } catch (error) {
        console.error(`❌ Failed to process ${filePath}:`, error);
        // Continue processing other images
      }
    }
    
    return results;
  }

  /**
   * Express middleware for automatic image processing
   */
  static middleware(options: ImageProcessingOptions = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Check if files were uploaded
        if (!req.files && !req.file) {
          return next();
        }

        const files = req.files as Express.Multer.File[] || (req.file ? [req.file] : []);
        const processedImages: ProcessedImage[] = [];

        console.log(`🔄 Processing ${files.length} uploaded image(s)...`);

        for (const file of files) {
          // Only process image files
          if (!file.mimetype.startsWith('image/')) {
            continue;
          }

          try {
            const result = await this.processImage(file.path, options);
            processedImages.push(result);

            // Update file path to WebP version
            file.path = result.webpPath;
            file.filename = path.basename(result.webpPath);
            file.mimetype = 'image/webp';
            file.size = result.webpSize;
          } catch (error) {
            console.error(`❌ Failed to process ${file.filename}:`, error);
            // Keep original file if processing fails
          }
        }

        // Add processed images info to request
        (req as any).processedImages = processedImages;

        console.log(`✅ Successfully processed ${processedImages.length} image(s)`);
        next();

      } catch (error) {
        console.error('❌ Image processing middleware error:', error);
        // Continue without processing if there's an error
        next();
      }
    };
  }

  /**
   * Get optimized image sizes for different use cases
   */
  static getImageSizes() {
    return {
      logo: { maxWidth: 200, maxHeight: 200, quality: 90 },
      hero: { maxWidth: 1920, maxHeight: 1080, quality: 85 },
      gallery: { maxWidth: 1200, maxHeight: 800, quality: 80 },
      thumbnail: { maxWidth: 300, maxHeight: 300, quality: 75 },
      feature: { maxWidth: 800, maxHeight: 600, quality: 80 }
    };
  }

  /**
   * Clean up old image files
   */
  static async cleanupOldImages(directory: string, maxAge: number = 7 * 24 * 60 * 60 * 1000) {
    try {
      const files = await fs.readdir(directory);
      const now = Date.now();
      let cleanedCount = 0;

      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          await fs.unlink(filePath);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        console.log(`🧹 Cleaned up ${cleanedCount} old image files`);
      }
    } catch (error) {
      console.error('❌ Error cleaning up old images:', error);
    }
  }
}

/**
 * Middleware configurations for different image types
 */
export const imageProcessingConfigs = {
  // Logo images - high quality, small size
  logo: ImageProcessor.middleware({
    quality: 90,
    maxWidth: 200,
    maxHeight: 200,
    createThumbnail: false,
    keepOriginal: false
  }),

  // Hero images - high quality, large size
  hero: ImageProcessor.middleware({
    quality: 85,
    maxWidth: 1920,
    maxHeight: 1080,
    createThumbnail: true,
    thumbnailSize: 400,
    keepOriginal: false
  }),

  // Gallery images - balanced quality and size
  gallery: ImageProcessor.middleware({
    quality: 80,
    maxWidth: 1200,
    maxHeight: 800,
    createThumbnail: true,
    thumbnailSize: 300,
    keepOriginal: false
  }),

  // Feature images - medium quality and size
  feature: ImageProcessor.middleware({
    quality: 80,
    maxWidth: 800,
    maxHeight: 600,
    createThumbnail: true,
    thumbnailSize: 200,
    keepOriginal: false
  }),

  // News images - optimized for web
  news: ImageProcessor.middleware({
    quality: 75,
    maxWidth: 1000,
    maxHeight: 700,
    createThumbnail: true,
    thumbnailSize: 250,
    keepOriginal: false
  })
};

export default ImageProcessor;
