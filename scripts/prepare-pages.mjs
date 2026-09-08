/**
 * prepare-pages.mjs — Build a Cloudflare Pages dist/ from the repo root.
 *
 * Copies the marketing site (HTML/CSS/JS/images/blog/appcasts/notes) but only
 * the current installer binaries referenced by each appcast (plus *-latest.*).
 * Historical zip/dmg stay in git for GitHub Pages / Releases — they are not
 * uploaded to Cloudflare (keeps deploy under Pages file-size limits).
 *
 * Usage: node scripts/prepare-pages.mjs
 * Expects: blog already built (npm run build:blog).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const SKIP_DIRS = new Set([
  '.git',
  '.github',
  'node_modules',
  'dist',
  'app-finder-worker',
]);

const SKIP_FILES = new Set(['.DS_Store', 'package-lock.json', 'package.json']);

const RELEASE_APPS = ['meetly', 'hoverboard', 'localmelody'];
const BINARY_EXT = /\.(zip|dmg)$/i;

function readAppcastAllowlist(app) {
  const dir = path.join(ROOT, app, 'releases');
  const appcastPath = path.join(dir, 'appcast.xml');
  const allowed = new Set();

  if (fs.existsSync(appcastPath)) {
    const xml = fs.readFileSync(appcastPath, 'utf8');
    // Match basename in any enclosure / notes URL that points at this releases dir.
    const re = new RegExp(
      `/${app}/releases/([A-Za-z0-9._+-]+\\.(?:zip|dmg))`,
      'gi'
    );
    let m;
    while ((m = re.exec(xml)) !== null) {
      allowed.add(m[1]);
    }
    // GitHub Releases enclosure (LocalMelody) — still allow the same basename
    // if the file exists locally for landing-page downloads.
    const gh = xml.matchAll(
      /releases\/download\/[^/"']+\/([A-Za-z0-9._+-]+\.(?:zip|dmg))/gi
    );
    for (const hit of gh) allowed.add(hit[1]);
  }

  for (const name of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    if (/^[\w.-]+-latest\.(zip|dmg)$/i.test(name)) allowed.add(name);
  }

  return allowed;
}

function buildBinaryAllowlist() {
  /** @type {Map<string, Set<string>>} app -> filenames */
  const map = new Map();
  for (const app of RELEASE_APPS) {
    map.set(app, readAppcastAllowlist(app));
  }
  return map;
}

function shouldCopyFile(relPosix, allowlist) {
  const base = path.posix.basename(relPosix);
  if (SKIP_FILES.has(base)) return false;
  if (base.startsWith('.env')) return false;

  const parts = relPosix.split('/');
  // app/releases/foo.zip
  if (
    parts.length === 3 &&
    RELEASE_APPS.includes(parts[0]) &&
    parts[1] === 'releases' &&
    BINARY_EXT.test(parts[2])
  ) {
    const allowed = allowlist.get(parts[0]);
    return Boolean(allowed && allowed.has(parts[2]));
  }
  return true;
}

function copyTree(srcDir, destDir, relBase, allowlist) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    if (entry.name === '.DS_Store') continue;

    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      copyTree(src, dest, rel, allowlist);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!shouldCopyFile(rel.replace(/\\/g, '/'), allowlist)) continue;
    fs.copyFileSync(src, dest);
  }
}

function writeHeaders(distRoot) {
  const headers = `# Cloudflare Pages — cache policy
# https://developers.cloudflare.com/pages/configuration/headers/

# HTML: short TTL so deploys show up quickly; still edge-cached (not DYNAMIC via GH).
/*.html
  Cache-Control: public, max-age=300, must-revalidate

/
  Cache-Control: public, max-age=300, must-revalidate

# Versioned installers + -latest aliases: long cache (filenames change on release).
/*/releases/*.zip
  Cache-Control: public, max-age=31536000, immutable
  Content-Type: application/zip

/*/releases/*.dmg
  Cache-Control: public, max-age=31536000, immutable
  Content-Type: application/octet-stream

# Static assets
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/*.js
  Cache-Control: public, max-age=86400
/*.css
  Cache-Control: public, max-age=86400
/fonts/inter.css
  Cache-Control: public, max-age=604800
/*.svg
  Cache-Control: public, max-age=604800
/*.png
  Cache-Control: public, max-age=604800
/*.webp
  Cache-Control: public, max-age=604800
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
`;
  fs.writeFileSync(path.join(distRoot, '_headers'), headers);
}

function main() {
  const allowlist = buildBinaryAllowlist();
  for (const [app, set] of allowlist) {
    console.log(`[prepare-pages] ${app} binaries: ${[...set].sort().join(', ') || '(none)'}`);
  }

  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST, { recursive: true });

  copyTree(ROOT, DIST, '', allowlist);
  writeHeaders(DIST);

  // Cloudflare Pages uses 404.html at root automatically when present.
  console.log(`[prepare-pages] wrote ${DIST}`);
}

main();
