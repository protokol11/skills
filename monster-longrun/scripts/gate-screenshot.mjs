#!/usr/bin/env node
// gate-screenshot.mjs — "eyes" gate: open a URL, screenshot the rendered surface,
// assert the frame is not black (pixel variance + unique color count above thresholds).
//
// Usage:
//   node gate-screenshot.mjs <url> [--timeout-ms 8000] [--variance-threshold 0.5]
//                               [--colors-threshold 3] [--out shot.png]
//
// Exit: 0 = frame not black (pass), 1 = black frame or error (fail).
//
// Eyes hook: if you want a vision model to describe the frame, pipe the screenshot
// path to deepseek/deepseek-v4-flash-vision-exp yourself. This script only computes
// the deterministic pixel assertion. No API keys here.

import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

function usage() {
  console.error(`Usage: node gate-screenshot.mjs <url> [options]
  --timeout-ms N        wait for render before screenshot (default 8000)
  --variance-threshold N  min pixel variance to be "not black" (default 0.5)
  --colors-threshold N    min unique colors to be "not empty" (default 3)
  --out F              screenshot output path (default ./tmp/gate-screenshot.png)`);
}

function parseArgs(argv) {
  const out = { url: null, timeout: 8000, variance: 0.5, colors: 3, outPath: "./tmp/gate-screenshot.png" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--timeout-ms") out.timeout = Number(argv[++i]);
    else if (a === "--variance-threshold") out.variance = Number(argv[++i]);
    else if (a === "--colors-threshold") out.colors = Number(argv[++i]);
    else if (a === "--out") out.outPath = argv[++i];
    else if (a === "--help" || a === "-h") { usage(); process.exit(2); }
    else if (out.url === null) out.url = a;
    else { console.error(`Unknown arg: ${a}`); usage(); process.exit(2); }
  }
  return out;
}

// Decode a PNG to raw RGBA without external deps.
// Supports 8-bit RGB/RGBA, grayscale/RGB palettes, and the standard zlib filters.
async function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let pos = 8;
  let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0;
  let idat = [];
  let palette = null;
  let trns = null;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "PLTE") {
      palette = [];
      for (let i = 0; i + 2 < data.length; i += 3) palette.push([data[i], data[i + 1], data[i + 2]]);
    } else if (type === "tRNS") {
      trns = data;
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
    pos += 12 + len;
  }
  if (bitDepth !== 8) throw new Error(`unsupported bit depth ${bitDepth}`);
  if (interlace !== 0) throw new Error("interlaced PNG unsupported");

  const { inflateSync } = await import("node:zlib");
  const raw = inflateSync(Buffer.concat(idat));

  // Channels per PNG colorType: 0 gray=1, 2 RGB=3, 3 palette=1, 4 gray+alpha=2, 6 RGBA=4.
  // (The previous lookup array was indexed wrongly and decoded RGB as 1 channel.)
  const channels = ({ 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 })[colorType];
  if (!channels) throw new Error(`unsupported color type ${colorType}`);
  const bpp = channels;
  const stride = width * bpp;
  const out = Buffer.alloc(width * height * 4);

  let prev = Buffer.alloc(stride);
  let rp = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++];
    const row = Buffer.alloc(stride);
    for (let x = 0; x < stride; x++) {
      const rawByte = raw[rp++];
      const a = x >= bpp ? row[x - bpp] : 0;
      const b = prev[x];
      const c = x >= bpp ? prev[x - bpp] : 0;
      let val;
      switch (filter) {
        case 0: val = rawByte; break;
        case 1: val = (rawByte + a) & 0xff; break;
        case 2: val = (rawByte + b) & 0xff; break;
        case 3: val = (rawByte + ((a + b) >> 1)) & 0xff; break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          val = (rawByte + pr) & 0xff;
          break;
        }
        default: throw new Error(`bad filter ${filter}`);
      }
      row[x] = val;
    }
    // unfilter to RGBA
    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 4;
      if (colorType === 0) { // grayscale
        const g = row[x];
        let alpha = 255;
        if (trns && trns.length >= 2) { const tg = trns[1]; alpha = g === trns[0] ? 0 : 255; }
        out[o] = g; out[o + 1] = g; out[o + 2] = g; out[o + 3] = alpha;
      } else if (colorType === 2) { // RGB
        out[o] = row[x * 3]; out[o + 1] = row[x * 3 + 1]; out[o + 2] = row[x * 3 + 2]; out[o + 3] = 255;
      } else if (colorType === 3) { // palette
        const idx = row[x];
        const c = palette[idx];
        out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2];
        let alpha = 255;
        if (trns && idx < trns.length) alpha = trns[idx];
        out[o + 3] = alpha;
      } else if (colorType === 4) { // gray+alpha
        const g = row[x * 2];
        const alpha = row[x * 2 + 1];
        out[o] = g; out[o + 1] = g; out[o + 2] = g; out[o + 3] = alpha;
      } else if (colorType === 6) { // RGBA
        out[o] = row[x * 4]; out[o + 1] = row[x * 4 + 1]; out[o + 2] = row[x * 4 + 2]; out[o + 3] = row[x * 4 + 3];
      }
    }
    prev = row;
  }
  return { width, height, data: out };
}

