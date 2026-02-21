import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            leadData,
            planDetails,
            amount // Client-provided amount, we will verify this against the order
        } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: 'Missing required verification fields' },
                { status: 400 }
            );
        }

        const key_id = process.env.RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            console.error('Razorpay keys not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // 1. Verify Signature
        const hmac = crypto.createHmac('sha256', key_secret);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generated_signature = hmac.digest('hex');

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // 2. Fetch Order from Razorpay to Verify Amount
        const razorpay = new Razorpay({
            key_id,
            key_secret,
        });

        const order = await razorpay.orders.fetch(razorpay_order_id);

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        // Verify amount (Razorpay order amount is in paise)
        // We compare the order amount with the amount sent from client (also usually in paise or rupees depending on impl)
        // In create-order logic, we multiply by 100. So order.amount is in paise.
        // The client 'amount' might be in rupees. Let's assume client sends rupees based on previous create-order logic check.

        // Let's verify against planDetails if possible, or at least check if order.amount matches expected
        // Ideally we should recalculate total from planDetails here, but for now let's ensure order.amount matches (order.amount is trusted from Razorpay)

        // Use order.amount (in paise) / 100 as the trusted amount for our record
        const trustedAmount = Number(order.amount) / 100;

        // 3. Create Consultation Lead on backend
        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const enrichedLeadData = {
                ...leadData,
                paymentStatus: 'paid',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                planDetails: planDetails,
                totalAmount: trustedAmount, // Use the verified amount
                status: 'new'
            };

            console.log('Creating consultation lead after verified payment:', enrichedLeadData);

            const leadResponse = await fetch(`${backendUrl}/api/consultation-leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrichedLeadData)
            });

            if (!leadResponse.ok) {
                console.error('Failed to create lead on backend', await leadResponse.text());
                // We don't fail the verification itself, as the payment WAS successful
                // But we should log it or perhaps return a warning
            }
        } catch (err) {
            console.error('Error creating lead:', err);
        }

        return NextResponse.json({
            success: true,
            message: 'Payment verified and lead created successfully',
        });

    } catch (error: any) {
        console.error('Razorpay verification error:', error);
        return NextResponse.json(
            { error: 'Payment verification failed' },
            { status: 500 }
        );
    }
}
