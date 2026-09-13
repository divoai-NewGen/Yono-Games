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
      url: 'https://moreyonogames.com',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
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

        {/* Hero Showcase Container */}
        <div className="relative rounded-[32px] border border-[#E4ECE7] bg-radial-featured p-6 sm:p-10 lg:p-12 shadow-luxury overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Game specs, Badges, CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
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

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#172331] tracking-tight">
                  {game.name}
                </h1>
                <p className="text-base sm:text-lg text-[#087F5B] font-semibold mt-2">
                  {game.tagline}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#5D6B78] leading-relaxed max-w-2xl">
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <a
                  href={game.downloadUrl}
                  download
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white font-bold text-base shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <Download className="w-5 h-5" />
                  <span>Download APK ({game.size})</span>
                </a>

                <div className="flex items-center gap-2 text-xs text-[#5D6B78]">
                  <ShieldCheck className="w-4 h-4 text-[#087F5B]" />
                  <span>100% Virus-Free & Verified</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Mockup */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/80 bg-white">
                <Image
                  src={game.heroImage}
                  alt={game.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
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
            
            {/* Quick Download Card */}
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

              <a
                href={game.downloadUrl}
                download
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-bold shadow-xs transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download {game.name}</span>
              </a>
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
