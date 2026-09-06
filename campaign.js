/**
 * Back to School 2026 — promo bar.
 * Ends 30 Sep 2026 (Asia/Ho_Chi_Minh). Remove after campaign + revert prices.
 */
(function () {
  'use strict';

  var END = new Date('2026-09-30T23:59:59+07:00');
  if (Date.now() > END.getTime()) return;

  var path = location.pathname || '';
  var isProduct =
    path.indexOf('/meetly') === 0 ||
    path.indexOf('/hoverboard') === 0 ||
    path.indexOf('/localmelody') === 0;

  var href = isProduct ? '#pricing' : '/apps/';
  var linkLabel = isProduct ? 'See pricing' : 'Browse apps';

  var bar = document.createElement('div');
  bar.className = 'coh-promo is-active';
  bar.setAttribute('role', 'banner');
  bar.innerHTML =
    '<span class="coh-promo-badge">Sale</span>' +
    '<span><strong>Back to School</strong> — 30% off Pro on every app · ends 30 Sep</span>' +
    '<a href="' + href + '">' + linkLabel + ' →</a>';

  document.body.insertBefore(bar, document.body.firstChild);
  document.body.classList.add('coh-promo-on');
})();
