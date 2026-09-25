import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Trophy, Download, ShieldCheck, ArrowRight, Flame } from 'lucide-react';
import { Game } from '@/types/game';

interface FeaturedGameProps {
  game: Game;
}

export default function FeaturedGame({ game }: FeaturedGameProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section eyebrow */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-[#D6A83E]" />
            Spotlight Game of the Month
          </div>
        </div>

        {/* Large Rounded Showcase Container */}
        <div className="relative rounded-[32px] overflow-hidden border border-[#E4ECE7] bg-radial-featured p-6 sm:p-10 lg:p-12 shadow-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Details, Highlights, CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#E4ECE7] text-[#07553F]">
                    {game.category}
                  </span>
                  <span className="text-xs font-bold text-[#D6A83E] flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    Top Rated #1
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172331] tracking-tight">
                  {game.name}
                </h2>
                
                <p className="text-sm sm:text-base text-[#087F5B] font-semibold">
                  {game.tagline}
                </p>
              </div>

              <p className="text-sm text-[#5D6B78] leading-relaxed">
                {game.description}
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {game.features.slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#172331]">
                    <div className="w-4 h-4 rounded-full bg-[#EEF8F2] flex items-center justify-center flex-shrink-0 mt-0.5 text-[#087F5B]">
                      <Sparkles className="w-2.5 h-2.5" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Bonus and Specs Bar */}
              <div className="p-4 rounded-2xl bg-white border border-[#E4ECE7] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">Instant Welcome Gift</p>
                  <p className="text-sm font-black text-[#087F5B]">{game.bonus}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-[#5D6B78]">Active Community</p>
                  <p className="text-sm font-bold text-[#172331]">{game.players}</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {game.downloadUrl && (
                  <a
                    href={game.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Free APK ({game.size})</span>
                  </a>
                )}

                <Link
                  href={`/games/${game.slug}`}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl ${
                    game.downloadUrl
                      ? 'bg-white hover:bg-[#EEF8F2] text-[#07553F] border border-[#E4ECE7] hover:border-[#087F5B]/30'
                      : 'bg-[#087F5B] hover:bg-[#07553F] text-white'
                  } font-bold text-sm transition-all`}
                >
                  <span>Game Guide & Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#5D6B78]">
                <ShieldCheck className="w-4 h-4 text-[#087F5B]" />
                <span>Verified Clean APK • Safe Installation Guaranteed</span>
              </div>

            </div>

            {/* Right Column: Visual Showcase Mockup */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white/80 group">
                <Image
                  src={game.heroImage}
                  alt={game.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Floating badge over artwork */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E4ECE7] shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6A83E]" />
                  <span className="text-xs font-bold text-[#172331]">Jackpot Ready</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
