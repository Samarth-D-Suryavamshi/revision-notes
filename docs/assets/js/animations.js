/**
 * MkDocs Material Premium — Scroll Animations & Navigation
 */

(function() {
  'use strict';

  window.MkDocsPremium = window.MkDocsPremium || {};
  const C = window.MkDocsPremium.CONFIG;
  const U = window.MkDocsPremium.Utils;

  window.MkDocsPremium.Animations = {

    // ------------------------------------------------------------------
    // Section Reveal (Intersection Observer) — NON-INVASIVE
    // ------------------------------------------------------------------
    SectionReveal: {
      observer: null,

      init() {
        if (C.reducedMotion) {
          document.querySelectorAll('.reveal-section').forEach(el => el.classList.add('is-visible'));
          return;
        }

        if (this.observer) this.observer.disconnect();

        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              this.observer.unobserve(entry.target);
            }
          });
        }, {
          root: null,
          rootMargin: '0px 0px -50px 0px',
          threshold: C.revealThreshold
        });

        const content = document.querySelector(C.contentSelector);
        if (!content) return;

        Array.from(content.children).forEach((child, index) => {
          if (child.matches('script, style, .md-search, nav, .md-typeset__scrollwrap')) return;
          child.classList.add('reveal-section', `stagger-${(index % 3) + 1}`);
          this.observer.observe(child);
        });
      }
    },

    // ------------------------------------------------------------------
    // TOC Scroll Spy — TOC ONLY (no sidebar conflict)
    // ------------------------------------------------------------------
    TocSpy: {
      observer: null,

      init() {
        const headings = Array.from(document.querySelectorAll(C.headingsSelector));
        const tocLinks = Array.from(document.querySelectorAll(C.tocSelector));
        if (!headings.length || !tocLinks.length) return;

        if (this.observer) this.observer.disconnect();

        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              tocLinks.forEach(link => {
                link.classList.toggle('md-toc__link--active', link.getAttribute('href') === `#${id}`);
              });
            }
          });
        }, {
          rootMargin: '-80px 0px -60% 0px',
          threshold: 0
        });

        headings.forEach(heading => {
          if (heading.id) this.observer.observe(heading);
        });
      }
    },

    // ------------------------------------------------------------------
    // Smooth Anchor Navigation — uses native :target via location.hash
    // ------------------------------------------------------------------
    AnchorNavigation: {
      init() {
        document.addEventListener('click', (e) => {
          const link = e.target.closest('a[href^="#"]');
          if (!link) return;

          const targetId = link.getAttribute('href').slice(1);
          const targetElement = document.getElementById(targetId);
          if (!targetElement) return;

          e.preventDefault();
          U.scrollToElement(targetElement);

          setTimeout(() => {
            location.hash = targetId;
          }, C.reducedMotion ? 0 : 300);
        });
      }
    },

    // ------------------------------------------------------------------
    // Page Transition Fade (safe — no click interception)
    // ------------------------------------------------------------------
    PageTransition: {
      init() {
        const mainInner = document.querySelector(C.mainInnerSelector);
        if (mainInner) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              mainInner.classList.add('is-visible');
            });
          });
        }
        // Navigation click interception intentionally removed to preserve
        // MkDocs Material's instant loading (XHR page swaps).
      }
    },

    // ------------------------------------------------------------------
    // Scroll Restoration
    // ------------------------------------------------------------------
    ScrollRestoration: {
      init() {
        window.addEventListener('beforeunload', () => {
          sessionStorage.setItem('md-scroll-position', window.scrollY.toString());
        });

        const saved = sessionStorage.getItem('md-scroll-position');
        if (saved) {
          window.scrollTo(0, parseInt(saved, 10));
          sessionStorage.removeItem('md-scroll-position');
        }
      }
    },

    // ------------------------------------------------------------------
    // Button Ripple Effect
    // ------------------------------------------------------------------
    ButtonRipple: {
      init() {
        document.addEventListener('click', (e) => {
          const button = e.target.closest('.md-button');
          if (!button) return;

          const rect = button.getBoundingClientRect();
          const ripple = document.createElement('span');
          ripple.className = 'ripple';

          const size = Math.max(rect.width, rect.height);
          ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 600ms linear;
            pointer-events: none;
            width: ${size}px;
            height: ${size}px;
            left: ${e.clientX - rect.left - size / 2}px;
            top: ${e.clientY - rect.top - size / 2}px;
          `;

          button.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        });
      }
    },

    // ------------------------------------------------------------------
    // Lazy Image Loading Enhancement
    // ------------------------------------------------------------------
    LazyImages: {
      init() {
        if (C.reducedMotion) return;

        document.querySelectorAll('.md-typeset img:not([loading])').forEach(img => {
          img.setAttribute('loading', 'lazy');

          if (img.complete) {
            img.style.opacity = '1';
          } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 400ms ease, transform 400ms ease';
            img.addEventListener('load', () => {
              img.style.opacity = '1';
            }, { once: true });
          }
        });
      }
    }
  };
})();