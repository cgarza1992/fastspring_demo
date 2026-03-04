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
    const signature = request.headers.get('X-Signature');
    
    console.log('Secret exists:', !!secret);
    console.log('Signature header:', signature ? 'present' : 'missing');
    
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
        const body = JSON.parse(rawBody);
        
        // FastSpring sends events in an array
        if (!body.events || !Array.isArray(body.events)) {
            return NextResponse.json(
                { error: 'Invalid webhook format - no events array' },
                { status: 400 }
            );
        }

        // Store each event from the webhook
        const storedEvents = [];
        for (const fsEvent of body.events) {
            console.log('Storing FastSpring event:', fsEvent.type);
            const event = addEvent(fsEvent.type, fsEvent.data);
            storedEvents.push(event);
        }

        return NextResponse.json({
            success: true,
            eventsStored: storedEvents.length,
            eventIds: storedEvents.map(e => e.id)
        }, { status: 200 });
    }
}