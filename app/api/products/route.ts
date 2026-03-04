import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const userName = process.env.FASTSPRING_API_USERNAME;
    const password = process.env.FASTSPRING_API_PASSWORD;

    console.log('[API] Environment check - userName exists:', !!userName);
    console.log('[API] Environment check - password exists:', !!password);

    if (!userName || !password) {
        console.error('[API] Missing environment variables');
        return NextResponse.json(
            { error: 'Missing API credentials' },
            { status: 500 }
        );
    }

    const auth = Buffer.from(`${userName}:${password}`).toString('base64');

    console.log('[API] Auth header created, length:', auth.length);

    try{
        const response = await fetch(
            'https://api.fastspring.com/products',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        console.log('[API] FastSpring response status:', response.status);

        if( !response.ok) {
            const errorText = await response.text();
            console.error('[API] FastSpring error:', errorText);
            return NextResponse.json(
                { error: 'Failed to fetch products', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('[API] Success - returning products');
        return NextResponse.json(data);
    } catch (error) {
        console.error('[API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}