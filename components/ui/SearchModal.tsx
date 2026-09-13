'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Star, ArrowRight, Gamepad2 } from 'lucide-react';
import { Game } from '@/types/game';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/games?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success && data.games) {
          setResults(data.games);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border-light overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E4ECE7] gap-3 bg-[#F7FBF8]">
          <Search className="w-5 h-5 text-[#087F5B]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search games by name, category, or features (e.g. Rummy, 777, Aviator)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#172331] text-base placeholder-[#5D6B78] outline-none font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#E4ECE7] text-[#5D6B78] hover:text-[#172331] font-mono shadow-sm"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#EEF8F2] flex items-center justify-center text-[#087F5B] mb-3">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#172331]">Discover Yono Games</p>
              <p className="text-xs text-[#5D6B78] mt-1 max-w-sm mx-auto">
                Type keywords like &ldquo;Slots&rdquo;, &ldquo;Rummy&rdquo;, &ldquo;Aviator&rdquo;, or &ldquo;Multiplier&rdquo; to find instant matches.
              </p>
            </div>
          ) : isSearching ? (
            <div className="py-8 text-center text-sm text-[#5D6B78]">
              Searching games...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#5D6B78] px-2 mb-2">
                Matches ({results.length})
              </p>
              {results.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  onClick={onClose}
                  className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#EEF8F2] transition-colors border border-transparent hover:border-[#087F5B]/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#E4ECE7] bg-gray-100 flex-shrink-0">
                      <Image
                        src={game.thumbnail}
                        alt={game.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#172331] group-hover:text-[#087F5B] transition-colors">
                        {game.name}
                      </h4>
                      <p className="text-xs text-[#5D6B78] line-clamp-1">{game.tagline}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-[#5D6B78]">
                        <span className="px-1.5 py-0.5 rounded bg-white border border-[#E4ECE7] font-medium text-[#07553F]">
                          {game.category}
                        </span>
                        <span className="flex items-center gap-0.5 text-[#D6A83E] font-semibold">
                          <Star className="w-3 h-3 fill-current" />
                          {game.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[#087F5B] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-semibold">
                    View
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold text-[#172331]">No games found</p>
              <p className="text-xs text-[#5D6B78] mt-1">
                We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try browsing our game catalog.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
