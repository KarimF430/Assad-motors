import { NextRequest, NextResponse } from 'next/server';

// Use Node.js runtime for Vercel Free plan compatibility
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('🏷️ API Route: POST /api/upload/logo');
    
    // Security: Check for authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }
    
    const formData = await request.formData();
    const logo = formData.get('logo') as File;
    
    if (!logo) {
      return NextResponse.json({
        success: false,
        error: 'No logo file provided',
      }, { status: 400 });
    }
    
    // Security: File size limit (5MB for logos)
    if (logo.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'Logo too large. Maximum size is 5MB.',
      }, { status: 413 });
    }
    
    // Security: File type validation (PNG only for logos)
    if (logo.type !== 'image/png') {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only PNG files are allowed for logos.',
      }, { status: 400 });
    }
    
    console.log('📁 Logo file received:', logo.name, 'Size:', logo.size);
    
    // Forward to backend server
    const backendFormData = new FormData();
    backendFormData.append('logo', logo);
    
    const backendUrl = process.env.BACKEND_URL 
      || process.env.NEXT_PUBLIC_BACKEND_URL 
      || process.env.NEXT_PUBLIC_API_URL 
      || 'http://localhost:5001';
    const uploadEndpoint = `${backendUrl}/api/upload/logo`;
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: backendFormData,
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend logo upload error:', errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Logo uploaded successfully:', data.url);

    return NextResponse.json({
      success: true,
      url: data.url,
      filename: data.filename,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in POST /api/upload/logo:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload logo',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

// Handle OPTIONS for CORS - Secure configuration
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://killer-whale101.vercel.app',
    'https://killer-whale.onrender.com',
    'http://localhost:3000',
    'http://localhost:5001'
  ];
  
  const isAllowedOrigin = origin && allowedOrigins.includes(origin);
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': isAllowedOrigin ? origin : 'null',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}
