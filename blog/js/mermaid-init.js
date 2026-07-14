/**
 * Init Mermaid only when .mermaid nodes exist (script tagged on those pages).
 */
(function () {
    'use strict';
    if (!document.querySelector('.mermaid')) return;
    if (typeof mermaid === 'undefined') return;

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
})();
