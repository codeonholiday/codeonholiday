/**
 * build-blog.mjs — Markdown posts → static HTML with TOC, rich media, SEO.
 *
 * Usage: node scripts/build-blog.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://codeonholiday.com';
const POSTS_DIR = path.join(ROOT, 'blog', 'posts');
const BLOG_DIR = path.join(ROOT, 'blog');
const DEFAULT_OG = `${SITE}/og-image.png`;
const DEFAULT_AUTHOR = 'codeonholiday';

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isoDate(d) {
  if (!d) return new Date().toISOString().slice(0, 10);
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

function isoDateTime(d) {
  const day = isoDate(d);
  return `${day}T00:00:00+00:00`;
}

function gitLastModified(relativePath, fallback) {
  try {
    const value = execFileSync(
      'git',
      ['log', '-1', '--format=%cs', '--', relativePath],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    return value || fallback;
  } catch {
    return fallback;
  }
}

function extractYoutubeId(input) {
  const s = String(input).trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('/')[0];
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/);
    if (m) return m[1];
  } catch {
    /* not a URL */
  }
  return null;
}

/** Expand :::youtube shortcodes before markdown parse. */
function expandYoutubeShortcodes(md) {
  return md.replace(
    /^:::\s*youtube\s+(\S+)[ \t]*\r?\n:::[ \t]*$/gim,
    (_, ref) => {
      const id = extractYoutubeId(ref);
      if (!id) return `\n<!-- invalid youtube: ${escapeHtml(ref)} -->\n`;
      return `\n\n<div class="video-embed"><iframe src="https://www.youtube.com/embed/${id}?rel=0&playsinline=1" title="YouTube video" allow="accelerometer; encrypted-media; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>\n\n`;
    }
  );
}

function uniqueId(base, used) {
  let id = base || 'section';
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n++}`;
  }
  used.add(id);
  return id;
}

function resolveAssetUrl(src, slug) {
  if (!src) return src;
  if (/^(https?:|data:|\/)/i.test(src)) return src;
  // ./assets/welcome/x.webp or assets/welcome/x.webp → /blog/posts/assets/...
  let cleaned = src.replace(/^\.\//, '');
  if (cleaned.startsWith('assets/')) {
    return `/blog/posts/${cleaned}`;
  }
  // relative like hero.webp assumed under assets/<slug>/
  return `/blog/posts/assets/${slug}/${cleaned}`;
}

function createRenderer(slug, headingCollect, state) {
  const renderer = new marked.Renderer();
  const usedIds = new Set();

  renderer.heading = function ({ tokens, depth, text }) {
    const raw = this.parser.parseInline(tokens);
    const plain = text || raw.replace(/<[^>]+>/g, '');
    if (depth === 2 || depth === 3) {
      const id = uniqueId(slugify(plain), usedIds);
      headingCollect.push({ id, text: plain, depth });
      return `<h${depth} id="${id}">${raw}</h${depth}>\n`;
    }
    return `<h${depth}>${raw}</h${depth}>\n`;
  };

  renderer.image = function ({ href, title, text }) {
    const src = resolveAssetUrl(href, slug);
    const alt = escapeHtml(text || '');
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    const caption = text ? `<figcaption>${escapeHtml(text)}</figcaption>` : '';
    return `<figure><img src="${escapeHtml(src)}" alt="${alt}"${titleAttr} loading="lazy" decoding="async">${caption}</figure>\n`;
  };

  renderer.code = function ({ text, lang }) {
    if (lang === 'mermaid') {
      state.hasMermaid = true;
      return `<pre class="mermaid">${escapeHtml(text)}</pre>\n`;
    }
    const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : '';
    return `<pre><code${langClass}>${escapeHtml(text)}</code></pre>\n`;
  };

  renderer.link = function ({ href, title, tokens }) {
    const body = this.parser.parseInline(tokens);
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    const external = /^https?:\/\//i.test(href) && !href.startsWith(SITE);
    const rel = external ? ' rel="noopener noreferrer"' : '';
    const target = external ? ' target="_blank"' : '';
    return `<a href="${escapeHtml(href || '')}"${titleAttr}${rel}${target}>${body}</a>`;
  };

  // Readable comparison / key-value tables: wrap + data-label for mobile cards.
  renderer.table = function (token) {
    const headers = token.header.map((cell) => {
      const html = this.parser.parseInline(cell.tokens);
      const plain = String(cell.text || html.replace(/<[^>]+>/g, '')).trim();
      return { html, plain, align: cell.align };
    });
    const colCount = headers.length;

    const headCells = headers
      .map((h, i) => {
        const align = h.align ? ` align="${h.align}"` : '';
        const scope = i === 0 ? ' scope="col" class="col-label"' : ' scope="col"';
        return `<th${scope}${align}>${h.html}</th>`;
      })
      .join('');

    const bodyRows = token.rows
      .map((row) => {
        const cells = row
          .map((cell, i) => {
            const html = this.parser.parseInline(cell.tokens);
            const align = cell.align ? ` align="${cell.align}"` : '';
            if (i === 0) {
              return `<th scope="row" class="row-label"${align}>${html}</th>`;
            }
            const label = escapeHtml(headers[i]?.plain || `Column ${i + 1}`);
            return `<td data-label="${label}"${align}>${html}</td>`;
          })
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('\n');

    const kind = colCount <= 2 ? 'table-kv' : 'table-compare';
    return `<div class="table-scroll" role="region" aria-label="Data table" tabindex="0">
