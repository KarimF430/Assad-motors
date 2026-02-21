import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

        console.log(`Proxying consultation lead to: ${backendUrl}/api/consultation-leads`);

        const response = await fetch(`${backendUrl}/api/consultation-leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend error:', data);
            return NextResponse.json(
                {
                    error: data.error || 'Failed to submit to backend',
                    details: data.details
                },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error (Proxy)' },
            { status: 500 }
        );
    }
}