function analyze(rgba) {
  const n = rgba.length / 4;
  let sum = 0, sumSq = 0;
  const colors = new Set();
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const r = rgba[o], g = rgba[o + 1], b = rgba[o + 2];
    const lum = (r + g + b) / 3;
    sum += lum; sumSq += lum * lum;
    colors.add((r << 16) | (g << 8) | b);
  }
  const mean = sum / n;
  const variance = sumSq / n - mean * mean;
  return { variance, uniqueColors: colors.size, mean };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url) { usage(); process.exit(2); }
  mkdirSync(dirname(args.outPath), { recursive: true });

  // Screenshot via playwright if available, else chromium CLI, else fail with guidance.
  // Resolve playwright from this script's dir or any ancestor node_modules.
  const playwrightCandidates = [
    join(__dirname, "node_modules", "playwright"),
    join(__dirname, "..", "node_modules", "playwright"),
    join(process.cwd(), "node_modules", "playwright"),
  ];
  const playwrightPath = playwrightCandidates.find((p) => existsSync(p));
  const hasPlaywright = Boolean(playwrightPath);

  if (!hasPlaywright) {
    // Try a system chromium headless screenshot.
    const shotResult = await trySystemChromium(args);
    if (!shotResult) {
      console.error("No playwright installed and no headless chromium found.");
      console.error("Install one, or hook a vision model (Eyes) directly. Failing as NOT-verified.");
      process.exit(1);
    }
  } else {
    try {
      await runPlaywright(args);
    } catch (e) {
      console.error(`Playwright screenshot failed: ${e.message}`);
      process.exit(1);
    }
  }

  if (!existsSync(args.outPath)) {
    console.error(`Screenshot not written: ${args.outPath}`);
    process.exit(1);
  }

  const png = readFileSync(args.outPath);
  const { width, height, data } = await decodePng(png);
  const { variance, uniqueColors, mean } = analyze(data);

  const pass = variance >= args.variance && uniqueColors >= args.colors;
  console.log(JSON.stringify({ pass, width, height, variance: variance.toFixed(3), uniqueColors, mean: mean.toFixed(3) }));
  process.exit(pass ? 0 : 1);
}

async function runPlaywright(args) {
  const base = [
    join(__dirname, "node_modules", "playwright"),
    join(__dirname, "..", "node_modules", "playwright"),
    join(process.cwd(), "node_modules", "playwright"),
  ].find((p) => existsSync(p));
  const { chromium } = await import("file://" + join(base, "index.mjs"));
  // Try the bundled browser, then system Chrome/Edge channels, then an explicit
  // executable. Hosts often have a system Chrome but not the matching bundled build.
  const launchOptions = [
    {},
    { channel: "chrome" },
    { channel: "msedge" },
    { executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" },
    { executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" },
  ];
  let browser = null;
  let lastErr = null;
  for (const opt of launchOptions) {
    try {
      browser = await chromium.launch({ headless: true, ...opt });
      break;
    } catch (e) {
      lastErr = e;
    }
  }
  if (!browser) throw lastErr ?? new Error("no browser launchable");
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(args.url, { waitUntil: "networkidle", timeout: args.timeout });
  await page.waitForTimeout(Math.min(args.timeout, 8000));
  await page.screenshot({ path: args.outPath });
  await browser.close();
}

async function trySystemChromium(args) {
  // headless chrome/chromium --screenshot --headless
  const candidates = ["chrome", "chromium", "chrome.exe", "chromium.exe",
    "msedge", "msedge.exe"];
  for (const bin of candidates) {
    try {
      const code = await new Promise((resolve) => {
        const p = spawn(bin, [
          "--headless", "--disable-gpu", "--no-sandbox",
          `--screenshot=${args.outPath}`,
          `--window-size=1280,720`,
          "--virtual-time-budget=5000",
          args.url,
        ], { stdio: "ignore", timeout: args.timeout + 5000 });
        p.on("exit", (c) => resolve(c ?? 0));
        p.on("error", () => resolve(1));
      });
      if (code === 0 && existsSync(args.outPath)) return true;
    } catch { /* try next */ }
  }
  return false;
}

main();
