/**
 * codeonholiday — shared analytics bootstrap
 * Loads GA4 (if missing) + Microsoft Clarity. Safe to include on every page.
 * Pair with events.js for CTA / download tracking.
 */
(function () {
    'use strict';

    var GA_ID = 'G-XSL5Z5MEBZ';
    var CLARITY_ID = 'yei24sjpvi';

    // GA4 — only init if this page did not already load gtag inline.
    if (typeof window.gtag !== 'function') {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        var ga = document.createElement('script');
        ga.async = true;
        ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(ga);
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, { anonymize_ip: true });
    }

    // Microsoft Clarity — session replay / heatmaps. Skip if already present.
    if (typeof window.clarity !== 'function') {
        (function (c, l, a, r, i, t, y) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', CLARITY_ID);
    }
})();
