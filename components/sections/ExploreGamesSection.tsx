'use client';

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Game, GameCategory } from '@/types/game';
import GameCard from '@/components/games/GameCard';

interface ExploreGamesSectionProps {
  initialGames: Game[];
}

const CATEGORIES: { label: string; value: GameCategory }[] = [
  { label: 'All Games', value: 'All' },
  { label: 'Yono Games', value: 'Yono Games' },
  { label: 'Other Best Games', value: 'Other Best Games' },
];

export default function ExploreGamesSection({ initialGames }: ExploreGamesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<GameCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = initialGames.filter((game) => {
    const matchesCategory =
      activeCategory === 'All' ||
      activeCategory === 'All Games' ||
      game.category === activeCategory ||
      game.categories?.includes(activeCategory);

    const matchesSearch =
      !searchTerm.trim() ||
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.tagline.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="games" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172331] tracking-tight">
            Explore Our Games
          </h2>
          <p className="text-base text-[#5D6B78] mt-3">
            Find your next favourite from our growing collection of games.
          </p>
        </div>

        {/* Filter Bar & Search Input */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E4ECE7]">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-[#087F5B] text-white shadow-xs'
                      : 'bg-[#F7FBF8] text-[#5D6B78] hover:text-[#172331] hover:bg-[#EEF8F2] border border-[#E4ECE7]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Inline Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#087F5B]" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#F7FBF8] border border-[#E4ECE7] text-xs font-medium text-[#172331] placeholder-[#5D6B78] outline-none focus:border-[#087F5B] focus:bg-white transition-all"
            />
          </div>

        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredGames.map((game, index) => (
              <GameCard key={game.id} game={game} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F7FBF8] rounded-3xl border border-[#E4ECE7]">
            <Filter className="w-10 h-10 text-[#087F5B] mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-[#172331]">No matching games found</h3>
            <p className="text-xs text-[#5D6B78] mt-1 max-w-sm mx-auto">
              Try switching your category filter or clearing the search query.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#087F5B] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
