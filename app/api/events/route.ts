import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/app/lib/events';

export async function GET(request: NextRequest) {
    // Get option limit from query param.
    const limit = request.nextUrl.searchParams.get('limit');

    // Fetch events.
    const events = getEvents(limit ? parseInt(limit): 50);
    console.log('[API] GET /api/events - Returning', events.length, 'events (limit:', limit || 50, ')');

    return NextResponse.json({
        events,
        count: events.length
    }, {
        status: 200,
    });
}