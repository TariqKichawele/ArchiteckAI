import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' *; frame-src 'self' https: http: data: blob:;",
          },
        ],
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
