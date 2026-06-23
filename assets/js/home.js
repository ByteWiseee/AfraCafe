/* ============================================
   کافه آرا — جاوااسکریپت صفحه اصلی
   home.js
   ============================================ */

/* ══════════════════════════════════════
   فیلتر منو
══════════════════════════════════════ */
(function initMenuFilter() {
  const tabs  = document.querySelectorAll('.m-tab');
  const cards = document.querySelectorAll('.menu-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      /* آپدیت تب فعال */
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const cat = this.dataset.cat;

      cards.forEach((card, i) => {
        const match = cat === 'all' || card.dataset.cat === cat;
        if (match) {
          card.style.display = 'block';
          /* انیمیشن ظهور پله‌ای */
          card.style.opacity   = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'opacity .35s ease, transform .35s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          }, i * 40);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ══════════════════════════════════════
   دکمه افزودن به سبد
══════════════════════════════════════ */
(function initCartBtns() {
  const btns = document.querySelectorAll('.mc-btn');
  if (!btns.length) return;

  /* سبد در حافظه */
  const cart = {};

  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      const name  = this.dataset.name;
      cart[name]  = (cart[name] || 0) + 1;

      /* انیمیشن دکمه */
      this.textContent = '✓';
      this.style.background   = 'var(--gold)';
      this.style.color        = '#fff';
      this.style.borderColor  = 'var(--gold)';

      setTimeout(() => {
        this.textContent = '+';
        this.style.background  = '';
        this.style.color       = '';
        this.style.borderColor = '';
      }, 1800);

      /* آپدیت شمارنده دکمه شناور */
      updateFloatBadge();

      showToast(`${name} به سبد اضافه شد ✓`, 'success');
    });
  });

  function updateFloatBadge() {
    const total = Object.values(cart).reduce((a, b) => a + b, 0);
    const badge = document.querySelector('.float-btn .fb-badge');
    if (badge) {
      badge.textContent = total > 0 ? `${total} آیتم` : 'جدید';
    }
  }
})();

/* ══════════════════════════════════════
   گالری — کلیک
══════════════════════════════════════ */
(function initGallery() {
  document.querySelectorAll('.g-item').forEach(item => {
    item.addEventListener('click', () => {
      const label = item.querySelector('.g-overlay span')?.textContent || '';
      showToast(`گالری کامل به زودی... (${label})`, 'default');
    });
  });
})();

/* ══════════════════════════════════════
   CTA — عضویت خبرنامه
══════════════════════════════════════ */
(function initCTA() {
  const btn   = document.getElementById('ctaBtn');
  const input = document.getElementById('ctaInput');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) {
      showToast('لطفاً ایمیل یا شماره خود را وارد کنید', 'error');
      input.focus();
      input.style.borderColor = '#e44';
      setTimeout(() => input.style.borderColor = '', 2000);
      return;
    }
    btn.textContent        = '✓ عضو شدید!';
    btn.style.background   = '#2a9d5c';
    showToast('عضویت شما با موفقیت انجام شد 🎉', 'success');
    setTimeout(() => {
      btn.textContent      = 'عضویت رایگان';
      btn.style.background = '';
      input.value          = '';
    }, 3000);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });
})();

/* ══════════════════════════════════════
   Parallax خفیف برای هیرو
══════════════════════════════════════ */
(function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.25}px)`;
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════
   Hover روی کارت‌های آماری
══════════════════════════════════════ */
(function initStatCards() {
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-5px) scale(1.03)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });
})();