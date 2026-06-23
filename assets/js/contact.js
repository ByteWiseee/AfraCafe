/* ============================================
   کافه آرا — جاوااسکریپت تماس
   contact.js
   ============================================ */

/* ══════════════════════════════════════
   اعتبارسنجی فرم تماس
══════════════════════════════════════ */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const submit  = document.getElementById('cfSubmit');
  if (!form) return;

  /* قوانین اعتبارسنجی */
  const rules = {
    'cf-name':    { required: true, minLen: 3,  msg: 'نام باید حداقل ۳ کاراکتر باشد' },
    'cf-phone':   { required: true, pattern: /^(\+98|0)?9\d{9}$|^\d{2,3}-\d{6,8}$|^\d{8,11}$/, msg: 'شماره تماس معتبر نیست' },
    'cf-email':   { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'ایمیل معتبر نیست' },
    'cf-subject': { required: true, msg: 'لطفاً موضوع را انتخاب کنید' },
    'cf-message': { required: true, minLen: 10, msg: 'پیام باید حداقل ۱۰ کاراکتر باشد' },
  };

  function validateField(id) {
    const el    = document.getElementById(id);
    const errEl = document.getElementById('err-' + id.replace('cf-', ''));
    const rule  = rules[id];
    if (!el || !rule) return true;

    const val = el.value.trim();
    let error = '';

    if (rule.required && !val) {
      error = 'این فیلد الزامی است';
    } else if (val && rule.minLen && val.length < rule.minLen) {
      error = rule.msg;
    } else if (val && rule.pattern && !rule.pattern.test(val)) {
      error = rule.msg;
    }

    if (errEl) errEl.textContent = error;
    el.classList.toggle('invalid', !!error);
    el.classList.toggle('valid',   !error && !!val);
    return !error;
  }

  /* اعتبارسنجی زنده */
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur',  () => validateField(id));
    el.addEventListener('input', () => {
      if (el.classList.contains('invalid')) validateField(id);
    });
  });

  /* شمارنده کاراکتر پیام */
  const msgEl    = document.getElementById('cf-message');
  const charCount= document.getElementById('charCount');
  if (msgEl && charCount) {
    msgEl.addEventListener('input', () => {
      const len = msgEl.value.length;
      charCount.textContent = len.toLocaleString('fa-IR');
      charCount.style.color = len > 450 ? '#e44' : len > 350 ? '#c8922a' : '';
      if (len > 500) msgEl.value = msgEl.value.slice(0, 500);
    });
  }

  /* ارسال فرم */
  form.addEventListener('submit', e => {
    e.preventDefault();

    /* اعتبارسنجی همه فیلدها */
    let valid = true;
    Object.keys(rules).forEach(id => {
      if (!validateField(id)) valid = false;
    });

    /* چک چک‌باکس */
    const agree   = document.getElementById('cf-agree');
    const errAgree= document.getElementById('err-agree');
    if (agree && !agree.checked) {
      if (errAgree) errAgree.textContent = 'پذیرش قوانین الزامی است';
      valid = false;
    } else if (errAgree) {
      errAgree.textContent = '';
    }

    if (!valid) {
      showToast('لطفاً خطاهای فرم را برطرف کنید', 'error');
      /* اسکرول به اولین خطا */
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    /* شبیه‌سازی ارسال */
    const btnText = submit.querySelector('.cs-text');
    const btnIcon = submit.querySelector('.cs-icon');
    submit.disabled = true;
    if (btnText) btnText.textContent = 'در حال ارسال...';
    if (btnIcon) btnIcon.textContent = '⏳';

    setTimeout(() => {
      submit.disabled = false;
      submit.style.background = '#2a9d5c';
      if (btnText) btnText.textContent = 'پیام ارسال شد!';
      if (btnIcon) btnIcon.textContent = '✓';
      showToast('پیام شما با موفقیت ارسال شد. به زودی پاسخ می‌دهیم 🙏', 'success', 4000);
      form.reset();
      if (charCount) charCount.textContent = '۰';
      /* ریست استایل فیلدها */
      form.querySelectorAll('.valid,.invalid').forEach(el => {
        el.classList.remove('valid', 'invalid');
      });
      setTimeout(() => {
        submit.style.background = '';
        if (btnText) btnText.textContent = 'ارسال پیام';
        if (btnIcon) btnIcon.textContent = '←';
      }, 4000);
    }, 1800);
  });
})();

/* ══════════════════════════════════════
   تب‌های نقشه + شعبه‌ها
══════════════════════════════════════ */
(function initBranchTabs() {
  const mapTabs   = document.querySelectorAll('.map-tab');
  const branchCards = document.querySelectorAll('.branch-card');
  const mpName    = document.getElementById('mpName');
  const mpAddr    = document.getElementById('mpAddr');

  const branchData = {
    '1': { name: 'شعبه ولیعصر',  addr: 'ولیعصر، بالاتر از ونک، پلاک ۱۲۳' },
    '2': { name: 'شعبه نیاوران', addr: 'نیاوران، خیابان باهنر، پلاک ۴۵' },
  };

  function selectBranch(id) {
    /* آپدیت تب‌های نقشه */
    mapTabs.forEach(t => t.classList.toggle('active', t.dataset.branch === id));

    /* آپدیت کارت‌های شعبه */
    branchCards.forEach(c => c.classList.toggle('bc-active', c.dataset.branch === id));

    /* آپدیت نقشه */
    const data = branchData[id];
    if (data && mpName && mpAddr) {
      mpName.textContent = data.name;
      mpAddr.textContent = data.addr;
    }
  }

  mapTabs.forEach(tab => {
    tab.addEventListener('click', () => selectBranch(tab.dataset.branch));
  });

  branchCards.forEach(card => {
    card.addEventListener('click', () => selectBranch(card.dataset.branch));
  });
})();

/* ══════════════════════════════════════
   آکاردئون سوالات متداول
══════════════════════════════════════ */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      /* بستن همه */
      items.forEach(i => i.classList.remove('open'));

      /* باز کردن کلیک‌شده */
      if (!isOpen) item.classList.add('open');
    });
  });
})();