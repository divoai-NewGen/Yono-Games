const sharp = require('sharp');
const path = require('path');

async function processImage() {
  const inputPath = path.join(__dirname, 'public', 'images', 'hero-vibrant-3d.jpg');
  const outputPath = path.join(__dirname, 'public', 'images', 'hero-vibrant-3d.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Processing image ${width}x${height}...`);

  for (let i = 0; i < data.length; i += channels) {
    const pixelIndex = i / channels;
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // 1. Background White Removal (Feathered edge into pure transparent)
    const brightness = (r + g + b) / 3;
    const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));

    if (diff < 12 && brightness > 230) {
      if (brightness >= 246) {
        data[i + 3] = 0; // 100% transparent
      } else {
        const factor = (246 - brightness) / 16;
        data[i + 3] = Math.round(data[i + 3] * factor);
      }
    }

    // 2. Soft bottom shadow fade (guarantees zero cutoff at bottom border)
    if (y > height - 25 && data[i + 3] > 0) {
      const bottomProgress = (height - y) / 25;
      data[i + 3] = Math.round(data[i + 3] * Math.pow(bottomProgress, 1.4));
    }
  }

  await sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPath);

  console.log('Successfully generated hero-vibrant-3d.png with full uncut ribbons at:', outputPath);
}

processImage().catch(console.error);


