/**
 * MkDocs Material Premium — Shared Config & Utilities
 * Must be loaded FIRST before all other premium scripts.
 */

(function() {
  'use strict';

  window.MkDocsPremium = window.MkDocsPremium || {};

  // ========================================================================
  // Shared Configuration — consumed by progress.js, animations.js, etc.
  // ========================================================================
  window.MkDocsPremium.CONFIG = {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    fadeDuration: 250,
    scrollOffset: 80,
    contentSelector: '.md-content__inner',
    headingsSelector: '.md-typeset h1, .md-typeset h2, .md-typeset h3',
    tocSelector: '.md-toc__link',
    preSelector: '.md-typeset pre',
    mainInnerSelector: '.md-main__inner',
    revealThreshold: 0.1,
    backToTopThreshold: 400,
    readingPositionThreshold: 200,
  };

  // ========================================================================
  // Shared Utilities — consumed by progress.js, animations.js, etc.
  // ========================================================================
  window.MkDocsPremium.Utils = {
    throttle(fn, wait) {
      let lastTime = 0;
      return function(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
          lastTime = now;
          fn.apply(this, args);
        }
      };
    },

    debounce(fn, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    scrollToElement(element, offset) {
      const off = offset !== undefined ? offset : window.MkDocsPremium.CONFIG.scrollOffset;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - off;
      window.scrollTo({
        top: targetPosition,
        behavior: window.MkDocsPremium.CONFIG.reducedMotion ? 'auto' : 'smooth'
      });
    },

    formatMinutes(words) {
      const wpm = 200;
      return Math.ceil(words / wpm);
    }
  };

})();
