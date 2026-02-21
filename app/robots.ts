import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.gadizone.com'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/_next/',
                    '/login',
                    '/signup',
                    '/forgot-password',
                    '/reset-password',
                    '/verify-email',
                    '/debug-env',
                    '/test-honda',
                    '/search',       // Search results pages
                    '/ai-search',
                    '/ai-car-finder',
                    '/insurance',    // Insurance utility pages
                    '/service',      // Service utility pages
                    '/feedback',     // Feedback utility pages
                    '/privacy-policy',      // Legal pages
                    '/terms-and-conditions',
                    '/visitor-agreement',
                    '/google-terms',
                ],
            },
            // Block AI Scrapers (Content Protection)
            {
                userAgent: ['GPTBot', 'Google-Extended', 'ClaudeBot', 'Amazonbot', 'Applebot-Extended'],
                disallow: '/',
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
