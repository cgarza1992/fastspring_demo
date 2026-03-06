import { NextResponse } from "next/server";

interface FastSpringProduct {
  product: string;
  display?: { en: string };
  pricing?: { price?: { USD: number } };
  description?: { summary?: { en: string } };
}

export async function GET() {
    const userName = process.env.FASTSPRING_API_USERNAME;
    const password = process.env.FASTSPRING_API_PASSWORD;

    const auth = Buffer.from(`${userName}:${password}`).toString('base64');

    try {
        const response = await fetch('https://api.fastspring.com/products', {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch products', status: response.status },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // Extract product paths and names from the response
        const productList = data.products?.map((product: FastSpringProduct) => ({
            path: product.product,
            name: product.display?.en || product.product,
            price: product.pricing?.price?.USD,
            description: product.description?.summary?.en,
        })) || [];

        return NextResponse.json({
            total: productList.length,
            products: productList,
            firstProductRaw: data.products?.[0], // Show first product raw structure
            allRaw: data, // Include full raw data
        });
    } catch (error) {
        console.error('[API] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch products', details: String(error) },
            { status: 500 }
        );
    }
}
