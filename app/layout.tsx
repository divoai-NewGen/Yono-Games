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

  // =========================
  // BASIC SEO
  // =========================
  title: {
    default: 'Real Yono Games | Yono Games & Gaming Directory',
    template: '%s | Real Yono Games',
  },

  description:
    'Real Yono Games is a gaming directory featuring Yono games, arcade games, card games, and popular mobile gaming titles. Explore game information, features, updates, and related resources in one place.',

  keywords: [
    'Yono Games',
    'Real Yono Games',
    'Yono Games Directory',
    'Yono Rummy',
    'Yono 777',
    'Yono Slots',
    'Teen Patti Yono',
  ],

  authors: [
    {
      name: 'Real Yono Games',
    },
  ],

  creator: 'Real Yono Games',
  publisher: 'Real Yono Games',

  // =========================
  // OPEN GRAPH
  // =========================
  openGraph: {
    type: 'website',
    locale: 'en_IN',

    url: 'https://realyonogame.com/',

    siteName: 'Real Yono Games',

    title: 'Real Yono Games | Yono Games & Gaming Directory',

    description:
      'Explore Yono games, arcade games, card games, and popular mobile gaming titles with game information, features, and updates.',

    images: [
      {
        url: '/images/hero-composition.jpg',
        width: 1200,
        height: 630,
        alt: 'Real Yono Games - Yono Games Directory',
      },
    ],
  },

  // =========================
  // TWITTER / X
  // =========================
  twitter: {
    card: 'summary_large_image',

    title: 'Real Yono Games | Yono Games & Gaming Directory',

    description:
      'Explore Yono games, arcade games, card games, and popular mobile gaming titles with game information, features, and updates.',

    images: ['/images/hero-composition.jpg'],
  },

  // =========================
  // CANONICAL
  // =========================
  alternates: {
    canonical: 'https://realyonogame.com/',
  },

  // =========================
  // ROBOTS
  // =========================
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

  // =========================
  // FAVICONS
  // =========================
  icons: {
    icon: [
      {
        url: '/images/logo.png',
        type: 'image/png',
      },
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
    ],

    shortcut: '/images/logo.png',

    apple: [
      {
        url: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

// =====================================================
// STRUCTURED DATA
// =====================================================

const structuredData = {
  '@context': 'https://schema.org',

  '@graph': [
    // =========================
    // WEBSITE
    // =========================
    {
      '@type': 'WebSite',

      '@id': 'https://realyonogame.com/#website',

      url: 'https://realyonogame.com/',

      name: 'Real Yono Games',

      description:
        'Gaming directory featuring Yono games, arcade games, card games, and popular mobile gaming titles.',

      publisher: {
        '@id': 'https://realyonogame.com/#organization',
      },
    },

    // =========================
    // ORGANIZATION
    // =========================
    {
      '@type': 'Organization',

      '@id': 'https://realyonogame.com/#organization',

      name: 'Real Yono Games',

      alternateName: 'Yono Games',

      url: 'https://realyonogame.com/',

      logo: {
        '@type': 'ImageObject',
        url: 'https://realyonogame.com/images/logo.png',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        {/* =========================
            STRUCTURED DATA
        ========================== */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body className="min-h-full flex flex-col font-sans bg-white text-[#172331]">
        <Navbar />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}