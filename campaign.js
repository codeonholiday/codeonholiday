/**
 * Seasonal campaigns (Asia/Ho_Chi_Minh via +07:00 offsets).
 * - Back to School promo bar: ends 30 Sep 2026
 * - Mid-Autumn (Trung Thu) visual theme: 11 Sep 2026 – end of 25 Sep 2026
 * Preview theme anytime: ?trungthu=1
 */
(function () {
  'use strict';

  var now = Date.now();
  var SCHOOL_END = new Date('2026-09-30T23:59:59+07:00');
  var TT_START = new Date('2026-09-11T00:00:00+07:00');
  var TT_END = new Date('2026-09-26T00:00:00+07:00');

  var params = new URLSearchParams(location.search || '');
  var previewTheme = params.get('trungthu') === '1' || params.get('trungthu') === 'true';
  var schoolActive = now <= SCHOOL_END.getTime();
  var themeActive =
    previewTheme || (now >= TT_START.getTime() && now < TT_END.getTime());

  /* ---------- Back to School promo bar (unchanged behavior) ---------- */
  if (schoolActive) {
    var path = location.pathname || '';
    var isProduct =
      path.indexOf('/meetly') === 0 ||
      path.indexOf('/hoverboard') === 0 ||
      path.indexOf('/localmelody') === 0;
    var isBlog = path.indexOf('/blog') === 0;

    var href = '/apps/';
    var linkLabel = 'Browse apps';
    if (isProduct) {
      href = '#pricing';
      linkLabel = 'See pricing';
    } else if (isBlog) {
      href = '/blog/back-to-school-mac-apps-2026/';
      linkLabel = 'Sale details';
    }

    var bar = document.createElement('div');
    bar.className = 'coh-promo is-active';
    bar.setAttribute('role', 'banner');
    bar.innerHTML =
      '<span class="coh-promo-badge">Sale</span>' +
      '<span><strong>Back to School</strong> — 30% off Pro on every app · ends 30 Sep</span>' +
      '<a href="' + href + '">' + linkLabel + ' →</a>';

    document.body.insertBefore(bar, document.body.firstChild);
    document.body.classList.add('coh-promo-on');

    function syncPromoHeight() {
      document.body.style.setProperty('--coh-promo-h', bar.offsetHeight + 'px');
    }
    syncPromoHeight();
    window.addEventListener('resize', syncPromoHeight);
  }

  /* ---------- Mid-Autumn visual theme (does not touch promo bar) ---------- */
  if (!themeActive) return;

  document.documentElement.classList.add('coh-trungthu');
  document.body.classList.add('coh-trungthu-on');

  var svgUid = 0;

  function hangLantern(variant) {
    var fills = {
      gold: ['#FFE9B0', '#F6C445', '#E89B20'],
      coral: ['#FFB088', '#E4572E', '#B83220'],
      amber: ['#FFD08A', '#F08A24', '#C45E12'],
      rose: ['#FFC4B8', '#F07167', '#C23B3B']
    };
    var c = fills[variant] || fills.gold;
    var id = 'tt-h' + ++svgUid;
    return (
      '<svg class="coh-tt-lantern-svg" viewBox="0 0 72 140" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="' + id + 'a" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + c[0] + '"/>' +
      '<stop offset="55%" stop-color="' + c[1] + '"/>' +
      '<stop offset="100%" stop-color="' + c[2] + '"/>' +
      '</linearGradient>' +
      '<radialGradient id="' + id + 'b" cx="50%" cy="40%" r="55%">' +
      '<stop offset="0%" stop-color="#fff" stop-opacity=".35"/>' +
      '<stop offset="100%" stop-color="' + c[1] + '" stop-opacity="0"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<line x1="36" y1="2" x2="36" y2="16" stroke="rgba(255,233,176,.5)" stroke-width="1.6"/>' +
      '<ellipse cx="36" cy="20" rx="11" ry="4.5" fill="#1a120c"/>' +
      '<path d="M20 24c2-5 8-8 16-8s14 3 16 8v10c0 2-4 4-16 4s-16-2-16-4V24z" fill="url(#' + id + 'a)"/>' +
      '<path d="M17 34c2 3 10 6 19 6s17-3 19-6v48c0 10-8 18-19 18S17 92 17 82V34z" fill="url(#' + id + 'a)"/>' +
      '<ellipse cx="36" cy="55" rx="16" ry="26" fill="url(#' + id + 'b)"/>' +
      '<path d="M24 42h24M24 56h24M24 70h24" stroke="rgba(255,255,255,.22)" stroke-width="1.3" stroke-linecap="round"/>' +
      '<ellipse cx="36" cy="100" rx="13" ry="4.5" fill="#1a120c"/>' +
      '<path d="M36 104v18" stroke="' + c[0] + '" stroke-width="1.5"/>' +
      '<circle cx="36" cy="126" r="4" fill="' + c[0] + '">' +
      '<animate attributeName="opacity" values=".4;1;.4" dur="1.6s" repeatCount="indefinite"/>' +
      '</circle>' +
      '</svg>'
    );
  }

  function skyLantern() {
    var id = 'tt-s' + ++svgUid;
    return (
      '<svg class="coh-tt-sky-svg" viewBox="0 0 80 96" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#FFF4D2"/>' +
      '<stop offset="45%" stop-color="#F6C445"/>' +
      '<stop offset="100%" stop-color="#E4572E"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<path d="M12 28c0-14 12-24 28-24s28 10 28 24v36c0 8-8 16-28 16S12 72 12 64V28z" fill="url(#' + id + ')" opacity=".92"/>' +
      '<ellipse cx="40" cy="28" rx="28" ry="10" fill="#FFE9B0" opacity=".55"/>' +
      '<path d="M24 40h32M24 52h32M24 64h32" stroke="rgba(255,255,255,.25)" stroke-width="1.2"/>' +
      '<ellipse cx="40" cy="78" rx="10" ry="3" fill="#FF8A3D" opacity=".7"/>' +
      '<path d="M36 78c1 6 3 10 4 14c1-4 3-8 4-14" fill="#FFB347" opacity=".85"/>' +
      '</svg>'
    );
  }

  var i;
  var stars = '';
  for (i = 0; i < 36; i++) {
    stars += '<span class="coh-tt-star coh-tt-star-' + i + '"></span>';
  }

  var fireflies = '';
  for (i = 0; i < 16; i++) {
    fireflies += '<span class="coh-tt-firefly coh-tt-firefly-' + i + '"></span>';
  }

  var rising = '';
  for (i = 0; i < 7; i++) {
    rising +=
      '<div class="coh-tt-sky coh-tt-sky-' + i + '">' + skyLantern() + '</div>';
  }

  var layer = document.createElement('div');
  layer.className = 'coh-trungthu-decor';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML =
    '<div class="coh-tt-vignette"></div>' +
    '<div class="coh-tt-aurora"></div>' +
    '<div class="coh-tt-rays"></div>' +
    '<div class="coh-tt-stars">' + stars + '</div>' +
    '<div class="coh-tt-moon-wrap">' +
    '<span class="coh-tt-moon-ring"></span>' +
    '<span class="coh-tt-moon-glow"></span>' +
    '<span class="coh-tt-moon">' +
    '<svg class="coh-tt-rabbit" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
    '<path fill="rgba(140,90,20,.28)" d="M28 18c-2-8 2-14 4-14s4 5 3 12c4-6 9-8 10-5s-2 9-7 12c6 2 10 8 9 14-1 9-10 14-18 13s-13-8-12-16c1-7 6-11 11-12z"/>' +
    '</svg>' +
    '</span>' +
    '</div>' +
    '<div class="coh-tt-lantern-wrap coh-tt-hang coh-tt-hang-a">' + hangLantern('gold') + '</div>' +
    '<div class="coh-tt-lantern-wrap coh-tt-hang coh-tt-hang-b">' + hangLantern('coral') + '</div>' +
    '<div class="coh-tt-lantern-wrap coh-tt-hang coh-tt-hang-c">' + hangLantern('amber') + '</div>' +
    '<div class="coh-tt-lantern-wrap coh-tt-hang coh-tt-hang-d">' + hangLantern('rose') + '</div>' +
    '<div class="coh-tt-lantern-wrap coh-tt-hang coh-tt-hang-e">' + hangLantern('gold') + '</div>' +
    '<div class="coh-tt-rising">' + rising + '</div>' +
    '<span class="coh-tt-mist coh-tt-mist-a"></span>' +
    '<span class="coh-tt-mist coh-tt-mist-b"></span>' +
    '<span class="coh-tt-mist coh-tt-mist-c"></span>' +
    '<div class="coh-tt-fireflies">' + fireflies + '</div>';

  document.body.appendChild(layer);

  requestAnimationFrame(function () {
    document.body.classList.add('coh-trungthu-ready');
  });
})();
