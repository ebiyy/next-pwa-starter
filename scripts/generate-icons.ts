import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

async function generateIcons() {
  const sizes = [192, 512];
  const inputFile = path.join(process.cwd(), 'public', 'icon.svg');

  try {
    for (const size of sizes) {
      await sharp(inputFile)
        .resize(size, size)
        .png()
        .toFile(path.join(process.cwd(), 'public', `icon-${size}x${size}.png`));
    }
    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();