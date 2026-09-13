import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import { Game, GameCategory } from '@/types/game';
import { GAMES_DATA } from '@/data/games';

const GAMES_JSON_PATH = path.join(process.cwd(), 'data', 'games.json');
const REDIS_KEY = 'yono_games_data';

// Helper to get Redis client if credentials are configured
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
  if (url && token) {
    return new Redis({ url, token });
  }
  return null;
}

async function readGamesFromDisk(): Promise<Game[]> {
  const redis = getRedisClient();
  
  // 1. If Vercel KV / Upstash is connected, read from cloud
  if (redis) {
    try {
      const cloudGames = await redis.get<Game[]>(REDIS_KEY);
      if (Array.isArray(cloudGames) && cloudGames.length > 0) {
        return cloudGames;
      }
      // Auto-seed cloud store if empty
      await redis.set(REDIS_KEY, GAMES_DATA);
      return [...GAMES_DATA];
    } catch (err) {
      console.error('Redis read error, falling back to local storage:', err);
    }
  }

  // 2. Local environment fallback: read data/games.json
  try {
    if (fs.existsSync(GAMES_JSON_PATH)) {
      const fileData = await fs.promises.readFile(GAMES_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading games.json, falling back to static games:', err);
  }
  return [...GAMES_DATA];
}

async function writeGamesToDisk(games: Game[]): Promise<void> {
  const redis = getRedisClient();
  
  // 1. If Vercel KV / Upstash is connected, save to cloud
  if (redis) {
    try {
      await redis.set(REDIS_KEY, games);
      return;
    } catch (err) {
      console.error('Redis write error:', err);
    }
  }

  // 2. Local environment fallback: save to data/games.json
  try {
    await fs.promises.writeFile(GAMES_JSON_PATH, JSON.stringify(games, null, 2), 'utf-8');
  } catch (err) {
    console.error('Local file write error:', err);
  }
}


export async function getGames(): Promise<Game[]> {
  return await readGamesFromDisk();
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const games = await readGamesFromDisk();
  return games.find((game) => game.slug === slug);
}

export async function getGameById(id: string): Promise<Game | undefined> {
  const games = await readGamesFromDisk();
  return games.find((game) => game.id === id);
}

export async function getFeaturedGames(): Promise<Game[]> {
  const games = await readGamesFromDisk();
  return games.filter((game) => game.featured);
}

export async function getNewGames(): Promise<Game[]> {
  const games = await readGamesFromDisk();
  return games.filter((game) => game.newRelease);
}

export async function getPopularGames(): Promise<Game[]> {
  const games = await readGamesFromDisk();
  return games.filter((game) => game.popular);
}

export async function getGamesByCategory(category: GameCategory | string): Promise<Game[]> {
  const games = await readGamesFromDisk();
  if (category === 'All') return games;
  return games.filter((game) => 
    game.category === category || game.categories.includes(category)
  );
}

export async function getRelatedGames(currentSlug: string, limit = 3): Promise<Game[]> {
  const games = await readGamesFromDisk();
  const current = games.find(g => g.slug === currentSlug);
  if (!current) return games.slice(0, limit);

  const related = games.filter(
    g => g.slug !== currentSlug && (g.category === current.category || g.categories.some(c => current.categories.includes(c)))
  );

  return related.length >= limit ? related.slice(0, limit) : games.filter(g => g.slug !== currentSlug).slice(0, limit);
}

export async function searchGames(query: string): Promise<Game[]> {
  const games = await readGamesFromDisk();
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return games.filter((game) => {
    return (
      game.name.toLowerCase().includes(q) ||
      game.category.toLowerCase().includes(q) ||
      game.tagline.toLowerCase().includes(q) ||
      game.categories.some((cat) => cat.toLowerCase().includes(q)) ||
      game.shortDescription.toLowerCase().includes(q)
    );
  });
}

export async function createGame(newGame: Game): Promise<Game> {
  const games = await readGamesFromDisk();
  // Check duplicate slug or id
  const existingIdx = games.findIndex(g => g.id === newGame.id || g.slug === newGame.slug);
  if (existingIdx !== -1) {
    throw new Error(`A game with ID or Slug "${newGame.slug}" already exists.`);
  }
  
  // Add to beginning of the list
  const updated = [newGame, ...games];
  await writeGamesToDisk(updated);
  return newGame;
}

export async function updateGame(id: string, gameUpdates: Partial<Game>): Promise<Game | null> {
  const games = await readGamesFromDisk();
  const index = games.findIndex(g => g.id === id);
  if (index === -1) return null;

  const existing = games[index];
  const updatedGame: Game = {
    ...existing,
    ...gameUpdates,
    id: existing.id, // Preserve immutable ID
  };

  games[index] = updatedGame;
  await writeGamesToDisk(games);
  return updatedGame;
}

export async function deleteGame(id: string): Promise<boolean> {
  const games = await readGamesFromDisk();
  const filtered = games.filter(g => g.id !== id);
  if (filtered.length === games.length) return false;

  await writeGamesToDisk(filtered);
  return true;
}

