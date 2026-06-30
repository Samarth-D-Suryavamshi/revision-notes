/**
 * MkDocs Material Premium — Search Enhancements
 * Visual polish for search dialog. Avoids keyboard conflicts with MkDocs Material.
 */

(function() {
  'use strict';

  window.MkDocsPremium = window.MkDocsPremium || {};

  window.MkDocsPremium.Search = {
    init() {
      const searchInner = document.querySelector('.md-search__inner');
      const search = document.querySelector('.md-search');

      if (!searchInner || !search) return;

      // Fix clipping
      search.style.overflow = "visible";
      searchInner.style.overflow = "visible";
      

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            searchInner.classList.toggle(
              'is-visible',
              searchInner.classList.contains('md-search__inner--active')
            );
          }
        });
      });

      observer.observe(searchInner, { attributes: true });

      // NOTE: Custom ArrowUp/ArrowDown navigation intentionally omitted
      // to avoid conflicting with MkDocs Material's built-in search keyboard handling.
    }
  };

  

}

)(); 