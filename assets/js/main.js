/* ============================================
   کافه آرا — جاوااسکریپت مشترک
   main.js
   ============================================ */

/* ══════════════════════════════════════
   ناوبار — اسکرول + همبرگر
══════════════════════════════════════ */
(function initNavbar() {
  const navbar  = document.querySelector('.navbar');
  const toggle  = document.querySelector('.nav-toggle');
  const mobile  = document.querySelector('.nav-mobile');

  if (!navbar) return;

  /* اسکرول → سایه */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* همبرگر */
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const isOpen = mobile.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      /* انیمیشن خطوط همبرگر */
      const lines = toggle.querySelectorAll('span');
      if (isOpen) {
        lines[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        lines[1].style.opacity   = '0';
        lines[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        lines.forEach(l => { l.style.transform = ''; l.style.opacity = ''; });
      }
    });

    /* بستن با کلیک بیرون */
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobile.contains(e.target)) {
        mobile.classList.remove('open');
        toggle.querySelectorAll('span').forEach(l => {
          l.style.transform = ''; l.style.opacity = '';
        });
      }
    });
  }

  /* Active link */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ══════════════════════════════════════
   Toast — نوتیفیکیشن
══════════════════════════════════════ */
function showToast(msg, type = 'default', duration = 3000) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  /* force reflow */
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ══════════════════════════════════════
   Scroll Reveal — انیمیشن ظهور
══════════════════════════════════════ */
(function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  /* استایل اولیه */
  els.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    const delay = el.dataset.delay || 0;
    el.style.transitionDelay = delay + 'ms';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════
   Counter — شمارنده آماری
══════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString('fa-IR');
    if (current < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

(function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ══════════════════════════════════════
   Smooth Scroll — لینک‌های لنگر
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
    window.scrollTo({ top, behavior: 'smooth' });

    /* بستن منوی موبایل */
    document.querySelector('.nav-mobile')?.classList.remove('open');
  });
});

/* ══════════════════════════════════════
   Ripple — افکت موج روی دکمه‌ها
══════════════════════════════════════ */
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const r = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.style.cssText = `
    position:absolute;border-radius:50%;
    width:${size}px;height:${size}px;
    top:${e.clientY - rect.top - size/2}px;
    left:${e.clientX - rect.left - size/2}px;
    background:rgba(255,255,255,0.25);
    transform:scale(0);animation:ripple .5s linear;
    pointer-events:none;
  `;
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
});

/* استایل انیمیشن ریپل */
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple{to{transform:scale(2.5);opacity:0}}`;
document.head.appendChild(rippleStyle);

/* ══════════════════════════════════════
   Back to Top — دکمه بازگشت
══════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.opacity   = window.scrollY > 400 ? '1' : '0';
    btn.style.transform = window.scrollY > 400
      ? 'translateY(0)' : 'translateY(16px)';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ══════════════════════════════════════
   سال جاری در فوتر
══════════════════════════════════════ */
const yearEl = document.getElementById('currentYear');
if (yearEl) {
  const d = new Date();
  yearEl.textContent = d.toLocaleDateString('fa-IR', { year: 'numeric' }).replace(/[^۰-۹]/g, '');
}