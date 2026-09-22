import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://realyonogame.com'),
  title: {
    default: 'All Yono Games - India’s Favourite Gaming Platform',
    template: '%s | Yono Games',
  },
  description:
    'Discover exciting games, explore new releases, and find your next favourite. Play 13-card Rummy, Yono 777 Spin Gold, Aviator Multiplier, Teen Patti, and more with verified fair play.',
  keywords: [
    'Yono Games',
    'Real Yono Game',
    'All Yono Games',
    'Yono Rummy',
    'Yono 777',
    'Yono Slots',
    'Aviator Yono',
    'Teen Patti Yono',
    'Download Yono APK',
  ],
  authors: [{ name: 'Yono Games' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://realyonogame.com',
    siteName: 'Yono Games',
    title: 'All Yono Games - Your Next Game Is Waiting',
    description:
      'India’s favourite gaming platform. Discover 90+ games with progressive jackpots, verified RNG, and 24/7 support.',
    images: [
      {
        url: '/images/hero-composition.jpg',
        width: 1200,
        height: 630,
        alt: 'Yono Games Gaming Platform Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Yono Games - India’s Favourite Gaming Platform',
    description:
      'Discover 90+ games, explore new releases, and claim exclusive welcome bonuses.',
    images: ['/images/hero-composition.jpg'],
  },
  alternates: {
    canonical: 'https://realyonogame.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/images/logo.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://realyonogame.com/#website',
      url: 'https://realyonogame.com',
      name: 'Real Yono Games',
      description: 'Official directory for Yono Games, APK downloads, new releases, and gaming information platform.',
      publisher: {
        '@id': 'https://realyonogame.com/#organization',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://realyonogame.com/#organization',
      name: 'Real Yono Games Platform',
      url: 'https://realyonogame.com',
      logo: 'https://realyonogame.com/images/logo.png',
      sameAs: [],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-[#172331]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
