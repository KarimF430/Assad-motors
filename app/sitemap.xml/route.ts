import { getServerSideSitemapIndex } from 'next-sitemap'
// Actually I will write manual XML string generation to avoid dependencies if possible, or just standard string.

import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/config'

const BASE_URL = 'https://www.assadmotors.com'
const EXTERNAL_API_URL = BACKEND_URL

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

const REL_MODELS_PER_CHUNK = 30

export async function GET() {
    // 1. Fetch all models to determine how many chunks
    const modelsResponse = await fetchData('/api/models?limit=5000')
    const modelsData = modelsResponse?.data || modelsResponse
    const models = Array.isArray(modelsData) ? modelsData : []
    const totalModels = models.length

    const numChunks = Math.ceil(totalModels / REL_MODELS_PER_CHUNK)

    // Generate Sitemap Index XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap/main.xml</loc>
  </sitemap>`

    for (let i = 0; i < numChunks; i++) {
        xml += `
  <sitemap>
    <loc>${BASE_URL}/sitemap/${i}.xml</loc>
  </sitemap>`
    }

    xml += `
</sitemapindex>`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    })
}
