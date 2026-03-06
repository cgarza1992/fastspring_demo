import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ storefrontId: string }> }
) {
  // Note: storefrontId is in params but FastSpring API doesn't support filtering by storefront
  // In the future, this could be used to filter products if the API supports it
  await params;

  const userName = process.env.FASTSPRING_API_USERNAME;
  const password = process.env.FASTSPRING_API_PASSWORD;

  const auth = Buffer.from(`${userName}:${password}`).toString("base64");

  try {
    // Get all product paths for this storefront
    const response = await fetch("https://api.fastspring.com/products", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const productPaths = data.products || []; // Array of strings like ["devmetrics-pro", ...]

    return NextResponse.json({ productPaths });
  } catch (error) {
    console.error("[API] Error fetching storefront products:", error);
    return NextResponse.json(
      { error: "Failed to fetch storefront products" },
      { status: 500 }
    );
  }
}
