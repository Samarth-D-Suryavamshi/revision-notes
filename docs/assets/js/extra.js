(function () {
  'use strict';

  // ========================================================================
  // Configuration
  // ========================================================================
  const CONFIG = {
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
  // Utility Functions
  // ========================================================================
  const Utils = {
    throttle(fn, wait) {
      let lastTime = 0;
      return function (...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
          lastTime = now;
          fn.apply(this, args);
        }
      };
    },

    debounce(fn, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    scrollToElement(element, offset = CONFIG.scrollOffset) {
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: CONFIG.reducedMotion ? 'auto' : 'smooth'
      });
    },

    formatMinutes(words) {
      const wpm = 200;
      return Math.ceil(words / wpm);
    }
  };

  // ========================================================================
  // Reading Progress Bar
  // ========================================================================
  const ReadingProgress = (() => {
    let progressBar = null;

    function create() {
      progressBar = document.createElement('div');
      progressBar.className = 'reading-progress';
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-label', 'Reading progress');
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');
      document.body.appendChild(progressBar);
    }

    function update() {
      if (!progressBar) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(progress));
    }

    return { create, update };
  })();

  // ========================================================================
  // Section Reveal (Intersection Observer) — NON-INVASIVE
  // ========================================================================
  const SectionReveal = (() => {
    let observer = null;

    function init() {
      if (CONFIG.reducedMotion) {
        document.querySelectorAll('.reveal-section').forEach(el => el.classList.add('is-visible'));
        return;
      }

      if (observer) observer.disconnect();

      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: CONFIG.revealThreshold
      });

      const content = document.querySelector(CONFIG.contentSelector);
      if (!content) return;

      Array.from(content.children).forEach((child, index) => {
        // Skip non-content elements to avoid breaking MkDocs Material internals
        if (child.matches('script, style, .md-search, nav, .md-typeset__scrollwrap')) return;

        child.classList.add('reveal-section', `stagger-${(index % 3) + 1}`);
        observer.observe(child);
      });
    }

    return { init };
  })();

  // ========================================================================
  // Table of Contents Scroll Spy — TOC ONLY (no sidebar conflict)
  // ========================================================================
  const TocSpy = (() => {
    let observer = null;

    function init() {
      const headings = Array.from(document.querySelectorAll(CONFIG.headingsSelector));
      const tocLinks = Array.from(document.querySelectorAll(CONFIG.tocSelector));
      if (!headings.length || !tocLinks.length) return;

      if (observer) observer.disconnect();

      observer = new IntersectionObserver((entries) => {
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
        if (heading.id) observer.observe(heading);
      });
    }

    return { init };
  })();

  // ========================================================================
  // Smooth Anchor Navigation — uses native :target via location.hash
  // ========================================================================
  const AnchorNavigation = (() => {
    function init() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const targetId = link.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        e.preventDefault();
        Utils.scrollToElement(targetElement);

        // Update hash after scroll to trigger CSS :target animation natively
        const updateHash = () => {
          location.hash = targetId;
        };
        setTimeout(updateHash, CONFIG.reducedMotion ? 0 : 300);
      });
    }

    return { init };
  })();

  // ========================================================================
  // Copy Link Animation
  // ========================================================================
  const CopyLink = (() => {
    function init() {
      document.addEventListener('click', async (e) => {
        const link = e.target.closest('.headerlink');
        if (!link) return;

        e.preventDefault();
        const href = link.href;

        try {
          await navigator.clipboard.writeText(href);
          showToast('Link copied to clipboard');
        } catch (err) {
          const textarea = document.createElement('textarea');
          textarea.value = href;
          textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;z-index:-1;';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast('Link copied to clipboard');
        }
      });
    }

    function showToast(message) {
      const existing = document.querySelector('.copy-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = 'copy-toast';
      toast.textContent = message;
      toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: var(--color-surface-1, #fff);
        color: var(--color-text-primary, #000);
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        border: 1px solid var(--color-border, #eee);
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 1000;
        opacity: 0;
        transition: opacity 250ms ease, transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: none;
      `;
      document.body.appendChild(toast);

      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
      });

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => toast.remove(), 250);
      }, 2000);
    }

    return { init };
  })();

  // ========================================================================
  // Back to Top Button
  // ========================================================================
  const BackToTop = (() => {
    let button = null;

    function create() {
      button = document.createElement('button');
      button.className = 'back-to-top';
      button.setAttribute('aria-label', 'Back to top');
      button.setAttribute('title', 'Back to top');
      button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      document.body.appendChild(button);

      button.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: CONFIG.reducedMotion ? 'auto' : 'smooth'
        });
      });
    }

    function update() {
      if (!button) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      button.classList.toggle('is-visible', scrollTop > CONFIG.backToTopThreshold);
    }

    return { create, update };
  })();

  // ========================================================================
  // Reading Position & Estimated Time — positioned left to avoid overlap
  // ========================================================================
  const ReadingPosition = (() => {
    let indicator = null;

    function create() {
      const content = document.querySelector(CONFIG.contentSelector);
      if (!content) return;

      const text = content.textContent || '';
      const words = text.trim().split(/\s+/).length;
      const minutes = Utils.formatMinutes(words);

      indicator = document.createElement('div');
      indicator.className = 'reading-position';
      indicator.innerHTML = `${minutes} min read`;
      indicator.setAttribute('aria-live', 'polite');
      // Override CSS right-position to avoid overlapping back-to-top button
      indicator.style.left = '1.5rem';
      indicator.style.right = 'auto';
      document.body.appendChild(indicator);
    }

    function update() {
      if (!indicator) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

      if (scrollTop > CONFIG.readingPositionThreshold) {
        indicator.classList.add('is-visible');
        indicator.innerHTML = `${progress}% · ${Math.max(0, 100 - progress)}% remaining`;
      } else {
        indicator.classList.remove('is-visible');
      }
    }

    return { create, update };
  })();

  // ========================================================================
  // Code Block Enhancements — deduplicated with dataset guard
  // ========================================================================
  const CodeBlocks = (() => {
    function init() {
      document.querySelectorAll(CONFIG.preSelector).forEach(pre => {
        if (pre.dataset.enhanced) return;
        pre.dataset.enhanced = 'true';
        enhanceCodeBlock(pre);
      });
    }

    function enhanceCodeBlock(pre) {
      const code = pre.querySelector('code');
      if (code) {
        const langClass = Array.from(code.classList).find(c => c.startsWith('language-'));
        if (langClass) {
          pre.setAttribute('data-lang', langClass.replace('language-', ''));
        }
      }

      const checkOverflow = () => {
        pre.classList.toggle('is-scrollable', pre.scrollWidth > pre.clientWidth);
      };
      checkOverflow();
      window.addEventListener('resize', Utils.debounce(checkOverflow, 200));

      const clipboard = pre.querySelector('.md-clipboard');
      if (clipboard && !clipboard.dataset.enhanced) {
        clipboard.dataset.enhanced = 'true';
        clipboard.addEventListener('click', async () => {
          const codeText = pre.querySelector('code')?.textContent || '';
          try {
            await navigator.clipboard.writeText(codeText);
            clipboard.classList.add('is-copied');
            setTimeout(() => clipboard.classList.remove('is-copied'), 2000);
          } catch (err) {
            console.warn('Clipboard API failed:', err);
          }
        });
      }
    }

    return { init };
  })();

  // ========================================================================
  // Search Dialog Enhancement — visual only, no keyboard conflict
  // ========================================================================
  const SearchEnhancement = (() => {
    function init() {
      const searchInner = document.querySelector('.md-search__inner');
      if (!searchInner) return;

      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            searchInner.classList.toggle('is-visible', searchInner.classList.contains('md-search__inner--active'));
          }
        });
      });
      observer.observe(searchInner, { attributes: true });

      // NOTE: Custom keyboard navigation removed to avoid conflict with
      // MkDocs Material's built-in search keyboard handling.
    }

    return { init };
  })();

  // ========================================================================
  // Page Transition Fade — SAFE (no click interception)
  // ========================================================================
  const PageTransition = (() => {
    function init() {
      const mainInner = document.querySelector(CONFIG.mainInnerSelector);
      if (mainInner) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            mainInner.classList.add('is-visible');
          });
        });
      }
      // Navigation click interception intentionally removed to preserve
      // MkDocs Material's instant loading (XHR page swaps).
      // If you do NOT use instant loading, you can re-enable interception here.
    }

    return { init };
  })();

  // ========================================================================
  // Scroll Restoration
  // ========================================================================
  const ScrollRestoration = (() => {
    function init() {
      window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('md-scroll-position', window.scrollY.toString());
      });

      const savedPosition = sessionStorage.getItem('md-scroll-position');
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
        sessionStorage.removeItem('md-scroll-position');
      }
    }

    return { init };
  })();

  // ========================================================================
  // Button Ripple Effect
  // ========================================================================
  const ButtonRipple = (() => {
    function init() {
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

    return { init };
  })();

  // ========================================================================
  // Lazy Image Loading Enhancement
  // ========================================================================
  const LazyImages = (() => {
    function init() {
      if (CONFIG.reducedMotion) return;

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

    return { init };
  })();

  // ========================================================================
  // Keyboard Accessibility Enhancements
  // ========================================================================
  const KeyboardAccessibility = (() => {
    function init() {
      const skipLink = document.querySelector('.md-skip');
      if (skipLink) {
        skipLink.addEventListener('click', (e) => {
          const main = document.querySelector('main') || document.querySelector('.md-main');
          if (main) {
            e.preventDefault();
            main.setAttribute('tabindex', '-1');
            main.focus();
            Utils.scrollToElement(main, 0);
          }
        });
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const search = document.querySelector('.md-search');
          if (search && search.classList.contains('md-search--active')) {
            const input = search.querySelector('.md-search__input');
            if (input) input.blur();
          }
        }
      });
    }

    return { init };
  })();

  function setup() {
    console.log("[MkDocs Premium] Initializing...");

    const P = window.MkDocsPremium;

    if (!P) return;

    // Progress
    P.Progress?.ReadingProgress?.create?.();
    P.Progress?.BackToTop?.create?.();
    P.Progress?.ReadingPosition?.create?.();

    // Animations
    P.Animations?.PageTransition?.init?.();
    P.Animations?.SectionReveal?.init?.();
    P.Animations?.TocSpy?.init?.();
    P.Animations?.AnchorNavigation?.init?.();
    P.Animations?.ScrollRestoration?.init?.();
    P.Animations?.ButtonRipple?.init?.();
    P.Animations?.LazyImages?.init?.();

    // Clipboard
    P.Clipboard?.CopyLink?.init?.();
    P.Clipboard?.CodeBlocks?.init?.();

    // Search
    P.Search?.init?.();

    console.log("[MkDocs Premium] Ready.");
  }

  // Initial page load
  document.addEventListener("DOMContentLoaded", setup);

  // MkDocs Instant Loading
  document.addEventListener("DOMContentSwitch", setup);

  // Material for MkDocs Instant Navigation
  if (typeof document$ !== "undefined") {
    document$.subscribe(setup);
  }
})();