# GA4 setup checklist (codeonholiday)

Do these in the Google Analytics admin UI after deploying `analytics.js` + updated `events.js`. They are configuration only — no code changes.

## Measurement ID

`G-XSL5Z5MEBZ` (already embedded site-wide).

## Custom dimension: `app`

1. Admin → Data display → Custom definitions → Create custom dimension
2. Dimension name: `App`
3. Scope: **Event**
4. Event parameter: `app`
5. Save

Use this to break down `download_click` / `purchase_click` by Meetly / HoverBoard / LocalMelody.

Optional (same steps): `page_type` event parameter for where the click happened (`home`, `product`, `blog`, `apps`, `legal`).

## Enhanced measurement

Admin → Data streams → your web stream → Enhanced measurement — enable:

- Scrolls
- Outbound clicks
- File downloads

(Page views and site search can stay as-is.)

## Mark conversions

Admin → Data display → Events — mark as key events / conversions:

- `download_click` (installer zip/dmg served from this domain; param `app` = which product)
- `purchase_click` (Lemon Squeezy checkout; param `app` = which product)

## Explorations

**Path exploration**

- Explore → Path exploration
- Dimension: Page path + query string (or Page path)
- See how users move home → product → download

**Funnel exploration**

Suggested steps:

1. Session start (or page view on `/` / `/blog/` / `/apps/`)
2. Page view matching `/meetly/` OR `/hoverboard/` OR `/localmelody/`
3. Event `download_click` (breakdown by `app`)
4. Optional: Event `purchase_click` (breakdown by `app`)

## Event inventory (from `events.js`)

| Event | Meaning | Key params |
|---|---|---|
| `download_click` | Click a real installer asset (`/<app>/releases/…zip|dmg`) | `app`, `version`, `page_type` |
| `purchase_click` | Lemon Squeezy Pro checkout | `app`, `page_type` |
| `product_open` | Open product from home card or `/apps/` card | `app`, `page_type` |
| `promo_click` | Back to School promo bar | `page_type` |
| `section_view` | `#pricing` / `#download` / `#features` (not a download) | `label`, `page_type` |
| `cta_click` / `secondary_click` | Other primary/secondary buttons | `label`, `page_type` |
| `producthunt_click` | Product Hunt badge | `page_type` |

## Clarity

Project ID `yei24sjpvi` is loaded from `analytics.js` **after idle** (`requestIdleCallback`, or 2s after `load`). Do not also embed Clarity inline.

## Do not double-load GA4

Pages should use **either** `/analytics.js` **or** an inline `gtag` snippet — not both. Prefer `/analytics.js` (GA4 + deferred Clarity).
