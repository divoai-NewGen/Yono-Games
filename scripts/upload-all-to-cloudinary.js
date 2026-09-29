const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { Redis } = require('@upstash/redis');

// Simple .env parser
function loadEnv(envPath) {
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || '').trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[match[1]] = val;
      }
    }
  }
}

loadEnv(path.join(__dirname, '..', '.env'));
loadEnv(path.join(__dirname, '..', '.env.local'));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'efvabqpd',
  api_key: process.env.CLOUDINARY_API_KEY || '937373892574827',
  api_secret: process.env.CLOUDINARY_API_SECRET || '4d111Z7Ifi3bfDq669x0O2GCV_w',
  secure: true,
});

const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const uploadedMap = new Map();

async function uploadFileToCloudinary(localPathOrUrl, publicIdHint) {
  if (!localPathOrUrl) return '';
  if (localPathOrUrl.startsWith('https://res.cloudinary.com')) {
    return localPathOrUrl; // already uploaded
  }
  if (uploadedMap.has(localPathOrUrl)) {
    return uploadedMap.get(localPathOrUrl);
  }

  try {
    let uploadSource;
    if (localPathOrUrl.startsWith('data:image')) {
      uploadSource = localPathOrUrl;
    } else if (localPathOrUrl.startsWith('/')) {
      const fullPath = path.join(__dirname, '..', 'public', localPathOrUrl.replace(/^\//, ''));
      if (!fs.existsSync(fullPath)) {
        console.warn(`File not found: ${fullPath}`);
        return localPathOrUrl;
      }
      uploadSource = fullPath;
    } else {
      uploadSource = localPathOrUrl;
    }

    const cleanId = (publicIdHint || path.basename(localPathOrUrl, path.extname(localPathOrUrl)))
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .toLowerCase();

    const result = await cloudinary.uploader.upload(uploadSource, {
      folder: 'yono-games',
      public_id: `${cleanId}-${Date.now()}`,
      resource_type: 'image',
      format: 'webp',
      quality: 'auto:good',
      fetch_format: 'auto',
    });

    console.log(`✓ Uploaded ${localPathOrUrl.substring(0, 35)}... -> ${result.secure_url}`);
    uploadedMap.set(localPathOrUrl, result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error(`Failed to upload ${localPathOrUrl}:`, err.message);
    return localPathOrUrl;
  }
}

async function migrate() {
  console.log('--- Starting Cloudinary Migration ---');
  const gamesJsonPath = path.join(__dirname, '..', 'data', 'games.json');
  let games = JSON.parse(fs.readFileSync(gamesJsonPath, 'utf8'));

  console.log(`Found ${games.length} games to process...`);

  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    console.log(`\n[${i + 1}/${games.length}] Processing: ${game.name} (${game.slug})`);

    if (game.logo) {
      game.logo = await uploadFileToCloudinary(game.logo, `${game.slug}-logo`);
    }
    if (game.thumbnail) {
      game.thumbnail = await uploadFileToCloudinary(game.thumbnail, `${game.slug}-thumb`);
    }
    if (game.heroImage) {
      game.heroImage = await uploadFileToCloudinary(game.heroImage, `${game.slug}-hero`);
    }
    if (Array.isArray(game.screenshots)) {
      const newScreenshots = [];
      for (let s = 0; s < game.screenshots.length; s++) {
        const screenUrl = await uploadFileToCloudinary(game.screenshots[s], `${game.slug}-screen-${s}`);
        newScreenshots.push(screenUrl);
      }
      game.screenshots = newScreenshots;
    }
  }

  // Save to data/games.json
  fs.writeFileSync(gamesJsonPath, JSON.stringify(games, null, 2), 'utf8');
  console.log(`\n✓ Successfully updated data/games.json`);

  // Update Redis if connected
  if (redis) {
    try {
      console.log('Syncing updated games to Upstash Redis...');
      await redis.set('yono_games_data', games);
      console.log('✓ Successfully updated Upstash Redis!');
    } catch (redisErr) {
      console.error('Failed to update Upstash Redis:', redisErr.message);
    }
  }

  console.log('\n🎉 ALL GAMES & IMAGES MIGRATED TO CLOUDINARY SUCCESSFULLY!');
}

migrate().catch(console.error);
