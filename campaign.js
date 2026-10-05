/**
 * Seasonal campaigns (Asia/Ho_Chi_Minh via +07:00 offsets).
 * - Back to School promo bar: ends 30 Sep 2026
 * - Mid-Autumn (Trung Thu) visual theme: 11 Sep 2026 – end of 25 Sep 2026
 * - Halloween visual theme: 1 Oct 2026 – end of 1 Nov 2026
 * Preview anytime: ?trungthu=1 or ?halloween=1
 */
(function () {
  'use strict';

  var now = Date.now();
  var SCHOOL_END = new Date('2026-09-30T23:59:59+07:00');
  var TT_START = new Date('2026-09-11T00:00:00+07:00');
  var TT_END = new Date('2026-09-26T00:00:00+07:00');
  var HW_START = new Date('2026-10-01T00:00:00+07:00');
  var HW_END = new Date('2026-11-02T00:00:00+07:00');

  var params = new URLSearchParams(location.search || '');
  var previewTheme = params.get('trungthu') === '1' || params.get('trungthu') === 'true';
  var previewHalloween = params.get('halloween') === '1' || params.get('halloween') === 'true';
  var schoolActive = now <= SCHOOL_END.getTime();
  var themeActive =
    previewTheme || (now >= TT_START.getTime() && now < TT_END.getTime());
  var halloweenActive =
    previewHalloween || (now >= HW_START.getTime() && now < HW_END.getTime());

  if (previewHalloween) themeActive = false;
  else if (previewTheme) halloweenActive = false;
  else if (halloweenActive) themeActive = false;

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
  if (themeActive) {

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
  }

  /* ---------- Halloween visual theme (does not touch promo bar) ---------- */
  if (!halloweenActive) return;

  document.documentElement.classList.add('coh-halloween');
  document.body.classList.add('coh-halloween-on');

  var hwUid = 0;

  function pumpkin() {
    var id = 'hw-p' + ++hwUid;
    return (
      '<svg class="coh-hw-pumpkin-svg" viewBox="0 0 80 108" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<radialGradient id="' + id + '" cx="42%" cy="38%" r="68%">' +
      '<stop offset="0%" stop-color="#FFD089"/>' +
      '<stop offset="42%" stop-color="#F97316"/>' +
      '<stop offset="100%" stop-color="#9A3412"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<line x1="40" y1="2" x2="40" y2="16" stroke="rgba(255,196,120,.55)" stroke-width="1.5"/>' +
      '<path d="M40 16c-3 0-5 4-3 8 4-2 7-1 9 2 2-6-1-10-6-10z" fill="#3F6B32"/>' +
      '<ellipse cx="24" cy="58" rx="16" ry="26" fill="url(#' + id + ')"/>' +
      '<ellipse cx="40" cy="56" rx="18" ry="30" fill="url(#' + id + ')"/>' +
      '<ellipse cx="56" cy="58" rx="16" ry="26" fill="url(#' + id + ')"/>' +
      '<path d="M40 30c2 18 2 36 0 52" stroke="rgba(120,30,8,.35)" stroke-width="1.4" fill="none"/>' +
      '<path d="M28 48l6 9h-11zM52 48l5 9h-11z" fill="#1C0A06"/>' +
      '<path d="M30 70c3 6 6 8 10 8s7-2 10-8c-3 3-6 4-10 4s-7-1-10-4z" fill="#1C0A06"/>' +
      '<ellipse class="coh-hw-pumpkin-glow" cx="40" cy="60" rx="8" ry="12" fill="#FFE7B0" opacity=".45"/>' +
      '</svg>'
    );
  }

  function bat() {
    return (
      '<svg class="coh-hw-bat-svg" viewBox="0 0 120 48" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill="#120814" d="M60 26c-1-6-4-10-7-12-10 2-24 3-38 0 8 5 14 9 16 16-7 2-16 8-24 9 11-2 19-2 27-7 2 6 6 10 11 12 2-4 3-10 3-15 0 5 1 11 3 15 5-2 9-6 11-12 8 5 16 5 27 7-8-1-17-7-24-9 2-7 8-11 16-16-14 3-28 2-38 0-3 2-6 6-7 12z"/>' +
      '</svg>'
    );
  }

  function ghost() {
    return (
      '<svg class="coh-hw-ghost-svg" viewBox="0 0 64 84" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill="rgba(255,246,236,.88)" d="M32 4C16 4 6 18 6 34v40c4-7 7-7 10 0s6 7 10 0 6-7 10 0 6 7 10 0 6-7 10 0 6 7 8 0V34C64 18 52 4 32 4z"/>' +
      '<ellipse cx="24" cy="36" rx="4" ry="5.5" fill="#1A1024"/>' +
      '<ellipse cx="42" cy="36" rx="4" ry="5.5" fill="#1A1024"/>' +
      '<ellipse cx="25" cy="35" rx="1.3" ry="1.6" fill="#fff" opacity=".7"/>' +
      '<ellipse cx="43" cy="35" rx="1.3" ry="1.6" fill="#fff" opacity=".7"/>' +
      '<ellipse cx="32" cy="48" rx="3" ry="4" fill="#1A1024" opacity=".28"/>' +
      '</svg>'
    );
  }

  function web() {
    return (
      '<svg class="coh-hw-web-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
      '<g fill="none" stroke="rgba(236,220,255,.42)" stroke-width="1.15">' +
      '<path d="M4 4h188M4 4v188M4 4l188 188M4 4l188 96M4 4l96 188"/>' +
      '<path d="M36 10c28 20 32 46 16 72"/>' +
      '<path d="M70 16c34 32 34 74 8 112"/>' +
      '<path d="M112 24c32 46 22 98-10 140"/>' +
      '<path d="M156 40c16 52 4 96-28 132"/>' +
      '</g></svg>'
    );
  }

  var starSpots = [
    [5, 8], [8, 18], [4, 29], [12, 38], [6, 49], [14, 58], [5, 67], [10, 78], [7, 88],
    [18, 12], [24, 26], [20, 44], [28, 62], [22, 84], [34, 8], [36, 36], [30, 72],
    [42, 18], [46, 52], [40, 90], [54, 28], [58, 66], [66, 14], [70, 48]
  ];
  var stars = '';
  var i;
  for (i = 0; i < starSpots.length; i++) {
    var big = i % 5 === 0 ? ' coh-hw-star-lg' : '';
    stars +=
      '<span class="coh-hw-star' + big + '" style="top:' + starSpots[i][0] + '%;left:' + starSpots[i][1] + '%"></span>';
  }

  var batSpecs = [
    ['14%', '92px', '16s', '-1s'],
    ['32%', '58px', '21s', '-7s'],
    ['52%', '74px', '18s', '-12s'],
    ['22%', '44px', '25s', '-4s'],
    ['68%', '64px', '20s', '-15s']
  ];
  var bats = '';
  for (i = 0; i < batSpecs.length; i++) {
    var b = batSpecs[i];
    bats +=
      '<div class="coh-hw-bat" style="--y:' + b[0] + ';--s:' + b[1] + ';--d:' + b[2] + ';--delay:' + b[3] + '">' +
      bat() + '</div>';
  }

  var ghostSpecs = [
    ['8%', '46px', '26s', '0s'],
    ['28%', '62px', '32s', '-8s'],
    ['58%', '40px', '24s', '-14s'],
    ['78%', '54px', '30s', '-4s']
  ];
  var ghosts = '';
  for (i = 0; i < ghostSpecs.length; i++) {
    var g = ghostSpecs[i];
    ghosts +=
      '<div class="coh-hw-ghost" style="--x:' + g[0] + ';--s:' + g[1] + ';--d:' + g[2] + ';--delay:' + g[3] + '">' +
      ghost() + '</div>';
  }

  var layer = document.createElement('div');
  layer.className = 'coh-halloween-decor';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML =
    '<div class="coh-hw-vignette"></div>' +
    '<div class="coh-hw-aurora"></div>' +
    '<div class="coh-hw-stars">' + stars + '</div>' +
    '<div class="coh-hw-moon-wrap">' +
    '<span class="coh-hw-moon-glow"></span>' +
    '<span class="coh-hw-moon"></span>' +
    '</div>' +
    '<div class="coh-hw-web coh-hw-web-a">' + web() + '</div>' +
    '<div class="coh-hw-web coh-hw-web-b">' + web() + '</div>' +
    '<div class="coh-hw-spider" aria-hidden="true">' +
    '<span class="coh-hw-thread"></span>' +
    '<svg viewBox="0 0 36 28" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="none" stroke="#1A1020" stroke-width="1.3" stroke-linecap="round">' +
    '<path d="M14 10C6 4 2 2 0 1M14 12C4 12 1 16-1 22M15 16C8 22 6 26 4 30"/>' +
    '<path d="M22 10C30 4 34 2 36 1M22 12C32 12 35 16 37 22M21 16C28 22 30 26 32 30"/>' +
    '</g>' +
    '<ellipse cx="18" cy="16" rx="5" ry="6" fill="#1A1020"/>' +
    '<circle cx="18" cy="10" r="3.4" fill="#1A1020"/>' +
    '</svg></div>' +
    '<div class="coh-hw-pumpkin coh-hw-pumpkin-a">' + pumpkin() + '</div>' +
    '<div class="coh-hw-pumpkin coh-hw-pumpkin-b">' + pumpkin() + '</div>' +
    '<div class="coh-hw-pumpkin coh-hw-pumpkin-c">' + pumpkin() + '</div>' +
    '<div class="coh-hw-pumpkin coh-hw-pumpkin-d">' + pumpkin() + '</div>' +
    '<div class="coh-hw-bats">' + bats + '</div>' +
    '<div class="coh-hw-ghosts">' + ghosts + '</div>' +
    '<span class="coh-hw-fog coh-hw-fog-a"></span>' +
    '<span class="coh-hw-fog coh-hw-fog-b"></span>';

  document.body.appendChild(layer);

  requestAnimationFrame(function () {
    document.body.classList.add('coh-halloween-ready');
  });
})();
