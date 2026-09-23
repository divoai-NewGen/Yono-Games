import React from 'react';
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
  Smartphone, 
  Layers, 
  CheckCircle, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { getGameBySlug, getGames, getRelatedGames } from '@/services/gameService';
import GameCard from '@/components/games/GameCard';

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const games = await getGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    return {
      title: 'Game Not Found | Yono Games',
    };
  }

  return {
    title: game.seoTitle || `${game.name} - Official Download & Review`,
    description: game.seoDescription || game.shortDescription,
    openGraph: {
      title: `${game.name} | Yono Games`,
      description: game.shortDescription,
      images: [{ url: game.thumbnail }],
    },
  };
}

const TELEGRAM_URL = 'https://t.me/PredictionAndGiveaways';

export default async function GameDetailPage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const relatedGames = await getRelatedGames(game.slug, 3);

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: game.name,
    operatingSystem: 'Android 6.0+',
    applicationCategory: 'GameApplication',
    applicationSubCategory: game.category,
    downloadUrl: game.downloadUrl,
    softwareVersion: game.version,
    fileSize: game.size,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(game.rating || 4.8),
      bestRating: '5',
      worstRating: '1',
      ratingCount: '24500',
    },
    author: {
      '@type': 'Organization',
      name: 'Yono Games',
      url: 'https://realyonogame.com',
    },
    description: game.seoDescription || game.shortDescription,
  };

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      {/* Google Rich Snippet Structured Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/games/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#5D6B78] hover:text-[#087F5B] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Games Catalog</span>
          </Link>
        </div>

        {/* Hero Showcase Container: Image First, Download & Telegram Buttons, then Details */}
        <div className="relative rounded-[32px] border border-[#E4ECE7] bg-radial-featured p-5 sm:p-8 lg:p-10 shadow-luxury overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* 1. Game Artwork / Image at top */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-2 border-white bg-white">
                <Image
                  src={game.heroImage || game.thumbnail || game.logo || '/images/hero-full-ribbon-3d.png'}
                  alt={game.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* 2. Actions & Specs: Download APK, Join Telegram, Badges, Name, Specs */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white border border-[#E4ECE7] text-xs font-bold text-[#07553F]">
                  {game.category}
                </span>
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#E4ECE7] text-xs font-bold text-[#172331]">
                  <Star className="w-3.5 h-3.5 text-[#D6A83E] fill-current" />
                  <span>{game.rating}</span>
                  <span className="text-[#5D6B78] font-normal">({game.ratingCount})</span>
                </div>
                {game.newRelease && (
                  <span className="px-3 py-1 rounded-full bg-[#087F5B] text-white text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D6A83E]" />
                    New Release
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#172331] tracking-tight">
                  {game.name}
                </h1>
                <p className="text-base sm:text-lg text-[#087F5B] font-semibold mt-1.5">
                  {game.tagline}
                </p>
              </div>

              {/* Primary Action Buttons: 1. Download APK, 2. Join Telegram */}
              <div className="space-y-3 pt-1">
                {/* Download Button */}
                <a
                  href={game.downloadUrl}
                  download
                  className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white font-extrabold text-base sm:text-lg shadow-[0_6px_20px_-3px_rgba(8,127,91,0.35)] hover:shadow-[0_10px_28px_-3px_rgba(8,127,91,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  <Download className="w-5 h-5 flex-shrink-0" />
                  <span>Download APK ({game.size})</span>
                </a>

                {/* Join Telegram Button */}
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white hover:bg-[#EEF8F2] text-[#087F5B] hover:text-[#066145] font-bold text-sm sm:text-base border-2 border-[#087F5B]/30 hover:border-[#087F5B] shadow-xs hover:shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  <svg className="w-5 h-5 text-[#24A1DE] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  <span>Join Our Telegram Channel</span>
                </a>

                {/* Trust Verification */}
                <div className="flex items-center justify-center gap-3 pt-1 text-xs font-medium text-[#5D6B78]">
                  <div className="flex items-center gap-1.5 text-[#087F5B]">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>100% Virus-Free & Verified</span>
                  </div>
                  <span>•</span>
                  <span>Direct Official APK</span>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-sm sm:text-base text-[#5D6B78] leading-relaxed">
                {game.shortDescription}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-[#E4ECE7]">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">App Version</p>
                  <p className="text-xs font-extrabold text-[#172331] mt-0.5">{game.version}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">Download Size</p>
                  <p className="text-xs font-extrabold text-[#172331] mt-0.5">{game.size}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">Active Players</p>
                  <p className="text-xs font-extrabold text-[#087F5B] mt-0.5">{game.players}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">Welcome Bonus</p>
                  <p className="text-xs font-extrabold text-[#087F5B] mt-0.5">{game.bonus}</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Content Section: About & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* About the Game */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#172331]">
                About {game.name}
              </h2>
              <p className="text-sm sm:text-base text-[#5D6B78] leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Key Game Highlights */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#172331] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#087F5B]" />
                Key Highlights & Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.features.map((feature, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-[#F7FBF8] border border-[#E4ECE7] flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#087F5B] flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-[#172331]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Screenshots Gallery */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#172331]">
                Gameplay Screenshots
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {game.screenshots.map((src, i) => (
                  <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E4ECE7] bg-[#F7FBF8] shadow-xs group">
                    <Image
                      src={src}
                      alt={`${game.name} Screenshot ${i + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* How to Get Started */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#172331] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#087F5B]" />
                How to Get Started & Play
              </h3>
              <div className="space-y-3">
                {game.howToPlay.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E4ECE7]">
                    <span className="w-6 h-6 rounded-full bg-[#EEF8F2] text-[#087F5B] text-xs font-bold flex items-center justify-center flex-shrink-0 font-mono">
                      {index + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#172331] font-medium leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Download & Community Card */}
            <div className="p-6 rounded-3xl bg-[#F7FBF8] border border-[#E4ECE7] space-y-4 shadow-xs">
              <h4 className="text-base font-bold text-[#172331]">
                Download Information
              </h4>
              <ul className="space-y-2.5 text-xs text-[#5D6B78]">
                <li className="flex justify-between pb-2 border-b border-[#E4ECE7]">
                  <span>System Support:</span>
                  <strong className="text-[#172331]">Android 6.0 & above</strong>
                </li>
                <li className="flex justify-between pb-2 border-b border-[#E4ECE7]">
                  <span>Package File:</span>
                  <strong className="text-[#172331]">{game.slug}.apk</strong>
                </li>
                <li className="flex justify-between pb-2 border-b border-[#E4ECE7]">
                  <span>Total Size:</span>
                  <strong className="text-[#172331]">{game.size}</strong>
                </li>
                <li className="flex justify-between pb-2 border-b border-[#E4ECE7]">
                  <span>Security Status:</span>
                  <strong className="text-[#087F5B] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Safe
                  </strong>
                </li>
              </ul>

              <div className="space-y-2.5 pt-1">
                <a
                  href={game.downloadUrl}
                  download
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-bold shadow-xs transition-all text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {game.name}</span>
                </a>

                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-[#EEF8F2] text-[#087F5B] text-xs font-bold border border-[#087F5B]/30 hover:border-[#087F5B] shadow-xs transition-all text-center"
                >
                  <svg className="w-4 h-4 text-[#24A1DE]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  <span>Join Telegram Channel</span>
                </a>
              </div>
            </div>

            {/* Responsible Gaming Box */}
            <div className="p-5 rounded-3xl bg-white border border-[#E4ECE7] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#172331]">
                <AlertCircle className="w-4 h-4 text-[#D6A83E]" />
                <span>Player Advisory</span>
              </div>
              <p className="text-[11px] text-[#5D6B78] leading-relaxed">
                Skill games involve financial risk. Set daily time and deposit boundaries. Restricted for minors under 18 years of age.
              </p>
            </div>

          </div>

        </div>

        {/* Related Games (Only related games as requested, not full catalog) */}
        <div className="pt-10 border-t border-[#E4ECE7] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#172331]">
                Related Games You Might Like
              </h3>
              <p className="text-xs text-[#5D6B78] mt-1">
                More top-rated titles in {game.category}
              </p>
            </div>
            <Link
              href="/games/"
              className="text-xs font-bold text-[#087F5B] hover:underline"
            >
              Browse All Games →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedGames.map((related) => (
              <GameCard key={related.id} game={related} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
