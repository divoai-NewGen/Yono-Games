import React from 'react';
import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { getGames } from '@/services/gameService';
import GamesDirectory from '@/components/games/GamesDirectory';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { createMetadata } from '@/utils/seo';
import { STATIC_PAGE_SEO } from '@/utils/seoData';
import { getGamesBreadcrumb } from '@/utils/breadcrumbs';
import { getWebPageSchema } from '@/utils/structuredData';

export const metadata: Metadata = createMetadata(STATIC_PAGE_SEO.games);

export default async function GamesPage() {
  const games = await getGames();
  const breadcrumbItems = getGamesBreadcrumb();
  const webPageSchema = getWebPageSchema({
    name: 'Games Catalog - Verified Yono Games',
    description: 'Explore the complete directory of verified Yono mobile games and APK downloads.',
    path: 'games',
    breadcrumbItems,
  });

  return (
    <div className="py-8 sm:py-14 bg-white min-h-screen">
      <JsonLd id="games-page-schema" data={webPageSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        {/* Page Header */}
        <header className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D6A83E]" aria-hidden="true" />
            Official Games Library
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#172331] tracking-tight">
            Explore All Games
          </h1>
          <p className="text-base text-[#5D6B78] mt-3">
            Discover verified releases, classic card games, and progressive jackpot titles across the Yono ecosystem.
          </p>
        </header>

        {/* Directory Explorer */}
        <main>
          <GamesDirectory initialGames={games} />
        </main>
      </div>
    </div>
  );
}
