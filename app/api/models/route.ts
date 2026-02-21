import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/config';

// Use Node.js runtime for Vercel Free plan compatibility
export const runtime = 'nodejs';

// Cache configuration - disabled for development to ensure fresh data
const CACHE_HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Vary': 'Accept-Encoding',
};

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 API Route: GET /api/models');

    // Forward request to backend server
    const backendUrl = `${BACKEND_URL}/api/models`;
    const response = await fetch(backendUrl);

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.length || 0} models from backend`);

    const nextResponse = NextResponse.json({
      success: true,
      data: data,
      meta: {
        total: data.length || 0,
        timestamp: new Date().toISOString()
      }
    });

    // Set cache headers
    Object.entries(CACHE_HEADERS).forEach(([key, value]) => {
      nextResponse.headers.set(key, value);
    });

    return nextResponse;
  } catch (error) {
    console.error('❌ Error in GET /api/models:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch models',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API Route: POST /api/models');

    const body = await request.json();
    console.log('📝 Model data received:', JSON.stringify(body, null, 2));

    // Forward request to backend server
    const backendUrl = `${BACKEND_URL}/api/models`;
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Model created successfully:', data);

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Model created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in POST /api/models:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create model',
      timestamp: new Date().toISOString()
    }, {
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}


// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
