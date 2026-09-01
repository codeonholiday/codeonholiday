/**
 * mac-demo — macOS-accurate interactive shell for landing page demos.
 *
 * DOM: screen → menuBar → desktopArea → window(titleBar + toolbar + body)
 *
 * Usage:
 *   MacDemo.mount(element, { title, accent, appearance, menubar, scenes, hint, startScene })
 */
(function (global) {
    'use strict';

    var instances = new WeakMap();

    var APPLE_SVG = '<svg viewBox="0 0 814 1000" aria-hidden="true"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-163.8-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.2-155.5-127.5C46.5 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>';

    var STATUS_ICONS = {
        wifi: '<svg viewBox="0 0 16 12" aria-hidden="true"><path d="M8 11.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zM3.5 7.8l1.1 1.1C5.6 7.9 6.7 7.5 8 7.5s2.4.4 3.4 1.4l1.1-1.1C11.1 6.7 9.6 6 8 6s-3.1.7-4.5 1.8zM.5 4.3l1.1 1.1C3.6 4.1 5.7 3.2 8 3.2s4.4.9 6.4 2.2l1.1-1.1C13.1 2.6 10.7 1.5 8 1.5S2.9 2.6.5 4.3z"/></svg>',
        battery: '<svg viewBox="0 0 25 12" aria-hidden="true"><rect x="0.5" y="0.5" width="21" height="11" rx="2.5" fill="none" stroke="currentColor" stroke-width="1"/><rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor" opacity="0.9"/><path d="M23 4v4a1.5 1.5 0 0 0 0-4z" fill="currentColor"/></svg>',
        search: '<svg viewBox="0 0 14 14" aria-hidden="true"><circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9.5 9.5L13 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
    };

    function createBus() {
        var handlers = Object.create(null);
        return {
            on: function (event, fn) {
                if (!handlers[event]) handlers[event] = [];
                handlers[event].push(fn);
                return function off() {
                    handlers[event] = (handlers[event] || []).filter(function (h) { return h !== fn; });
                };
            },
            emit: function (event, payload) {
                (handlers[event] || []).slice().forEach(function (fn) {
                    try { fn(payload); } catch (e) { console.error('[MacDemo]', e); }
                });
            },
            clear: function () { handlers = Object.create(null); }
        };
    }

    function el(tag, className, html) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (html != null) node.innerHTML = html;
        return node;
    }

    function formatMenuClock(date) {
        var weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        var month = date.toLocaleDateString('en-US', { month: 'short' });
        var day = date.getDate();
        var time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return weekday + ' ' + month + ' ' + day + '  ' + time;
    }

    function createDragHelper(root, bus) {
        var ghost = null;
        var active = null;
        var pointerId = null;

        function cleanup() {
            if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
            ghost = null;
            if (active) active.classList.remove('is-dragging');
            active = null;
            pointerId = null;
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointercancel', onUp);
        }

        function findZone(x, y) {
            var zones = root.querySelectorAll('[data-drop]');
            for (var i = 0; i < zones.length; i++) {
                var r = zones[i].getBoundingClientRect();
                if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zones[i];
            }
            return null;
        }

        function onMove(e) {
            if (!active || e.pointerId !== pointerId) return;
            if (ghost) {
                ghost.style.left = e.clientX + 'px';
                ghost.style.top = e.clientY + 'px';
            }
            var zone = findZone(e.clientX, e.clientY);
            root.querySelectorAll('.mac-demo-dropzone.is-over').forEach(function (z) {
                if (z !== zone) z.classList.remove('is-over');
            });
            if (zone) zone.classList.add('is-over');
        }

        function onUp(e) {
            if (!active || e.pointerId !== pointerId) return;
            var zone = findZone(e.clientX, e.clientY);
            root.querySelectorAll('.mac-demo-dropzone.is-over').forEach(function (z) {
                z.classList.remove('is-over');
            });
            if (zone) {
                bus.emit('drop', {
                    id: active.getAttribute('data-id') || active.textContent.trim(),
                    zone: zone.getAttribute('data-drop') || ''
                });
            }
            cleanup();
        }

        function bindItem(item) {
            item.addEventListener('pointerdown', function (e) {
                if (e.button !== 0) return;
                e.preventDefault();
                active = item;
                pointerId = e.pointerId;
                item.classList.add('is-dragging');
                item.setPointerCapture(e.pointerId);
                ghost = item.cloneNode(true);
                ghost.classList.add('mac-demo-ghost');
                ghost.classList.remove('is-dragging');
                ghost.style.width = item.offsetWidth + 'px';
                document.body.appendChild(ghost);
                ghost.style.left = e.clientX + 'px';
                ghost.style.top = e.clientY + 'px';
                document.addEventListener('pointermove', onMove);
                document.addEventListener('pointerup', onUp);
                document.addEventListener('pointercancel', onUp);
            });
        }

        return {
            bind: function (selector) { root.querySelectorAll(selector).forEach(bindItem); },
            destroy: cleanup
        };
    }

    function createToastLayer(wrap) {
        var node = el('div', 'mac-demo-toast');
        wrap.appendChild(node);
        var timer = null;
        return {
            show: function (message, ms) {
                if (timer) clearTimeout(timer);
                node.textContent = message;
                node.classList.add('is-visible');
                timer = setTimeout(function () {
                    node.classList.remove('is-visible');
                    timer = null;
                }, ms || 2400);
            },
            hide: function () {
                if (timer) clearTimeout(timer);
                node.classList.remove('is-visible');
            }
        };
    }

    function buildStatusIcons(container) {
        ['wifi', 'battery', 'search'].forEach(function (name) {
            var icon = el('span', 'mac-demo-status-icon', STATUS_ICONS[name]);
            icon.setAttribute('aria-hidden', 'true');
            container.appendChild(icon);
        });
    }

    function buildDock(parent, apps) {
        apps = apps || [];
        var dock = el('div', 'mac-demo-dock');
        apps.forEach(function (app) {
            var item = el('div', 'mac-demo-dock-icon' + (app.active ? ' is-active' : ''));
            if (app.label) item.setAttribute('title', app.label);
            if (app.icon) {
                var img = document.createElement('img');
                img.src = app.icon;
                img.alt = app.label || '';
                img.draggable = false;
                item.appendChild(img);
            }
            dock.appendChild(item);
        });
        parent.appendChild(dock);
    }

    function mount(target, options) {
        if (!target) throw new Error('MacDemo.mount: target element required');
        options = options || {};

        var bus = createBus();
        var sceneCleanups = [];
        var currentSceneId = null;
        var clockTimer = null;
        var keyHandler = null;
        var visible = true;

        var root = el('div', 'mac-demo-root is-floating');
        if (options.appearance === 'light') root.classList.add('is-light');
        if (options.accent) root.style.setProperty('--mac-demo-accent', options.accent);
        if (options.accent2) root.style.setProperty('--mac-demo-accent-2', options.accent2);

        var screen = el('div', 'mac-demo-screen');

        /* ── Screen-level menu bar (macOS-accurate placement) ── */
        var menubar = el('div', 'mac-demo-menubar');
        var menubarLeft = el('div', 'mac-demo-menubar-left');
        menubarLeft.appendChild(el('span', 'mac-demo-apple', APPLE_SVG));

        var menubarCfg = options.menubar || {};
        (menubarCfg.left || []).forEach(function (label, idx) {
            menubarLeft.appendChild(el('span', 'mac-demo-menu-item', label));
        });

        var menubarRight = el('div', 'mac-demo-menubar-right');
        var statusIconBtn = null;
        if (menubarCfg.statusIcon) {
            statusIconBtn = el('button', 'mac-demo-mly-icon');
            statusIconBtn.type = 'button';
            statusIconBtn.setAttribute('aria-label', menubarCfg.statusIcon.label || 'Meetly');
            statusIconBtn.innerHTML = menubarCfg.statusIcon.html || '';
            if (menubarCfg.statusIcon.state === 'soon') statusIconBtn.classList.add('is-soon');
            if (menubarCfg.statusIcon.state === 'live') statusIconBtn.classList.add('is-live');
            menubarRight.appendChild(statusIconBtn);
        }
        var accessoryBtn = null;
        if (menubarCfg.accessory) {
            accessoryBtn = el('button', 'mac-demo-accessory');
            accessoryBtn.type = 'button';
            accessoryBtn.textContent = menubarCfg.accessory.label || '';
            if (menubarCfg.accessory.pulse) accessoryBtn.classList.add('is-pulse');
            menubarRight.appendChild(accessoryBtn);
        }
        buildStatusIcons(menubarRight);
        var clockEl = el('span', 'mac-demo-clock', formatMenuClock(new Date()));
        menubarRight.appendChild(clockEl);
        menubar.appendChild(menubarLeft);
        menubar.appendChild(menubarRight);

        /* ── Desktop wallpaper area ── */
        var desktopArea = el('div', 'mac-demo-desktop-area');

        var windowEl = el('div', 'mac-demo-window');

        var titlebar = el('div', 'mac-demo-titlebar');
        var traffic = el('div', 'mac-demo-traffic');
        var closeBtn = el('button', 'mac-demo-dot mac-demo-dot--close');
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Close');
        var minBtn = el('button', 'mac-demo-dot mac-demo-dot--min');
        minBtn.type = 'button';
        minBtn.setAttribute('aria-label', 'Minimize');
        var maxBtn = el('button', 'mac-demo-dot mac-demo-dot--max');
        maxBtn.type = 'button';
        maxBtn.setAttribute('aria-label', 'Zoom');
        traffic.appendChild(closeBtn);
        traffic.appendChild(minBtn);
        traffic.appendChild(maxBtn);
        titlebar.appendChild(traffic);
        titlebar.appendChild(el('div', 'mac-demo-title', options.title || ''));
        titlebar.appendChild(el('div', 'mac-demo-titlebar-spacer'));

        var scenes = options.scenes || [];
        var tabsEl = null;
        if (scenes.length > 1) {
            tabsEl = el('div', 'mac-demo-toolbar');
            scenes.forEach(function (scene, idx) {
                var tab = el('button', 'mac-demo-tab' + (idx === 0 ? ' is-active' : ''));
                tab.type = 'button';
                tab.textContent = scene.label || scene.id;
                tab.setAttribute('data-scene', scene.id);
                tab.addEventListener('click', function () { api.setScene(scene.id); });
                tabsEl.appendChild(tab);
            });
        }

        var body = el('div', 'mac-demo-body');
        var desktop = el('div', 'mac-demo-desktop');
        var overlay = el('div', 'mac-demo-overlay');
        var toastWrap = el('div', 'mac-demo-toast-wrap');
        var toastApi = createToastLayer(toastWrap);

        body.appendChild(desktop);
        body.appendChild(overlay);

        windowEl.appendChild(titlebar);
        if (tabsEl) windowEl.appendChild(tabsEl);
        windowEl.appendChild(body);
        if (options.showWindow !== false) {
            desktopArea.appendChild(windowEl);
        } else {
            windowEl.style.display = 'none';
        }

        /* Screen-level layers (menu bar panel, fullscreen overlay) */
        var panel = el('div', 'mac-demo-panel');
        var screenOverlay = el('div', 'mac-demo-screen-overlay');

        if (options.hint) {
            desktopArea.appendChild(el('div', 'mac-demo-hint', options.hint));
        }
        if (options.dock !== false) {
            buildDock(desktopArea, options.dockApps);
        }

        screen.appendChild(menubar);
        screen.appendChild(desktopArea);
        screen.appendChild(panel);
        screen.appendChild(screenOverlay);
        screen.appendChild(toastWrap);
        root.appendChild(screen);
        target.appendChild(root);

        var dragHelper = createDragHelper(root, bus);

        var ctx = {
            root: root,
            screen: screen,
            menubar: menubar,
            desktopArea: desktopArea,
            window: windowEl,
            desktop: desktop,
            overlay: overlay,
            screenOverlay: screenOverlay,
            panel: panel,
            toast: toastApi,
            drag: dragHelper,
            on: bus.on.bind(bus),
            emit: bus.emit.bind(bus),
            onEsc: null,
            onKeyDown: null,
            setStatusIcon: function (opts) {
                if (!statusIconBtn || !opts) return;
                if (opts.html != null) statusIconBtn.innerHTML = opts.html;
                statusIconBtn.classList.remove('is-soon', 'is-live', 'is-idle');
                if (opts.state) statusIconBtn.classList.add('is-' + opts.state);
            },
            openOverlay: function () { overlay.classList.add('is-open'); },
            closeOverlay: function () { overlay.classList.remove('is-open'); },
            openScreenOverlay: function () { screenOverlay.classList.add('is-open'); },
            closeScreenOverlay: function () { screenOverlay.classList.remove('is-open'); },
            openPanel: function () { panel.classList.add('is-open'); },
            closePanel: function () { panel.classList.remove('is-open'); },
            isOverlayOpen: function () { return overlay.classList.contains('is-open'); },
            isScreenOverlayOpen: function () { return screenOverlay.classList.contains('is-open'); },
            isPanelOpen: function () { return panel.classList.contains('is-open'); }
        };

        function runSceneCleanups() {
            sceneCleanups.forEach(function (fn) {
                try { fn(); } catch (e) { console.error('[MacDemo] scene cleanup', e); }
            });
            sceneCleanups = [];
            desktop.innerHTML = '';
            overlay.innerHTML = '';
            overlay.classList.remove('is-open');
            screenOverlay.innerHTML = '';
            screenOverlay.classList.remove('is-open');
            panel.innerHTML = '';
            panel.classList.remove('is-open');
            toastApi.hide();
            windowEl.style.display = '';
            var dock = desktopArea.querySelector('.mac-demo-dock');
            if (dock) dock.style.display = '';
            desktopArea.querySelectorAll('.mly-quickpanel-bg').forEach(function (n) { n.remove(); });
        }

        function setScene(id) {
            var scene = scenes.find(function (s) { return s.id === id; });
            if (!scene) return;
            runSceneCleanups();
            currentSceneId = id;
            if (tabsEl) {
                tabsEl.querySelectorAll('.mac-demo-tab').forEach(function (tab) {
                    tab.classList.toggle('is-active', tab.getAttribute('data-scene') === id);
                });
            }
            if (typeof scene.setup === 'function') {
                var maybeCleanup = scene.setup(ctx);
                if (typeof maybeCleanup === 'function') sceneCleanups.push(maybeCleanup);
            }
            bus.emit('scene', { id: id });
        }

        function hide() {
            if (!visible) return;
            visible = false;
            root.classList.add('is-hidden');
            bus.emit('hide');
        }

        function show() {
            if (visible) return;
            visible = true;
            root.classList.remove('is-hidden');
            bus.emit('show');
        }

        ctx.hide = hide;
        ctx.show = show;

        function handleEsc() {
            if (typeof ctx.onEsc === 'function' && ctx.onEsc()) return;
            if (ctx.isScreenOverlayOpen()) { ctx.closeScreenOverlay(); return; }
            if (ctx.isOverlayOpen()) { ctx.closeOverlay(); return; }
            if (ctx.isPanelOpen()) { ctx.closePanel(); return; }
            hide();
        }

        closeBtn.addEventListener('click', hide);

        if (statusIconBtn && menubarCfg.statusIcon) {
            statusIconBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                var action = menubarCfg.statusIcon.onClick || 'panel';
                if (action === 'panel') {
                    if (ctx.isPanelOpen()) ctx.closePanel();
                    else ctx.openPanel();
                    bus.emit('statusIconClick', ctx);
                } else if (typeof action === 'function') {
                    action(ctx);
                } else {
                    bus.emit(action, ctx);
                }
            });
        }

        if (accessoryBtn && menubarCfg.accessory) {
            accessoryBtn.addEventListener('click', function () {
                var action = menubarCfg.accessory.onClick;
                if (action === 'menubar' || action === 'panel') {
                    if (ctx.isPanelOpen()) ctx.closePanel();
                    else ctx.openPanel();
                } else if (typeof action === 'function') {
                    action(ctx);
                } else if (typeof action === 'string' && action !== 'menubar' && action !== 'panel') {
                    bus.emit(action, ctx);
                }
            });
        }

        keyHandler = function (e) {
            if (!root.isConnected) return;
            var rect = root.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;
            if (typeof ctx.onKeyDown === 'function' && ctx.onKeyDown(e)) return;
            if (e.key !== 'Escape') return;
            handleEsc();
        };
        document.addEventListener('keydown', keyHandler);

        clockTimer = setInterval(function () {
            clockEl.textContent = formatMenuClock(new Date());
        }, 10000);

        var api;
        api = {
            show: show,
            hide: hide,
            setScene: setScene,
            getScene: function () { return currentSceneId; },
            ctx: ctx,
            destroy: function () {
                runSceneCleanups();
                dragHelper.destroy();
                if (clockTimer) clearInterval(clockTimer);
                if (keyHandler) document.removeEventListener('keydown', keyHandler);
                bus.clear();
                if (root.parentNode) root.parentNode.removeChild(root);
                instances.delete(target);
            }
        };

        var startId = options.startScene || (scenes[0] && scenes[0].id);
        if (startId) setScene(startId);

        instances.set(target, api);
        return api;
    }

    global.MacDemo = {
        mount: mount,
        get: function (target) { return instances.get(target); }
    };
})(typeof window !== 'undefined' ? window : globalThis);
