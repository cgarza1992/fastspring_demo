import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://sbl.onfastspring.com https://cdn.onfastspring.com; frame-src 'self' https://*.onfastspring.com https://sbl.onfastspring.com; connect-src 'self' https://*.onfastspring.com https://api.onfastspring.com; style-src 'self' 'unsafe-inline' https://sbl.onfastspring.com https://cdn.onfastspring.com; img-src 'self' data: https: https://cdn.onfastspring.com https://sbl.onfastspring.com; font-src 'self' data: https://cdn.onfastspring.com; form-action 'self' https://*.onfastspring.com; child-src 'self' https://*.onfastspring.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
