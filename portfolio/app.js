/* ==========================================================================
   KSHITIJ SHAH — EDITORIAL PORTFOLIO APPLICATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME SWITCHER (DARK / LIGHT) ---
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  function applyTheme(isLight) {
    if (isLight) {
      document.body.classList.add('light-theme');
      if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      }
    } else {
      document.body.classList.remove('light-theme');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }
  }

  // Load initial theme from localStorage or system preference
  const savedTheme = localStorage.getItem('ks_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    applyTheme(true);
  } else {
    applyTheme(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isNowLight = !document.body.classList.contains('light-theme');
      applyTheme(isNowLight);
      localStorage.setItem('ks_theme', isNowLight ? 'light' : 'dark');
    });
  }


  // --- 2. FLOATING SCROLL PERCENTAGE & BACK TO TOP ---
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const scrollPercentageEl = document.getElementById('scroll-percentage');

  function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

    if (scrollPercentageEl) {
      scrollPercentageEl.textContent = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // --- 3. PROJECT FILTERING & REAL-TIME SEARCH ---
  const searchInput = document.getElementById('site-search');
  const clearSearchBtn = document.getElementById('clear-search');
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.editorial-card');
  const searchStatusBar = document.getElementById('search-status-bar');
  const searchStatusText = document.getElementById('search-status-text');
  const resetFilterBtn = document.getElementById('reset-filter-btn');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    const query = searchQuery.trim().toLowerCase();

    cards.forEach(card => {
      const categoryStr = (card.getAttribute('data-category') || '').toLowerCase();
      const tagsStr = (card.getAttribute('data-tags') || '').toLowerCase();
      const textContent = card.innerText.toLowerCase();

      // Check category match
      const matchesCategory = (activeCategory === 'all') || categoryStr.includes(activeCategory);

      // Check search query match
      const matchesSearch = !query || textContent.includes(query) || tagsStr.includes(query);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Update status banner
    if (searchStatusBar) {
      if (query || activeCategory !== 'all') {
        searchStatusBar.style.display = 'flex';
        let statusMsg = `Showing ${visibleCount} result${visibleCount === 1 ? '' : 's'}`;
        if (query) statusMsg += ` matching "${query}"`;
        if (activeCategory !== 'all') statusMsg += ` in category [${activeCategory}]`;
        if (searchStatusText) searchStatusText.textContent = statusMsg;
      } else {
        searchStatusBar.style.display = 'none';
      }
    }
  }

  // Filter pill click handlers
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? 'inline-block' : 'none';
      }
      applyFilters();
    });
  }

  // Clear search button handler
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      applyFilters();
    });
  }

  // Reset filter button handler
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      activeCategory = 'all';
      filterPills.forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-filter') === 'all');
      });
      applyFilters();
    });
  }

  // Tagline interactive links in Hero
  const taglineLinks = document.querySelectorAll('.tagline-link');
  taglineLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetFilter = link.getAttribute('data-filter');
      if (targetFilter) {
        activeCategory = targetFilter;
        filterPills.forEach(p => {
          p.classList.toggle('active', p.getAttribute('data-filter') === targetFilter);
        });
        applyFilters();
      }
    });
  });


  // --- 4. COPY EMAIL TO CLIPBOARD ---
  const copyEmailTrigger = document.getElementById('copy-email-trigger');
  const emailAddress = document.getElementById('email-address');
  const copyStatus = document.getElementById('copy-status');

  if (copyEmailTrigger) {
    copyEmailTrigger.addEventListener('click', () => {
      const email = 'shahkshtitiz9865@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (copyStatus) {
          const originalText = copyStatus.textContent;
          copyStatus.textContent = 'copied!';
          copyStatus.style.background = 'var(--accent-emerald)';
          copyStatus.style.color = '#ffffff';

          setTimeout(() => {
            copyStatus.textContent = originalText;
            copyStatus.style.background = '';
            copyStatus.style.color = '';
          }, 2000);
        }
      });
    });
  }

});
