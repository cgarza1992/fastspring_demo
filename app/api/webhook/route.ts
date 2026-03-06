import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { addEvent } from '@/app/lib/events';

export async function POST(request: NextRequest) {
    // step 1: Get raw body.
    const rawBody = await request.text();

    // Step 2: Get signature from header
    const signature = request.headers.get('x-fs-signature');

    // Step 3: Validate Signature
    const secret = process.env.FASTSPRING_WEBHOOK_SECRET;
    
    // If signature present, validate it
    if (signature && secret) {
        // Create HMAC and compute signature (base64 encoded)
        const computedSignature = createHmac('sha256', secret)
            .update(rawBody)
            .digest()
            .toString('base64');

        if (signature !== computedSignature) {
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }
    }
    
    // Parse and store the event
    try {
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
            console.log('[Webhook] Processing event:', fsEvent.type);
            const event = await addEvent(fsEvent.type, fsEvent.data);
            storedEvents.push(event);
        }
        console.log('[Webhook] Stored', storedEvents.length, 'events');

        return NextResponse.json({
            success: true,
            eventsStored: storedEvents.length,
            eventIds: storedEvents.map(e => e.id)
        }, { status: 200 });
    } catch (error) {
        console.error('Failed to process webhook:', error);
        return NextResponse.json(
            { error: 'Failed to process webhook' },
            { status: 500 }
        );
    }
}