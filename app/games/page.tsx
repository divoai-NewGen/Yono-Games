import React from 'react';
import { Metadata } from 'next';
import { getGames } from '@/services/gameService';
import GamesDirectory from '@/components/games/GamesDirectory';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Games Catalog - Play & Download All Yono Games',
  description:
    'Browse the complete collection of 90+ verified games on More Yono Games. Download official APKs for Yono 777, Yono Rummy, Aviator, Dragon vs Tiger, Teen Patti, and more.',
};

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D6A83E]" />
            Official Games Library
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#172331] tracking-tight">
            Explore All Games
          </h1>
          <p className="text-base text-[#5D6B78] mt-3">
            Discover verified releases, classic card games, and progressive jackpot titles across the Yono ecosystem.
          </p>
        </div>

        {/* Directory Explorer */}
        <GamesDirectory initialGames={games} />

      </div>
    </div>
  );
}
