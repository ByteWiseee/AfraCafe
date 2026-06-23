/* ============================================
   کافه آرا — جاوااسکریپت منو
   menu.js
   ============================================ */

/* ══════════════════════════════════════
   داده سبد خرید
══════════════════════════════════════ */
const cart = {
  items: {},   /* { name: { price, qty } } */
  coupon: null,

  add(name, price) {
    if (this.items[name]) {
      this.items[name].qty++;
    } else {
      this.items[name] = { price: parseInt(price), qty: 1 };
    }
    this.render();
  },

  remove(name) {
    if (!this.items[name]) return;
    this.items[name].qty--;
    if (this.items[name].qty <= 0) delete this.items[name];
    this.render();
  },

  clear() {
    this.items = {};
    this.coupon = null;
    this.render();
  },

  get totalQty() {
    return Object.values(this.items).reduce((s, i) => s + i.qty, 0);
  },

  get subtotal() {
    return Object.values(this.items).reduce((s, i) => s + i.price * i.qty, 0);
  },

  get discount() {
    if (!this.coupon) return 0;
    return Math.round(this.subtotal * this.coupon.pct);
  },

  get total() {
    return this.subtotal - this.discount;
  },

  render() {
    const isEmpty   = this.totalQty === 0;
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItems = document.getElementById('cartItems');
    const cartFooter= document.getElementById('cartFooter');
    const cartCount = document.getElementById('cartCount');
    const mobileCount = document.getElementById('mobileCartCount');

    /* شمارنده */
    const qtyText = this.totalQty.toLocaleString('fa-IR');
    if (cartCount)   cartCount.textContent  = qtyText;
    if (mobileCount) mobileCount.textContent = qtyText;

    /* نمایش/پنهان */
    if (cartEmpty)  cartEmpty.style.display  = isEmpty ? 'block' : 'none';
    if (cartItems)  cartItems.style.display  = isEmpty ? 'none'  : 'flex';
    if (cartFooter) cartFooter.style.display = isEmpty ? 'none'  : 'block';

    if (isEmpty) return;

    /* رندر آیتم‌ها */
    cartItems.innerHTML = Object.entries(this.items).map(([name, { price, qty }]) => `
      <div class="ci-item">
        <div class="ci-name">${name}</div>
        <div class="ci-controls">
          <button class="ci-btn" data-action="remove" data-name="${name}">−</button>
          <span class="ci-qty">${qty.toLocaleString('fa-IR')}</span>
          <button class="ci-btn" data-action="add" data-name="${name}" data-price="${price}">+</button>
        </div>
        <div class="ci-price">${(price * qty).toLocaleString('fa-IR')} ت</div>
      </div>
    `).join('');

    /* مبالغ */
    const fmt = n => n.toLocaleString('fa-IR') + ' تومان';
    document.getElementById('cartSubtotal').textContent = fmt(this.subtotal);
    document.getElementById('cartDiscount').textContent = this.discount > 0
      ? '− ' + fmt(this.discount) : 'ندارد';
    document.getElementById('cartTotal').textContent    = fmt(this.total);

    /* رویداد دکمه‌های داخل سبد */
    cartItems.querySelectorAll('.ci-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const { action, name, price } = btn.dataset;
        action === 'add' ? cart.add(name, price) : cart.remove(name);
      });
    });
  }
};

/* ══════════════════════════════════════
   فیلتر دسته‌بندی
══════════════════════════════════════ */
(function initCatTabs() {
  const tabs  = document.querySelectorAll('.cat-tab');
  const items = () => document.querySelectorAll('.menu-item');
  const title = document.getElementById('catTitle');
  const count = document.getElementById('catCount');
  const labels = {
    all:'همه آیتم‌ها', drink:'نوشیدنی‌ها',
    breakfast:'صبحانه', main:'غذای اصلی',
    dessert:'دسرها', special:'پیشنهادهای ویژه'
  };

  function filterItems(cat) {
    let visible = 0;
    items().forEach((item, i) => {
      const match = cat === 'all' || item.dataset.cat === cat;
      if (match) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'translateY(16px)';
        item.style.transition = 'none';
        setTimeout(() => {
          item.style.transition = 'opacity .35s ease, transform .35s ease';
          item.style.opacity    = '1';
          item.style.transform  = 'translateY(0)';
        }, visible * 45);
        visible++;
      } else {
        item.style.display = 'none';
      }
    });

    /* پیام خالی */
    const empty = document.getElementById('emptyState');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';

    /* آپدیت عنوان و تعداد */
    if (title) title.textContent = labels[cat] || 'آیتم‌ها';
    if (count) count.textContent = visible.toLocaleString('fa-IR') + ' آیتم';
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      filterItems(this.dataset.cat);
      /* ریست سرچ */
      const s = document.getElementById('menuSearch');
      if (s) s.value = '';
    });
  });

  /* اجرای اولیه */
  filterItems('all');
})();

