// ============================================================
// Rock Foundations — main.js
// Vanilla JS for all non-Vue interactions
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- Dark Mode ----
  function initDarkMode() {
    const isDark = localStorage.getItem('rf-dark-mode') === 'true';
    if (isDark) document.body.classList.add('dark-mode');
    updateDarkModeIcons(isDark);
  }

  function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('rf-dark-mode', isDark);
    updateDarkModeIcons(isDark);
  }

  function updateDarkModeIcons(isDark) {
    document.querySelectorAll('.rf-dark-toggle-icon, .rf-topbar-dark-icon').forEach(function(el) {
      el.className = el.className.replace(/fa-(sun|moon)/, isDark ? 'fa-sun' : 'fa-moon');
    });
    document.querySelectorAll('.rf-dark-toggle-label').forEach(function(el) {
      el.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    });
  }

  document.querySelectorAll('.rf-dark-toggle, #rf-topbar-dark-toggle').forEach(function(el) {
    el.addEventListener('click', toggleDarkMode);
  });

  initDarkMode();

  // ---- Hamburger / Mobile Sidebar ----
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('rf-sidebar-overlay');
  const hamburger = document.getElementById('rf-hamburger');

  function openSidebar() {
    sidebar && sidebar.classList.add('rf-sidebar-open');
    overlay && overlay.classList.add('rf-sidebar-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar && sidebar.classList.remove('rf-sidebar-open');
    overlay && overlay.classList.remove('rf-sidebar-open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger && hamburger.addEventListener('click', openSidebar);
  overlay && overlay.addEventListener('click', closeSidebar);

  // ---- Sidebar: Collapsible Sections ----
  document.querySelectorAll('.rf-sidebar-section-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const expanded = header.getAttribute('aria-expanded') !== 'false';
      header.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      const items = header.nextElementSibling;
      if (items) items.classList.toggle('rf-sidebar-collapsed', expanded);
    });
  });

  // ---- Sidebar: Live Search ----
  const sidebarSearch = document.getElementById('rf-sidebar-search');
  if (sidebarSearch) {
    sidebarSearch.addEventListener('input', function() {
      const q = this.value.trim().toLowerCase();
      document.querySelectorAll('.rf-sidebar-item').forEach(function(item) {
        const text = item.textContent.toLowerCase();
        item.classList.toggle('rf-sidebar-hidden', q && !text.includes(q));
      });
      document.querySelectorAll('.rf-sidebar-section').forEach(function(section) {
        const items = section.querySelectorAll('.rf-sidebar-item:not(.rf-sidebar-hidden)');
        section.classList.toggle('rf-sidebar-hidden', q && items.length === 0);
      });
    });
  }

  // ---- Sidebar: Smooth Scroll + Active State ----
  document.querySelectorAll('.rf-sidebar-item a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveLink(this);
        if (window.innerWidth < 768) closeSidebar();
      }
    });
  });

  function setActiveLink(activeEl) {
    document.querySelectorAll('.rf-sidebar-item a').forEach(function(l) {
      l.classList.remove('rf-active');
    });
    activeEl.classList.add('rf-active');
  }

  // ---- Scroll Spy ----
  function initScrollSpy() {
    const sections = document.querySelectorAll('.rf-section[id]');
    const topOffset = 80;

    window.addEventListener('scroll', function() {
      let current = '';
      sections.forEach(function(section) {
        const top = section.getBoundingClientRect().top;
        if (top <= topOffset) current = section.id;
      });
      if (current) {
        document.querySelectorAll('.rf-sidebar-item a').forEach(function(link) {
          const href = link.getAttribute('href');
          link.classList.toggle('rf-active', href === '#' + current);
        });
      }
    }, { passive: true });
  }
  initScrollSpy();

  // ---- Topbar Nav Active State ----
  document.querySelectorAll('.rf-topbar-nav a').forEach(function(link) {
    link.addEventListener('click', function() {
      document.querySelectorAll('.rf-topbar-nav a').forEach(function(l) {
        l.classList.remove('rf-nav-active');
      });
      this.classList.add('rf-nav-active');
    });
  });

  // ---- Code Copy Buttons ----
  window.copyCode = function(btn) {
    const codeBlock = btn.closest('.rf-code-block');
    const code = codeBlock ? codeBlock.querySelector('code') : null;
    if (!code) return;

    const text = code.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showCopied(btn);
      });
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showCopied(btn);
    }
  };

  function showCopied(btn) {
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function() {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 2000);
  }

  // ---- Collapsible Panels ----
  document.querySelectorAll('.rf-panel-header').forEach(function(header) {
    const body = header.nextElementSibling;
    if (!body || !body.classList.contains('rf-panel-body')) return;

    header.setAttribute('aria-expanded', 'true');
    body.classList.add('is-open');

    header.addEventListener('click', function() {
      const isOpen = body.classList.contains('is-open');
      body.classList.toggle('is-open', !isOpen);
      header.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  // ---- Alert Dismiss ----
  document.querySelectorAll('.rf-alert-dismiss').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const alert = btn.closest('.rf-alert');
      if (alert) {
        alert.style.transition = 'opacity 0.2s ease, max-height 0.3s ease, margin 0.3s ease, padding 0.3s ease';
        alert.style.opacity = '0';
        alert.style.maxHeight = alert.offsetHeight + 'px';
        requestAnimationFrame(function() {
          alert.style.maxHeight = '0';
          alert.style.paddingTop = '0';
          alert.style.paddingBottom = '0';
          alert.style.marginTop = '0';
          alert.style.marginBottom = '0';
          alert.style.overflow = 'hidden';
        });
        setTimeout(function() { alert.remove(); }, 350);
      }
    });
  });

  // ---- Removable Tags ----
  document.querySelectorAll('.rf-tag-remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const tag = btn.closest('.rf-tag');
      if (tag) {
        tag.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        setTimeout(function() { tag.remove(); }, 200);
      }
    });
  });

  // ---- Sortable Tables ----
  document.querySelectorAll('.rf-table .rf-sortable').forEach(function(th) {
    th.addEventListener('click', function() {
      const table = th.closest('.rf-table');
      const headers = table.querySelectorAll('th');
      const colIdx = Array.from(headers).indexOf(th);
      const currentSort = th.classList.contains('rf-sort-asc') ? 'asc' : (th.classList.contains('rf-sort-desc') ? 'desc' : null);
      const newSort = currentSort === 'asc' ? 'desc' : 'asc';

      headers.forEach(function(h) {
        h.classList.remove('rf-sort-asc', 'rf-sort-desc');
        const icon = h.querySelector('.rf-sort-icon');
        if (icon) icon.className = 'fas fa-sort rf-sort-icon';
      });

      th.classList.add('rf-sort-' + newSort);
      const icon = th.querySelector('.rf-sort-icon');
      if (icon) icon.className = 'fas fa-sort-' + (newSort === 'asc' ? 'up' : 'down') + ' rf-sort-icon';

      sortTable(table, colIdx, newSort);
    });
  });

  function sortTable(table, colIdx, dir) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort(function(a, b) {
      const aText = (a.cells[colIdx] ? a.cells[colIdx].textContent.trim() : '');
      const bText = (b.cells[colIdx] ? b.cells[colIdx].textContent.trim() : '');
      const aNum = parseFloat(aText.replace(/[^0-9.-]/g, ''));
      const bNum = parseFloat(bText.replace(/[^0-9.-]/g, ''));
      const isNum = !isNaN(aNum) && !isNaN(bNum);
      const cmp = isNum ? (aNum - bNum) : aText.localeCompare(bText);
      return dir === 'asc' ? cmp : -cmp;
    });

    rows.forEach(function(row) { tbody.appendChild(row); });
  }

  // ---- Table Pagination ----
  document.querySelectorAll('.rf-paged-table').forEach(function(wrapper) {
    const table = wrapper.querySelector('.rf-table');
    const pagination = wrapper.querySelector('.rf-pagination');
    if (!table || !pagination) return;

    const rowsPerPage = parseInt(wrapper.dataset.perPage || '5');
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const totalRows = rows.length;
    let currentPage = 1;

    function showPage(page) {
      currentPage = page;
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      rows.forEach(function(row, i) {
        row.style.display = (i >= start && i < end) ? '' : 'none';
      });

      updatePaginationInfo(pagination, start + 1, Math.min(end, totalRows), totalRows);
      updatePageButtons(pagination, page, Math.ceil(totalRows / rowsPerPage));
    }

    pagination.addEventListener('click', function(e) {
      const btn = e.target.closest('.rf-page-btn');
      if (!btn || btn.disabled) return;

      const action = btn.dataset.action;
      const totalPages = Math.ceil(totalRows / rowsPerPage);

      if (action === 'prev') showPage(Math.max(1, currentPage - 1));
      else if (action === 'next') showPage(Math.min(totalPages, currentPage + 1));
      else if (btn.dataset.page) showPage(parseInt(btn.dataset.page));
    });

    showPage(1);
  });

  function updatePaginationInfo(pagination, from, to, total) {
    const info = pagination.querySelector('.rf-pagination-info');
    if (info) info.textContent = 'Showing ' + from + '–' + to + ' of ' + total + ' results';
  }

  function updatePageButtons(pagination, current, total) {
    const controls = pagination.querySelector('.rf-pagination-controls');
    if (!controls) return;

    const prevBtn = controls.querySelector('[data-action="prev"]');
    const nextBtn = controls.querySelector('[data-action="next"]');
    if (prevBtn) prevBtn.disabled = current === 1;
    if (nextBtn) nextBtn.disabled = current === total;

    controls.querySelectorAll('.rf-page-btn[data-page]').forEach(function(btn) {
      const page = parseInt(btn.dataset.page);
      btn.classList.toggle('rf-page-active', page === current);
    });
  }

  // ---- Table: Select All Checkbox ----
  document.querySelectorAll('.rf-table-select-all').forEach(function(selectAll) {
    selectAll.addEventListener('change', function() {
      const table = selectAll.closest('.rf-table');
      table.querySelectorAll('.rf-table-row-check').forEach(function(cb) {
        cb.checked = selectAll.checked;
      });
    });
  });

  // ---- Vanilla JS Tabs ----
  document.querySelectorAll('.rf-tabs').forEach(function(tabsEl) {
    const buttons = tabsEl.querySelectorAll('.rf-tab-btn');
    const panes   = tabsEl.querySelectorAll('.rf-tab-pane');

    buttons.forEach(function(btn, i) {
      btn.addEventListener('click', function() {
        buttons.forEach(function(b) {
          b.classList.remove('rf-tab-active');
          b.setAttribute('aria-selected', 'false');
        });
        panes.forEach(function(p) { p.classList.remove('rf-tab-pane-active'); });

        btn.classList.add('rf-tab-active');
        btn.setAttribute('aria-selected', 'true');
        if (panes[i]) panes[i].classList.add('rf-tab-pane-active');
      });
    });

    // Activate first tab by default
    if (buttons[0]) buttons[0].click();
  });

  // ---- Pills Navigation ----
  document.querySelectorAll('.rf-pills').forEach(function(pillsEl) {
    pillsEl.querySelectorAll('.rf-pill').forEach(function(pill) {
      pill.addEventListener('click', function() {
        pillsEl.querySelectorAll('.rf-pill').forEach(function(p) { p.classList.remove('rf-pill-active'); });
        pill.classList.add('rf-pill-active');
      });
    });
  });

  // ---- Giving Widget: Amount Buttons ----
  document.querySelectorAll('.rf-giving-amounts').forEach(function(amountsEl) {
    const customInput = amountsEl.parentNode.querySelector('.rf-giving-custom-input');
    const totalAmount = amountsEl.parentNode.querySelector('.rf-giving-total-amount');
    const freq = amountsEl.parentNode.querySelector('.rf-freq-tab.rf-freq-active');

    amountsEl.querySelectorAll('.rf-amount-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        amountsEl.querySelectorAll('.rf-amount-btn').forEach(function(b) { b.classList.remove('rf-amount-active'); });
        btn.classList.add('rf-amount-active');

        if (btn.dataset.custom === 'true') {
          customInput && customInput.classList.add('rf-visible');
        } else {
          customInput && customInput.classList.remove('rf-visible');
          updateGivingTotal(btn.dataset.amount, totalAmount, amountsEl);
        }
      });
    });

    // Custom amount input
    if (customInput) {
      const input = customInput.querySelector('input');
      input && input.addEventListener('input', function() {
        updateGivingTotal(this.value, totalAmount, amountsEl);
      });
    }
  });

  function updateGivingTotal(amount, totalEl, amountsEl) {
    if (!totalEl) return;
    const freqTab = amountsEl && amountsEl.parentNode.querySelector('.rf-freq-tab.rf-freq-active');
    const freqText = freqTab ? freqTab.textContent.trim() : 'one-time';
    const num = parseFloat(amount) || 0;
    const freqMap = { 'One-Time': '', 'Weekly': ' / week', 'Monthly': ' / month' };
    const suffix = freqMap[freqText] || '';
    totalEl.textContent = '$' + num.toFixed(0) + suffix;
  }

  // ---- Giving Widget: Frequency Tabs ----
  document.querySelectorAll('.rf-freq-tabs').forEach(function(freqEl) {
    freqEl.querySelectorAll('.rf-freq-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        freqEl.querySelectorAll('.rf-freq-tab').forEach(function(t) { t.classList.remove('rf-freq-active'); });
        tab.classList.add('rf-freq-active');
        // Re-update total
        const widget = freqEl.closest('.rf-giving-widget');
        if (widget) {
          const activeAmount = widget.querySelector('.rf-amount-btn.rf-amount-active');
          const totalEl = widget.querySelector('.rf-giving-total-amount');
          const amountsEl = widget.querySelector('.rf-giving-amounts');
          if (activeAmount && totalEl && amountsEl) {
            const customInput = widget.querySelector('.rf-giving-custom-input');
            const customActive = customInput && customInput.classList.contains('rf-visible');
            if (customActive) {
              const val = customInput.querySelector('input') ? customInput.querySelector('input').value : 0;
              updateGivingTotal(val, totalEl, amountsEl);
            } else {
              updateGivingTotal(activeAmount.dataset.amount, totalEl, amountsEl);
            }
          }
        }
      });
    });
  });

  // ---- Prayer Card: Read More ----
  document.querySelectorAll('.rf-prayer-read-more').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const text = btn.previousElementSibling;
      if (!text) return;
      const expanded = text.classList.contains('rf-prayer-expanded');
      text.classList.toggle('rf-prayer-expanded', !expanded);
      btn.textContent = expanded ? 'Read more' : 'Read less';
    });
  });

  // ---- Hero: Copy CDN Link Button ----
  const cdnBtn = document.getElementById('rf-copy-cdn');
  if (cdnBtn) {
    cdnBtn.addEventListener('click', function() {
      const cdnLink = '<link rel="stylesheet/less" href="less/main.less">';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(cdnLink).then(function() {
          cdnBtn.textContent = 'Copied!';
          setTimeout(function() { cdnBtn.textContent = 'Copy CDN Link'; }, 2000);
        });
      }
    });
  }

  // ---- Color swatch sections: Generate from token map ----
  function buildSwatchSection(containerId, swatches) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    swatches.forEach(function(s) {
      const card = document.createElement('div');
      card.className = 'rf-swatch-card';
      card.innerHTML =
        '<div class="rf-swatch-color" style="background:' + s.hex + ';"></div>' +
        '<div class="rf-swatch-info">' +
        '<span class="rf-swatch-name">@' + s.name + '</span>' +
        '<span class="rf-swatch-hex">' + s.hex + '</span>' +
        '</div>';
      container.appendChild(card);
    });
  }

  buildSwatchSection('swatches-brand', [
    { name: 'color-primary',       hex: '#1E6EBF' },
    { name: 'color-primary-dark',  hex: '#155499' },
    { name: 'color-primary-light', hex: '#EBF4FF' },
    { name: 'color-primary-soft',  hex: '#DBEAFE' },
  ]);

  buildSwatchSection('swatches-interface', [
    { name: 'color-interface-strongest', hex: '#0D1117' },
    { name: 'color-interface-strong',    hex: '#1F2937' },
    { name: 'color-interface-medium',    hex: '#6B7280' },
    { name: 'color-interface-soft',      hex: '#D1D5DB' },
    { name: 'color-interface-softer',    hex: '#F3F4F6' },
    { name: 'color-interface-softest',   hex: '#FAFAFA' },
  ]);

  buildSwatchSection('swatches-semantic', [
    { name: 'color-success-strong', hex: '#15803D' },
    { name: 'color-success-soft',   hex: '#DCFCE7' },
    { name: 'color-warning-strong', hex: '#B45309' },
    { name: 'color-warning-soft',   hex: '#FEF3C7' },
    { name: 'color-danger-strong',  hex: '#B91C1C' },
    { name: 'color-danger-soft',    hex: '#FEE2E2' },
    { name: 'color-info-strong',    hex: '#0369A1' },
    { name: 'color-info-soft',      hex: '#E0F2FE' },
  ]);

  // ---- Avatar color hash helper (for demo) ----
  window.rfAvatarColor = function(name) {
    const colors = ['rf-avatar-blue','rf-avatar-green','rf-avatar-amber','rf-avatar-teal','rf-avatar-purple','rf-avatar-pink','rf-avatar-indigo'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // ---- Topbar: Smooth scroll for section anchors ----
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
