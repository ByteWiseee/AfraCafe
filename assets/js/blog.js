/* ============================================
   کافه آرا — جاوااسکریپت وبلاگ
   blog.js
   ============================================ */

/* ══════════════════════════════════════
   فیلتر دسته‌بندی (blog.html)
══════════════════════════════════════ */
(function initBlogFilter() {
  const tabs  = document.querySelectorAll('.bc-tab');
  const cards = () => document.querySelectorAll('.post-card, .featured-post');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.cat;

      let visible = 0;
      cards().forEach((card, i) => {
        const match = cat === 'all' || card.dataset.cat === cat;
        if (match) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(14px)';
          setTimeout(() => {
            card.style.transition = 'opacity .35s ease, transform .35s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0)';
          }, visible * 50);
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      const empty = document.getElementById('blogEmpty');
      if (empty) empty.style.display = visible === 0 ? 'block' : 'none';

      /* ریست سرچ */
      const s = document.getElementById('blogSearch');
      if (s) s.value = '';
    });
  });
})();

/* ══════════════════════════════════════
   جستجوی وبلاگ
══════════════════════════════════════ */
(function initBlogSearch() {
  const inputs = [
    document.getElementById('blogSearch'),
    document.getElementById('sbSearch'),
  ].filter(Boolean);

  function doSearch(q) {
    const cards = document.querySelectorAll('.post-card, .featured-post');
    let visible = 0;
    cards.forEach(card => {
      const title = card.querySelector('.pc-title, .fp-title')?.textContent.toLowerCase() || '';
      const desc  = card.querySelector('.pc-desc,  .fp-desc')?.textContent.toLowerCase()  || '';
      const match = !q || title.includes(q) || desc.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    const empty = document.getElementById('blogEmpty');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';

    /* غیرفعال تب‌ها */
    if (q) document.querySelectorAll('.bc-tab').forEach(t => t.classList.remove('active'));
  }

  inputs.forEach(input => {
    input.addEventListener('input', () => doSearch(input.value.trim().toLowerCase()));
  });

  /* دکمه جستجو سایدبار */
  const sbBtn = document.getElementById('sbSearchBtn');
  if (sbBtn) {
    sbBtn.addEventListener('click', () => {
      const sbInput = document.getElementById('sbSearch');
      if (sbInput) doSearch(sbInput.value.trim().toLowerCase());
    });
  }
})();

/* ══════════════════════════════════════
   مرتب‌سازی
══════════════════════════════════════ */
(function initBlogSort() {
  const select = document.getElementById('blogSort');
  if (!select) return;

  select.addEventListener('change', function () {
    const grid  = document.getElementById('postsGrid');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.post-card')];

    cards.sort((a, b) => {
      if (this.value === 'popular') {
        const la = parseInt(a.querySelector('.likes-count')?.textContent.replace(/[^\d]/g,'')) || 0;
        const lb = parseInt(b.querySelector('.likes-count')?.textContent.replace(/[^\d]/g,'')) || 0;
        return lb - la;
      }
      /* برای قدیمی/جدید از ترتیب DOM به عنوان ایندکس استفاده می‌کنیم */
      const ia = [...grid.children].indexOf(a);
      const ib = [...grid.children].indexOf(b);
      return this.value === 'oldest' ? ia - ib : ib - ia;
    });

    cards.forEach((card, i) => {
      card.style.opacity   = '0';
      card.style.transform = 'scale(0.97)';
      grid.appendChild(card);
      setTimeout(() => {
        card.style.transition = 'opacity .3s ease, transform .3s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'scale(1)';
      }, i * 40);
    });
  });
})();

/* ══════════════════════════════════════
   لایک پست‌ها
══════════════════════════════════════ */
(function initPostLikes() {
  document.addEventListener('click', e => {
    const likeBtn = e.target.closest('.pc-likes');
    if (!likeBtn) return;

    const isLiked = likeBtn.dataset.liked === 'true';
    const countEl = likeBtn.querySelector('.likes-count');
    if (!countEl) return;

    let count = parseInt(countEl.textContent.replace(/[^\d]/g,'')) || 0;
    if (isLiked) {
      count--;
      likeBtn.dataset.liked = 'false';
      likeBtn.classList.remove('liked');
    } else {
      count++;
      likeBtn.dataset.liked = 'true';
      likeBtn.classList.add('liked');
    }
    countEl.textContent = count.toLocaleString('fa-IR');
  });
})();

/* ══════════════════════════════════════
   لایک مقاله تکی
══════════════════════════════════════ */
(function initSingleLike() {
  const likeEl = document.getElementById('singleLikes');
  if (!likeEl) return;

  likeEl.addEventListener('click', function () {
    const isLiked = this.dataset.liked === 'true';
    const countEl = this.querySelector('span');
    let count = parseInt(countEl?.textContent) || 0;

    if (isLiked) {
      count--;
      this.dataset.liked = 'false';
      this.classList.remove('liked');
    } else {
      count++;
      this.dataset.liked = 'true';
      this.classList.add('liked');
    }
    if (countEl) countEl.textContent = count.toLocaleString('fa-IR');
  });
})();

/* ══════════════════════════════════════
   لایک نظرات
══════════════════════════════════════ */
(function initCommentLikes() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.ci-like');
    if (!btn) return;
    const isLiked = btn.classList.contains('liked');
    const match   = btn.textContent.match(/\d+/);
    let count = match ? parseInt(match[0]) : 0;
    if (isLiked) { count--; btn.classList.remove('liked'); }
    else         { count++; btn.classList.add('liked'); }
    btn.textContent = `👍 ${count.toLocaleString('fa-IR')}`;
  });
})();

