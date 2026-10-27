/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
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
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/download/yono-aviator.apk',
        destination: '/games/yono-aviator',
        permanent: true,
      },
      {
        source: '/download/dragon-vs-tiger.apk',
        destination: '/games/dragon-vs-tiger',
        permanent: true,
      },
      {
        source: '/download/teen-patti-yono.apk',
        destination: '/games/teen-patti-yono',
        permanent: true,
      },
      {
        source: '/download/andar-bahar-pro.apk',
        destination: '/games/andar-bahar-pro',
        permanent: true,
      },
      {
        source: '/download/mines-adventure.apk',
        destination: '/games/mines-adventure',
        permanent: true,
      },
      {
        source: '/download/car-roulette.apk',
        destination: '/games/car-roulette',
        permanent: true,
      },
      {
        source: '/download/ludo-yono.apk',
        destination: '/games/ludo-yono',
        permanent: true,
      },
      {
        source: '/download/yono-arcade.apk',
        destination: '/games/yono-arcade-hub',
        permanent: true,
      },
      {
        source: '/games/yono-arcade',
        destination: '/games/yono-arcade-hub',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
