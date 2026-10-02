import { MetadataRoute } from 'next';
import { getGames } from '@/services/gameService';
import { SITE_URL } from '@/utils/seo';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const games = await getGames();
  const buildDate = new Date();

  // 1. Core Primary Static Pages (Strictly canonical, no trailing slashes)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: buildDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // 2. Verified Dynamic Content Pages
  const gameRoutes: MetadataRoute.Sitemap = games
    .filter((game) => game && game.slug)
    .map((game) => ({
      url: `${baseUrl}/games/${encodeURIComponent(game.slug.toLowerCase().trim())}`,
      lastModified: buildDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [...staticRoutes, ...gameRoutes];
}
