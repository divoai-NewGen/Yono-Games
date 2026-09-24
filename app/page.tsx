import Hero from '@/components/sections/Hero';
import FeaturedGame from '@/components/sections/FeaturedGame';
import NewReleasesCarousel from '@/components/sections/NewReleasesCarousel';
import ExploreGamesSection from '@/components/sections/ExploreGamesSection';
import MobileGamesList from '@/components/sections/MobileGamesList';
import WhyYonoGames from '@/components/sections/WhyYonoGames';
import HowItWorks from '@/components/sections/HowItWorks';

import {
  getGames,
  getFeaturedGames,
  getNewGames,
} from '@/services/gameService';

export default async function HomePage() {
  const [allGames, featuredList, newGames] = await Promise.all([
    getGames(),
    getFeaturedGames(),
    getNewGames(),
  ]);

  const featuredGame = featuredList[0] || allGames[0];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero / Main Introduction */}
      <Hero />

      {/* 
        Mobile:
        Show the game catalogue directly below the hero.
      */}
      <div className="block md:hidden">
        <MobileGamesList games={allGames} />
      </div>

      {/* 
        Desktop:
        Featured game, new releases and complete game catalogue.
      */}
      <div className="hidden md:block">
        {featuredGame && (
          <FeaturedGame game={featuredGame} />
        )}

        {newGames?.length > 0 && (
          <NewReleasesCarousel games={newGames} />
        )}

        <ExploreGamesSection initialGames={allGames} />
      </div>

      {/* About / Value Proposition */}
      <WhyYonoGames />

      {/* How the website works */}
      <HowItWorks />
    </div>
  );
}