/* ══════════════════════════════════════
   جستجو
══════════════════════════════════════ */
(function initSearch() {
  const input = document.getElementById('menuSearch');
  if (!input) return;

  input.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    const items = document.querySelectorAll('.menu-item');
    let visible = 0;

    /* غیرفعال‌کردن تب‌ها هنگام جستجو */
    if (q) {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    }

    items.forEach(item => {
      const name = item.dataset.name?.toLowerCase() || '';
      const desc = item.querySelector('.mi-desc')?.textContent.toLowerCase() || '';
      const match = !q || name.includes(q) || desc.includes(q);
      item.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    const empty = document.getElementById('emptyState');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';

    const count = document.getElementById('catCount');
    if (count) count.textContent = visible.toLocaleString('fa-IR') + ' آیتم';

    const title = document.getElementById('catTitle');
    if (title) title.textContent = q ? `نتایج جستجو برای «${q}»` : 'همه آیتم‌ها';
  });
})();

/* ══════════════════════════════════════
   مرتب‌سازی
══════════════════════════════════════ */
(function initSort() {
  const select = document.getElementById('menuSort');
  if (!select) return;

  select.addEventListener('change', function () {
    const grid  = document.getElementById('itemsGrid');
    if (!grid) return;
    const items = [...grid.querySelectorAll('.menu-item')];

    items.sort((a, b) => {
      const pa = parseInt(a.dataset.price) || 0;
      const pb = parseInt(b.dataset.price) || 0;
      const na = a.dataset.name || '';
      const nb = b.dataset.name || '';
      if (this.value === 'price-asc')  return pa - pb;
      if (this.value === 'price-desc') return pb - pa;
      if (this.value === 'name')       return na.localeCompare(nb, 'fa');
      return 0;
    });

    /* انیمیشن جابجایی */
    items.forEach((item, i) => {
      item.style.opacity   = '0';
      item.style.transform = 'scale(0.97)';
      grid.appendChild(item);
      setTimeout(() => {
        item.style.transition = 'opacity .3s ease, transform .3s ease';
        item.style.opacity    = '1';
        item.style.transform  = 'scale(1)';
      }, i * 40);
    });
  });
})();

/* ══════════════════════════════════════
   دکمه افزودن به سبد
══════════════════════════════════════ */
(function initAddBtns() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.mi-btn');
    if (!btn) return;

    const { name, price } = btn.dataset;
    if (!name || !price) return;

    cart.add(name, price);

    /* انیمیشن دکمه */
    const icon = btn.querySelector('.mi-btn-icon');
    const orig = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = '<span>✓</span> اضافه شد';
    btn.disabled  = true;

    setTimeout(() => {
      btn.innerHTML  = orig;
      btn.classList.remove('added');
      btn.disabled   = false;
    }, 1800);

    showToast(`${name} به سبد اضافه شد ✓`, 'success');

    /* انیمیشن تکان سبد */
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
      sidebar.style.transform = 'scale(1.01)';
      setTimeout(() => sidebar.style.transform = '', 200);
    }
  });
})();

/* ══════════════════════════════════════
   پاک کردن سبد
══════════════════════════════════════ */
(function initClearCart() {
  const btn = document.getElementById('clearCart');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (cart.totalQty === 0) return;
    cart.clear();
    showToast('سبد خرید پاک شد', 'default');
  });
})();

/* ══════════════════════════════════════
   کد تخفیف
══════════════════════════════════════ */
(function initCoupon() {
  const btn   = document.getElementById('couponBtn');
  const input = document.getElementById('couponInput');
  if (!btn || !input) return;

  const COUPONS = {
    'ARA10':  { pct: 0.10, label: '۱۰٪' },
    'ARA20':  { pct: 0.20, label: '۲۰٪' },
    'COFFEE': { pct: 0.15, label: '۱۵٪' },
  };

  btn.addEventListener('click', () => {
    const code = input.value.trim().toUpperCase();
    if (!code) {
      showToast('کد تخفیف را وارد کنید', 'error');
      return;
    }
    const coupon = COUPONS[code];
    if (coupon) {
      cart.coupon = coupon;
      cart.render();
      showToast(`کد تخفیف ${coupon.label} اعمال شد 🎉`, 'success');
      btn.textContent = '✓';
      btn.style.background = '#2a9d5c';
      btn.style.color      = '#fff';
      btn.style.borderColor= '#2a9d5c';
      input.disabled = true;
    } else {
      showToast('کد تخفیف نامعتبر است', 'error');
      input.style.borderColor = '#e44';
      setTimeout(() => input.style.borderColor = '', 2000);
    }
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });
})();

/* ══════════════════════════════════════
   سبد موبایل (باز/بسته)
══════════════════════════════════════ */
(function initMobileCart() {
  const floatBtn = document.getElementById('mobileCartBtn');
  const sidebar  = document.getElementById('cartSidebar');
  if (!floatBtn || !sidebar) return;

  floatBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  /* بستن با کلیک بیرون */
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !floatBtn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
})();

/* ══════════════════════════════════════
   رندر اولیه سبد
══════════════════════════════════════ */
cart.render();