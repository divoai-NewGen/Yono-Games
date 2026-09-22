import React from 'react';
import Hero from '@/components/sections/Hero';
import FeaturedGame from '@/components/sections/FeaturedGame';
import NewReleasesCarousel from '@/components/sections/NewReleasesCarousel';
import ExploreGamesSection from '@/components/sections/ExploreGamesSection';
import MobileGamesList from '@/components/sections/MobileGamesList';
import WhyYonoGames from '@/components/sections/WhyYonoGames';
import HowItWorks from '@/components/sections/HowItWorks';
import AboutSection from '@/components/sections/AboutSection';
import { getGames, getFeaturedGames, getNewGames } from '@/services/gameService';

export default async function HomePage() {
  const [allGames, featuredList, newGames] = await Promise.all([
    getGames(),
    getFeaturedGames(),
    getNewGames(),
  ]);

  const featuredGame = featuredList[0] || allGames[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Mobile View: Compact, High-Converting Games List directly below Hero */}
      <div className="block md:hidden">
        <MobileGamesList games={allGames} />
      </div>

      {/* Desktop View: Full Featured Showcase, Carousel & Catalog */}
      <div className="hidden md:block">
        <FeaturedGame game={featuredGame} />
        <NewReleasesCarousel games={newGames} />
        <ExploreGamesSection initialGames={allGames} />
      </div>

      <AboutSection />
      <WhyYonoGames />
      <HowItWorks />
    </div>
  );
}