<table class="blog-table ${kind}">
<thead><tr>${headCells}</tr></thead>
<tbody>
${bodyRows}
</tbody>
</table>
</div>\n`;
  };

  return renderer;
}

function tocHtml(headings, className) {
  if (!headings.length) return '';
  const links = headings
    .map(
      (h) =>
        `<a href="#${h.id}" class="${h.depth === 3 ? 'toc-h3' : 'toc-h2'}">${escapeHtml(h.text)}</a>`
    )
    .join('\n');
  if (className === 'toc-mobile') {
    return `<details class="toc toc-mobile">
      <summary>On this page</summary>
      <nav aria-label="Table of contents">${links}</nav>
    </details>`;
  }
  return `<aside class="toc toc-desktop" aria-label="Table of contents">
    <div class="toc-title">On this page</div>
    <nav>${links}</nav>
  </aside>`;
}

function sharedHeadExtras() {
  return `
    <link rel="icon" type="image/svg+xml" href="/codeonholiday-logo.svg?v=2">
    <link rel="apple-touch-icon" href="/codeonholiday-logo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/blog/css/blog.css">
    <script defer data-domain="codeonholiday.com" src="https://plausible.io/js/script.js"></script>
    <script>window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments) }</script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XSL5Z5MEBZ"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-XSL5Z5MEBZ', { 'anonymize_ip': true });
    </script>`;
}

function siteHeader(active) {
  return `<header class="site-header">
    <div class="nav">
      <a href="/" class="brand" aria-label="codeonholiday home">
        <span class="brand-mark"></span>
        codeonholiday
      </a>
      <nav class="nav-links" aria-label="Primary">
        <a href="/blog/"${active === 'blog' ? ' aria-current="page"' : ''}>Blog</a>
        <a href="/apps/">Apps</a>
        <a href="/meetly/">Meetly</a>
        <a href="/hoverboard/">HoverBoard</a>
        <a href="/localmelody/">LocalMelody</a>
      </nav>
    </div>
  </header>`;
}

function siteFooter() {
  return `<footer class="site-footer">
    <div class="wrap">
      <div class="foot">
        <span>© ${new Date().getFullYear()} codeonholiday</span>
        <div class="foot-end">
          <!-- Social URLs — replace placeholders as real links arrive -->
          <nav class="social" aria-label="Social links">
            <a href="https://x.com/codeonholiday" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@codeonholiday" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 16.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.2 8.2 0 0 0 4.79 1.52V6.84a4.84 4.84 0 0 1-1.04-.15z"/></svg>
            </a>
            <a href="https://www.facebook.com/codeonholiday" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.26 2.09 16.09 2 14.84 2 12.27 2 10.5 3.57 10.5 6.61V9.5H8v4h2.5V22h3.5z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/hungpv99/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.047c.476-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.371 4.267 5.456v6.285zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452z"/></svg>
            </a>
            <a href="https://www.reddit.com/user/hi_codeonholiday/" target="_blank" rel="noopener noreferrer" aria-label="Reddit">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12a1.75 1.75 0 0 1 2.541-1.562 8.796 8.796 0 0 1 4.66-1.49l.885-4.162a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.068l2.914.614a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.841 2.484.917 2.961.917.477 0 2.105-.079 2.961-.917a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>
            </a>
          </nav>
          <span>
            <a href="/blog/">Blog</a>
            ·
            <a href="/blog/feed.xml">RSS</a>
            ·
            <a href="mailto:hello@codeonholiday.com">hello@codeonholiday.com</a>
          </span>
        </div>
      </div>
    </div>
  </footer>`;
}

function resolveOgImage(image, slug) {
  if (!image) return DEFAULT_OG;
  const url = resolveAssetUrl(String(image), slug);
  if (url.startsWith('http')) return url;
  return `${SITE}${url}`;
}

function renderPostPage(post) {
  const {
    slug,
    title,
    description,
    date,
    updated,
    tags,
    author,
    ogImage,
    html,
    headings,
    hasMermaid,
    lang,
  } = post;

  const canonical = `${SITE}/blog/${slug}/`;
  const published = isoDateTime(date);
  const modified = isoDateTime(updated || date);
  const pageTitle = `${title} — codeonholiday`;
  const tagMetas = (tags || [])
    .map((t) => `<meta property="article:tag" content="${escapeHtml(t)}">`)
    .join('\n    ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${canonical}#article`,
        headline: title,
        description,
        datePublished: published,
        dateModified: modified,
        author: {
          '@type': 'Organization',
          name: author,
          url: SITE + '/',
        },
        publisher: {
          '@type': 'Organization',
          name: 'codeonholiday',
          url: SITE + '/',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE}/codeonholiday-logo.png`,
          },
        },
        image: ogImage,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonical,
        },
        keywords: (tags || []).join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${SITE}/blog/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: canonical,
          },
        ],
      },
    ],
  };

  const mermaidScripts = hasMermaid
    ? `
    <script type="module">
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
      window.mermaid = mermaid;
      mermaid.initialize({
        startOnLoad: true,
        theme: 'dark',
        securityLevel: 'strict',
        themeVariables: {
          primaryColor: '#141C2A',
          primaryTextColor: '#F8FBFF',
          primaryBorderColor: '#4EE6D5',
          lineColor: '#93A1B5',
          secondaryColor: '#101722',
          tertiaryColor: '#0A0D13',
          background: '#0A0D13',
          mainBkg: '#141C2A',
          nodeBorder: '#4EE6D5',
          clusterBkg: '#101722',
          titleColor: '#F8FBFF',
          edgeLabelBackground: '#101722'
        }
      });
    </script>`
    : '';

  const dateLabel = isoDate(date);
  const tocDesktop = tocHtml(headings, 'toc-desktop');
  const tocMobile = tocHtml(headings, 'toc-mobile');
  const relatedProduct = (tags || []).includes('meetly')
    ? { name: 'Meetly', url: '/meetly/', guide: '/blog/how-to-use-meetly-complete-guide/' }
    : (tags || []).includes('hoverboard')
      ? { name: 'HoverBoard', url: '/hoverboard/', guide: '/blog/how-to-use-hoverboard-complete-guide/' }
      : (tags || []).includes('localmelody')
        ? { name: 'LocalMelody', url: '/localmelody/', guide: '/blog/how-to-use-localmelody-complete-guide/' }
        : null;
  const productCta = relatedProduct
    ? `<aside class="article-cta"><strong>Ready to try ${relatedProduct.name}?</strong><p>See the product page for the download, pricing, and full feature list.</p><a href="${relatedProduct.url}">Explore ${relatedProduct.name} →</a> · <a href="${relatedProduct.guide}">Complete guide</a></aside>`
    : '';

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang || 'en')}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="${escapeHtml(author)}">

    <meta property="og:type" content="article">
    <meta property="og:site_name" content="codeonholiday">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${escapeHtml(ogImage)}">
    <meta property="og:image:alt" content="${escapeHtml(title)}">
    <meta property="article:published_time" content="${published}">
    <meta property="article:modified_time" content="${modified}">
    <meta property="article:author" content="${escapeHtml(author)}">
${tagMetas}

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@codeonholiday">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${escapeHtml(ogImage)}">

    <link rel="alternate" type="application/rss+xml" title="codeonholiday Blog" href="${SITE}/blog/feed.xml">

    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 4)}
    </script>
${sharedHeadExtras()}
</head>
<body>
${siteHeader('blog')}
    <main class="wrap article-wrap">
      <div class="article-layout">
        <article>
          <header class="article-header">
            <div class="meta">
              <time datetime="${isoDate(date)}">${dateLabel}</time>
              <span class="dot"></span>
              <span>${escapeHtml(author)}</span>
            </div>
            <h1>${escapeHtml(title)}</h1>
          </header>
          ${tocMobile}
          <div class="prose">
${html}
          </div>
          ${productCta}
          <div class="article-footer">
            <a href="/blog/">← All posts</a>
            <a href="/">codeonholiday home</a>
          </div>
        </article>
        ${tocDesktop}
      </div>
    </main>
${siteFooter()}
    <script src="/events.js"></script>
    <script src="/blog/js/blog.js"></script>
${mermaidScripts}
</body>
</html>
`;
}

