import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { addEvent } from '@/app/lib/events';

export async function POST(request: NextRequest) {
    // step 1: Get raw body.
    const rawBody = await request.text();

    console.log('Webhook received and validated. Raw body:', rawBody);

    // Step 2: Get signature from header.
    const signature = request.headers.get('X-Signature');

    // Step 3: Validate Signature
    const secret = process.env.FASTSPRING_WEBHOOK_SECRET;
    if( !secret || !signature ) {
        return NextResponse.json({ error: 'Missing secret or signature' }, { status: 401 });
    }

    // create our hmac
    const hmac = createHmac('sha256', secret);

    // hash our body
    hmac.update(rawBody);

    // get the computed signature hex.
    const computedSignature = hmac.digest('hex');

    const isValid = timingSafeEqual(
        Buffer.from(computedSignature),
        Buffer.from(signature)
    );

    if( !isValid ) {
    return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
    );

    } else {
        const data = JSON.parse(rawBody);

        const event = addEvent(data.eventType || 'webhook', data);

        return NextResponse.json({
            success: true,
            eventId: event.id 
        },
            {
                status: 200
            }
        );
    }
}