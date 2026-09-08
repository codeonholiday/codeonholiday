# Cloudflare Pages (dual-deploy with GitHub Pages)

Phase 1 keeps **GitHub Pages** as the apex origin (`codeonholiday.com`) and also
publishes a filtered tree to **Cloudflare Pages** at
`https://codeonholiday.pages.dev`. Phase 2 (later) attaches the custom domain
and unpublishes GitHub Pages.

Do **not** connect this GitHub repo in the Cloudflare Pages “Create project from
Git” UI — that would upload every historical `*/releases/*.zip|dmg` (~500MB).
CI uses Wrangler direct upload of `dist/` instead.

## GitHub Actions secrets

Repo → **Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Custom API token (see below) |
| `CLOUDFLARE_ACCOUNT_ID` | Account ID (32-char hex) — **not** Zone ID |

### Create the API token

1. Open [API Tokens](https://dash.cloudflare.com/profile/api-tokens).
2. **Create Token → Custom token**.
3. Permissions: **Account** → **Cloudflare Pages** → **Edit**.
4. Account Resources: include the account that owns `codeonholiday.com`
   (same account as the `mcp.codeonholiday.com` Worker).
5. Zone / User permissions: leave empty for Phase 1 (`*.pages.dev` only).

Do **not** use the “Edit Cloudflare Workers” template — it lacks Pages Edit.

### Find Account ID

Dashboard → Workers & Pages (or zone Overview) → right sidebar **API** →
**Account ID**. Or copy from the URL: `https://dash.cloudflare.com/<ACCOUNT_ID>/…`.

## What CI deploys where

On every push to `main` ([`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)):

1. `npm run build:blog`
2. **GitHub Pages** — upload `path: .` (full tree, including old installers)
3. IndexNow against the live apex
4. `node scripts/prepare-pages.mjs` → `dist/`
5. `wrangler pages deploy dist --project-name=codeonholiday --branch=main`

`prepare-pages.mjs` copies the site but only installer binaries named in each
app’s `*/releases/appcast.xml` plus `*-latest.zip|dmg`. It also writes
`dist/_headers` (short cache for HTML, long/immutable for zip/dmg).

Local dry-run:

```bash
npm run build:pages
# inspect dist/, then optionally:
npx wrangler pages deploy dist --project-name=codeonholiday --branch=main
```

## Phase 1 QA (`*.pages.dev`)

After secrets exist and CI is green:

1. Open `https://codeonholiday.pages.dev/`
2. Check `/meetly/`, `/hoverboard/`, `/localmelody/`
3. Download a current zip/dmg from the landing button
4. Fetch `/meetly/releases/appcast.xml`
5. Compare TTFB / headers: `cf-cache-status` should not be `DYNAMIC` the way
   GitHub Pages + proxy is today

Apex `https://codeonholiday.com` should still be GitHub Pages until Phase 2.

## Phase 2 — DNS cutover (later)

1. Cloudflare dashboard → Workers & Pages → **codeonholiday** → Custom domains
   → add `codeonholiday.com` (and `www` if used). Zone is already on Cloudflare.
2. Confirm apex TTFB and downloads.
3. GitHub repo → Settings → Pages → unpublish.
4. Remove the GitHub Pages steps from `deploy.yml` (keep Wrangler only).

## Related

- Worker on `mcp.codeonholiday.com`: [`app-finder-worker/`](../app-finder-worker/)
  (separate Wrangler project; not part of this site deploy).
