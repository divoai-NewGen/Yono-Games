import React from 'react';
import Hero from '@/components/sections/Hero';
import FeaturedGame from '@/components/sections/FeaturedGame';
import NewReleasesCarousel from '@/components/sections/NewReleasesCarousel';
import ExploreGamesSection from '@/components/sections/ExploreGamesSection';
import WhyYonoGames from '@/components/sections/WhyYonoGames';
import HowItWorks from '@/components/sections/HowItWorks';
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
      <FeaturedGame game={featuredGame} />
      <NewReleasesCarousel games={newGames} />
      <ExploreGamesSection initialGames={allGames} />
      <WhyYonoGames />
      <HowItWorks />
    </div>
  );
}
