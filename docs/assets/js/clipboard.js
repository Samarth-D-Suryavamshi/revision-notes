/**
 * MkDocs Material Premium — Clipboard & Copy Enhancements
 */

(function() {
  'use strict';

  window.MkDocsPremium = window.MkDocsPremium || {};
  const C = window.MkDocsPremium.CONFIG;

  window.MkDocsPremium.Clipboard = {

    // ------------------------------------------------------------------
    // Copy Link Animation (heading anchors)
    // ------------------------------------------------------------------
    CopyLink: {
      init() {
        document.addEventListener('click', async (e) => {
          const link = e.target.closest('.headerlink');
          if (!link) return;

          e.preventDefault();
          const href = link.href;

          try {
            await navigator.clipboard.writeText(href);
            this.showToast('Link copied to clipboard');
          } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = href;
            textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;z-index:-1;';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('Link copied to clipboard');
          }
        });
      },

      showToast(message) {
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
    },

    // ------------------------------------------------------------------
    // Code Block Enhancements — deduplicated with dataset guard
    // ------------------------------------------------------------------
    CodeBlocks: {
      init() {
        document.querySelectorAll(C.preSelector).forEach(pre => {
          if (pre.dataset.enhanced) return;
          pre.dataset.enhanced = 'true';
          this.enhance(pre);
        });
      },

      enhance(pre) {
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
        window.addEventListener('resize', window.MkDocsPremium.Utils.debounce(checkOverflow, 200));

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
    }
  };
})();