const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

const REDIS_KEY = 'yono_games_data';
const GAMES_JSON_PATH = path.join(__dirname, '..', 'data', 'games.json');

function getRedisClient() {
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

function isFakeUrl(url) {
  if (!url) return false;
  const str = String(url).trim();
  return (
    str.includes('realyonogame.com/download/') ||
    str.startsWith('/download/') ||
    (str.endsWith('.apk') && !str.startsWith('http://') && !str.startsWith('https://'))
  );
}

async function runMigration() {
  console.log('=== STARTING SAFE TARGETED GAMES MIGRATION ===\n');
  const redis = getRedisClient();
  let games = null;
  let source = '';

  if (redis) {
    try {
      console.log('Redis client connected. Fetching games from Redis key:', REDIS_KEY);
      games = await redis.get(REDIS_KEY);
      source = 'Redis';
    } catch (err) {
      console.error('Error connecting to Redis:', err);
    }
  }

  if (!games && fs.existsSync(GAMES_JSON_PATH)) {
    console.log('Reading games from local games.json:', GAMES_JSON_PATH);
    games = JSON.parse(fs.readFileSync(GAMES_JSON_PATH, 'utf-8'));
    source = 'games.json';
  }

  if (!games || !Array.isArray(games)) {
    console.log('No existing games found in Redis or games.json.');
    return;
  }

  console.log(`\nFound ${games.length} game records in ${source}.`);
  console.log('\n--- EXISTING VALUES BEFORE MIGRATION ---');
  games.forEach((g) => {
    console.log(`[${g.slug}]: downloadUrl = "${g.downloadUrl}"`);
  });

  let modifiedCount = 0;
  const updatedGames = games.map((game) => {
    const originalUrl = game.downloadUrl;
    if (isFakeUrl(originalUrl)) {
      console.log(`\nCLEANING fake URL for [${game.slug}]:`);
      console.log(`  OLD: ${originalUrl}`);
      console.log(`  NEW: null`);
      modifiedCount++;
      return {
        ...game,
        downloadUrl: null,
      };
    } else {
      console.log(`\nPRESERVING legitimate/valid URL for [${game.slug}]: ${originalUrl || 'null'}`);
      return {
        ...game,
        downloadUrl: game.downloadUrl ? game.downloadUrl : null,
      };
    }
  });

  console.log(`\nTotal records cleaned: ${modifiedCount}`);

  // Write to Redis if available
  if (redis) {
    console.log('\nUpdating Redis key:', REDIS_KEY);
    await redis.set(REDIS_KEY, updatedGames);
    console.log('Redis updated successfully without flushing or touching unrelated keys.');
  }

  // Also write to games.json
  if (fs.existsSync(GAMES_JSON_PATH)) {
    fs.writeFileSync(GAMES_JSON_PATH, JSON.stringify(updatedGames, null, 2), 'utf-8');
    console.log('data/games.json updated successfully.');
  }

  console.log('\n--- VERIFIED VALUES AFTER MIGRATION ---');
  updatedGames.forEach((g) => {
    console.log(`[${g.slug}]: downloadUrl = ${g.downloadUrl === null ? 'null' : `"${g.downloadUrl}"`}`);
  });

  console.log('\n=== MIGRATION COMPLETED SUCCESSFULLY ===');
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
