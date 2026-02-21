import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'
import { CITY_DATABASE } from '@/lib/city-database'

const BASE_URL = 'https://www.gadizone.com'
const EXTERNAL_API_URL = BACKEND_URL
const REL_MODELS_PER_CHUNK = 30

async function fetchData(endpoint: string, cacheTime = 3600) {
    try {
        const url = `${EXTERNAL_API_URL}${endpoint}`;
        const res = await fetch(url, {
            next: { revalidate: cacheTime },
            headers: {
                'User-Agent': 'KillerWhale/1.0 SitemapGenerator'
            }
        })
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`)
        return await res.json()
    } catch (error) {
        console.error(`Sitemap fetch error for ${endpoint}:`, error)
        return []
    }
}

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
        return c;
    });
}

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    // id will be "main.xml" or "0.xml"
    const idParam = params.id
    const id = idParam.replace('.xml', '')

    let routes: { url: string; lastModified?: Date; priority?: number }[] = []

    if (id === 'main') {
        const coreRoutes = [
            { url: `${BASE_URL}/`, priority: 1.0 },
            { url: `${BASE_URL}/car-expert`, priority: 0.9 },
            { url: `${BASE_URL}/new-cars`, priority: 0.9 },
            { url: `${BASE_URL}/news`, priority: 0.9 },
            { url: `${BASE_URL}/compare`, priority: 0.9 },
            { url: `${BASE_URL}/electric-cars`, priority: 0.9 },
            { url: `${BASE_URL}/upcoming-cars-in-india`, priority: 0.9 },
            { url: `${BASE_URL}/new-car-launches-in-india`, priority: 0.9 },
            { url: `${BASE_URL}/top-selling-cars-in-india`, priority: 0.9 },
        ]

        const toolRoutes = [
            { url: `${BASE_URL}/emi-calculator`, priority: 0.8 },
            { url: `${BASE_URL}/fuel-cost-calculator`, priority: 0.8 },
            { url: `${BASE_URL}/sell-car`, priority: 0.8 },
            { url: `${BASE_URL}/location`, priority: 0.8 },
        ]

        const budgetPages = [
            'best-cars-under-8-lakh',
            'best-cars-under-10-lakh',
            'best-cars-under-15-lakh',
            'best-cars-under-20-lakh',
            'best-cars-under-25-lakh',
            'best-cars-under-30-lakh',
            'best-cars-under-40-lakh',
            'best-cars-under-50-lakh',
            'best-cars-under-60-lakh',
            'best-cars-under-80-lakh',
            'best-cars-under-1-crore-lakh',
            'best-cars-under-above-1-crore-lakh',
        ]
        const categoryRoutes = budgetPages.map(page => ({
            url: `${BASE_URL}/${page}`,
            priority: 0.8
        }))

        const infoRoutes = [
            { url: `${BASE_URL}/about-us`, priority: 0.5 },
            { url: `${BASE_URL}/contact-us`, priority: 0.5 },
        ]

        // Fetch Brands and News
        const [brandsResponse, newsResponse] = await Promise.all([
            fetchData('/api/brands'),
            fetchData('/api/news?limit=100'),
        ])

        const brandsData = brandsResponse?.data || brandsResponse
        const brands = Array.isArray(brandsData) ? brandsData : []
        const activeBrands = brands.filter((brand: any) => brand.status === 'active')

        const brandRoutes = activeBrands
            .filter((b: any) => b.name)
            .map((brand: any) => ({
                url: `${BASE_URL}/${brand.name.toLowerCase().replace(/\s+/g, '-')}-cars`,
                priority: 0.9,
            }))

        const articlesData = newsResponse?.articles || newsResponse?.data || newsResponse
        const articles = Array.isArray(articlesData) ? articlesData : []

        const newsRoutes = articles
            .filter((a: any) => a.slug)
            .map((article: any) => ({
                url: `${BASE_URL}/news/${article.slug}`,
                lastModified: article.publishedAt ? new Date(article.publishedAt) : undefined,
                priority: 0.7,
            }))

        routes = [
            ...coreRoutes,
            ...toolRoutes,
            ...categoryRoutes,
            ...infoRoutes,
            ...brandRoutes,
            ...newsRoutes,
        ]
    } else {
        // Model Chunks
        const chunkIndex = parseInt(id)
        if (!isNaN(chunkIndex)) {
            const modelsResponse = await fetchData('/api/models?limit=5000')
            const modelsData = modelsResponse?.data || modelsResponse
            const models = Array.isArray(modelsData) ? modelsData : []

            const start = chunkIndex * REL_MODELS_PER_CHUNK
            const end = start + REL_MODELS_PER_CHUNK
            const chunkModels = models.slice(start, end)

            const brandsResponse = await fetchData('/api/brands')
            const brands = Array.isArray(brandsResponse?.data || brandsResponse) ? (brandsResponse?.data || brandsResponse) : []
            const brandMap = new Map(brands.map((b: any) => [b.id, b.name]))

            chunkModels.forEach((model: any) => {
                const brandName = model.brandName || brandMap.get(model.brandId)
                if (!brandName || !model.name) return

                const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-')
                const modelSlug = model.name.toLowerCase().replace(/\s+/g, '-')
                const basePath = `${BASE_URL}/${brandSlug}-cars/${modelSlug}`
                const lastMod = model.updatedAt ? new Date(model.updatedAt) : undefined

                // 1. Main Model Page
                routes.push({ url: basePath, lastModified: lastMod, priority: 0.8 })

                // 2. Standard Sub-pages
                const subPages = ['images', 'reviews', 'colors', 'mileage', 'variants']
                subPages.forEach(sub => {
                    routes.push({ url: `${basePath}/${sub}`, lastModified: lastMod, priority: 0.6 })
                })

                // 3. Price URLs for ALL Cities
                CITY_DATABASE.forEach(city => {
                    const citySlug = city.city.toLowerCase().replace(/\s+/g, '-')
                    routes.push({
                        url: `${basePath}/price-in-${citySlug}`,
                        lastModified: lastMod,
                        priority: city.popular ? 0.7 : 0.5
                    })
                })
            })
        }
    }

    // Generate XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

    routes.forEach(route => {
        xml += `
  <url>
    <loc>${escapeXml(route.url)}</loc>`
        if (route.lastModified) {
            xml += `
    <lastmod>${route.lastModified.toISOString()}</lastmod>`
        }
        if (route.priority) {
            xml += `
    <priority>${route.priority}</priority>`
        }
        xml += `
  </url>`
    })

    xml += `
</urlset>`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    })
}
