import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Vercel sets this header in production
  const vercelCountry = request.headers.get("x-vercel-ip-country");
  if (vercelCountry) {
    return NextResponse.json({ country: vercelCountry });
  }

  // Locally, fall back to ip-api.com (free, no key required)
  try {
    const res = await fetch("http://ip-api.com/json/?fields=countryCode");
    const data = await res.json();
    return NextResponse.json({ country: data.countryCode || "US" });
  } catch {
    return NextResponse.json({ country: "US" });
  }
}
