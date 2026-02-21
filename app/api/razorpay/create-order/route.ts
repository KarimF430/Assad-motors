import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
    try {
        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            console.error('Razorpay keys not configured');
            return NextResponse.json(
                { error: 'Razorpay not configured' },
                { status: 500 }
            );
        }

        const razorpay = new Razorpay({
            key_id,
            key_secret,
        });

        const body = await request.json();
        const { amount, currency = 'INR', receipt } = body;

        if (!amount) {
            return NextResponse.json(
                { error: 'Amount is required' },
                { status: 400 }
            );
        }

        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error: any) {
        console.error('Razorpay order creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create Razorpay order' },
            { status: 500 }
        );
    }
}
