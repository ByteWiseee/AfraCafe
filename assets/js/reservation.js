/* ============================================
   کافه آرا — جاوااسکریپت رزرو
   reservation.js
   ============================================ */

/* ══════════════════════════════════════
   وضعیت فرم
══════════════════════════════════════ */
const state = {
  currentStep: 1,
  totalSteps:  3,
  data: {
    name: '', phone: '', email: '',
    occasion: 'normal', occasionLabel: '🍽️ معمولی',
    branch: '', branchLabel: '',
    guests: 2,
    date: '', time: '',
    notes: ''
  }
};

/* ══════════════════════════════════════
   ناوبری استپ‌ها
══════════════════════════════════════ */
function goToStep(n) {
  const steps = document.querySelectorAll('.form-step');
  const bars  = document.querySelectorAll('.step[data-step]');
  const lines = document.querySelectorAll('.step-line');

  steps.forEach(s => s.classList.remove('active'));
  const target = document.getElementById('step' + n);
  if (target) target.classList.add('active');

  bars.forEach(b => {
    const sn = parseInt(b.dataset.step);
    b.classList.remove('active', 'done');
    if (sn === n) b.classList.add('active');
    if (sn < n)  b.classList.add('done');
  });

  lines.forEach((l, i) => {
    l.classList.toggle('done', i < n - 1);
  });

  state.currentStep = n;

  /* اسکرول به بالای فرم */
  const wrap = document.querySelector('.res-form-wrap');
  if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ══════════════════════════════════════
   اعتبارسنجی هر استپ
══════════════════════════════════════ */
function validateStep(n) {
  if (n === 1) {
    let ok = true;
    const name  = document.getElementById('r-name');
    const phone = document.getElementById('r-phone');

    if (!name?.value.trim() || name.value.trim().length < 3) {
      setErr('re-name', 'نام باید حداقل ۳ کاراکتر باشد');
      name?.classList.add('invalid'); ok = false;
    } else {
      setErr('re-name', ''); name?.classList.remove('invalid'); name?.classList.add('valid');
    }

    const phoneVal = phone?.value.trim().replace(/-/g, '');
    if (!phoneVal || !/^(0?9\d{9}|\d{8,11})$/.test(phoneVal)) {
      setErr('re-phone', 'شماره موبایل معتبر نیست');
      phone?.classList.add('invalid'); ok = false;
    } else {
      setErr('re-phone', ''); phone?.classList.remove('invalid'); phone?.classList.add('valid');
    }
    return ok;
  }

  if (n === 2) {
    let ok = true;
    const branch = document.getElementById('r-branch');
    const date   = document.getElementById('r-date');
    const time   = document.getElementById('r-time');

    if (!branch?.value) {
      setErr('re-branch', 'شعبه را انتخاب کنید');
      branch?.classList.add('invalid'); ok = false;
    } else {
      setErr('re-branch', ''); branch?.classList.remove('invalid');
    }

    if (!date?.value.trim()) {
      setErr('re-date', 'تاریخ را وارد کنید');
      date?.classList.add('invalid'); ok = false;
    } else {
      setErr('re-date', ''); date?.classList.remove('invalid'); date?.classList.add('valid');
    }

    if (!time?.value) {
      setErr('re-time', 'لطفاً ساعت را انتخاب کنید'); ok = false;
    } else {
      setErr('re-time', '');
    }
    return ok;
  }

  return true;
}

function setErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

/* ══════════════════════════════════════
   ذخیره داده از استپ
══════════════════════════════════════ */
function saveStep(n) {
  if (n === 1) {
    state.data.name  = document.getElementById('r-name')?.value.trim() || '';
    state.data.phone = document.getElementById('r-phone')?.value.trim() || '';
    state.data.email = document.getElementById('r-email')?.value.trim() || '';
  }
  if (n === 2) {
    const branchEl = document.getElementById('r-branch');
    state.data.branch      = branchEl?.value || '';
    state.data.branchLabel = branchEl?.options[branchEl.selectedIndex]?.text || '';
    state.data.date  = document.getElementById('r-date')?.value.trim() || '';
    state.data.time  = document.getElementById('r-time')?.value || '';
    state.data.notes = document.getElementById('r-notes')?.value.trim() || '';
    state.data.guests = parseInt(document.getElementById('r-guests')?.value) || 2;
  }
}

/* ══════════════════════════════════════
   رندر صفحه تأیید
══════════════════════════════════════ */
function renderConfirm() {
  const rows = document.getElementById('confirmRows');
  if (!rows) return;

  const d = state.data;
  const items = [
    { key: '👤 نام',        val: d.name },
    { key: '📞 موبایل',     val: d.phone },
    { key: '🏢 شعبه',       val: d.branchLabel },
    { key: '👥 تعداد نفر', val: d.guests.toLocaleString('fa-IR') + ' نفر' },
    { key: '📅 تاریخ',      val: d.date },
    { key: '⏰ ساعت',       val: d.time },
    { key: '🎉 مناسبت',     val: d.occasionLabel },
  ];
  if (d.notes) items.push({ key: '📝 یادداشت', val: d.notes });

  rows.innerHTML = items.map(i => `
    <div class="cc-row">
      <span class="cc-key">${i.key}</span>
      <span class="cc-val">${i.val}</span>
    </div>
  `).join('');
}

/* ══════════════════════════════════════
   رویدادهای استپ (next / prev)
══════════════════════════════════════ */
(function initStepNav() {
  document.addEventListener('click', e => {
    const nextBtn = e.target.closest('.step-next');
    const prevBtn = e.target.closest('.step-prev');

    if (nextBtn) {
      const to = parseInt(nextBtn.dataset.to);
      const from = to - 1;
      if (!validateStep(from)) return;
      saveStep(from);
      if (to === 3) renderConfirm();
      goToStep(to);
    }
    if (prevBtn) {
      goToStep(parseInt(prevBtn.dataset.to));
    }
  });
})();

/* ══════════════════════════════════════
   انتخاب مناسبت
══════════════════════════════════════ */
(function initOccasion() {
  const grid = document.getElementById('occasionGrid');
  const hidden = document.getElementById('r-occasion');
  if (!grid) return;

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.occ-btn');
    if (!btn) return;
    grid.querySelectorAll('.occ-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if (hidden) hidden.value = btn.dataset.val;
    state.data.occasionLabel = btn.textContent.trim();
    state.data.occasion = btn.dataset.val;
  });
})();

