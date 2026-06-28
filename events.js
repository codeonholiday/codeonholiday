/**
 * codeonholiday — click event tracking
 * Tracks CTA / download clicks to BOTH Google Analytics (GA4) and Plausible,
 * using event delegation (one listener on document, no per-button wiring).
 *
 * Loads after gtag + Plausible. Safe if either is missing.
 */
(function () {
    'use strict';

    var PRODUCT = (function () {
        var p = location.pathname;
        if (p.indexOf('/meetly/') === 0 || p === '/meetly') return 'meetly';
        if (p.indexOf('/hoverboard/') === 0 || p === '/hoverboard') return 'hoverboard';
        return 'home';
    })();

    function send(name, params) {
        // GA4 — gtag('event', name, {...})
        if (typeof window.gtag === 'function') {
            window.gtag('event', name, params);
        }
        // Plausible — plausible('event', name, { props: {...} })
        if (typeof window.plausible === 'function') {
            try {
                window.plausible('event', name, { props: params });
            } catch (e) { /* noop */ }
        }
        // Visible in dev so you can verify in the console.
        if (location.hostname === 'localhost' || location.protocol === 'file:') {
            console.log('[track]', name, params);
        }
    }

    // Extract semver from a release zip href, e.g.
    //   "/meetly/releases/meetly-0.1.3-202606272129.zip"  -> "0.1.3"
    //   "/hoverboard/releases/hoverboard-1.0-202606271055.zip" -> "1.0"
    // Returns '' if it doesn't look like a versioned release link.
    function extractVersion(href) {
        var m = href.match(/-(\d+\.\d+(?:\.\d+)?)-\d{12}\.zip$/);
        return m ? m[1] : '';
    }

    function classify(el) {
        var href = (el.getAttribute('href') || '').toLowerCase();
        var cls = (el.className || '').toLowerCase();
        var text = (el.textContent || el.innerText || '').trim().toLowerCase();

        // Download / install intent: real GitHub release links.
        if (href.indexOf('github.com') !== -1 && href.indexOf('releases') !== -1) {
            return { name: 'download_click', label: 'download', version: extractVersion(href) };
        }
        // "#download" anchors (HoverBoard) — scroll intent to download section.
        if (href === '#download') {
            return { name: 'download_click', label: 'download_section', version: '' };
        }
        // Product card on home page.
        if (cls.indexOf('product') !== -1) {
            return { name: 'product_open', label: href.replace(/\/$/, '').split('/').pop() || 'home', version: '' };
        }
        // Primary CTA buttons (e.g. "Download Free", "Download for macOS").
        if (/\bbtn-primary\b/.test(cls) || /\bbtn-download\b/.test(cls)) {
            if (text.indexOf('download') !== -1) return { name: 'download_click', label: 'cta', version: extractVersion(href) };
            return { name: 'cta_click', label: text.slice(0, 40), version: '' };
        }
        // Secondary / ghost buttons.
        if (/\bbtn-secondary\b/.test(cls) || /\bbtn-ghost\b/.test(cls)) {
            return { name: 'secondary_click', label: text.slice(0, 40), version: '' };
        }
        return null;
    }

    document.addEventListener('click', function (e) {
        // Walk up from the click target to the nearest anchor.
        var node = e.target;
        while (node && node !== document.body) {
            if (node.tagName === 'A') break;
            node = node.parentNode;
        }
        if (!node || node.tagName !== 'A') return;

        var info = classify(node);
        if (!info) return;

        send(info.name, {
            product: PRODUCT,
            label: info.label,
            version: info.version || '',
            link_text: (node.textContent || '').trim().slice(0, 60),
            href: node.getAttribute('href') || ''
        });
    }, { passive: true });
})();
