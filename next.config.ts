import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/games',
        has: [
          {
            type: 'query',
            key: 'filter',
          },
        ],
        destination: '/games/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
