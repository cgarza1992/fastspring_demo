import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ storefrontId: string }> }
) {
  // Note: storefrontId is available but FastSpring API doesn't support filtering by storefront
  const { storefrontId } = await params;
  const userName = process.env.FASTSPRING_API_USERNAME;
  const password = process.env.FASTSPRING_API_PASSWORD;

  const auth = Buffer.from(`${userName}:${password}`).toString("base64");

  try {
    // First, get all products
    const allProductsResponse = await fetch("https://api.fastspring.com/products", {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    if (!allProductsResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products from FastSpring" },
        { status: allProductsResponse.status }
      );
    }

    const allProductsData = await allProductsResponse.json();
    const productPaths = allProductsData.products || []; // This is an array of strings, not objects

    // Fetch full details for each product
    const productDetails = await Promise.all(
      productPaths.map(async (productPath: string) => {
        try {
          const productResponse = await fetch(
            `https://api.fastspring.com/products/${productPath}`,
            {
              headers: {
                Authorization: `Basic ${auth}`,
              },
            }
          );
          
          if (productResponse.ok) {
            const productData = await productResponse.json();
            const p = productData.products?.[0];
            return {
              path: p?.product,
              name: p?.display?.en || p?.product,
              price: p?.pricing?.price?.USD,
              description: p?.description?.summary?.en,
            };
          } else {
            return {
              path: productPath,
              error: `Failed to fetch details (${productResponse.status})`,
            };
          }
        } catch (error) {
          return {
            path: productPath,
            error: String(error),
          };
        }
      })
    );

    // Return information about what's available in this storefront
    return NextResponse.json({
      storefrontId,
      message: `Products available in ${storefrontId}:`,
      availableProducts: productDetails,
      totalAvailable: productDetails.length,
    });
  } catch (error) {
    console.error("[API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch storefront products", details: String(error) },
      { status: 500 }
    );
  }
}
