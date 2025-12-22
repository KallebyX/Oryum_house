#!/usr/bin/env node
/**
 * PWA Icon Generator Script
 *
 * This script generates all required PWA icons from the source SVG.
 *
 * Prerequisites:
 *   npm install sharp
 *
 * Usage:
 *   node scripts/generate-icons.js
 *
 * Or add to package.json scripts:
 *   "generate-icons": "node scripts/generate-icons.js"
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Installing sharp for icon generation...');
  const { execSync } = require('child_process');
  execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  sharp = require('sharp');
}

const SOURCE_SVG = path.join(__dirname, '../apps/web/public/icon.svg');
const OUTPUT_DIR = path.join(__dirname, '../apps/web/public');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  console.log('Generating PWA icons...\n');

  // Check if source SVG exists
  if (!fs.existsSync(SOURCE_SVG)) {
    console.error(`Source SVG not found: ${SOURCE_SVG}`);
    console.log('Please create the source icon.svg first.');
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(SOURCE_SVG);

  for (const size of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);

    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`  Created: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`  Failed to create icon-${size}x${size}.png:`, error.message);
    }
  }

  // Generate favicon.ico (32x32)
  try {
    const faviconSvg = path.join(OUTPUT_DIR, 'favicon.svg');
    if (fs.existsSync(faviconSvg)) {
      await sharp(fs.readFileSync(faviconSvg))
        .resize(32, 32)
        .png()
        .toFile(path.join(OUTPUT_DIR, 'favicon.png'));
      console.log('  Created: favicon.png');
    }
  } catch (error) {
    console.error('  Failed to create favicon.png:', error.message);
  }

  // Generate Apple Touch Icon (180x180)
  try {
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));
    console.log('  Created: apple-touch-icon.png');
  } catch (error) {
    console.error('  Failed to create apple-touch-icon.png:', error.message);
  }

  // Generate OG Image (1200x630)
  try {
    // Create a larger canvas for OG image
    const ogBackground = Buffer.from(
      `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0ea5e9"/>
            <stop offset="100%" style="stop-color:#0284c7"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="url(#bg)"/>
        <text x="600" y="400" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">Oryum House</text>
        <text x="600" y="480" font-family="Arial, sans-serif" font-size="32" fill="white" fill-opacity="0.8" text-anchor="middle">Sistema de Gestao de Condominios</text>
      </svg>`
    );

    const iconResized = await sharp(svgBuffer)
      .resize(200, 200)
      .toBuffer();

    await sharp(ogBackground)
      .composite([
        {
          input: iconResized,
          top: 120,
          left: 500,
        }
      ])
      .png()
      .toFile(path.join(OUTPUT_DIR, 'og-image.png'));

    console.log('  Created: og-image.png');
  } catch (error) {
    console.error('  Failed to create og-image.png:', error.message);
  }

  console.log('\nIcon generation complete!');
  console.log('\nNote: For production, consider using a professional icon.');
  console.log('You can use tools like https://realfavicongenerator.net/');
}

generateIcons().catch(console.error);
