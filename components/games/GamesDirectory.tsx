'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, Sparkles, Filter, ChevronDown, Check } from 'lucide-react';
import { Game, GameCategory } from '@/types/game';
import GameCard from '@/components/games/GameCard';
import CompactGameCard from '@/components/games/CompactGameCard';
import DownloadModal from '@/components/ui/DownloadModal';

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

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'New Releases' },
] as const;

export default function GamesDirectory({ initialGames, initialCategory = 'All' }: GamesDirectoryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedGameForModal, setSelectedGameForModal] = useState<Game | null>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownloadClick = (e: React.MouseEvent, game: Game) => {
    if (game.downloadUrl && game.downloadUrl.startsWith('http')) {
      return;
    }
    e.preventDefault();
    setSelectedGameForModal(game);
  };

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
      {/* Search and Filters Bar (Theme Green Styled, Zero Overlap) */}
      <div className="bg-gradient-to-b from-[#F7FBF8] to-[#EEF8F2]/60 p-4 sm:p-6 rounded-3xl border border-[#087F5B]/20 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#087F5B]" />
            <input
              type="text"
              placeholder="Search by game title, category, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-2xl bg-white border border-[#087F5B]/25 text-sm font-medium text-[#172331] placeholder-[#5D6B78] outline-none focus:border-[#087F5B] focus:ring-2 focus:ring-[#087F5B]/20 transition-all shadow-xs"
            />
          </div>

          {/* Custom Theme-Green Rounded Sort Dropdown */}
          <div ref={sortRef} className="relative flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#07553F] font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#087F5B]" />
              <span>Sort:</span>
            </div>
            
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#EEF8F2] hover:bg-[#E1F3E9] border border-[#087F5B]/30 text-xs font-bold text-[#07553F] shadow-xs transition-all active:scale-95"
            >
              <span>{SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Most Popular'}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#087F5B] transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Rounded Dropdown Menu */}
            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl border border-[#087F5B]/25 shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                {SORT_OPTIONS.map((option) => {
                  const isSelected = sortBy === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        isSelected
                          ? 'bg-[#087F5B] text-white shadow-xs'
                          : 'text-[#172331] hover:bg-[#EEF8F2] hover:text-[#087F5B]'
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Category Filter Pills: Brand Theme Green (Not plain white!) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
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

      {/* Games Catalog: Compact Cards on Mobile, Full Grid on Desktop */}
      {filteredGames.length > 0 ? (
        <>
          {/* Mobile View: Exact 100% compact list matching home page */}
          <div className="block md:hidden space-y-3">
            {filteredGames.map((game) => (
              <CompactGameCard
                key={game.id || game.slug}
                game={game}
                onDownloadClick={handleDownloadClick}
              />
            ))}
          </div>

          {/* Desktop View: Full 3-Column Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </>
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

      {/* Download Modal if triggered */}
      {selectedGameForModal && (
        <DownloadModal
          isOpen={true}
          onClose={() => setSelectedGameForModal(null)}
          gameName={selectedGameForModal.name}
          apkUrl={selectedGameForModal.downloadUrl}
        />
      )}
    </div>
  );
}