function renderListingPage(posts) {
  const canonical = `${SITE}/blog/`;
  const title = 'Blog — codeonholiday';
  const description =
    'Notes on building small, focused macOS apps — Meetly, HoverBoard, LocalMelody, and whatever comes next.';

  const itemList = posts.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${SITE}/blog/${p.slug}/`,
    name: p.title,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'codeonholiday Blog',
    url: canonical,
    description,
    publisher: {
      '@type': 'Organization',
      name: 'codeonholiday',
      url: SITE + '/',
    },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE}/blog/${p.slug}/`,
      datePublished: isoDateTime(p.date),
      description: p.description,
    })),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: itemList,
    },
  };

  const listHtml = posts.length
    ? `<ul class="post-list">
${posts
  .map(
    (p) => `      <li>
        <a href="/blog/${p.slug}/">
          <div class="post-date"><time datetime="${isoDate(p.date)}">${isoDate(p.date)}</time></div>
          <h2>${escapeHtml(p.title)}</h2>
          <p class="post-desc">${escapeHtml(p.description)}</p>
        </a>
      </li>`
  )
  .join('\n')}
    </ul>`
    : `<p class="empty">No posts yet.</p>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="codeonholiday">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="codeonholiday">
    <meta property="og:url" content="${canonical}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:image" content="${DEFAULT_OG}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@codeonholiday">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${DEFAULT_OG}">

    <link rel="alternate" type="application/rss+xml" title="codeonholiday Blog" href="${SITE}/blog/feed.xml">

    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 4)}
    </script>
    ${sharedHeadExtras()}
</head>
<body>
${siteHeader('blog')}
    <main class="wrap wrap-narrow">
      <div class="list-hero">
        <h1>Blog</h1>
        <p>${escapeHtml(description)}</p>
      </div>
      ${listHtml}
    </main>
${siteFooter()}
    <script src="/events.js"></script>
</body>
</html>
`;
}

