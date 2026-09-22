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
    'Real Yono Games is an online gaming platform directory featuring mobile arcade games, card titles, and predictive gaming applications. Explore verified game releases, latest updates, and download resources.',
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
    title: 'All Yono Games - India’s Favourite Gaming Platform',
    description:
      'Real Yono Games is an online gaming platform directory featuring mobile arcade games, card titles, and predictive gaming applications.',
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
      'Real Yono Games is an online gaming platform directory featuring mobile arcade games, card titles, and predictive gaming applications.',
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
      description: 'Online gaming platform directory featuring mobile arcade games, card titles, and predictive gaming applications with verified guides and updates.',
      publisher: {
        '@id': 'https://realyonogame.com/#organization',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://realyonogame.com/#organization',
      name: 'Real Yono Games',
      url: 'https://realyonogame.com',
      logo: 'https://realyonogame.com/images/logo.png',
    },
    {
      '@type': 'DataCatalog',
      '@id': 'https://realyonogame.com/#catalog',
      name: 'Yono Games Directory',
      description: 'Curated index and discovery portal for mobile gaming apps, card games, and online arcade titles.',
      url: 'https://realyonogame.com/games',
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
