/**
 * Image Optimization Utilities
 * 
 * Helper functions for image optimization including:
 * - R2 CDN URL optimization
 * - Responsive image sizing
 * - Blur placeholder generation
 */

/**
 * Optimizes image URL for Cloudflare R2 with automatic format and sizing
 */
export function getOptimizedImageUrl(
    url: string,
    options: {
        width?: number
        quality?: number
        format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png'
    } = {}
): string {
    if (!url) return ''

    const { width, quality = 85, format = 'auto' } = options

    // Check if it's an R2 URL
    const r2Host = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_HOST ||
        process.env.R2_PUBLIC_BASE_HOST || ''

    if (r2Host && url.includes(r2Host)) {
        const params = new URLSearchParams()
        if (width) params.append('width', width.toString())
        params.append('quality', quality.toString())
        params.append('format', format)

        return `${url}?${params.toString()}`
    }

    return url
}

/**
 * Resolves a local upload path to a direct R2 URL if available
 * Bypasses backend proxy redirects for better performance
 */
export function resolveR2Url(path: string | null | undefined): string {
    if (!path) return '/api/placeholder/800/600';

    // If already absolute URL, check if it's the old R2 URL and rewrite it
    if (path.startsWith('http://') || path.startsWith('https://')) {
        const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ||
            process.env.R2_PUBLIC_BASE_URL ||
            process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_HOST;

        // Legacy R2 dev URL to replace
        const legacyR2 = 'https://pub-a4a4bb84fc2d41cba103f4e2a8b5d185.r2.dev';

        if (path.includes(legacyR2) && r2Base) {
            return path.replace(legacyR2, r2Base);
        }
        return path;
    }

    // Get R2 Base URL from env
    const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ||
        process.env.R2_PUBLIC_BASE_URL ||
        process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_HOST;

    if (r2Base && path.startsWith('/uploads/')) {
        // Remove /uploads/ prefix if the R2 bucket structure doesn't include it
        // OR keep it if the bucket mimics the folder structure. 
        // Based on backend/server/index.ts, the R2 target is `${publicBase}/${relPath}`
        // where relPath is path without leading slash. 
        // If path is `/uploads/img.jpg`, relPath in backend logic (line 162) was `uploads/img.jpg`?
        // No, backend: req.path (e.g. /uploads/x.jpg) -> relPath = x.jpg (line 162: replace(/^\/+/, ''))?
        // Wait, backend line 162: `const relPath = reqPath.replace(/^\/+/, '');`
        // If reqPath is `/uploads/x.jpg`, relPath is `uploads/x.jpg`.
        // Then target is `publicBase/uploads/x.jpg`.

        // Wait, let's re-read backend code carefully.
        // app.get('/uploads/*', ...)
        // req.path IS `/uploads/x.jpg` (express router matches relative to mount? No, app.get('/uploads/*') matches full path)
        // If I mount `app.use('/uploads', ...)` then req.path is relative.
        // But `app.get('/uploads/*', ...)` -> req.path is full path.
        // So relPath = `uploads/x.jpg`.
        // So R2 URL = `R2_BASE/uploads/x.jpg`.

        // However, usually uploads are stored in root of bucket or a specific folder.
        // Let's assume the path should be concatenated.

        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        // Ensure r2Base doesn't have trailing slash
        const cleanBase = r2Base.replace(/\/$/, '');
        return `${cleanBase}${cleanPath}`;
    }

    return path;
}


/**
 * Get responsive image sizes for srcSet
 */
export function getResponsiveSizes(baseWidth: number): string {
    const sizes = [640, 750, 828, 1080, 1200, 1920]
    return sizes
        .filter(size => size >= baseWidth)
        .map(size => `${size}w`)
        .join(', ')
}

/**
 * Generate blur data URL for placeholder
 * This is a simple implementation - for production, consider using plaiceholder or similar
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
    // Simple gray blur placeholder
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6' filter='url(%23b)'/%3E%3C/svg%3E`
}

/**
 * Get image dimensions from URL (if available in filename)
 */
export function extractDimensionsFromUrl(url: string): { width?: number; height?: number } {
    // Try to extract dimensions from filename like "image-800x600.jpg"
    const match = url.match(/(\d+)x(\d+)/)
    if (match) {
        return {
            width: parseInt(match[1], 10),
            height: parseInt(match[2], 10),
        }
    }
    return {}
}

/**
 * Check if image should be prioritized (above the fold)
 */
export function shouldPrioritizeImage(index: number, isMobile: boolean = false): boolean {
    // Prioritize first 2 images on desktop, first 1 on mobile
    return isMobile ? index === 0 : index < 2
}

/**
 * Get optimal image quality based on image type
 */
export function getOptimalQuality(imageType: 'hero' | 'thumbnail' | 'gallery' | 'icon'): number {
    switch (imageType) {
        case 'hero':
            return 90 // High quality for hero images
        case 'gallery':
            return 85 // Good quality for gallery
        case 'thumbnail':
            return 75 // Lower quality for thumbnails
        case 'icon':
            return 90 // High quality for small icons
        default:
            return 85
    }
}
