import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Get backend URL from environment or use default
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

        // Forward request to backend
        const response = await fetch(`${backendUrl}/api/ai-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error('AI Chat API Error:', error)
        return NextResponse.json(
            { error: 'Failed to process request', reply: "Sorry, I'm having trouble right now. Please try again!" },
            { status: 500 }
        )
    }
}
