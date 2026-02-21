import { NextRequest, NextResponse } from 'next/server'

// Use Node.js runtime for Vercel Free plan compatibility
export const runtime = 'nodejs';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

// GET - Fetch popular comparisons
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/popular-comparisons`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return NextResponse.json([], { status: 200 })
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching popular comparisons:', error)
    return NextResponse.json([], { status: 200 })
  }
}

// POST - Save popular comparisons
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/api/popular-comparisons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    if (!response.ok) {
      throw new Error('Failed to save comparisons')
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error saving popular comparisons:', error)
    return NextResponse.json(
      { error: 'Failed to save comparisons' },
      { status: 500 }
    )
  }
}
