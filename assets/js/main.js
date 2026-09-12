/* ============================================================
   SAQR FIGHT CLUB — behaviour
   No dependencies. Everything degrades: with JS off the page is
   complete in German, all content is visible, all links work.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var LANGS = ['de', 'en', 'ar'];
  var STORE = 'saqr.lang';
  var lang = 'de';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ══════════════════ i18n ══════════════════ */

  function t(key) {
    var d = window.I18N || {};
    return (d[lang] && d[lang][key]) || (d.de && d.de[key]) || '';
  }

  var arFontsLoaded = false;
  function loadArabicFonts() {
    if (arFontsLoaded) return;
    arFontsLoaded = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap';
    document.head.appendChild(l);
  }

  function applyLang(next, persist) {
    if (LANGS.indexOf(next) === -1) next = 'de';
    lang = next;
    if (lang === 'ar') loadArabicFonts();

    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    $$('[data-i18n]').forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v) el.textContent = v;
    });

    document.title = t('meta.title');
    var md = $('meta[name="description"]');
    if (md) md.setAttribute('content', t('meta.desc'));

    $$('.lang__b').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    if (burger) {
      burger.setAttribute('aria-label',
        t(nav && nav.classList.contains('is-open') ? 'a11y.menuClose' : 'a11y.menuOpen'));
    }

    renderLive();

    if (persist) { try { localStorage.setItem(STORE, lang); } catch (e) {} }
  }

  /* ══════════════════ header · menu · nav ══════════════════ */

  var hdr = $('#hdr');
  var nav = $('#nav');
  var burger = $('#burger');

  var onScrollHdr = function () {
    if (hdr) hdr.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScrollHdr, { passive: true });
  onScrollHdr();

  function setMenu(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', t(open ? 'a11y.menuClose' : 'a11y.menuOpen'));
  }
  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  /* scroll-spy — recomputed from scratch, so no section can stay stuck active */
  var spyIds = ['disziplinen', 'zeiten', 'kinder', 'wettkampf', 'fragen', 'kontakt'];
  var spyTargets = spyIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  var navLinks = $$('.nav a');

  function spyTick() {
    var line = window.innerHeight * 0.38;
    var id = null;
    /* the last section whose top has crossed the reading line */
    spyTargets.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) id = s.id;
    });
    /* nothing is "current" while the hero still owns the screen */
    if (window.scrollY < 120) id = null;
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', !!id && a.getAttribute('href') === '#' + id);
    });
  }
  if (spyTargets.length) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { spyTick(); ticking = false; });
    }, { passive: true });
    window.addEventListener('resize', spyTick, { passive: true });
    spyTick();
  }

  /* ══════════════════ reveal ══════════════════ */

  var revealSel = '.sec__head, .disc, .sched, .sched__foot, .kids__copy, .kids__mosaic,' +
    '.steps__i, .multicam, .wide, .faq, .voucher, .convo, .convo__grid, .contact__info, .mapbox';

  function initReveal() {
    if (!('IntersectionObserver' in window) || reduce.matches) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    $$(revealSel).forEach(function (el) {
      el.classList.add('rv');
      /* anything already at or above the fold (reload mid-page, deep link,
         restored scroll position) is shown at once — never left invisible */
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('is-in');
      } else {
        io.observe(el);
      }
    });
  }
  initReveal();

  reduce.addEventListener('change', function () {
    if (reduce.matches) {
      $$('.rv').forEach(function (el) { el.classList.remove('rv'); });
    } else {
      initReveal();
    }
  });

  /* ══════════════════ ticker — duplicate for a seamless loop ══════════════════ */

  var track = $('#tickerTrack');
  if (track) track.innerHTML += track.innerHTML;

  /* ══════════════════ live / next training (Europe/Berlin) ══════════════════ */

  /* Tuesday = 2, Thursday = 4 */
  var DAYS = [2, 4];
  var SLOTS = [
    { from: 17 * 60, to: 18 * 60, key: 'sched.g1' },
    { from: 18 * 60, to: 19 * 60, key: 'sched.g2' },
    { from: 19 * 60, to: 20 * 60, key: 'sched.g3' },
    { from: 20 * 60, to: 22 * 60, key: 'sched.g4' }
  ];
  var OPEN = SLOTS[0].from, CLOSE = SLOTS[SLOTS.length - 1].to;

  function berlinNow() {
    var parts;
    try {
      parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Berlin', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
    } catch (e) { return null; }
    var map = {};
    parts.forEach(function (p) { map[p.type] = p.value; });
    var idx = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[map.weekday];
    if (idx === undefined) return null;
    var h = parseInt(map.hour, 10);
    if (h === 24) h = 0;
    return { dow: idx, min: h * 60 + parseInt(map.minute, 10) };
  }

  function hhmm(m) {
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  }

  function renderLive() {
    var chip = $('#liveChip'), txt = $('#liveTxt');
    if (!chip || !txt) return;
    var now = berlinNow();
    if (!now) { chip.hidden = true; return; }

    var current = null;
    if (DAYS.indexOf(now.dow) !== -1) {
      current = SLOTS.filter(function (s) { return now.min >= s.from && now.min < s.to; })[0] || null;
    }

    $$('.sched tbody tr').forEach(function (tr) { tr.classList.remove('is-now'); });

    if (current) {
      var row = $('.sched tbody tr[data-slot="' + Math.floor(current.from / 60) + '"]');
      if (row) row.classList.add('is-now');
      txt.textContent = t('live.now')
        .replace('{group}', t(current.key).replace(/­/g, ''))
        .replace('{end}', hhmm(current.to));
      chip.classList.remove('is-next');
      chip.hidden = false;
      return;
    }

    /* find the next Tuesday or Thursday 17:00 */
    for (var d = 0; d < 8; d++) {
      var dow = (now.dow + d) % 7;
      if (DAYS.indexOf(dow) === -1) continue;
      if (d === 0 && now.min >= CLOSE) continue;
      var when = (d === 0 && now.min < OPEN) || d > 0 ? OPEN : null;
      if (when === null) continue;
      txt.textContent = t('live.next')
        .replace('{day}', t(dow === 2 ? 'day.tue' : 'day.thu'))
        .replace('{time}', hhmm(OPEN));
      chip.classList.add('is-next');
      chip.hidden = false;
      return;
    }
    chip.hidden = true;
  }

  setInterval(renderLive, 60000);

  /* ══════════════════ thumb bar — step aside for the booking band ══════════════════ */

  var thumb = $('#thumb');
  var band = $('#probetraining');
  if (thumb && band && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      thumb.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0.12 }).observe(band);
  }

  /* ══════════════════ map — loaded only on request (DSGVO) ══════════════════ */

  var mapBtn = $('#mapBtn');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var ph = $('#mapPh');
      var f = document.createElement('iframe');
      f.src = 'https://maps.google.com/maps?q=' +
        encodeURIComponent('Lachnerstraße 38, 80636 München') +
        '&z=16&hl=' + (lang === 'ar' ? 'ar' : lang) + '&output=embed';
      f.loading = 'lazy';
      f.title = 'Saqr Fight Club — Lachnerstraße 38, 80636 München';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      $('#mapbox').appendChild(f);
      if (ph) ph.remove();
    });
  }

  /* ══════════════════ misc ══════════════════ */

  var yr = $('#yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  $$('.lang__b').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
  });

  /* German is the primary language. We never auto-switch away from it —
     only a deliberate choice by the visitor is remembered. */
  var saved = null;
  try { saved = localStorage.getItem(STORE); } catch (e) {}
  applyLang(saved || 'de', false);
})();
