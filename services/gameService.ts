import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import { Game, GameCategory } from '@/types/game';
import { GAMES_DATA } from '@/data/games';

const GAMES_JSON_PATH = path.join(process.cwd(), 'data', 'games.json');
const REDIS_KEY = 'yono_games_data';

/**
 * Returns a Redis client when the required environment
 * variables are available.
 */
function getRedisClient(): Redis | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.STORAGE_REST_API_URL ||
    process.env.STORAGE_URL;

  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.STORAGE_REST_API_TOKEN ||
    process.env.STORAGE_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

/**
 * Read games from Redis first, then local JSON,
 * and finally fall back to the static game data.
 */
async function readGamesFromDisk(): Promise<Game[]> {
  const redis = getRedisClient();

  // 1. Cloud storage
  if (redis) {
    try {
      const cloudGames = await redis.get<Game[]>(REDIS_KEY);

      if (Array.isArray(cloudGames) && cloudGames.length > 0) {
        return cloudGames;
      }

      // Seed Redis when no game data exists yet.
      await redis.set(REDIS_KEY, GAMES_DATA);

      return [...GAMES_DATA];
    } catch (error) {
      console.error(
        'Redis read error, falling back to local storage:',
        error
      );
    }
  }

  // 2. Local JSON fallback
  try {
    if (fs.existsSync(GAMES_JSON_PATH)) {
      const fileData = await fs.promises.readFile(
        GAMES_JSON_PATH,
        'utf-8'
      );

      const parsed: unknown = JSON.parse(fileData);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Game[];
      }
    }
  } catch (error) {
    console.error(
      'Error reading games.json, falling back to static games:',
      error
    );
  }

  // 3. Static fallback
  return [...GAMES_DATA];
}

/**
 * Write games to Redis when available,
 * otherwise write to the local JSON file.
 */
async function writeGamesToDisk(games: Game[]): Promise<void> {
  const redis = getRedisClient();

  // 1. Cloud storage
  if (redis) {
    try {
      await redis.set(REDIS_KEY, games);
      return;
    } catch (error) {
      console.error('Redis write error:', error);
    }
  }

  // 2. Local JSON fallback
  try {
    await fs.promises.writeFile(
      GAMES_JSON_PATH,
      JSON.stringify(games, null, 2),
      'utf-8'
    );
  } catch (error) {
    console.error('Local file write error:', error);
  }
}

/**
 * Return all games.
 */
export async function getGames(): Promise<Game[]> {
  return readGamesFromDisk();
}

/**
 * Return a game by its SEO-friendly slug.
 */
export async function getGameBySlug(
  slug: string
): Promise<Game | undefined> {
  if (!slug) {
    return undefined;
  }

  const games = await readGamesFromDisk();

  return games.find((game) => game.slug === slug);
}

/**
 * Return a game by its ID.
 */
export async function getGameById(
  id: string
): Promise<Game | undefined> {
  if (!id) {
    return undefined;
  }

  const games = await readGamesFromDisk();

  return games.find((game) => game.id === id);
}

/**
 * Return featured games.
 */
export async function getFeaturedGames(): Promise<Game[]> {
  const games = await readGamesFromDisk();

  return games.filter((game) => game.featured);
}

/**
 * Return newly released games.
 */
export async function getNewGames(): Promise<Game[]> {
  const games = await readGamesFromDisk();

  return games.filter((game) => game.newRelease);
}

/**
 * Return popular games.
 */
export async function getPopularGames(): Promise<Game[]> {
  const games = await readGamesFromDisk();

  return games.filter((game) => game.popular);
}

/**
 * Return games belonging to a category.
 */
export async function getGamesByCategory(
  category: GameCategory | string
): Promise<Game[]> {
  const games = await readGamesFromDisk();

  if (!category || category === 'All') {
    return games;
  }

  return games.filter(
    (game) =>
      game.category === category ||
      game.categories?.includes(category)
  );
}

/**
 * Return games related to the current game.
 */
export async function getRelatedGames(
  currentSlug: string,
  limit = 3
): Promise<Game[]> {
  const games = await readGamesFromDisk();

  if (limit <= 0) {
    return [];
  }

  const current = games.find(
    (game) => game.slug === currentSlug
  );

  if (!current) {
    return games.slice(0, limit);
  }

  const currentCategories = current.categories ?? [];

  const related = games.filter((game) => {
    if (game.slug === currentSlug) {
      return false;
    }

    const samePrimaryCategory =
      game.category === current.category;

    const sameAdditionalCategory =
      game.categories?.some((category) =>
        currentCategories.includes(category)
      ) ?? false;

    return samePrimaryCategory || sameAdditionalCategory;
  });

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  // Fill remaining slots with other games if
  // there aren't enough category matches.
  const relatedSlugs = new Set(
    related.map((game) => game.slug)
  );

  const fallbackGames = games.filter(
    (game) =>
      game.slug !== currentSlug &&
      !relatedSlugs.has(game.slug)
  );

  return [...related, ...fallbackGames].slice(0, limit);
}

/**
 * Search games by name, category, tags,
 * tagline, or short description.
 */
export async function searchGames(
  query: string
): Promise<Game[]> {
  const games = await readGamesFromDisk();
  const q = query.trim().toLowerCase();

  if (!q) {
    return [];
  }

  return games.filter((game) => {
    const searchableText = [
      game.name,
      game.category,
      game.tagline,
      game.shortDescription,
      ...(game.categories ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(q);
  });
}

/**
 * Create a new game.
 */
export async function createGame(
  newGame: Game
): Promise<Game> {
  const games = await readGamesFromDisk();

  const existingIndex = games.findIndex(
    (game) =>
      game.id === newGame.id ||
      game.slug === newGame.slug
  );

  if (existingIndex !== -1) {
    throw new Error(
      `A game with ID or Slug "${newGame.slug}" already exists.`
    );
  }

  const updatedGames = [newGame, ...games];

  await writeGamesToDisk(updatedGames);

  return newGame;
}

/**
 * Update an existing game while preserving its ID.
 */
export async function updateGame(
  id: string,
  gameUpdates: Partial<Game>
): Promise<Game | null> {
  const games = await readGamesFromDisk();

  const index = games.findIndex(
    (game) => game.id === id
  );

  if (index === -1) {
    return null;
  }

  const existingGame = games[index];

  const updatedGame: Game = {
    ...existingGame,
    ...gameUpdates,
    id: existingGame.id,
  };

  games[index] = updatedGame;

  await writeGamesToDisk(games);

  return updatedGame;
}

/**
 * Delete a game by ID.
 */
export async function deleteGame(
  id: string
): Promise<boolean> {
  const games = await readGamesFromDisk();

  const filteredGames = games.filter(
    (game) => game.id !== id
  );

  if (filteredGames.length === games.length) {
    return false;
  }

  await writeGamesToDisk(filteredGames);

  return true;
}