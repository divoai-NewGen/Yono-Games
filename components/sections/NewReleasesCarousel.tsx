'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Game } from '@/types/game';
import GameCard from '@/components/games/GameCard';

interface NewReleasesCarouselProps {
  games: Game[];
}

export default function NewReleasesCarousel({ games }: NewReleasesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 bg-[#F7FBF8] border-y border-[#E4ECE7]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D6A83E]" />
              Fresh Arrivals
            </div>
            <h2 className="text-3xl font-extrabold text-[#172331] tracking-tight">
              New Releases
            </h2>
            <p className="text-sm text-[#5D6B78] mt-1">
              Explore the latest games freshly verified and added to the Yono ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-white border border-[#E4ECE7] text-[#172331] hover:text-[#087F5B] hover:bg-[#EEF8F2] transition-colors shadow-2xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-white border border-[#E4ECE7] text-[#172331] hover:text-[#087F5B] hover:bg-[#EEF8F2] transition-colors shadow-2xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link
              href="/games?filter=new"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#087F5B] hover:text-[#07553F] ml-2"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {games.map((game) => (
            <div key={game.id} className="min-w-[280px] sm:min-w-[320px] max-w-[340px] flex-shrink-0 snap-start">
              <GameCard game={game} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