/* ══════════════════════════════════════
   شمارنده تعداد نفر
══════════════════════════════════════ */
(function initGuestCounter() {
  const minusBtn  = document.getElementById('guestMinus');
  const plusBtn   = document.getElementById('guestPlus');
  const countEl   = document.getElementById('guestCount');
  const hiddenEl  = document.getElementById('r-guests');
  if (!minusBtn) return;

  let count = 2;

  function update() {
    countEl.textContent = count.toLocaleString('fa-IR');
    if (hiddenEl) hiddenEl.value = count;
    state.data.guests = count;
    minusBtn.disabled = count <= 1;
    plusBtn.disabled  = count >= 20;
  }

  minusBtn.addEventListener('click', () => { if (count > 1) { count--; update(); } });
  plusBtn.addEventListener('click',  () => { if (count < 20) { count++; update(); } });
  update();
})();

/* ══════════════════════════════════════
   انتخاب ساعت
══════════════════════════════════════ */
(function initTimeSlots() {
  const slots  = document.querySelectorAll('.ts-btn:not(:disabled)');
  const hidden = document.getElementById('r-time');
  if (!slots.length) return;

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      if (hidden) hidden.value = slot.dataset.time;
      state.data.time = slot.dataset.time;
      setErr('re-time', '');
    });
  });
})();

/* ══════════════════════════════════════
   ارسال فرم نهایی
══════════════════════════════════════ */
(function initSubmit() {
  const form   = document.getElementById('resForm');
  const submit = document.getElementById('resSubmit');
  const rsText = document.getElementById('rs-text');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    /* چک موافقت */
    const agree = document.getElementById('r-agree');
    if (!agree?.checked) {
      setErr('re-agree', 'پذیرش قوانین الزامی است');
      return;
    }
    setErr('re-agree', '');

    /* لودینگ */
    if (submit) submit.disabled = true;
    if (rsText) rsText.textContent = 'در حال ثبت...';

    setTimeout(() => {
      /* موفقیت */
      if (submit) {
        submit.style.background = '#2a9d5c';
        submit.disabled = false;
      }
      if (rsText) rsText.textContent = 'رزرو ثبت شد!';

      showToast(
        `رزرو ${state.data.name} برای ${state.data.guests} نفر در تاریخ ${state.data.date} ساعت ${state.data.time} ثبت شد 🎉`,
        'success', 5000
      );

      /* ریست بعد از ۵ ثانیه */
      setTimeout(() => {
        form.reset();
        goToStep(1);
        if (submit) { submit.style.background = ''; submit.disabled = false; }
        if (rsText) rsText.textContent = 'ثبت رزرو';
        /* ریست state */
        state.data = { name:'',phone:'',email:'',occasion:'normal',occasionLabel:'🍽️ معمولی',branch:'',branchLabel:'',guests:2,date:'',time:'',notes:'' };
        /* ریست UI */
        document.querySelectorAll('.occ-btn').forEach((b,i) => b.classList.toggle('active', i===0));
        document.querySelectorAll('.ts-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('guestCount').textContent = '۲';
        document.getElementById('r-guests').value = '2';
        document.querySelectorAll('.valid,.invalid').forEach(el => el.classList.remove('valid','invalid'));
      }, 5000);
    }, 2000);
  });
})();