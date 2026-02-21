/** @type {import('next').NextConfig} */
const isProdEnv = process.env.NODE_ENV === 'production'
const extraImageHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || '')
  .split(',')
  .map(h => h.trim())
  .filter(Boolean)
// Support either a hostname or a full URL in env and extract just the hostname
const rawR2 = process.env.R2_PUBLIC_BASE_URL || process.env.R2_PUBLIC_BASE_HOST || ''
let r2Host = ''
try {
  if (rawR2) {
    r2Host = rawR2.includes('://')
      ? new URL(rawR2).hostname
      : rawR2.replace(/^https?:\/\//, '').replace(/\/.*/, '')
  }
} catch { }
// Extract backend host (Render) so brand logos served from backend pass Next/Image allow-list
const rawBackend = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ''
let backendHost = ''
try {
  if (rawBackend) {
    backendHost = rawBackend.includes('://')
      ? new URL(rawBackend).hostname
      : rawBackend.replace(/^https?:\/\//, '').replace(/\/.*/, '')
  }
} catch { }
const baseImageHosts = [
  'images.unsplash.com',
  'gadizone.com',
  'www.gadizone.com',
  r2Host,
  backendHost,
  'pub-a4a4bb84fc2d41cba103f4e2a8b5d185.r2.dev', // Cloudflare R2 CDN for car images
  ...extraImageHosts,
].filter(Boolean)
const devImageHosts = ['localhost', '127.0.0.1']
const imageHosts = isProdEnv ? baseImageHosts : [...baseImageHosts, ...devImageHosts]
const remotePatterns = imageHosts.flatMap((hostname) => {
  const patterns = [{ protocol: 'https', hostname, pathname: '/**' }]
  if (!isProdEnv && (hostname === 'localhost' || hostname === '127.0.0.1')) {
    patterns.push({ protocol: 'http', hostname, pathname: '/**' })
  }
  return patterns
})

const nextConfig = {
  // Enable gzip compression for returned responses
  compress: true,
  // Enable SWC minification for improved performance
  // swcMinify: true, // Removed as it's default and can cause issues

  // External packages configuration
  serverExternalPackages: ['sharp'],

  // Remove console logs in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  images: {
    unoptimized: !isProdEnv, // Disable image optimization in dev for speed and to avoid 404s
    remotePatterns,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    // Configure allowed quality values for Next.js 16+
    qualities: [25, 50, 75, 85, 100],
  },

  // Ignore ESLint errors during build to allow deployment despite legacy code issues
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Security headers and cache control for production
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'
    const connectSrcDev = "http://localhost:* https://localhost:*"
    // Derive backend origin for CSP connect-src (Vercel/production)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || ''
    let backendOrigin = ''
    try {
      if (apiUrl) backendOrigin = new URL(apiUrl).origin
    } catch { }
    const connectSrc = isProd ? backendOrigin : `${connectSrcDev} ${backendOrigin}`.trim()
    const unsafeEval = isProd ? "" : " 'unsafe-eval'"
    const csp = [
      "default-src 'self'",
      // Allow unsafe-eval only in development for Next/Webpack dev tooling
      // Added unpkg.com and lottie hosts for Killer Whale loading animation
      // Added Clarity and Amplitude domains (including wildcards)
      `script-src 'self' 'unsafe-inline'${unsafeEval} 'wasm-unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://cdn.jsdelivr.net https://www.clarity.ms https://c.clarity.ms https://scripts.clarity.ms https://*.clarity.ms https://static.cloudflareinsights.com https://checkout.razorpay.com`,
      "style-src 'self' 'unsafe-inline'",
      "worker-src 'self' blob:;",
      // Added Clarity image domains
      "img-src 'self' data: https: http: blob: https://c.clarity.ms https://*.clarity.ms",
      "font-src 'self' data:",
      // Added lottie.host, unpkg.com, cdn.jsdelivr.net for Killer Whale animation
      // Added Amplitude and Clarity connect domains
      // Added https://*.google for domains like ep1.adtrafficquality.google
      `connect-src 'self' ${connectSrc} https://www.google-analytics.com https://*.sentry.io https://images.unsplash.com https://www.googleapis.com https://lottie.host https://unpkg.com https://cdn.jsdelivr.net https://*.amplitude.com https://api.amplitude.com https://api2.amplitude.com https://*.clarity.ms https://c.clarity.ms https://static.cloudflareinsights.com https://api.razorpay.com`,
      // Frame sources
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://api.razorpay.com",
      // Added wasm-unsafe-eval for Lottie WASM player
      "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://unpkg.com https://cdn.jsdelivr.net https://www.clarity.ms https://scripts.clarity.ms https://*.clarity.ms https://static.cloudflareinsights.com https://checkout.razorpay.com",
    ].join('; ')

    return [
      {
        source: '/((?!_next|static|favicon.ico).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
      // Cache headers for static assets
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Exclude backend directory from TypeScript checking
  typescript: {
    ignoreBuildErrors: true,
  },

  // Exclude backend from build
  outputFileTracingExcludes: {
    '*': ['./backend/**/*'],
  },

  // URL rewrites: Map /price-in-{city} to /price-in/{city}
  async rewrites() {
    return [
      {
        // Match /{brand}-cars/{model}/price-in-{city}
        source: '/:brand-cars/:model/price-in-:city',
        destination: '/:brand-cars/:model/price-in/:city',
      },
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
          : 'http://localhost:5001/api/:path*',
      }
    ]
  },
};


// Injected content via Sentry Wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "gadizone",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: false,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