/* ══════════════════════════════════════
   اشتراک‌گذاری
══════════════════════════════════════ */
(function initShare() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.sh-btn');
    if (!btn) return;
    const url = encodeURIComponent(location.href);

    if (btn.classList.contains('sh-telegram')) {
      window.open(`https://t.me/share/url?url=${url}`, '_blank');
    } else if (btn.classList.contains('sh-whatsapp')) {
      window.open(`https://wa.me/?text=${url}`, '_blank');
    } else if (btn.classList.contains('sh-copy')) {
      navigator.clipboard?.writeText(location.href).then(() => {
        showToast('لینک مقاله کپی شد! 🔗', 'success');
      });
    }
  });
})();

/* ══════════════════════════════════════
   فرم نظر جدید
══════════════════════════════════════ */
(function initCommentForm() {
  const btn  = document.getElementById('cmSubmit');
  const list = document.getElementById('commentsList');
  const countEl = document.getElementById('commentCount');
  if (!btn || !list) return;

  btn.addEventListener('click', () => {
    const name = document.getElementById('cm-name')?.value.trim();
    const text = document.getElementById('cm-text')?.value.trim();

    if (!name) { showToast('نام خود را وارد کنید', 'error'); return; }
    if (!text || text.length < 5) { showToast('نظر باید حداقل ۵ کاراکتر باشد', 'error'); return; }

    const colors = ['#c8922a','#5c3d1e','#1a3d2a','#3d1a3d','#1a1a3d'];
    const color  = colors[Math.floor(Math.random() * colors.length)];
    const initial = name.charAt(0);

    const item = document.createElement('div');
    item.className = 'comment-item';
    item.style.opacity   = '0';
    item.style.transform = 'translateY(10px)';
    item.innerHTML = `
      <div class="ci-ava" style="background:${color}">${initial}</div>
      <div class="ci-body">
        <div class="ci-header">
          <span class="ci-name">${name}</span>
          <span class="ci-date">همین الان</span>
        </div>
        <p class="ci-text">${text}</p>
        <button class="ci-like">👍 ۰</button>
      </div>
    `;
    list.appendChild(item);

    /* انیمیشن */
    setTimeout(() => {
      item.style.transition = 'opacity .4s ease, transform .4s ease';
      item.style.opacity    = '1';
      item.style.transform  = 'translateY(0)';
    }, 50);

    /* آپدیت شمارنده */
    if (countEl) {
      const cur = parseInt(countEl.textContent.replace(/[^\d]/g,'')) || 0;
      countEl.textContent = (cur + 1).toLocaleString('fa-IR');
    }

    /* ریست */
    document.getElementById('cm-name').value = '';
    document.getElementById('cm-text').value = '';
    if (document.getElementById('cm-email')) document.getElementById('cm-email').value = '';
    showToast('نظر شما با موفقیت ثبت شد 🙏', 'success');
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();

/* ══════════════════════════════════════
   خبرنامه سایدبار
══════════════════════════════════════ */
(function initNewsletterSidebar() {
  [
    { btn: 'sbSubBtn',       input: 'sbEmail'       },
    { btn: 'sbSubBtnSingle', input: 'sbEmailSingle' },
  ].forEach(({ btn, input }) => {
    const b = document.getElementById(btn);
    const i = document.getElementById(input);
    if (!b || !i) return;

    b.addEventListener('click', () => {
      if (!i.value.trim()) {
        showToast('ایمیل خود را وارد کنید', 'error'); return;
      }
      b.textContent        = '✓ عضو شدید!';
      b.style.background   = '#2a9d5c';
      i.disabled = true;
      showToast('عضویت شما با موفقیت انجام شد 🎉', 'success');
      setTimeout(() => {
        b.textContent      = 'عضویت رایگان';
        b.style.background = '';
        i.value            = '';
        i.disabled         = false;
      }, 3500);
    });
  });
})();

/* ══════════════════════════════════════
   پیجینیشن (نمایشی)
══════════════════════════════════════ */
(function initPagination() {
  const nums = document.querySelectorAll('.pg-num');
  if (!nums.length) return;
  nums.forEach(btn => {
    btn.addEventListener('click', function () {
      nums.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      showToast(`صفحه ${this.textContent} — به زودی محتوای بیشتر...`);
    });
  });
})();

/* ══════════════════════════════════════
   فهرست مطالب (TOC)
══════════════════════════════════════ */
(function initTOC() {
  const links = document.querySelectorAll('.toc-link');
  if (!links.length) return;
  links.forEach((link, i) => {
    link.addEventListener('click', e => {
      e.preventDefault();
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
})();