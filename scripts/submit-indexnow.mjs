/**
 * Notify IndexNow (Bing, Amazon, Yandex, …) that sitemap URLs changed.
 * Search engines then recrawl — this is how we pull BingBot / Amazonbot
 * instead of waiting for them to rediscover the site.
 *
 * Usage: node scripts/submit-indexnow.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HOST = 'codeonholiday.com';
const SITE = `https://${HOST}`;
const KEY = 'adc827e0223089725fe44f5ba68db590';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://indexnow.amazonbot.amazon/indexnow',
];

function urlsFromSitemap() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function post(endpoint, payload) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  const body = await res.text().catch(() => '');
  return { endpoint, status: res.status, body: body.slice(0, 300) };
}

async function main() {
  const urlList = [...new Set([
    ...urlsFromSitemap(),
    `${SITE}/llms.txt`,
    `${SITE}/robots.txt`,
  ])];

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  console.log(`IndexNow: submitting ${urlList.length} URLs`);

  const results = await Promise.all(ENDPOINTS.map((ep) => post(ep, payload)));
  for (const r of results) {
    console.log(`  ${r.status} ${r.endpoint}${r.body ? ` — ${r.body}` : ''}`);
  }

  const ok = results.every((r) => r.status === 200 || r.status === 202);
  if (!ok) {
    console.error('IndexNow: one or more endpoints rejected the payload');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
