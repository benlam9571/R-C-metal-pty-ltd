// animations.js - R&C Metal Pty Ltd
// Scroll-reveal + number counters + metallic micro-effects
// No dependencies. Auto-targets elements by CSS selector.

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     1. SCROLL REVEAL CONFIG
     Each entry: { selector, type, stagger (ms between siblings) }
  ────────────────────────────────────────────────────────── */
  var REVEALS = [
    // Section chrome
    { selector: '.section-label',       type: 'left',  stagger: 0   },
    { selector: '.section-title',       type: 'up',    stagger: 0,  delay: 100 },
    { selector: '.section-divider',     type: 'up',    stagger: 0,  delay: 180 },

    // Cards & feature blocks
    { selector: '.card',                type: 'up',    stagger: 90  },
    { selector: '.product-card',        type: 'up',    stagger: 80  },
    { selector: '.mfg-stat-block',      type: 'up',    stagger: 80  },
    { selector: '.location-card',       type: 'up',    stagger: 80  },
    { selector: '.cert-badge',          type: 'scale', stagger: 50  },
    { selector: '.process-step',        type: 'up',    stagger: 100 },

    // Contact page
    { selector: '.info-block',          type: 'left',  stagger: 70  },
    { selector: '.contact-form-panel',  type: 'right', stagger: 0   },

    // About page
    { selector: '.story-visual',        type: 'left',  stagger: 0   },
    { selector: '.story-text',          type: 'right', stagger: 0   },

    // Service feature rows
    { selector: '.service-feature-content', type: 'up', stagger: 0  },

    // Stats
    { selector: '.stat',                type: 'up',    stagger: 60  },

    // Footer
    { selector: '.footer-brand',        type: 'up',    stagger: 0   },
    { selector: '.footer-col',          type: 'up',    stagger: 70  },
  ];

  /* ──────────────────────────────────────────────────────────
     2. STAT COUNTER CONFIG
     Targets elements with data-count="N" data-suffix="K+" etc.
     Dynamically assigned below based on known stat values.
  ────────────────────────────────────────────────────────── */

  /* ──────────────────────────────────────────────────────────
     3. HELPERS
  ────────────────────────────────────────────────────────── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCount(el, from, to, suffix, duration) {
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = easeOutQuart(progress);
      el.textContent = Math.round(from + eased * (to - from)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ──────────────────────────────────────────────────────────
     4. INITIALISE SCROLL REVEAL
  ────────────────────────────────────────────────────────── */
  function initReveal() {
    // Build a map: element → stagger-delay
    var observed = new Map(); // el → base delay (ms)

    REVEALS.forEach(function (rule) {
      var elements = Array.from(document.querySelectorAll(rule.selector));
      if (!elements.length) return;

      // Group siblings that share the same parent for staggering
      var groups = {};
      elements.forEach(function (el) {
        var key = el.parentNode ? el.parentNode._rcKey || (el.parentNode._rcKey = Math.random()) : 'root';
        if (!groups[key]) groups[key] = [];
        groups[key].push(el);
      });

      Object.values(groups).forEach(function (group) {
        group.forEach(function (el, i) {
          // Skip if already processed
          if (el._rcAnimated) return;
          el._rcAnimated = true;

          var delay = (rule.delay || 0) + i * (rule.stagger || 0);
          el.classList.add('rc-reveal', 'rc-' + rule.type);
          observed.set(el, delay);
        });
      });
    });

    // Single IntersectionObserver for all elements
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = observed.get(el) || 0;
        setTimeout(function () {
          el.classList.add('rc-in');
        }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -48px 0px' });

    observed.forEach(function (delay, el) {
      observer.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────
     5. STAT NUMBER COUNTERS
     Finds .stat-num elements and animates their numeric content
  ────────────────────────────────────────────────────────── */
  function initCounters() {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var container = entry.target;

        // Find the em (accent number) or the whole text
        var em = container.querySelector('em');
        var target = em || container;

        // Extract numeric value
        var raw = (target.dataset.count) ? target.dataset.count : target.textContent.replace(/[^0-9]/g, '');
        var num = parseInt(raw, 10);
        if (isNaN(num)) return;

        // Preserve suffix text nodes that follow (like "+", "K")
        var suffix = target.dataset.suffix !== undefined
          ? target.dataset.suffix
          : target.textContent.replace(/[0-9]/g, '');

        animateCount(target, 0, num, suffix, 1400);
        statObserver.unobserve(container);
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('.stat-num').forEach(function (el) {
      statObserver.observe(el);
    });
  }

  /* ──────────────────────────────────────────────────────────
     6. PRODUCT-CARD SHINE SWEEP
     Product cards use ::before/::after, so inject a
     <span class="rc-shine"> inside each and animate it.
  ────────────────────────────────────────────────────────── */
  function initCardShine() {
    var style = document.createElement('style');
    style.textContent = [
      '.rc-shine{',
        'position:absolute;top:0;left:-80%;width:50%;height:100%;',
        'background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);',
        'transform:skewX(-15deg);transition:left 0.65s ease;pointer-events:none;z-index:2',
      '}',
      '.product-card:hover .rc-shine{left:160%}',
      '.service-feature-visual .rc-shine{width:40%}',
      '.service-feature-visual:hover .rc-shine{left:160%}',
    ].join('');
    document.head.appendChild(style);

    var targets = document.querySelectorAll('.product-card, .service-feature-visual, .story-plate');
    targets.forEach(function (el) {
      if (el.querySelector('.rc-shine')) return;
      var shine = document.createElement('span');
      shine.className = 'rc-shine';
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(shine);
    });
  }

  /* ──────────────────────────────────────────────────────────
     7. RIVET STAGGER (about / sub-pages) - already CSS-handled,
        but add a slight random jitter for naturalness
  ────────────────────────────────────────────────────────── */
  function initRivets() {
    document.querySelectorAll('.rivet').forEach(function (el, i) {
      el.style.animationDelay = (0.2 + i * 0.13) + 's';
    });
  }

  /* ──────────────────────────────────────────────────────────
     8. STORY PLATE - metallic pulse glow on mouse enter
  ────────────────────────────────────────────────────────── */
  function initStoryPlate() {
    var plate = document.querySelector('.story-plate');
    if (!plate) return;
    plate.addEventListener('mouseenter', function () {
      plate.style.boxShadow = '8px 8px 0 var(--silver-dark), 16px 16px 0 rgba(176,180,186,0.18), 0 0 40px rgba(176,180,186,0.12)';
    });
    plate.addEventListener('mouseleave', function () {
      plate.style.boxShadow = '';
    });
  }

  /* ──────────────────────────────────────────────────────────
     9. NAV - add compact state after hero leaves top
  ────────────────────────────────────────────────────────── */
  function initNavScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var navStyle = document.createElement('style');
    navStyle.textContent = [
      'nav.scrolled{background:rgba(10,12,16,0.99)!important}',
      'nav{transition:background 0.4s ease}',
    ].join('');
    document.head.appendChild(navStyle);

    var sentinel = document.createElement('span');
    sentinel.setAttribute('aria-hidden', 'true');
    sentinel.style.cssText = 'position:absolute;top:40px;left:0;width:1px;height:1px;pointer-events:none;';
    document.body.prepend(sentinel);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        nav.classList.toggle('scrolled', !entry.isIntersecting);
      });
    }, { threshold: 0 });

    observer.observe(sentinel);
  }

  /* ──────────────────────────────────────────────────────────
     BOOT - wait for DOM ready
  ────────────────────────────────────────────────────────── */
  function boot() {
    initReveal();
    initCounters();
    initCardShine();
    initRivets();
    initStoryPlate();
    initNavScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
