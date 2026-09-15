'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Game, GameCategory } from '@/types/game';
import CompactGameCard from '@/components/games/CompactGameCard';
import DownloadModal from '@/components/ui/DownloadModal';

interface MobileGamesListProps {
  games: Game[];
}

const CATEGORIES: GameCategory[] = [
  'All',
  'Card & Rummy',
  'Slots & 777',
  'Arcade & Crash',
  'Roulette & Table',
  'Board Games',
];

export default function MobileGamesList({ games }: MobileGamesListProps) {
  const [activeCategory, setActiveCategory] = useState<GameCategory>('All');
  const [selectedGameForModal, setSelectedGameForModal] = useState<Game | null>(null);

  const filteredGames = games.filter((game) => {
    return (
      activeCategory === 'All' ||
      game.category === activeCategory ||
      game.categories?.includes(activeCategory)
    );
  });

  // Max 10 games on HomePage:
  // Shows max 10 in 'All', and max 10 when any category is selected (or fewer if category has fewer)
  const displayedGames = filteredGames.slice(0, 10);

  const handleDownloadClick = (e: React.MouseEvent, game: Game) => {
    if (game.downloadUrl && game.downloadUrl.startsWith('http')) {
      return;
    }
    e.preventDefault();
    setSelectedGameForModal(game);
  };

  return (
    <section className="py-6 px-4 bg-[#F8FAF9] border-t border-b border-[#E4ECE7]/80">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Section Header with Live Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#087F5B] animate-pulse" />
            <h2 className="text-lg font-black text-[#172331] tracking-tight">
              Top Yono Games
            </h2>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EEF8F2] text-[#087F5B] border border-[#087F5B]/20">
            {displayedGames.length} Games
          </span>
        </div>

        {/* Category Scrollable Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  active
                    ? 'bg-[#087F5B] text-white shadow-xs border border-[#087F5B]'
                    : 'bg-[#EEF8F2] text-[#07553F] hover:bg-[#E1F3E9] border border-[#087F5B]/25'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Games List Container (Max 10) */}
        <div className="space-y-3 pt-1">
          {displayedGames.map((game) => (
            <CompactGameCard
              key={game.id || game.slug}
              game={game}
              onDownloadClick={handleDownloadClick}
            />
          ))}

          {displayedGames.length === 0 && (
            <div className="bg-white rounded-2xl border border-[#E4ECE7] p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-[#172331]">No games found</p>
              <p className="text-xs text-[#5D6B78]">Try selecting another category.</p>
            </div>
          )}
        </div>

        {/* View All Games CTA */}
        <div className="pt-2 text-center">
          <Link
            href="/games"
            className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white hover:bg-[#EEF8F2] border border-[#E4ECE7] text-[#087F5B] font-bold text-xs shadow-2xs hover:shadow-xs transition-all active:scale-95"
          >
            <span>Explore All Games Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Download Modal */}
      {selectedGameForModal && (
        <DownloadModal
          isOpen={true}
          onClose={() => setSelectedGameForModal(null)}
          gameName={selectedGameForModal.name}
          apkUrl={selectedGameForModal.downloadUrl}
        />
      )}
    </section>
  );
}
