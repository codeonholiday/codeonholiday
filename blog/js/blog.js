/**
 * Blog TOC: collapse behavior + scroll-spy active link.
 */
(function () {
    'use strict';

    var links = Array.prototype.slice.call(
        document.querySelectorAll('.toc a[href^="#"]')
    );
    if (!links.length) return;

    var headings = links
        .map(function (a) {
            var id = a.getAttribute('href').slice(1);
            return document.getElementById(id);
        })
        .filter(Boolean);

    if (!headings.length) return;

    function setActive(id) {
        links.forEach(function (a) {
            var match = a.getAttribute('href') === '#' + id;
            a.classList.toggle('active', match);
        });
    }

    if ('IntersectionObserver' in window) {
        var visible = new Map();
        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        visible.set(entry.target.id, entry.boundingClientRect.top);
                    } else {
                        visible.delete(entry.target.id);
                    }
                });
                if (!visible.size) return;
                var best = null;
                var bestTop = Infinity;
                visible.forEach(function (top, id) {
                    var abs = Math.abs(top);
                    if (abs < bestTop) {
                        bestTop = abs;
                        best = id;
                    }
                });
                if (best) setActive(best);
            },
            { rootMargin: '-15% 0px -70% 0px', threshold: [0, 1] }
        );
        headings.forEach(function (h) { observer.observe(h); });
    }

    // Close mobile TOC after jump
    links.forEach(function (a) {
        a.addEventListener('click', function () {
            var details = a.closest('details.toc-mobile');
            if (details) details.open = false;
        });
    });
})();
