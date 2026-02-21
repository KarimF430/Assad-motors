import { NextRequest, NextResponse } from 'next/server';

// Use Node.js runtime for Vercel Free plan compatibility
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    console.log(`🚀 API Route: GET /api/models/${id}`);
    
    // Forward request to backend server
    const backendUrl = `http://localhost:5000/api/models/${id}`;
    const response = await fetch(backendUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Model not found',
        }, { status: 404 });
      }
      throw new Error(`Backend responded with ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Fetched model ${id} from backend`);

    return NextResponse.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`❌ Error in GET /api/models/${id}:`, error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch model',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    console.log(`🗑️ API Route: DELETE /api/models/${id}`);
    
    // Forward request to backend server
    const backendUrl = `http://localhost:5000/api/models/${id}`;
    const response = await fetch(backendUrl, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Model not found',
        }, { status: 404 });
      }
      const errorText = await response.text();
      console.error('❌ Backend error:', errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }
    
    console.log(`✅ Model ${id} deleted successfully`);

    return NextResponse.json({
      success: true,
      message: 'Model deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`❌ Error in DELETE /api/models/${id}:`, error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete model',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  try {
    const body = await request.json();
    console.log(`🔄 API Route: PATCH /api/models/${id}`);
    console.log('📝 Update data received:', JSON.stringify(body, null, 2));
    
    // Forward request to backend server
    const backendUrl = `http://localhost:5000/api/models/${id}`;
    const response = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: false,
          error: 'Model not found',
        }, { status: 404 });
      }
      const errorText = await response.text();
      console.error('❌ Backend error:', errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Model ${id} updated successfully`);

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Model updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`❌ Error in PATCH /api/models/${id}:`, error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update model',
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
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
