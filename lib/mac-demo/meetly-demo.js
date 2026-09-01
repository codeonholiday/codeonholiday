/**
 * Meetly interactive demo — full behavior matched to MenuBarContentView.swift
 * Menu bar icon · panel · hover detail · keyboard · mute · Quick Panel · Share
 */
(function (global) {
    'use strict';

    /* Asset paths resolve from meetly-demo.js location (/lib/mac-demo/assets/) */
    function resolveAssetBase() {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            var src = scripts[i].getAttribute('src');
            if (src && /meetly-demo\.js(\?|$)/.test(src)) {
                try {
                    return new URL('assets/', new URL(src, document.baseURI)).href;
                } catch (e) { /* fall through */ }
            }
        }
        return '/lib/mac-demo/assets/';
    }

    var ASSET_BASE = resolveAssetBase();
    var STATUS_ICON_BASE = ASSET_BASE + 'sf-svg/';
    function statusIconHtml(name) {
        return '<img class="mac-demo-mly-icon-img" src="' + STATUS_ICON_BASE + name + '.png" width="16" height="16" alt="" draggable="false">';
    }
    var STATUS_ICON_CALENDAR = statusIconHtml('calendar');
    var STATUS_ICON_BELL = statusIconHtml('bell-circle-fill');
    var STATUS_ICON_VIDEO = statusIconHtml('video-circle-fill');
    var ICON_VIDEO = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"/></svg>';
    var ICON_REPEAT = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2.5 5.5V3.5h2M13.5 10.5v2h-2"/><path d="M4 8a4 4 0 0 1 6.7-2.9L12 6M12 8a4 4 0 0 1-6.7 2.9L4 10"/></svg>';
    var ICON_MAP = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M8 14s4.5-2.8 4.5-6.3A4.5 4.5 0 1 0 3.5 7.7C3.5 11.2 8 14 8 14z"/><circle cx="8" cy="7.5" r="1.5"/></svg>';
    var ICON_CALENDAR_SM = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="2" y="3" width="12" height="11" rx="2"/><path d="M5 1.5v2M11 1.5v2M2 6.5h12"/></svg>';
    var ICON_PERSON = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 8a2.75 2.75 0 1 0 0-5.5A2.75 2.75 0 0 0 8 8Zm-4.25 5.5a4.25 4.25 0 0 1 8.5 0 .75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75Z"/></svg>';
    var BRAND_MARK = '<span class="mly-brand-mark" aria-hidden="true"></span>';
    var ICON_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
    var ICON_REFRESH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>';
    var ICON_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M12 16V4m0 0 4 4m-4-4-4 4"/></svg>';
    var ICON_SUPPORT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>';
    var ICON_SETTINGS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    var ICON_QUIT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10"/><path d="M8.5 8.5 12 12l3.5-3.5"/><path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/></svg>';
    var ICON_CAM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="13" height="12" rx="2"/><path d="m15 10 7-3v10l-7-3"/></svg>';
    var ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5M9 3h6l1 7 4 2v3H4v-3l4-2 1-7z"/></svg>';
    var ICON_DRAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9h16M4 15h16"/></svg>';
    var LOGO_SVG = '<svg viewBox="0 0 1024 1024" fill="none" aria-hidden="true"><defs><linearGradient id="mdbg" x1="168" y1="96" x2="856" y2="928" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#202735"/><stop offset="1" stop-color="#0A0D13"/></linearGradient><linearGradient id="mdteal" x1="320" y1="278" x2="704" y2="736" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#4EE6D5"/><stop offset="1" stop-color="#1787FF"/></linearGradient><linearGradient id="mdcoral" x1="622" y1="246" x2="812" y2="468" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FF8B6E"/><stop offset="1" stop-color="#FF3E62"/></linearGradient></defs><rect width="1024" height="1024" rx="228" fill="url(#mdbg)"/><circle cx="760" cy="294" r="78" stroke="url(#mdcoral)" stroke-width="22"/><rect x="236" y="230" width="552" height="586" rx="92" fill="#F8FBFF"/><rect x="236" y="230" width="552" height="160" rx="92" fill="url(#mdteal)"/><rect x="326" y="480" width="372" height="236" rx="58" fill="#111927"/><path d="M594 584L664 542C679.998 532.401 700 543.925 700 562.582V633.418C700 652.075 679.998 663.599 664 654L594 612V584Z" fill="#4EE6D5"/></svg>';

    var MAX_DAY_OFFSET = 3;
    var MAX_VISIBLE_ATTENDEES = 8;

    var ATTENDEES_LONG = [
        { name: 'You', status: 'accepted', self: true },
        { name: 'Alex Kim', status: 'noAnswer' },
        { name: 'Jordan Lee', status: 'accepted' },
        { name: 'Sam Rivera', status: 'accepted' },
        { name: 'Taylor Morgan', status: 'noAnswer' },
        { name: 'Chris Park', status: 'accepted' },
        { name: 'Dana Wu', status: 'tentative' },
        { name: 'Evan Brooks', status: 'accepted' },
        { name: 'Frank Liu', status: 'noAnswer' },
        { name: 'Grace Hall', status: 'accepted' },
        { name: 'Hannah Ortiz', status: 'accepted' },
        { name: 'Ivan Cole', status: 'noAnswer' },
        { name: 'Julia Santos', status: 'accepted' },
        { name: 'Kai Nguyen', status: 'noAnswer' }
    ];

    var MEETINGS = {
        'now-1': {
            id: 'now-1', kind: 'now', dayOffset: 0,
            dot: '#4ee6d5', title: 'Out of office',
            presence: 'Calendar event',
            ends: '00:00',
            account: 'Personal · Google',
            joinURL: false,
            time: 'All day',
            attendees: []
        },
        'next-1': {
            id: 'next-1', kind: 'next', dayOffset: 0,
            dot: '#bf5af2', title: 'Daily Tech + Product Stand Up',
            presence: 'Hybrid', platform: 'Google Meet',
            location: 'Building A · Conference Room 4',
            locationShort: 'Build...',
            account: 'Work · Google',
            countdown: 'in 8h 15m', range: '08:40 – 09:00',
            joinURL: true, recurrence: 'Every weekday',
            organizer: 'Taylor Morgan', time: '08:40 – 09:00',
            attendees: ATTENDEES_LONG
        },
        'up-1': {
            id: 'up-1', kind: 'upcoming', dayOffset: 1,
            dot: '#60a5fa', title: 'Sprint Planning',
            location: 'Zoom', platform: 'Zoom',
            account: 'Work · iCloud', joinURL: true,
            time: '10:00 – 11:00',
            attendees: [{ name: 'Team', status: 'accepted' }]
        },
        'up-2': {
            id: 'up-2', kind: 'upcoming', dayOffset: 1,
            dot: '#a78bfa', title: 'Product Demo',
            location: 'Google Meet', platform: 'Google Meet',
            account: 'Work · Google', joinURL: true,
            time: '14:30 – 15:00',
            attendees: [{ name: 'Stakeholders', status: 'tentative' }]
        },
        'd2-1': {
            id: 'd2-1', kind: 'upcoming', dayOffset: 2,
            dot: '#34d399', title: 'Team Retro',
            location: 'Meet', platform: 'Google Meet',
            account: 'Work', joinURL: true,
            time: '16:00 – 17:00',
            attendees: []
        }
    };

    var ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    var ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';

    /* Share availability demo data — fictional slots only */
    var SHARE_DAYS = [
        {
            id: 'past-today',
            slots: [
                { id: 'pt1', label: '14:00–14:30', kind: 'past' },
                { id: 'pt2', label: '14:30–15:00', kind: 'past' },
                { id: 'pt3', label: '15:00–15:30', kind: 'past' },
                { id: 'pt4', label: '15:30–16:00', kind: 'past' },
                { id: 'pt5', label: '16:00–16:30', kind: 'past' },
                { id: 'pt6', label: '16:30–17:00', kind: 'past' }
            ]
        },
        {
            id: 'sat',
            label: 'SATURDAY, 5 SEP',
            previewDay: 'Sat, 5 Sep',
            slots: [
                { id: 's1', label: '09:00–09:30', kind: 'free' },
                { id: 's2', label: '09:30–10:00', kind: 'free' },
                { id: 's3', label: '10:00–10:30', kind: 'free' },
                { id: 's4', label: '10:30–11:00', kind: 'free' },
                { id: 's5', label: '11:00–11:30', kind: 'busy' },
                { id: 's6', label: '11:30–12:00', kind: 'free' },
                { id: 's7', label: '12:00–12:30', kind: 'free' },
                { id: 's8', label: '12:30–13:00', kind: 'free' },
                { id: 's9', label: '13:00–13:30', kind: 'free' },
                { id: 's10', label: '13:30–14:00', kind: 'free' },
                { id: 's11', label: '14:00–14:30', kind: 'free' },
                { id: 's12', label: '14:30–15:00', kind: 'free' },
                { id: 's13', label: '15:00–15:30', kind: 'free' },
                { id: 's14', label: '15:30–16:00', kind: 'free' },
                { id: 's15', label: '16:00–16:30', kind: 'free' },
                { id: 's16', label: '16:30–17:00', kind: 'free' }
            ]
        }
    ];

    function shareGmtLabel() {
        var mins = -new Date().getTimezoneOffset();
        var sign = mins >= 0 ? '+' : '-';
        var abs = Math.abs(mins);
        var h = Math.floor(abs / 60);
        var m = abs % 60;
        return m === 0 ? 'GMT' + sign + h : 'GMT' + sign + h + ':' + String(m).padStart(2, '0');
    }

    function shareAllSlots() {
        var out = [];
        SHARE_DAYS.forEach(function (day) {
            day.slots.forEach(function (slot) {
                out.push({ day: day, slot: slot });
            });
        });
        return out;
    }

    function shareSlotById(id) {
        for (var i = 0; i < SHARE_DAYS.length; i++) {
            for (var j = 0; j < SHARE_DAYS[i].slots.length; j++) {
                if (SHARE_DAYS[i].slots[j].id === id) {
                    return { day: SHARE_DAYS[i], slot: SHARE_DAYS[i].slots[j] };
                }
            }
        }
        return null;
    }

    function buildShareMessage(state) {
        var selected = state.shareSelected || {};
        var ids = Object.keys(selected).filter(function (k) { return selected[k]; });
        if (!ids.length) return '';

        var byDay = {};
        ids.forEach(function (id) {
            var found = shareSlotById(id);
            if (!found || found.slot.kind !== 'free') return;
            var key = found.day.id;
            if (!byDay[key]) byDay[key] = { day: found.day, labels: [] };
            byDay[key].labels.push(found.slot.label);
        });

        var lines = ["I'm available at these times (" + shareGmtLabel() + '):', ''];
        SHARE_DAYS.forEach(function (day) {
            var group = byDay[day.id];
            if (!group || !group.labels.length) return;
            lines.push(day.previewDay || day.label || 'Day');
            group.labels.sort().forEach(function (label) {
                lines.push('  - ' + label);
            });
            lines.push('');
        });
        lines.push('Reply with a time that works for you.');
        return lines.join('\n').replace(/\n\n$/, '');
    }

    function shareChipHTML(slot, state) {
        var selected = state.shareSelected && state.shareSelected[slot.id];
        var kind = slot.kind;
        var cls = 'mly-share-chip is-' + kind + (selected ? ' is-selected' : '');
        var disabled = kind !== 'free' ? ' disabled' : '';
        var help = kind === 'free' ? 'Free — click to include' : (kind === 'busy' ? 'Busy — not available' : 'Past — not available');
        return '<button type="button" class="' + cls + '" data-slot="' + slot.id + '" title="' + help + '"' + disabled + '>' + slot.label + '</button>';
    }

    function sharePanelHTML(state) {
        state = state || {};
        var duration = state.shareDuration || 30;
        var workStart = state.shareWorkStart == null ? 9 : state.shareWorkStart;
        var workEnd = state.shareWorkEnd == null ? 17 : state.shareWorkEnd;
        var copied = state.shareCopied;
        var preview = buildShareMessage(state);
        if (!preview) preview = 'Select free slots to build a message.';
        var hasSelection = preview.indexOf('  - ') !== -1;

        var hourOptions = function (from, to, selected) {
            var html = '';
            for (var h = from; h <= to; h++) {
                html += '<option value="' + h + '"' + (h === selected ? ' selected' : '') + '>' + String(h).padStart(2, '0') + ':00</option>';
            }
            return html;
        };

        var slotSections = SHARE_DAYS.map(function (day) {
            var chips = day.slots.map(function (slot) { return shareChipHTML(slot, state); }).join('');
            var header = day.label ? '<div class="mly-share-day-label">' + day.label + '</div>' : '';
            return header + '<div class="mly-share-chip-grid">' + chips + '</div>';
        }).join('');

        return [
            '<div class="mly-share-panel">',
            '  <div class="mly-share-header">',
            '    <div class="mly-brand">' + BRAND_MARK + '<span class="mly-brand-name">Share free time</span></div>',
            '    <button type="button" class="mly-share-close" data-share-close aria-label="Close">×</button>',
            '  </div>',
            '  <div class="mly-share-controls">',
            '    <div class="mly-share-segment" role="tablist">',
            '      <button type="button" class="' + (duration === 30 ? 'is-active' : '') + '" data-duration="30">30 min</button>',
            '      <button type="button" class="' + (duration === 60 ? 'is-active' : '') + '" data-duration="60">1 hour</button>',
            '    </div>',
            '    <div class="mly-share-hours">',
            '      <label class="mly-share-hour">From',
            '        <select data-share-from>' + hourOptions(0, workEnd - 1, workStart) + '</select>',
            '      </label>',
            '      <label class="mly-share-hour">To',
            '        <select data-share-to>' + hourOptions(workStart + 1, 23, workEnd) + '</select>',
            '      </label>',
            '    </div>',
            '    <div class="mly-share-tz">',
            '      <span class="mly-share-tz-label">Show times as</span>',
            '      <select data-share-tz><option>My timezone (' + shareGmtLabel() + ')</option></select>',
            '    </div>',
            '    <div class="mly-share-legend">',
            '      <span><span class="mly-legend-dot is-free"></span>Free</span>',
            '      <span><span class="mly-legend-dot is-busy"></span>Busy</span>',
            '      <span><span class="mly-legend-dot is-past"></span>Past</span>',
            '    </div>',
            '  </div>',
            '  <div class="mly-share-slots">' + slotSections + '</div>',
            '  <div class="mly-share-preview">',
            '    <div class="mly-share-preview-label">Message preview</div>',
            '    <div class="mly-share-preview-box' + (hasSelection ? '' : ' is-empty') + '"><pre class="mly-share-preview-text">' + preview + '</pre></div>',
            '  </div>',
            '  <div class="mly-share-actions">',
            '    <button type="button" class="mly-share-copy"' + (hasSelection ? '' : ' disabled') + ' data-share-copy>' + (copied ? ICON_CHECK : ICON_COPY) + (copied ? 'Copied' : 'Copy') + '</button>',
            '    <button type="button" class="mly-share-done" data-share-done>Done</button>',
            '  </div>',
            '</div>'
        ].join('');
    }

    function syncedTime() {
        var d = new Date();
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    }

    function dayLabel(offset) {
        if (offset === 0) return 'Today';
        if (offset === 1) return 'Tomorrow';
        var d = new Date();
        d.setDate(d.getDate() + offset);
        return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    function meetingsForDay(offset) {
        var list = [];
        Object.keys(MEETINGS).forEach(function (k) {
            if (MEETINGS[k].dayOffset === offset) list.push(MEETINGS[k]);
        });
        return list;
    }

    function navigableMeetings(offset) {
        var all = meetingsForDay(offset);
        if (offset !== 0) return all;
        var now = all.filter(function (m) { return m.kind === 'now'; });
        var next = all.filter(function (m) { return m.kind === 'next'; });
        var up = all.filter(function (m) { return m.kind === 'upcoming'; });
        return now.concat(next).concat(up);
    }

    function selectedDayEmptyHTML(dayTitle) {
        return [
            '<div class="mly-selected-day-empty">',
            '  <div class="mly-selected-day-empty-icon">📅</div>',
            '  <div class="mly-selected-day-empty-text">No meetings on ' + dayTitle + '</div>',
            '</div>'
        ].join('');
    }

    function meetingById(id) {
        return MEETINGS[id] || null;
    }

    function attendeeStatusLabel(status) {
        if (status === 'accepted') return 'Accepted';
        if (status === 'declined') return 'Declined';
        if (status === 'tentative') return 'Tentative';
        return 'No answer';
    }

    function attendeeStatusIcon(status) {
        if (status === 'accepted') {
            return '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5.25" stroke="currentColor" stroke-width="1.2"/><path d="M3.5 6.2 5.2 7.8 8.7 4.3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        }
        if (status === 'declined') {
            return '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5.25" stroke="currentColor" stroke-width="1.2"/><path d="M4 4l4 4M8 4 4 8" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
        }
        if (status === 'tentative') {
            return '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5.25" stroke="currentColor" stroke-width="1.2"/><path d="M6 3.5v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>';
        }
        return '<svg viewBox="0 0 12 12" fill="none" aria-hidden="true"><circle cx="6" cy="6" r="5.25" stroke="currentColor" stroke-width="1.2"/></svg>';
    }

    function attendeeStatusClass(status) {
        if (status === 'accepted') return 'is-accepted';
        if (status === 'declined') return 'is-declined';
        if (status === 'tentative') return 'is-tentative';
        return 'is-noanswer';
    }

    function detailHTML(meeting, showAllAttendees) {
        var attendees = meeting.attendees || [];
        var visible = showAllAttendees ? attendees : attendees.slice(0, MAX_VISIBLE_ATTENDEES);
        var overflow = attendees.length - visible.length;
        var attendeeRows = visible.map(function (a) {
            return '<div class="mly-attendee-row ' + attendeeStatusClass(a.status) + '">' +
                '<span class="mly-attendee-icon">' + attendeeStatusIcon(a.status) + '</span>' +
                '<span class="mly-attendee-name' + (a.self ? ' is-self' : '') + '">' + a.name + '</span>' +
                '<span class="mly-attendee-status">' + attendeeStatusLabel(a.status) + '</span></div>';
        }).join('');
        var attendeesBlock = attendees.length ? [
            '<div class="mly-detail-section-label">Attendees · ' + attendees.length + '</div>',
            showAllAttendees && visible.length > 6
                ? '<div class="mly-detail-attendees-scroll">' + attendeeRows + '</div>'
                : '<div class="mly-detail-attendees-list">' + attendeeRows + '</div>',
            overflow > 0 && !showAllAttendees
                ? '<button type="button" class="mly-detail-more" data-show-all>+' + overflow + ' more</button>'
                : ''
        ].join('') : '';

        return [
            '<div class="mly-detail-title">' + meeting.title + '</div>',
            '<div class="mly-detail-line mly-detail-line--time">' + meeting.time + '</div>',
            meeting.recurrence ? '<div class="mly-detail-line mly-detail-line--icon">' + ICON_REPEAT + meeting.recurrence + '</div>' : '',
            meeting.location ? '<button type="button" class="mly-detail-line mly-detail-line--teal mly-detail-line--icon" data-map>' + ICON_MAP + '<span>' + meeting.location + '</span></button>' : '',
            meeting.account ? '<div class="mly-detail-line">' + meeting.account + '</div>' : '',
            meeting.platform ? '<div class="mly-detail-line">' + meeting.platform + '</div>' : '',
            meeting.organizer ? '<div class="mly-detail-organizer"><div class="mly-detail-section-label">Organizer</div><div class="mly-detail-line mly-detail-line--icon">' + ICON_PERSON + meeting.organizer + '</div></div>' : '',
            attendeesBlock,
            '<button type="button" class="mly-detail-link" data-calendar>' + ICON_CALENDAR_SM + 'Open in Calendar</button>'
        ].join('');
    }

    function platformTag(label) {
        return label ? '<span class="mly-tag">' + label + '</span>' : '';
    }

    function metaText(text) {
        return text ? '<span class="mly-meta-text">' + text + '</span>' : '';
    }

    function joinButton(id) {
        return '<button type="button" class="mly-join-circle" data-join="' + id + '" aria-label="Join">' + ICON_VIDEO + '</button>';
    }

    function cardHTML(meeting, state) {
        var isNext = meeting.kind === 'next';
        var isNow = meeting.kind === 'now';
        var muted = state.muted[meeting.id];
        var selected = state.selectedId === meeting.id;
        var cls = 'mly-meeting-card' + (isNext ? ' is-next' : ' is-now') + (muted ? ' is-muted' : '') + (selected ? ' is-selected' : '');

        var metaParts = [];
        if (muted) metaParts.push('<span class="mly-muted-tag">🔕 Muted</span>');
        if (meeting.presence) metaParts.push(platformTag(meeting.presence));
        if (meeting.platform) metaParts.push(platformTag(meeting.platform));
        if (isNext && meeting.locationShort) metaParts.push(metaText(meeting.locationShort));
        if (isNow && meeting.ends) metaParts.push(metaText('ends ' + meeting.ends));

        var aside = '';
        if (isNext) {
            aside = '<div class="mly-meeting-aside">' +
                '<div class="mly-next-countdown">' + meeting.countdown + '</div>' +
                '<div class="mly-next-range">' + meeting.range + '</div>' +
                (meeting.joinURL ? joinButton(meeting.id) : '') +
                '</div>';
        } else if (meeting.joinURL) {
            aside = '<div class="mly-meeting-aside">' + joinButton(meeting.id) + '</div>';
        }

        return [
            '<div class="' + cls + '" data-meeting-id="' + meeting.id + '" data-kind="' + meeting.kind + '">',
            '  <span class="mly-cal-dot" style="background:' + meeting.dot + '"></span>',
            '  <div class="mly-meeting-body">',
            '    <div class="mly-meeting-title">' + meeting.title + '</div>',
            '    <div class="mly-meeting-meta-row">' + metaParts.join('') + '</div>',
            meeting.account ? '    <div class="mly-account">' + meeting.account + '</div>' : '',
            '  </div>',
            aside,
            '</div>'
        ].join('');
    }

    function upcomingRowHTML(meeting, state) {
        var muted = state.muted[meeting.id];
        var selected = state.selectedId === meeting.id;
        return [
            '<button type="button" class="mly-meeting-row' + (selected ? ' is-selected' : '') + (muted ? ' is-muted' : '') + '" data-meeting-id="' + meeting.id + '" data-kind="upcoming">',
            '  <span class="mly-cal-dot" style="background:' + meeting.dot + '"></span>',
            '  <div class="mly-meeting-row-body">',
            '    <div class="mly-upcoming-title">' + meeting.title + (meeting.joinURL ? ICON_CAM : '') + '</div>',
            '    <div class="mly-account">' + (meeting.account || meeting.location || '') + '</div>',
            '  </div>',
            '  <div class="mly-upcoming-time">' + meeting.time + '</div>',
            '</button>'
        ].join('');
    }

    function panelInnerHTML(state, opts) {
        opts = opts || {};
        var offset = state.dayOffset;
        var nav = navigableMeetings(offset);
        var now = nav.filter(function (m) { return m.kind === 'now'; })[0];
        var next = nav.filter(function (m) { return m.kind === 'next'; })[0];
        var upcoming = nav.filter(function (m) { return m.kind === 'upcoming'; });
        var dayTitle = dayLabel(offset);
        var isToday = offset === 0;
        var headerRight = opts.quickPanel
            ? '<div class="mly-header-actions">' +
              (state.quickPinned ? '<span class="mly-drag-handle" title="Drag to move">' + ICON_DRAG + '</span>' : '') +
              '<button type="button" class="mly-pin-btn' + (state.quickPinned ? ' is-pinned' : '') + '" data-pin aria-label="Pin">' + ICON_PIN + '</button>' +
              '<span class="mly-synced">Synced ' + syncedTime() + '</span></div>'
            : '<span class="mly-synced">Synced ' + syncedTime() + '</span>';

        var dayNavLabel = isToday
            ? '<span class="mly-daynav-label">' + dayTitle + '</span>'
            : '<button type="button" class="mly-daynav-label mly-daynav-label--back" data-back-today title="Back to Today">' + dayTitle + '</button>';

        var sections = [];
        if (offset === 0) {
            if (now) {
                sections.push(
                    '<div class="mly-section"><div class="mly-section-label mly-section-label--now">Now</div>' + cardHTML(now, state) + '</div>'
                );
            }
            if (next) {
                if (sections.length) sections.push('<div class="mly-divider"></div>');
                sections.push(
                    '<div class="mly-section"><div class="mly-section-label mly-section-label--next">Next</div>' + cardHTML(next, state) + '</div>'
                );
            }
            if (!now && !next) {
                sections.push(selectedDayEmptyHTML('today'));
            }
            if (upcoming.length) {
                if (sections.length) sections.push('<div class="mly-divider"></div>');
                sections.push(
                    '<div class="mly-section"><div class="mly-section-label mly-section-label--upcoming">Upcoming</div>' +
                    upcoming.map(function (m) { return upcomingRowHTML(m, state); }).join('') +
                    '</div>'
                );
            }
        } else {
            var dayMeetings = meetingsForDay(offset);
            if (!dayMeetings.length) {
                sections.push(selectedDayEmptyHTML(dayTitle));
            } else {
                sections.push(
                    '<div class="mly-section">' +
                    '<div class="mly-section-label mly-section-label--agenda">' + dayTitle.toUpperCase() + ' · ' + dayMeetings.length + ' EVT</div>' +
                    dayMeetings.map(function (m) { return upcomingRowHTML(m, state); }).join('') +
                    '</div>'
                );
            }
        }

        return [
            '<div class="mly-popover-group">',
            '  <aside class="mly-detail" aria-hidden="true"></aside>',
            '  <div class="mly-panel">',
            '    <div class="mly-header">',
            '      <div class="mly-brand">' + BRAND_MARK + '<span class="mly-brand-name">Meetly</span></div>',
            headerRight,
            '    </div>',
            '    <div class="mly-daynav">',
            '      <button type="button" class="mly-daynav-btn" data-day="prev" aria-label="Previous day"' + (offset <= 0 ? ' disabled' : '') + '>‹</button>',
            dayNavLabel,
            '      <button type="button" class="mly-daynav-btn" data-day="next" aria-label="Next day"' + (offset >= MAX_DAY_OFFSET ? ' disabled' : '') + '>›</button>',
            '    </div>',
            '    <div class="mly-hints"><kbd>←→</kbd> / <kbd>⌘HL</kbd> day · <kbd>↑↓</kbd> / <kbd>⌘JK</kbd> select · <kbd>↵</kbd> open · <kbd>⌘M</kbd> mute · <kbd>⌘U</kbd> unmute</div>',
            sections.join(''),
            '    <div class="mly-footer">',
            '      <button type="button" class="mly-footer-btn" data-footer="refresh">' + ICON_REFRESH + '<span>Refresh</span></button>',
            '      <button type="button" class="mly-footer-btn" data-footer="share">' + ICON_SHARE + '<span>Share</span></button>',
            '      <span class="mly-footer-spacer"></span>',
            '      <button type="button" class="mly-footer-btn" data-footer="support">' + ICON_SUPPORT + '<span>Support</span></button>',
            '      <button type="button" class="mly-footer-btn" data-footer="settings">' + ICON_SETTINGS + '<span>Settings</span></button>',
            '      <button type="button" class="mly-footer-btn mly-footer-btn--quit" data-footer="quit">' + ICON_QUIT + '<span>Quit</span></button>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('');
    }

    function overlayHTML(seconds) {
        seconds = seconds == null ? 3 : seconds;
        var now = MEETINGS['now-1'];
        return [
            '<div class="mly-overlay-inner">',
            '  <div class="mly-overlay-top">',
            '    <div class="mly-brand">' + LOGO_SVG + '<span class="mly-brand-name">Meetly</span></div>',
            '    <span class="mly-overlay-badge">Meeting in <span data-countdown-label>' + seconds + 's</span></span>',
            '  </div>',
            '  <div class="mly-overlay-soon">Starting in</div>',
            '  <div class="mly-overlay-countdown" data-countdown>0:' + String(seconds).padStart(2, '0') + '</div>',
            '  <div class="mly-overlay-title">' + now.title + '</div>',
            '  <div class="mly-overlay-meta">' + (now.presence || 'Calendar') + ' · ' + now.account + '</div>',
            '  <div class="mly-overlay-snooze">',
            '    <button type="button" class="mly-snooze-btn" data-snooze="1">Snooze 1m</button>',
            '    <button type="button" class="mly-snooze-btn" data-snooze="3">Snooze 3m</button>',
            '    <button type="button" class="mly-snooze-btn" data-snooze="5">Snooze 5m</button>',
            '  </div>',
            '  <div class="mly-overlay-actions">',
            '    <button type="button" class="mly-action-btn" data-action="dismiss">' + ICON_X + ' Dismiss</button>',
            '    <button type="button" class="mly-action-btn mly-action-btn--join" data-action="join">' + ICON_VIDEO + ' Join now</button>',
            '  </div>',
            '</div>'
        ].join('');
    }

    function updateStatusIcon(ctx, state) {
        if (state.dayOffset !== 0) {
            ctx.setStatusIcon({ html: STATUS_ICON_CALENDAR, state: 'idle' });
            return;
        }
        if (MEETINGS['now-1'] && !state.muted['now-1']) {
            ctx.setStatusIcon({ html: STATUS_ICON_VIDEO, state: 'live' });
        } else if (MEETINGS['next-1']) {
            ctx.setStatusIcon({ html: STATUS_ICON_BELL, state: 'soon' });
        } else {
            ctx.setStatusIcon({ html: STATUS_ICON_CALENDAR, state: 'idle' });
        }
    }

    function createPanelController(ctx, getContainer, state, opts) {
        opts = opts || {};
        var hoveredId = null;
        var hoverTimer = null;
        var detailHovered = false;
        var showAllAttendees = false;

        function render() {
            getContainer().innerHTML = panelInnerHTML(state, opts);
            bindEvents();
            syncSelectionVisual();
            if (state.showDetailFromKeyboard && state.selectedId) openDetail(state.selectedId);
            if (typeof opts.onStateChange === 'function') opts.onStateChange();
        }

        function syncSelectionVisual() {
            var root = getContainer();
            root.querySelectorAll('[data-meeting-id]').forEach(function (el) {
                el.classList.toggle('is-selected', el.getAttribute('data-meeting-id') === state.selectedId);
                el.classList.toggle('is-hovered', el.getAttribute('data-meeting-id') === hoveredId);
            });
        }

        function closeDetail() {
            state.detailOpen = false;
            state.showDetailFromKeyboard = false;
            hoveredId = null;
            showAllAttendees = false;
            var detail = getContainer().querySelector('.mly-detail');
            if (detail) {
                detail.classList.remove('is-open');
                detail.setAttribute('aria-hidden', 'true');
                detail.innerHTML = '';
            }
            getContainer().querySelectorAll('.is-hovered').forEach(function (el) { el.classList.remove('is-hovered'); });
        }

        function openDetail(id) {
            var meeting = meetingById(id);
            if (!meeting) return;
            var detail = getContainer().querySelector('.mly-detail');
            if (!detail) return;
            detail.innerHTML = detailHTML(meeting, showAllAttendees);
            detail.classList.add('is-open');
            detail.setAttribute('aria-hidden', 'false');
            state.detailOpen = true;

            detail.onmouseenter = function () { detailHovered = true; if (hoverTimer) clearTimeout(hoverTimer); };
            detail.onmouseleave = function () {
                detailHovered = false;
                scheduleCloseDetail(hoveredId);
            };

            var calBtn = detail.querySelector('[data-calendar]');
            if (calBtn) calBtn.addEventListener('click', function () { ctx.toast.show('Opened in Calendar'); });
            var mapBtn = detail.querySelector('[data-map]');
            if (mapBtn) mapBtn.addEventListener('click', function () { ctx.toast.show('Opened in Google Maps'); });
            var moreBtn = detail.querySelector('[data-show-all]');
            if (moreBtn) moreBtn.addEventListener('click', function () {
                showAllAttendees = true;
                openDetail(id);
            });
        }

        function scheduleCloseDetail(expectedId) {
            if (hoverTimer) clearTimeout(hoverTimer);
            hoverTimer = setTimeout(function () {
                if (detailHovered) return;
                if (hoveredId !== expectedId && expectedId !== null) return;
                closeDetail();
            }, 280);
        }

        function setHover(id) {
            if (hoverTimer) clearTimeout(hoverTimer);
            hoveredId = id;
            showAllAttendees = false;
            state.showDetailFromKeyboard = false;
            syncSelectionVisual();
            openDetail(id);
        }

        function activateMeeting(meeting) {
            state.selectedId = meeting.id;
            if (meeting.joinURL) ctx.toast.show('Joined ' + (meeting.platform || 'meeting'));
            else if (meeting.location) ctx.toast.show('Copied location');
            else ctx.toast.show('Dismissed reminder');
        }

        function muteMeeting(id) {
            state.muted[id] = true;
            render();
            updateStatusIcon(ctx, state);
            ctx.toast.show('Reminder muted');
        }

        function unmuteMeeting(id) {
            if (!state.muted[id]) return;
            delete state.muted[id];
            render();
            updateStatusIcon(ctx, state);
            ctx.toast.show('Reminder unmuted');
        }

        function bindEvents() {
            var root = getContainer();
            root.querySelectorAll('[data-meeting-id]').forEach(function (el) {
                var id = el.getAttribute('data-meeting-id');
                el.addEventListener('mouseenter', function () { setHover(id); });
                el.addEventListener('mouseleave', function () {
                    if (hoveredId === id) scheduleCloseDetail(id);
                });
            });

            root.querySelectorAll('[data-join]').forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var m = meetingById(btn.getAttribute('data-join'));
                    if (m) activateMeeting(m);
                });
            });

            root.querySelectorAll('.mly-meeting-row').forEach(function (row) {
                row.addEventListener('click', function (e) {
                    if (e.target.closest('[data-join]')) return;
                    var m = meetingById(row.getAttribute('data-meeting-id'));
                    if (m) activateMeeting(m);
                });
            });

            root.querySelectorAll('[data-day]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var dir = btn.getAttribute('data-day');
                    if (dir === 'prev' && state.dayOffset > 0) state.dayOffset -= 1;
                    if (dir === 'next' && state.dayOffset < MAX_DAY_OFFSET) state.dayOffset += 1;
                    closeDetail();
                    syncSelectedForDay();
                    render();
                    updateStatusIcon(ctx, state);
                });
            });

            var backBtn = root.querySelector('[data-back-today]');
            if (backBtn) backBtn.addEventListener('click', function () {
                state.dayOffset = 0;
                closeDetail();
                syncSelectedForDay();
                render();
                updateStatusIcon(ctx, state);
            });

            root.querySelectorAll('[data-footer]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var action = btn.getAttribute('data-footer');
                    if (action === 'quit') ctx.hide();
                    else if (action === 'share') state.openShare();
                    else if (action === 'refresh') { ctx.toast.show('Synced'); render(); }
                    else if (action === 'support') ctx.toast.show('Opening Telegram support…');
                    else ctx.toast.show(action.charAt(0).toUpperCase() + action.slice(1));
                });
            });

            var pinBtn = root.querySelector('[data-pin]');
            if (pinBtn) pinBtn.addEventListener('click', function () {
                state.quickPinned = !state.quickPinned;
                render();
                ctx.toast.show(state.quickPinned ? 'Quick Panel pinned' : 'Quick Panel unpinned');
            });
        }

        function syncSelectedForDay() {
            var nav = navigableMeetings(state.dayOffset);
            if (!nav.some(function (m) { return m.id === state.selectedId; })) {
                state.selectedId = nav[0] ? nav[0].id : null;
            }
        }

        function selectPrevMeeting() {
            var nav = navigableMeetings(state.dayOffset);
            if (!nav.length) return;
            state.showDetailFromKeyboard = true;
            var idx = nav.findIndex(function (m) { return m.id === state.selectedId; });
            if (idx < 0) state.selectedId = nav[0].id;
            else state.selectedId = nav[Math.max(0, idx - 1)].id;
            render();
            openDetail(state.selectedId);
        }

        function selectNextMeeting() {
            var nav = navigableMeetings(state.dayOffset);
            if (!nav.length) return;
            state.showDetailFromKeyboard = true;
            var idx = nav.findIndex(function (m) { return m.id === state.selectedId; });
            if (idx < 0) state.selectedId = nav[0].id;
            else state.selectedId = nav[Math.min(nav.length - 1, idx + 1)].id;
            render();
            openDetail(state.selectedId);
        }

        function goPrevDay() {
            if (state.dayOffset <= 0) return;
            state.dayOffset -= 1;
            closeDetail();
            syncSelectedForDay();
            render();
            updateStatusIcon(ctx, state);
        }

        function goNextDay() {
            if (state.dayOffset >= MAX_DAY_OFFSET) return;
            state.dayOffset += 1;
            closeDetail();
            syncSelectedForDay();
            render();
            updateStatusIcon(ctx, state);
        }

        function activateSelected() {
            var m = meetingById(state.selectedId);
            if (m) activateMeeting(m);
        }

        function muteSelected() {
            if (state.selectedId) muteMeeting(state.selectedId);
        }

        function unmuteSelected() {
            if (state.selectedId) unmuteMeeting(state.selectedId);
        }

        function handleKey(e) {
            if (!opts.isActive || !opts.isActive()) return false;
            if (state.shareOpen || ctx.isScreenOverlayOpen()) return false;

            var key = e.key.toLowerCase();
            var mod = e.metaKey || e.ctrlKey;

            if (key === 'arrowleft' || (mod && key === 'h')) {
                e.preventDefault();
                goPrevDay();
                return true;
            }
            if (key === 'arrowright' || (mod && key === 'l')) {
                e.preventDefault();
                goNextDay();
                return true;
            }
            if (key === 'arrowup' || (mod && key === 'k')) {
                e.preventDefault();
                selectPrevMeeting();
                return true;
            }
            if (key === 'arrowdown' || (mod && key === 'j')) {
                e.preventDefault();
                selectNextMeeting();
                return true;
            }
            if (key === 'enter') {
                e.preventDefault();
                activateSelected();
                return true;
            }
            if (mod && key === 'm') {
                e.preventDefault();
                muteSelected();
                return true;
            }
            if (mod && key === 'u') {
                e.preventDefault();
                unmuteSelected();
                return true;
            }
            return false;
        }

        function onEsc() {
            if (state.detailOpen) {
                closeDetail();
                return true;
            }
            return false;
        }

        render();

        return {
            render: render,
            closeDetail: closeDetail,
            handleKey: handleKey,
            onEsc: onEsc,
            muteSelected: muteSelected,
            unmuteSelected: unmuteSelected,
            destroy: function () {
                if (hoverTimer) clearTimeout(hoverTimer);
            }
        };
    }

    function wireShare(ctx, state) {
        var layer = document.createElement('div');
        layer.className = 'mly-share-overlay';
        ctx.screen.appendChild(layer);

        state.shareDuration = state.shareDuration || 30;
        state.shareWorkStart = state.shareWorkStart == null ? 9 : state.shareWorkStart;
        state.shareWorkEnd = state.shareWorkEnd == null ? 17 : state.shareWorkEnd;
        state.shareSelected = state.shareSelected || { s2: true, s8: true };
        state.shareCopied = false;

        layer.addEventListener('click', function (e) {
            if (e.target === layer) closeShare();
        });

        function bindShareEvents() {
            var panel = layer.querySelector('.mly-share-panel');
            if (panel) {
                panel.addEventListener('click', function (e) { e.stopPropagation(); });
            }

            var closeBtn = layer.querySelector('[data-share-close]');
            if (closeBtn) closeBtn.addEventListener('click', closeShare);

            var doneBtn = layer.querySelector('[data-share-done]');
            if (doneBtn) doneBtn.addEventListener('click', closeShare);

            var copyBtn = layer.querySelector('[data-share-copy]');
            if (copyBtn) copyBtn.addEventListener('click', function () {
                if (copyBtn.disabled) return;
                state.shareCopied = true;
                renderShare();
                ctx.toast.show('Copied availability message');
                setTimeout(function () {
                    state.shareCopied = false;
                    renderShare();
                }, 1600);
            });

            layer.querySelectorAll('[data-slot]').forEach(function (chip) {
                chip.addEventListener('click', function () {
                    if (chip.disabled) return;
                    var id = chip.getAttribute('data-slot');
                    state.shareSelected[id] = !state.shareSelected[id];
                    state.shareCopied = false;
                    renderShare();
                });
            });

            layer.querySelectorAll('[data-duration]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    state.shareDuration = parseInt(btn.getAttribute('data-duration'), 10);
                    renderShare();
                });
            });

            var fromSel = layer.querySelector('[data-share-from]');
            if (fromSel) fromSel.addEventListener('change', function () {
                state.shareWorkStart = parseInt(fromSel.value, 10);
                if (state.shareWorkEnd <= state.shareWorkStart) state.shareWorkEnd = state.shareWorkStart + 1;
                renderShare();
            });

            var toSel = layer.querySelector('[data-share-to]');
            if (toSel) toSel.addEventListener('change', function () {
                state.shareWorkEnd = parseInt(toSel.value, 10);
                renderShare();
            });
        }

        function renderShare() {
            layer.innerHTML = sharePanelHTML(state);
            layer.classList.toggle('is-open', state.shareOpen);
            bindShareEvents();
        }

        function openShare() {
            state.shareOpen = true;
            renderShare();
        }

        function closeShare() {
            state.shareOpen = false;
            state.shareCopied = false;
            layer.classList.remove('is-open');
        }

        state.openShare = openShare;
        state.closeShare = closeShare;

        return function cleanupShare() {
            if (layer.parentNode) layer.parentNode.removeChild(layer);
        };
    }

    function wireQuickPanel(ctx, state, menuController) {
        var bg = document.createElement('div');
        bg.className = 'mly-quickpanel-bg';
        var panel = document.createElement('div');
        panel.className = 'mly-quickpanel';

        ctx.desktopArea.appendChild(bg);
        ctx.desktopArea.appendChild(panel);

        var quickController = createPanelController(ctx, function () { return panel; }, state, {
            quickPanel: true,
            isActive: function () { return state.quickOpen; }
        });

        function openQuick() {
            state.quickOpen = true;
            bg.classList.add('is-open');
            panel.classList.add('is-open');
            quickController.render();
            ctx.closePanel();
        }

        function closeQuick() {
            state.quickOpen = false;
            bg.classList.remove('is-open');
            panel.classList.remove('is-open');
            quickController.closeDetail();
        }

        function toggleQuick() {
            if (state.quickOpen) closeQuick();
            else openQuick();
        }

        bg.addEventListener('click', function () {
            if (!state.quickPinned) closeQuick();
        });

        state.toggleQuick = toggleQuick;
        state.closeQuick = closeQuick;

        return {
            controller: quickController,
            handleKey: quickController.handleKey,
            onEsc: quickController.onEsc,
            destroy: function () {
                quickController.destroy();
                if (bg.parentNode) bg.parentNode.removeChild(bg);
                if (panel.parentNode) panel.parentNode.removeChild(panel);
            }
        };
    }

    function wireOverlay(ctx) {
        var seconds = 3;
        var timer = null;
        var layer = ctx.screenOverlay;

        function stop() {
            if (timer) clearTimeout(timer);
            timer = null;
        }

        function render() {
            layer.innerHTML = overlayHTML(seconds);
            layer.querySelectorAll('[data-action]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    stop();
                    ctx.closeScreenOverlay();
                    ctx.toast.show(btn.getAttribute('data-action') === 'join' ? 'Joined Google Meet' : 'Dismissed');
                });
            });
            layer.querySelectorAll('[data-snooze]').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    stop();
                    ctx.closeScreenOverlay();
                    ctx.toast.show('Snoozed ' + btn.getAttribute('data-snooze') + 'm');
                });
            });
        }

        function tick() {
            var el = layer.querySelector('[data-countdown]');
            var label = layer.querySelector('[data-countdown-label]');
            if (!el) return;
            el.textContent = '0:' + String(seconds).padStart(2, '0');
            if (label) label.textContent = seconds + 's';
            if (seconds <= 0) return;
            seconds -= 1;
            timer = setTimeout(tick, 1000);
        }

        render();
        ctx.openScreenOverlay();
        timer = setTimeout(tick, 1000);
        return stop;
    }

    function setupDesktop(ctx) {
        ctx.desktopArea.insertAdjacentHTML('afterbegin',
            '<div class="mly-desktop-brand">' +
            '  <img src="' + ASSET_BASE + 'codeonholiday-logo.png" alt="codeonholiday" draggable="false">' +
            '</div>'
        );
    }

    function setupScene(ctx) {
        setupDesktop(ctx);

        var state = {
            dayOffset: 0,
            selectedId: 'next-1',
            muted: {},
            detailOpen: false,
            showDetailFromKeyboard: false,
            quickOpen: false,
            quickPinned: false,
            shareOpen: false,
            shareSelected: {},
            openShare: null,
            closeShare: null,
            toggleQuick: null,
            closeQuick: null
        };

        var shareCleanup = wireShare(ctx, state);

        var quickController = null;

        var menuController = createPanelController(ctx, function () { return ctx.panel; }, state, {
            isActive: function () { return ctx.isPanelOpen(); },
            onStateChange: function () {
                if (quickController && state.quickOpen) quickController.render();
            }
        });

        var quick = wireQuickPanel(ctx, state, menuController);
        quickController = quick.controller;

        updateStatusIcon(ctx, state);

        ctx.meetly = {
            toggleQuick: function () { state.toggleQuick(); },
            openShare: function () { state.openShare(); },
            muteSelected: function () { menuController.muteSelected && menuController.muteSelected(); }
        };

        ctx.onKeyDown = function (e) {
            if (state.shareOpen) {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    state.closeShare();
                    return true;
                }
                return false;
            }
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                state.toggleQuick();
                return true;
            }
            if (quick.handleKey(e)) return true;
            if (menuController.handleKey(e)) return true;
            return false;
        };

        ctx.onEsc = function () {
            if (state.shareOpen) {
                state.closeShare();
                return true;
            }
            if (quick.onEsc()) return true;
            if (menuController.onEsc()) return true;
            if (state.quickOpen) {
                state.closeQuick();
                return true;
            }
            return false;
        };

        return function cleanup() {
            menuController.destroy();
            quick.destroy();
            shareCleanup();
            ctx.onKeyDown = null;
            ctx.onEsc = null;
            ctx.desktopArea.querySelectorAll('.mly-desktop-brand').forEach(function (n) { n.remove(); });
        };
    }

    function buildConfig(overrides) {
        var cfg = {
            showWindow: false,
            menubar: {
                left: ['Meetly', 'File', 'Edit', 'View', 'Window', 'Help'],
                statusIcon: {
                    label: 'Meetly',
                    html: STATUS_ICON_VIDEO,
                    state: 'live',
                    onClick: 'panel'
                }
            },
            scenes: [{ id: 'desktop', label: 'Desktop', setup: setupScene }],
            hint: 'Click menu bar icon · hover for detail · ⌃⌥M Quick Panel · ESC closes layers',
            startScene: 'desktop',
            dock: true,
            dockApps: [
                { id: 'meetly', label: 'Meetly', icon: ASSET_BASE + 'dock/meetly.svg', active: true },
                { id: 'hoverboard', label: 'HoverBoard', icon: ASSET_BASE + 'dock/hoverboard.png' },
                { id: 'localmelody', label: 'LocalMelody', icon: ASSET_BASE + 'dock/localmelody.png' }
            ]
        };
        if (!overrides) return cfg;
        return Object.assign({}, cfg, overrides);
    }

    global.MeetlyDemo = {
        config: buildConfig(),
        buildConfig: buildConfig,
        openOverlay: wireOverlay,
        fireOverlay: function (ctx) { return wireOverlay(ctx); },
        toggleQuickPanel: function (ctx, state) {
            if (state && state.toggleQuick) state.toggleQuick();
        }
    };
})(typeof window !== 'undefined' ? window : globalThis);
