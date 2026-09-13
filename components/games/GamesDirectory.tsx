'use client';

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, Filter } from 'lucide-react';
import { Game, GameCategory } from '@/types/game';
import GameCard from '@/components/games/GameCard';

interface GamesDirectoryProps {
  initialGames: Game[];
  initialCategory?: string;
}

const CATEGORIES: GameCategory[] = [
  'All',
  'Card & Rummy',
  'Slots & 777',
  'Arcade & Crash',
  'Roulette & Table',
  'Board Games',
];

export default function GamesDirectory({ initialGames, initialCategory = 'All' }: GamesDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');

  const filteredGames = useMemo(() => {
    return initialGames
      .filter((game) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          game.category === selectedCategory ||
          game.categories.includes(selectedCategory);

        const matchesSearch =
          !searchQuery.trim() ||
          game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          game.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.newRelease ? 1 : 0) - (a.newRelease ? 1 : 0);
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      });
  }, [initialGames, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-10">
      {/* Search and Filters Bar */}
      <div className="bg-[#F7FBF8] p-5 sm:p-6 rounded-3xl border border-[#E4ECE7] space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#087F5B]" />
            <input
              type="text"
              placeholder="Search by game title, category, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#E4ECE7] text-sm font-medium text-[#172331] placeholder-[#5D6B78] outline-none focus:border-[#087F5B] transition-all shadow-xs"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5 text-xs text-[#5D6B78] font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#087F5B]" />
              <span>Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-[#E4ECE7] text-xs font-semibold text-[#172331] outline-none focus:border-[#087F5B] cursor-pointer shadow-xs"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Releases</option>
            </select>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#087F5B] text-white shadow-xs'
                    : 'bg-white text-[#5D6B78] hover:text-[#172331] hover:bg-[#EEF8F2] border border-[#E4ECE7]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#5D6B78] font-medium px-1">
        <span>
          Showing <strong className="text-[#172331]">{filteredGames.length}</strong> verified games
        </span>
        {selectedCategory !== 'All' && (
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-[#087F5B] hover:underline font-semibold"
          >
            Clear category filter
          </button>
        )}
      </div>

      {/* Games Catalog Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#F7FBF8] rounded-3xl border border-[#E4ECE7]">
          <Filter className="w-12 h-12 text-[#087F5B] mx-auto mb-3 opacity-60" />
          <h3 className="text-xl font-bold text-[#172331]">No matching games found</h3>
          <p className="text-xs text-[#5D6B78] mt-1 max-w-sm mx-auto">
            We couldn&apos;t find any games matching &ldquo;{searchQuery}&rdquo; in {selectedCategory}.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#087F5B] text-white text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
