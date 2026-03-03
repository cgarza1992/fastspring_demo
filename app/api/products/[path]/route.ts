import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string }> }
) {
    const { path: productPath } = await params;

    const userName = process.env.FASTSPRING_API_USERNAME;
    const password = process.env.FASTSPRING_API_PASSWORD;

    console.log('product path: ', productPath);
    console.log('username: ', userName );

    const auth = Buffer.from(`${userName}:${password}`).toString('base64');

    try {
        const response = await fetch(
            `https://api.fastspring.com/products/${productPath}`,
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                },
            }
        );

        console.log('[API] Calling:', `https://api.fastspring.com/products/${productPath}`);
        console.log('[API] Auth header:', `Basic ${auth}`);

        // Check for a failed response. 
        if(!response.ok) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch(error){
        console.log(error);

        return NextResponse.json(
            {error: "Failed to fetch product" },
            {status: 500}
        );
    }
}