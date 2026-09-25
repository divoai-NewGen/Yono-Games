import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  Star,
  Download,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

import {
  getGameBySlug,
  getGames,
  getRelatedGames,
} from '@/services/gameService';

import GameCard from '@/components/games/GameCard';

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;
export const revalidate = 60;

const TELEGRAM_URL = 'https://t.me/PredictionAndGiveaways';

export async function generateStaticParams() {
  const games = await getGames();

  return games.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return {
      title: 'Game Not Found | Real Yono Games',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    game.seoTitle ||
    `${game.name} | Real Yono Games`;

  const description =
    game.seoDescription ||
    game.shortDescription ||
    `Explore ${game.name}, including game information, features, updates, and available resources.`;

  const canonicalUrl =
    `https://realyonogame.com/games/${game.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },

    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: canonicalUrl,
      siteName: 'Real Yono Games',
      title,
      description,
      images: [
        {
          url:
            game.heroImage ||
            game.thumbnail ||
            game.logo ||
            '/images/hero-full-ribbon-3d.png',
          alt: `${game.name} game`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        game.heroImage ||
        game.thumbnail ||
        game.logo ||
        '/images/hero-full-ribbon-3d.png',
      ],
    },
  };
}

export default async function GameDetailPage({
  params,
}: GamePageProps) {
  const { slug } = await params;

  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const relatedGames = await getRelatedGames(
    game.slug,
    3
  );

  const canonicalUrl =
    `https://realyonogame.com/games/${game.slug}`;

  /*
   * Structured data
   *
   * Only use rating information when the game actually
   * provides it. This avoids inventing rating counts.
   */
  const schemaJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',

    '@id': `${canonicalUrl}#software`,

    name: game.name,

    url: canonicalUrl,

    operatingSystem: 'Android',

    applicationCategory: 'GameApplication',

    applicationSubCategory: game.category,

    description:
      game.seoDescription ||
      game.shortDescription,

    ...(game.downloadUrl ? { downloadUrl: game.downloadUrl } : {}),

    softwareVersion: game.version,

    fileSize: game.size,

    author: {
      '@type': 'Organization',
      name: 'Real Yono Games',
      url: 'https://realyonogame.com/',
    },
  };

  /*
   * Only add an Offer when a real free download
   * is actually represented by the data.
   */
  if (game.downloadUrl) {
    schemaJsonLd.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability:
        'https://schema.org/InStock',
      url: game.downloadUrl,
    };
  }

  /*
   * Only expose aggregateRating when real rating data
   * exists. Do not use a fabricated fallback.
   */
  if (
    game.rating &&
    game.ratingCount
  ) {
    schemaJsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: String(game.rating),
      bestRating: '5',
      worstRating: '1',
      ratingCount: String(game.ratingCount),
    };
  }

  /*
   * Breadcrumb structured data
   */
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://realyonogame.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Games',
        item: 'https://realyonogame.com/games/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: game.name,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="py-8 sm:py-12 bg-white min-h-screen">

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Breadcrumb / Back Navigation */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/games/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5D6B78] hover:text-[#087F5B] transition-colors group"
          >
            <ArrowLeft
              aria-hidden="true"
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            />

            <span>Back to Games Catalog</span>
          </Link>
        </nav>

        {/* Hero Section */}
        <section
          aria-labelledby="game-title"
          className="relative rounded-[32px] border border-[#E4ECE7] bg-radial-featured p-5 sm:p-8 lg:p-10 shadow-luxury overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

            {/* Game Artwork */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white bg-white">

                <Image
                  src={
                    game.heroImage ||
                    game.thumbnail ||
                    game.logo ||
                    '/images/hero-full-ribbon-3d.png'
                  }
                  alt={`${game.name} game`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

              </div>
            </div>

            {/* Game Details & Actions */}
            <div className="lg:col-span-6 space-y-5">

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">

                <span className="px-3 py-1 rounded-full bg-white border border-[#E4ECE7] text-xs font-bold text-[#07553F]">
                  {game.category}
                </span>

                <div
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#E4ECE7] text-xs font-bold text-[#172331]"
                  aria-label={`Rating ${game.rating}`}
                >
                  <Star
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-[#D6A83E] fill-current"
                  />

                  <span>{game.rating}</span>

                  {game.ratingCount && (
                    <span className="text-[#5D6B78] font-normal">
                      ({game.ratingCount})
                    </span>
                  )}
                </div>

                {game.newRelease && (
                  <span className="px-3 py-1 rounded-full bg-[#087F5B] text-white text-xs font-bold flex items-center gap-1">
                    <Sparkles
                      aria-hidden="true"
                      className="w-3 h-3 text-[#D6A83E]"
                    />

                    New Release
                  </span>
                )}

              </div>

              {/* Title */}
              <div>
                <h1
                  id="game-title"
                  className="text-3xl sm:text-4xl font-black text-[#172331] tracking-tight"
                >
                  {game.name}
                </h1>

                <p className="text-base sm:text-lg text-[#087F5B] font-semibold mt-1.5">
                  {game.tagline}
                </p>
              </div>

              {/* Primary Actions */}
              <div className="space-y-3 pt-1">

                {/* Download */}
                {game.downloadUrl ? (
                  <a
                    href={game.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download ${game.name} APK`}
                    className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white font-extrabold text-base sm:text-lg shadow-[0_6px_20px_-3px_rgba(8,127,91,0.35)] hover:shadow-[0_10px_28px_-3px_rgba(8,127,91,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                  >
                    <Download
                      aria-hidden="true"
                      className="w-5 h-5 flex-shrink-0"
                    />

                    <span>
                      Download APK ({game.size})
                    </span>
                  </a>
                ) : (
                  <div className="w-full py-3.5 px-4 rounded-2xl bg-[#EEF8F2] border border-[#087F5B]/20 text-center text-xs sm:text-sm font-bold text-[#087F5B]">
                    <span>Official Verified Web Edition</span>
                  </div>
                )}

                {/* Telegram */}
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white hover:bg-[#EEF8F2] text-[#087F5B] hover:text-[#066145] font-bold text-sm sm:text-base border-2 border-[#087F5B]/30 hover:border-[#087F5B] shadow-xs hover:shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-[#24A1DE] flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>

                  <span>Join Our Telegram Channel</span>
                </a>

                {/* Verification */}
                <div className="flex items-center justify-center gap-3 pt-1 text-xs font-medium text-[#5D6B78]">

                  <div className="flex items-center gap-1.5 text-[#087F5B]">
                    <ShieldCheck
                      aria-hidden="true"
                      className="w-4 h-4 flex-shrink-0"
                    />

                    <span>
                      Verified Download
                    </span>
                  </div>

                  <span aria-hidden="true">•</span>

                  <span>
                    Android APK
                  </span>

                </div>
              </div>

              {/* Short Description */}
              <p className="text-sm sm:text-base text-[#5D6B78] leading-relaxed">
                {game.shortDescription}
              </p>

              {/* Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-[#E4ECE7]">

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">
                    App Version
                  </p>

                  <p className="text-xs font-extrabold text-[#172331] mt-0.5">
                    {game.version}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">
                    Download Size
                  </p>

                  <p className="text-xs font-extrabold text-[#172331] mt-0.5">
                    {game.size}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">
                    Active Players
                  </p>

                  <p className="text-xs font-extrabold text-[#087F5B] mt-0.5">
                    {game.players}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">
                    Welcome Bonus
                  </p>

                  <p className="text-xs font-extrabold text-[#087F5B] mt-0.5">
                    {game.bonus}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Information */}
          <div className="lg:col-span-8 space-y-10">

            {/* About */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-[#172331]">
                About {game.name}
              </h2>

              <p className="text-sm sm:text-base text-[#5D6B78] leading-relaxed">
                {game.description}
              </p>
            </section>

            {/* Features */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-[#172331] flex items-center gap-2">
                <Sparkles
                  aria-hidden="true"
                  className="w-5 h-5 text-[#087F5B]"
                />

                Key Highlights & Features
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.features.map((feature, index) => (
                  <div
                    key={`${game.slug}-feature-${index}`}
                    className="p-4 rounded-2xl bg-[#F7FBF8] border border-[#E4ECE7] flex items-start gap-3"
                  >
                    <CheckCircle
                      aria-hidden="true"
                      className="w-4 h-4 text-[#087F5B] flex-shrink-0 mt-0.5"
                    />

                    <span className="text-xs sm:text-sm font-medium text-[#172331]">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Screenshots */}
            {game.screenshots?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-[#172331]">
                  {game.name} Gameplay Screenshots
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {game.screenshots.map((src, index) => (
                    <div
                      key={`${game.slug}-screenshot-${index}`}
                      className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E4ECE7] bg-[#F7FBF8] shadow-xs group"
                    >
                      <Image
                        src={src}
                        alt={`${game.name} gameplay screenshot ${index + 1}`}
                        fill
                        loading="lazy"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* How to Play */}
            {game.howToPlay?.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-[#172331] flex items-center gap-2">
                  <HelpCircle
                    aria-hidden="true"
                    className="w-5 h-5 text-[#087F5B]"
                  />

                  How to Get Started & Play
                </h2>

                <div className="space-y-3">
                  {game.howToPlay.map((step, index) => (
                    <div
                      key={`${game.slug}-step-${index}`}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E4ECE7]"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#EEF8F2] text-[#087F5B] text-xs font-bold flex items-center justify-center flex-shrink-0 font-mono">
                        {index + 1}
                      </span>

                      <p className="text-xs sm:text-sm text-[#172331] font-medium leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">

            {/* Download Information */}
            <div className="p-6 rounded-3xl bg-[#F7FBF8] border border-[#E4ECE7] space-y-4 shadow-xs">

              <h2 className="text-base font-bold text-[#172331]">
                {game.downloadUrl ? 'Download Information' : 'Application Overview'}
              </h2>

              <ul className="space-y-2.5 text-xs text-[#5D6B78]">

                <li className="flex justify-between pb-2 border-b border-[#E4ECE7] gap-4">
                  <span>System Support:</span>

                  <strong className="text-[#172331] text-right">
                    Android & Web (All Devices)
                  </strong>
                </li>

                <li className="flex justify-between pb-2 border-b border-[#E4ECE7] gap-4">
                  <span>App Version:</span>

                  <strong className="text-[#172331] text-right">
                    {game.version}
                  </strong>
                </li>

                <li className="flex justify-between pb-2 border-b border-[#E4ECE7] gap-4">
                  <span>Total Size:</span>

                  <strong className="text-[#172331] text-right">
                    {game.size}
                  </strong>
                </li>

                <li className="flex justify-between pb-2 border-b border-[#E4ECE7] gap-4">
                  <span>Access Type:</span>

                  <strong className="text-[#087F5B] flex items-center gap-1">
                    <ShieldCheck
                      aria-hidden="true"
                      className="w-3.5 h-3.5"
                    />

                    {game.downloadUrl ? 'Verified APK' : 'Instant Play'}
                  </strong>
                </li>

              </ul>

              <div className="space-y-2.5 pt-1">

                {game.downloadUrl && (
                  <a
                    href={game.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Download ${game.name}`}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-bold shadow-xs transition-all text-center"
                  >
                    <Download
                      aria-hidden="true"
                      className="w-4 h-4"
                    />

                    <span>
                      Download {game.name}
                    </span>
                  </a>
                )}

                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-[#EEF8F2] text-[#087F5B] text-xs font-bold border border-[#087F5B]/30 hover:border-[#087F5B] shadow-xs transition-all text-center"
                >
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 text-[#24A1DE]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>

                  <span>
                    Join Telegram Channel
                  </span>
                </a>

              </div>
            </div>

            {/* Player Advisory */}
            <div className="p-5 rounded-3xl bg-white border border-[#E4ECE7] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172331]">

                <AlertCircle
                  aria-hidden="true"
                  className="w-4 h-4 text-[#D6A83E]"
                />

                <span>Player Advisory</span>
              </div>

              <p className="text-[11px] text-[#5D6B78] leading-relaxed">
                Skill games may involve financial risk. Set
                appropriate time and spending boundaries and
                follow applicable age and local requirements.
              </p>
            </div>

          </aside>
        </div>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <section
            aria-labelledby="related-games-heading"
            className="pt-10 border-t border-[#E4ECE7] space-y-6"
          >

            <div className="flex items-center justify-between gap-4">

              <div>
                <h2
                  id="related-games-heading"
                  className="text-2xl font-bold text-[#172331]"
                >
                  Related Games You Might Like
                </h2>

                <p className="text-xs text-[#5D6B78] mt-1">
                  More games in {game.category}
                </p>
              </div>

              <Link
                href="/games/"
                className="text-xs font-bold text-[#087F5B] hover:underline whitespace-nowrap"
              >
                Browse All Games →
              </Link>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedGames.map((related) => (
                <GameCard
                  key={related.id}
                  game={related}
                />
              ))}
            </div>

          </section>
        )}

      </div>
    </main>
  );
}