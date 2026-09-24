import Hero from '@/components/sections/Hero';
import NewReleasesCarousel from '@/components/sections/NewReleasesCarousel';
import ExploreGamesSection from '@/components/sections/ExploreGamesSection';
import MobileGamesList from '@/components/sections/MobileGamesList';
import WhyYonoGames from '@/components/sections/WhyYonoGames';
import HowItWorks from '@/components/sections/HowItWorks';

import {
  getGames,
  getNewGames,
} from '@/services/gameService';

export default async function HomePage() {
  const [allGames, newGames] = await Promise.all([
    getGames(),
    getNewGames(),
  ]);

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
        New releases and complete game catalogue.
      */}
      <div className="hidden md:block">
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