import fs from "node:fs";
import zlib from "node:zlib";

// 1. Generate SVG Favicon with Fire Emoji 🔥 and Vector Fire
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="glow" cx="50%" cy="60%" r="50%">
      <stop offset="0%" stop-color="#ffedd5" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#f97316" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#ea580c" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="55" r="42" fill="url(#glow)"/>
  <text y="0.88em" font-size="80" x="50" text-anchor="middle" font-family="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif">🔥</text>
</svg>`;

// Write favicon.svg
fs.writeFileSync("frontend/Public/favicon.svg", svgContent, "utf8");
fs.writeFileSync("cpanel_upload/favicon.svg", svgContent, "utf8");
console.log("Successfully generated favicon.svg!");

// 2. Build 32x32 Fire PNG
const width = 32;
const height = 32;
const imgData = Buffer.alloc(width * height * 4); // RGBA

function setPixel(x, y, r, g, b, a) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const idx = (y * width + x) * 4;
  // Blend with existing pixel
  const srcA = a / 255;
  const dstA = imgData[idx + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA > 0) {
    imgData[idx] = Math.round((r * srcA + imgData[idx] * dstA * (1 - srcA)) / outA);
    imgData[idx + 1] = Math.round((g * srcA + imgData[idx + 1] * dstA * (1 - srcA)) / outA);
    imgData[idx + 2] = Math.round((b * srcA + imgData[idx + 2] * dstA * (1 - srcA)) / outA);
    imgData[idx + 3] = Math.round(outA * 255);
  }
}

// Procedural high-resolution flame
const cx = 16;
const cy = 19;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const dx = (x - cx) / 8.5;
    const dy = (y - cy) / 10.5;
    
    // Distance field for teardrop fire shape
    const r = Math.sqrt(dx * dx + dy * dy);
    // Asymmetry for flickers
    const taper = (30 - y) / 22;
    const flameDist = Math.sqrt((dx * dx) / Math.max(0.1, taper * 1.3) + dy * dy);

    if (flameDist < 1.05 && y > 3 && y < 29) {
      const edge = Math.max(0, Math.min(1, (1.05 - flameDist) * 3));
      
      // Core vs middle vs outer
      if (flameDist < 0.42 && y > 10 && y < 27) {
        // Bright white-yellow center
        const inner = (0.42 - flameDist) / 0.42;
        setPixel(x, y, 255, 255, Math.round(180 + 75 * inner), Math.round(255 * edge));
      } else if (flameDist < 0.72) {
        // Vibrant Amber/Orange
        setPixel(x, y, 251, Math.round(146 + 45 * (0.72 - flameDist)), 20, Math.round(245 * edge));
      } else {
        // Deep Orange-Red edges
        setPixel(x, y, 234, 70, 15, Math.round(225 * edge));
      }
    }
  }
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, "ascii");
  data.copy(chunk, 8);
  const toCrc = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(toCrc), 8 + len);
  return chunk;
}

// Build PNG scanlines
const scanlines = Buffer.alloc(height * (width * 4 + 1));
for (let y = 0; y < height; y++) {
  const rowStart = y * (width * 4 + 1);
  scanlines[rowStart] = 0; // Filter 0: None
  imgData.copy(scanlines, rowStart + 1, y * width * 4, (y + 1) * width * 4);
}

const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(width, 0);
ihdrData.writeUInt32BE(height, 4);
ihdrData[8] = 8; // Bit depth
ihdrData[9] = 6; // Color type 6: RGBA
ihdrData[10] = 0; // Compression
ihdrData[11] = 0; // Filter
ihdrData[12] = 0; // Interlace
const ihdrChunk = makeChunk("IHDR", ihdrData);

const compressed = zlib.deflateSync(scanlines);
const idatChunk = makeChunk("IDAT", compressed);
const iendChunk = makeChunk("IEND", Buffer.alloc(0));

const pngBuffer = Buffer.concat([pngHeader, ihdrChunk, idatChunk, iendChunk]);

// 3. Wrap PNG in ICO container (Standard Windows/Browser ICO)
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0); // Reserved
icoHeader.writeUInt16LE(1, 2); // Type 1: Icon
icoHeader.writeUInt16LE(1, 4); // Number of images: 1

const icoEntry = Buffer.alloc(16);
icoEntry[0] = width; // Width: 32
icoEntry[1] = height; // Height: 32
icoEntry[2] = 0; // Color count: 0 (no palette)
icoEntry[3] = 0; // Reserved
icoEntry.writeUInt16LE(1, 4); // Planes: 1
icoEntry.writeUInt16LE(32, 6); // Bit depth: 32
icoEntry.writeUInt32LE(pngBuffer.length, 8); // Size of PNG
icoEntry.writeUInt32LE(6 + 16, 12); // Offset to PNG: 22

const icoBuffer = Buffer.concat([icoHeader, icoEntry, pngBuffer]);

// Write favicon.ico to frontend and cpanel_upload
fs.writeFileSync("frontend/Public/favicon.ico", icoBuffer);
fs.writeFileSync("cpanel_upload/favicon.ico", icoBuffer);
console.log("Successfully generated fire favicon.ico (" + icoBuffer.length + " bytes)!");
