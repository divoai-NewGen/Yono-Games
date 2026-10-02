const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve('C:/Users/aman/Desktop/Yono-Games-main');
const sourceFile = path.join(rootDir, 'public', 'logonew.png');

if (!fs.existsSync(sourceFile)) {
  console.error("Source file not found at:", sourceFile);
  process.exit(1);
}

// Helper to create valid multi-size ICO with PNG encoding
async function createIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  let offset = 6 + count * 16;
  const entries = [];

  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8); // Size of image data
    entry.writeUInt32LE(offset, 12); // Offset
    offset += buf.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function run() {
  console.log("Reading source image from:", sourceFile);

  // 1. Backup old logo.png if it exists
  const oldLogoPath = path.join(rootDir, 'public', 'images', 'logo.png');
  const backupLogoPath = path.join(rootDir, 'public', 'images', 'logo-backup.png');
  if (fs.existsSync(oldLogoPath) && !fs.existsSync(backupLogoPath)) {
    fs.copyFileSync(oldLogoPath, backupLogoPath);
    console.log("Backed up old logo to:", backupLogoPath);
  }

  // 2. Generate optimized logo.png (512x512 and full size)
  const logo512Buf = await sharp(sourceFile)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 95, compressionLevel: 8 })
    .toBuffer();

  await sharp(sourceFile)
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(path.join(rootDir, 'public', 'images', 'logo.png'));
  console.log("Updated public/images/logo.png (1024x1024)");

  // 3. Next.js App Router icons
  // app/icon.png (Next.js automatically serves this as high-res browser tab icon)
  await sharp(sourceFile)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(rootDir, 'app', 'icon.png'));
  console.log("Generated app/icon.png (512x512)");

  // app/apple-icon.png (Apple touch icon)
  const apple180Buf = await sharp(sourceFile)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(rootDir, 'app', 'apple-icon.png'), apple180Buf);
  fs.writeFileSync(path.join(rootDir, 'public', 'apple-icon.png'), apple180Buf);
  console.log("Generated app/apple-icon.png and public/apple-icon.png (180x180)");

  // 4. Generate multi-size favicon.ico (16, 32, 48, 64)
  const sizes = [16, 32, 48, 64];
  const pngBuffers = [];
  for (const s of sizes) {
    const buf = await sharp(sourceFile)
      .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    pngBuffers.push(buf);
  }

  const icoBuffer = await createIco(pngBuffers, sizes);
  fs.writeFileSync(path.join(rootDir, 'app', 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon.ico'), icoBuffer);
  console.log("Generated app/favicon.ico and public/favicon.ico with multi-size 16/32/48/64 px icons");

  console.log("All logo and tab icons successfully generated from logonew.png!");
}

run().catch(console.error);