function renderRss(posts) {
  const items = posts
    .map((p) => {
      const link = `${SITE}/blog/${p.slug}/`;
      return `    <item>
      <title>${escapeHtml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(isoDate(p.date)).toUTCString()}</pubDate>
      <description>${escapeHtml(p.description)}</description>
    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>codeonholiday Blog</title>
    <link>${SITE}/blog/</link>
    <description>Notes on building small, focused macOS apps.</description>
    <language>en</language>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
}

/** Static product/legal URLs always present in sitemap; blog URLs injected by build. */
const STATIC_SITEMAP_URLS = [
  { loc: `${SITE}/`, source: 'index.html', fallbackLastmod: '2026-07-24', priority: '1.0', changefreq: 'weekly' },
  { loc: `${SITE}/apps/`, source: 'apps/index.html', fallbackLastmod: '2026-08-17', priority: '0.95', changefreq: 'weekly' },
  { loc: `${SITE}/apps/recommendation-guide.html`, source: 'apps/recommendation-guide.html', fallbackLastmod: '2026-08-17', priority: '0.8', changefreq: 'monthly' },
  // Thin /apps/* intent satellites are noindex and canonical to blog posts — omit from sitemap.
  { loc: `${SITE}/meetly/`, source: 'meetly/index.html', fallbackLastmod: '2026-07-23', priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE}/hoverboard/`, source: 'hoverboard/index.html', fallbackLastmod: '2026-07-25', priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE}/localmelody/`, source: 'localmelody/index.html', fallbackLastmod: '2026-08-04', priority: '0.9', changefreq: 'weekly' },
  { loc: `${SITE}/meetly/privacy.html`, source: 'meetly/privacy.html', fallbackLastmod: '2026-07-13', priority: '0.3', changefreq: 'yearly' },
  { loc: `${SITE}/meetly/terms.html`, source: 'meetly/terms.html', fallbackLastmod: '2026-07-13', priority: '0.3', changefreq: 'yearly' },
  { loc: `${SITE}/hoverboard/privacy.html`, source: 'hoverboard/privacy.html', fallbackLastmod: '2026-07-13', priority: '0.3', changefreq: 'yearly' },
  { loc: `${SITE}/hoverboard/terms.html`, source: 'hoverboard/terms.html', fallbackLastmod: '2026-07-13', priority: '0.3', changefreq: 'yearly' },
  { loc: `${SITE}/localmelody/privacy.html`, source: 'localmelody/privacy.html', fallbackLastmod: '2026-08-04', priority: '0.3', changefreq: 'yearly' },
  { loc: `${SITE}/localmelody/terms.html`, source: 'localmelody/terms.html', fallbackLastmod: '2026-08-04', priority: '0.3', changefreq: 'yearly' },
];

function renderSitemap(posts) {
  const today = isoDate(new Date());
  const blogUrls = [
    {
      loc: `${SITE}/blog/`,
      lastmod: posts[0] ? isoDate(posts[0].updated || posts[0].date) : today,
      priority: '0.8',
      changefreq: 'weekly',
    },
    ...posts.map((p) => ({
      loc: `${SITE}/blog/${p.slug}/`,
      lastmod: isoDate(p.updated || p.date),
      priority: '0.7',
      changefreq: 'monthly',
    })),
  ];

  const all = [
    ...STATIC_SITEMAP_URLS.map((u) => ({
      ...u,
      lastmod: gitLastModified(u.source, u.fallbackLastmod),
    })),
    ...blogUrls,
  ];

  const body = all
    .map(
      (u) => `    <url>
        <loc>${u.loc}</loc>
        <lastmod>${u.lastmod}</lastmod>
        <priority>${u.priority}</priority>
        <changefreq>${u.changefreq}</changefreq>
    </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
    const { data, content } = matter(raw);

    if (data.draft === true) {
      console.log(`  skip draft: ${slug}`);
      continue;
    }

    if (!data.title || !data.description || !data.date) {
      console.warn(`  warn: ${slug} missing title/description/date — skipping`);
      continue;
    }

    const headings = [];
    const state = { hasMermaid: false };
    const renderer = createRenderer(slug, headings, state);

    let body = expandYoutubeShortcodes(content);
    // Drop a leading H1 that duplicates frontmatter title
    body = body.replace(/^#\s+.+\n+/, '');

    marked.setOptions({ renderer, gfm: true, breaks: false });
    const html = marked.parse(body);

    posts.push({
      slug,
      title: String(data.title),
      description: String(data.description),
      date: data.date,
      updated: data.updated || data.date,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      author: data.author ? String(data.author) : DEFAULT_AUTHOR,
      ogImage: resolveOgImage(data.image, slug),
      html,
      headings,
      hasMermaid: state.hasMermaid,
      lang: data.lang ? String(data.lang) : 'en',
    });
  }

  posts.sort((a, b) => (isoDate(b.date) > isoDate(a.date) ? 1 : -1));
  return posts;
}

function cleanGeneratedDirs(posts) {
  // Remove previously generated slug dirs (keep posts/, css/, js/)
  const keep = new Set(['posts', 'css', 'js', 'README.md', 'index.html', 'feed.xml']);
  if (!fs.existsSync(BLOG_DIR)) return;
  for (const name of fs.readdirSync(BLOG_DIR)) {
    if (keep.has(name)) continue;
    const full = path.join(BLOG_DIR, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      // only remove if it looks like a generated post folder
      const indexPath = path.join(full, 'index.html');
      if (fs.existsSync(indexPath)) {
        fs.rmSync(full, { recursive: true, force: true });
      }
    }
  }
  // Ensure current slugs will be rewritten
  void posts;
}

function main() {
  console.log('Building blog…');
  const posts = loadPosts();
  cleanGeneratedDirs(posts);

  for (const post of posts) {
    const outDir = path.join(BLOG_DIR, post.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), renderPostPage(post), 'utf8');
    console.log(`  ✓ /blog/${post.slug}/`);
  }

  fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), renderListingPage(posts), 'utf8');
  console.log('  ✓ /blog/');

  fs.writeFileSync(path.join(BLOG_DIR, 'feed.xml'), renderRss(posts), 'utf8');
  console.log('  ✓ /blog/feed.xml');

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), renderSitemap(posts), 'utf8');
  console.log('  ✓ /sitemap.xml');

  console.log(`Done — ${posts.length} post(s).`);
}

main();
