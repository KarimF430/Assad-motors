import { NextRequest, NextResponse } from 'next/server';

// Use Node.js runtime for Vercel Free plan compatibility
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log('🖼️ API Route: POST /api/upload/image');
    
    // Security: Check for authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }
    
    const formData = await request.formData();
    const image = formData.get('image') as File;
    
    if (!image) {
      return NextResponse.json({
        success: false,
        error: 'No image file provided',
      }, { status: 400 });
    }
    
    // Security: File size limit (10MB)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 10MB.',
      }, { status: 413 });
    }
    
    // Security: File type validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
      }, { status: 400 });
    }
    
    console.log('📁 Image file received:', image.name, 'Size:', image.size);
    
    // Forward to backend server
    const backendFormData = new FormData();
    backendFormData.append('image', image);
    
    const backendUrl = process.env.BACKEND_URL 
      || process.env.NEXT_PUBLIC_BACKEND_URL 
      || process.env.NEXT_PUBLIC_API_URL 
      || 'http://localhost:5001';
    const uploadEndpoint = `${backendUrl}/api/upload/image`;
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: backendFormData,
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend upload error:', errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Image uploaded successfully:', data.url);

    return NextResponse.json({
      success: true,
      url: data.url,
      filename: data.filename,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error in POST /api/upload/image:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload image',
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
