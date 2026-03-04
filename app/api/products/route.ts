import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const userName = process.env.FASTSPRING_API_USERNAME;
    const password = process.env.FASTSPRING_API_PASSWORD;

    const auth = Buffer.from(`${userName}:${password}`).toString('base64');

    try{
        const response = await fetch(
            'https://api.fastspring.com/products',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        if( !response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch products' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('[API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}