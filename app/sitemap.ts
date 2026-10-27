import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { getGames } from '@/services/gameService';
import { SITE_URL } from '@/utils/seo';

export const revalidate = 3600; // Revalidate sitemap every hour

/**
 * Returns a stable modification date for static routes and local content.
 * Avoids generating a new Date() on every request so search engines don't receive
 * artificial modification timestamps.
 */
function getStableContentDate(): Date {
  try {
    const jsonPath = path.join(process.cwd(), 'data', 'games.json');
    if (fs.existsSync(jsonPath)) {
      return fs.statSync(jsonPath).mtime;
    }
  } catch {
    // ignore
  }
  return new Date('2025-01-01T00:00:00.000Z');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const games = await getGames();
  const stableDate = getStableContentDate();

  // 1. Core Primary Static Pages (Strictly canonical, no trailing slashes)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: stableDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: stableDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: stableDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: stableDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: stableDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // 2. Verified Dynamic Content Pages (Valid slugs only)
  const gameRoutes: MetadataRoute.Sitemap = games
    .filter((game) => game && typeof game.slug === 'string' && game.slug.trim().length > 0)
    .map((game) => {
      const cleanSlug = game.slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-');
      // If the game has an explicit updatedAt date, use it; otherwise fallback to stable file date
      const lastModified = (game as { updatedAt?: string }).updatedAt
        ? new Date((game as { updatedAt?: string }).updatedAt!)
        : stableDate;

      return {
        url: `${baseUrl}/games/${encodeURIComponent(cleanSlug)}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
      };
    });

  return [...staticRoutes, ...gameRoutes];
}
