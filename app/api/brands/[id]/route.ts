import { NextRequest, NextResponse } from 'next/server';
import { brandApi } from '@/lib/brand-api';

export const runtime = 'nodejs';

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200', // 10min cache, 20min stale
  'CDN-Cache-Control': 'public, s-maxage=7200', // 2 hour CDN cache
  'Vary': 'Accept-Encoding',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Brand ID is required'
      }, { status: 400 });
    }

    console.log(`🚀 API Route: GET /api/brands/${id}`);
    
    const startTime = Date.now();
    const brand = await brandApi.getBrand(id);
    const duration = Date.now() - startTime;

    console.log(`✅ Fetched brand ${brand.name} in ${duration}ms`);

    // Transform brand for frontend
    const transformedBrand = brandApi.transformBrandForFrontend(brand);

    const response = NextResponse.json({
      success: true,
      data: transformedBrand,
      meta: {
        id,
        timestamp: new Date().toISOString(),
        processingTime: duration
      }
    });

    // Set cache headers
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error(`❌ Error in GET /api/brands/${id}:`, error);
    
    const status = error instanceof Error && error.message.includes('404') ? 404 : 500;
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch brand',
      timestamp: new Date().toISOString()
    }, { 
      status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}
