/**
 * MkDocs Material Premium — Progress & Position Indicators
 */

(function () {
  'use strict';

  window.MkDocsPremium = window.MkDocsPremium || {};
  const C = window.MkDocsPremium.CONFIG;
  const U = window.MkDocsPremium.Utils;

  window.MkDocsPremium.Progress = {

    // ------------------------------------------------------------------
    // Reading Progress Bar
    // ------------------------------------------------------------------
    ReadingProgress: {
      bar: null,

      create() {

        if (this.bar) return;

        this.bar = document.querySelector(".reading-progress");

        if (!this.bar) {

          this.bar = document.createElement("div");

          this.bar.className = "reading-progress";

          this.bar.setAttribute("role", "progressbar");
          this.bar.setAttribute("aria-label", "Reading progress");
          this.bar.setAttribute("aria-valuemin", "0");
          this.bar.setAttribute("aria-valuemax", "100");

          document.body.appendChild(this.bar);

        }
      },

      update() {
        if (!this.bar) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        this.bar.style.width = progress + '%';
        this.bar.setAttribute('aria-valuenow', Math.round(progress));
      }
    },

    // ------------------------------------------------------------------
    // Back to Top Button
    // ------------------------------------------------------------------
    BackToTop: {
      button: null,

      create() {
        if (this.button) return;
        this.button = document.querySelector(".back-to-top");
        if (this.button) return;
        this.button = document.createElement('button');
        this.button.className = 'back-to-top';
        this.button.setAttribute('aria-label', 'Back to top');
        this.button.setAttribute('title', 'Back to top');
        this.button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        `;
        document.body.appendChild(this.button);

        this.button.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: C.reducedMotion ? 'auto' : 'smooth'
          });
        });
      },

      update() {
        if (!this.button) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        this.button.classList.toggle('is-visible', scrollTop > C.backToTopThreshold);
      }
    },

    // ------------------------------------------------------------------
    // Reading Position & Estimated Time
    // ------------------------------------------------------------------
    ReadingPosition: {
      indicator: null,
      create() {
        if (this.indicator) return;
        this.indicator = document.querySelector(".reading-position");
        if (this.indicator) return;
        const content = document.querySelector(C.contentSelector);
        if (!content) return;

        const text = content.textContent || '';
        const words = text.trim().split(/\s+/).length;
        const minutes = U.formatMinutes(words);

        this.indicator = document.createElement('div');
        this.indicator.className = 'reading-position';
        this.indicator.innerHTML = `${minutes} min read`;
        this.indicator.setAttribute('aria-live', 'polite');
        // Position left to avoid overlapping back-to-top button
        this.indicator.style.left = '1.5rem';
        this.indicator.style.right = 'auto';
        document.body.appendChild(this.indicator);
      },

      update() {
        if (!this.indicator) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

        if (scrollTop > C.readingPositionThreshold) {
          this.indicator.classList.add('is-visible');
          this.indicator.innerHTML = `${progress}% · ${Math.max(0, 100 - progress)}% remaining`;
        } else {
          this.indicator.classList.remove('is-visible');
        }
      }
    }
  };
})();