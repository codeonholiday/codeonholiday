/**
 * codeonholiday — click event tracking
 * Tracks CTA / download clicks to BOTH Google Analytics (GA4) and Plausible,
 * using event delegation (one listener on document, no per-button wiring).
 *
 * Loads after gtag + Plausible (+ analytics.js). Safe if either is missing.
 *
 * download_click / purchase_click use `app` from the link href (which product),
 * not from the current page path. `page_type` is where the click happened.
 */
(function () {
    'use strict';

    var CHECKOUT_APP = {
        'c3bc2ae8-d06d-42c6-a915-ccc6806c0a20': 'meetly',
        '304518b9-5fa8-4a1a-97b3-4b743fadedf8': 'hoverboard',
        '665ba1ad-0aa2-4f0b-a297-b6e9294f12bc': 'localmelody'
    };

    var PAGE_TYPE = (function () {
        var p = location.pathname;
        if (p.indexOf('/request-feature') === 0) return 'request_feature';
        if (p.indexOf('/apps/') === 0 || p === '/apps') return 'apps';
        if (p.indexOf('/blog/') === 0 || p === '/blog') return 'blog';
        if (/\/(privacy|terms)\.html$/.test(p)) return 'legal';
        if (p.indexOf('/meetly') === 0 || p.indexOf('/hoverboard') === 0 || p.indexOf('/localmelody') === 0) {
            return 'product';
        }
        if (p === '/' || p === '/index.html' || p === '') return 'home';
        return 'other';
    })();

    // Legacy page-context product (kept for non-download events).
    var PRODUCT = (function () {
        var p = location.pathname;
        if (p.indexOf('/meetly/') === 0 || p === '/meetly') return 'meetly';
        if (p.indexOf('/hoverboard/') === 0 || p === '/hoverboard') return 'hoverboard';
        if (p.indexOf('/localmelody/') === 0 || p === '/localmelody') return 'localmelody';
        if (p.indexOf('/blog/') === 0 || p === '/blog') return 'blog';
        if (p.indexOf('/apps/') === 0 || p === '/apps') return 'apps';
        return 'home';
    })();

    function send(name, params) {
        if (typeof window.gtag === 'function') {
            window.gtag('event', name, params);
        }
        if (typeof window.plausible === 'function') {
            try {
                window.plausible('event', name, { props: params });
            } catch (e) { /* noop */ }
        }
        if (location.hostname === 'localhost' || location.protocol === 'file:') {
            console.log('[track]', name, params);
        }
    }

    function extractVersion(href) {
        var m = href.match(/(?:v|[-_])(\d+\.\d+(?:\.\d+)?)(?:[-_]|\/|\?|$)/);
        return m ? m[1] : '';
    }

    /** Resolve which app a download / checkout / product link targets. */
    function appFromHref(href) {
        var h = (href || '').toLowerCase();

        // Feature-request mailto subjects
        if (h.indexOf('feature%20request') !== -1 || h.indexOf('feature request') !== -1) {
            if (h.indexOf('meetly') !== -1) return 'meetly';
            if (h.indexOf('hoverboard') !== -1) return 'hoverboard';
            if (h.indexOf('localmelody') !== -1) return 'localmelody';
        }

        // GitHub release filenames (most reliable for downloads)
        if (h.indexOf('meetly-latest') !== -1) return 'meetly';
        if (h.indexOf('hoverboard-latest') !== -1) return 'hoverboard';
        if (h.indexOf('localmelody-latest') !== -1) return 'localmelody';

        // Lemon Squeezy checkout UUID
        var m = h.match(/checkout\/buy\/([0-9a-f-]{36})/);
        if (m && CHECKOUT_APP[m[1]]) return CHECKOUT_APP[m[1]];

        // Internal product page paths
        if (/(^|\/)meetly(\/|$|\?|#)/.test(h)) return 'meetly';
        if (/(^|\/)hoverboard(\/|$|\?|#)/.test(h)) return 'hoverboard';
        if (/(^|\/)localmelody(\/|$|\?|#)/.test(h)) return 'localmelody';

        return '';
    }

    function featureSource(el) {
        var src = el.getAttribute('data-feature-source');
        if (src) return src;
        if (PAGE_TYPE === 'request_feature') return 'hub';
        if (el.closest && (el.closest('.soft-close') || el.closest('.final-cta') || el.closest('.coming'))) return 'section';
        if (el.closest && el.closest('footer')) return 'footer';
        return 'other';
    }

    function classify(el) {
        var href = (el.getAttribute('href') || '');
        var hrefLower = href.toLowerCase();
        var cls = (el.className || '').toLowerCase();
        var text = (el.textContent || el.innerText || '').trim().toLowerCase();

        // Feature request mailto (before generic CTAs).
        if (hrefLower.indexOf('mailto:') === 0 &&
            (hrefLower.indexOf('feature%20request') !== -1 || hrefLower.indexOf('feature request') !== -1 ||
             /\bfeature-request\b/.test(cls) || text.indexOf('request a feature') !== -1)) {
            return {
                name: 'feature_request_click',
                label: featureSource(el),
                version: '',
                app: appFromHref(hrefLower) || (PRODUCT === 'meetly' || PRODUCT === 'hoverboard' || PRODUCT === 'localmelody' ? PRODUCT : '')
            };
        }

        // Download / install intent: real GitHub release links.
        if (hrefLower.indexOf('github.com') !== -1 && hrefLower.indexOf('releases') !== -1) {
            return {
                name: 'download_click',
                label: 'download',
                version: extractVersion(hrefLower),
                app: appFromHref(hrefLower)
            };
        }
        if (hrefLower.indexOf('lemonsqueezy.com/checkout') !== -1) {
            return {
                name: 'purchase_click',
                label: 'pro_checkout',
                version: '',
                app: appFromHref(hrefLower)
            };
        }
        // Section anchors — intent only, NOT a download.
        if (hrefLower === '#download' || hrefLower === '#pricing' || hrefLower === '#features') {
            return {
                name: 'section_view',
                label: hrefLower.slice(1),
                version: '',
                app: PRODUCT === 'meetly' || PRODUCT === 'hoverboard' || PRODUCT === 'localmelody' ? PRODUCT : ''
            };
        }
        // Promo bar Back to School.
        if (el.closest && el.closest('.coh-promo')) {
            return { name: 'promo_click', label: text.slice(0, 40) || 'promo', version: '', app: '' };
        }
        // Product Hunt upvote / featured badge.
        if (hrefLower.indexOf('producthunt.com') !== -1) {
            return { name: 'producthunt_click', label: 'upvote', version: '', app: PRODUCT === 'blog' || PRODUCT === 'home' || PRODUCT === 'apps' ? '' : PRODUCT };
        }
        // Product card on home page OR /apps/ finder cards.
        if (cls.indexOf('product') !== -1 || (PAGE_TYPE === 'apps' && /\bcard\b/.test(cls))) {
            var app = appFromHref(hrefLower);
            return {
                name: 'product_open',
                label: app || href.replace(/\/$/, '').split('/').pop() || 'home',
                version: '',
                app: app
            };
        }
        // Primary CTA buttons (e.g. "Download Free", "Download for macOS").
        if (/\bbtn-primary\b/.test(cls) || /\bbtn-download\b/.test(cls) || /\bbtn primary\b/.test(cls) || cls === 'btn primary' || /(^|\s)primary(\s|$)/.test(cls) && /\bbtn\b/.test(cls)) {
            if (text.indexOf('download') !== -1) {
                // Only count as download_click if href is a real release; else CTA.
                if (hrefLower.indexOf('github.com') !== -1 && hrefLower.indexOf('releases') !== -1) {
                    return {
                        name: 'download_click',
                        label: 'cta',
                        version: extractVersion(hrefLower),
                        app: appFromHref(hrefLower)
                    };
                }
                return {
                    name: 'cta_click',
                    label: text.slice(0, 40),
                    version: '',
                    app: appFromHref(hrefLower) || (PRODUCT === 'meetly' || PRODUCT === 'hoverboard' || PRODUCT === 'localmelody' ? PRODUCT : '')
                };
            }
            return {
                name: 'cta_click',
                label: text.slice(0, 40),
                version: '',
                app: appFromHref(hrefLower) || (PRODUCT === 'meetly' || PRODUCT === 'hoverboard' || PRODUCT === 'localmelody' ? PRODUCT : '')
            };
        }
        // Secondary / ghost buttons.
        if (/\bbtn-secondary\b/.test(cls) || /\bbtn-ghost\b/.test(cls) || /\bbtn ghost\b/.test(cls)) {
            return {
                name: 'secondary_click',
                label: text.slice(0, 40),
                version: '',
                app: appFromHref(hrefLower) || (PRODUCT === 'meetly' || PRODUCT === 'hoverboard' || PRODUCT === 'localmelody' ? PRODUCT : '')
            };
        }
        return null;
    }

    document.addEventListener('click', function (e) {
        var node = e.target;
        while (node && node !== document.body) {
            if (node.tagName === 'A') break;
            node = node.parentNode;
        }
        if (!node || node.tagName !== 'A') return;

        var info = classify(node);
        if (!info) return;

        var params = {
            page_type: PAGE_TYPE,
            product: PRODUCT,
            label: info.label,
            version: info.version || '',
            link_text: (node.textContent || '').trim().slice(0, 60),
            href: node.getAttribute('href') || ''
        };
        if (info.app) params.app = info.app;

        send(info.name, params);
    }, { passive: true });
})();
