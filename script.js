
// V20: lightweight desktop-only pointer glow, gentle card tilt and magnetic actions.
// The site's existing pointer-follower remains the single custom cursor implementation.
(() => {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) return;

  document.body.classList.add('yt-pointer-glow');
  window.addEventListener('pointermove', event => {
    document.body.style.setProperty('--yt-pointer-x', `${event.clientX}px`);
    document.body.style.setProperty('--yt-pointer-y', `${event.clientY}px`);
  }, { passive: true });

  const cards = document.querySelectorAll('.featured-product,.catalog-card,.reel-card,.service-card,.solution-card,.project-card,.about-card');
  cards.forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const tiltX = (0.5 - y) * 2.4;
      const tiltY = (x - 0.5) * 2.4;
      card.style.transform = `perspective(1000px) translateY(-2px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }, { passive: true });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; }, { passive: true });
  });

  document.querySelectorAll('.btn-primary,.wa-float').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      button.style.transform = `translate(${dx * 2}px,${dy * 2}px)`;
    }, { passive: true });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; }, { passive: true });
  });
})();


// V16: keep the service/location strip visible; collapse it after scrolling on mobile and desktop.
(() => {
  const topLine = document.querySelector('.topline');
  if (!topLine) return;
  const setHeight = () => document.documentElement.style.setProperty('--topline-height', `${topLine.getBoundingClientRect().height}px`);
  const update = () => {
    topLine.classList.toggle('is-compact', window.scrollY > 24);
    requestAnimationFrame(setHeight);
  };
  setHeight();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', setHeight, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(setHeight).observe(topLine);
  update();
})();

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}
const phone = '918667015532';
function whatsappUrl(message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
document.querySelectorAll('[data-wa-message]').forEach(link => {
  link.href = whatsappUrl(link.dataset.waMessage || 'Hello YASH TECH, I would like to enquire about your security solutions.');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});
const form = document.querySelector('#enquiry-form');
if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phoneNumber = String(data.get('phone') || '').trim();
    const interest = String(data.get('interest') || 'Security solution');
    const message = String(data.get('message') || '').trim();
    if (!name || !phoneNumber) {
      alert('Please enter your name and phone number.');
      return;
    }
    const text = `Hello YASH TECH, I would like to enquire.\\nName: ${name}\\nMy phone: ${phoneNumber}\\nInterested in: ${interest}\\nDetails: ${message || 'Please contact me to discuss my requirement.'}`;
    window.open(whatsappUrl(text), '_blank', 'noopener,noreferrer');
  });
}
const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();


// Product catalogue: instant search, category filters, count and name sorting.
const catalogGrid = document.querySelector('#catalog-grid');
if (catalogGrid) {
  const searchInput = document.querySelector('#catalog-search');
  const sortSelect = document.querySelector('#catalog-sort');
  const count = document.querySelector('#catalog-count');
  const cards = Array.from(catalogGrid.querySelectorAll('.catalog-card'));
  let activeCategory = 'all';
  const normalize = value => (value || '').toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  function updateCatalog() {
    const query = normalize(searchInput?.value.trim());
    let visible = 0;
    cards.forEach(card => {
      const matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesQuery = normalize(card.textContent).includes(query);
      const show = matchesCategory && matchesQuery;
      card.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = `${visible} product${visible === 1 ? '' : 's'}`;
    const mode = sortSelect?.value || 'default';
    if (mode === 'az' || mode === 'za') {
      const sorted = [...cards].sort((a,b) => {
        const cmp = a.querySelector('h3').textContent.trim().localeCompare(b.querySelector('h3').textContent.trim());
        return mode === 'az' ? cmp : -cmp;
      });
      sorted.forEach(card => catalogGrid.appendChild(card));
    } else cards.forEach(card => catalogGrid.appendChild(card));
  }
  document.querySelectorAll('#catalog-filters [data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.filter || 'all';
      document.querySelectorAll('#catalog-filters [data-filter]').forEach(item => {
        item.classList.toggle('btn-primary', item === button);
        item.classList.toggle('btn-ghost', item !== button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      updateCatalog();
    });
  });
  searchInput?.addEventListener('input', updateCatalog);
  sortSelect?.addEventListener('change', updateCatalog);
  updateCatalog();
}

// Progressive reveal; all content remains available if IntersectionObserver is unavailable.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.section-head,.featured-product,.category-strip-grid>a,.why-points>div,.home-cta,.reel-loading').forEach(el => {
    el.setAttribute('data-reveal', ''); observer.observe(el);
  });
}

// Full-width campaign slider: pauseable autoplay, pointer effects, keyboard controls and touch swipes.
(function initHeroBannerCarousel() {
  const root = document.querySelector('#hero-carousel');
  const viewport = document.querySelector('#hero-slide-viewport');
  const track = document.querySelector('#hero-slides');
  if (!root || !viewport || !track) return;
  const slides = [...track.querySelectorAll('.hero-slide')];
  const dots = document.querySelector('#hero-carousel-dots');
  const number = document.querySelector('#hero-current-number');
  const toggle = document.querySelector('#hero-play-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const touchMode = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  let current = 0, timer = null, paused = reducedMotion.matches, pointerDown = null, hasUserPaused = false;
  const dotsList = slides.map((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'hero-carousel-dot';
    button.setAttribute('aria-label', `Show banner ${index + 1} of ${slides.length}`);
    button.addEventListener('click', () => { go(index); restartIfRunning(); });
    dots.appendChild(button); return button;
  });
  function render() {
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      if (active) slide.removeAttribute('inert'); else slide.setAttribute('inert', '');
      dotsList[i].classList.toggle('is-active', active);
      dotsList[i].setAttribute('aria-current', active ? 'true' : 'false');
    });
    if (number) number.textContent = String(current + 1).padStart(2, '0');
    root.style.setProperty('--hero-progress', `${((current + 1) / slides.length) * 100}%`);
  }
  function go(index) { current = (index + slides.length) % slides.length; render(); }
  function stop() { if (timer) window.clearInterval(timer); timer = null; }
  function start() {
    stop();
    if (!paused && !document.hidden && !reducedMotion.matches) timer = window.setInterval(() => go(current + 1), 5600);
    if (toggle) { toggle.textContent = paused ? '▶' : 'Ⅱ'; toggle.setAttribute('aria-label', paused ? 'Start automatic banner rotation' : 'Pause automatic banner rotation'); toggle.setAttribute('aria-pressed', String(paused)); toggle.title = paused ? 'Start slideshow' : 'Pause slideshow'; }
  }
  function restartIfRunning() { if (!paused) start(); }
  document.querySelector('#hero-prev')?.addEventListener('click', () => { go(current - 1); restartIfRunning(); });
  document.querySelector('#hero-next')?.addEventListener('click', () => { go(current + 1); restartIfRunning(); });
  toggle?.addEventListener('click', () => { paused = !paused; hasUserPaused = paused; start(); });
  root.addEventListener('mouseenter', () => { stop(); root.classList.add('is-hovered'); });
  root.addEventListener('mouseleave', () => { root.classList.remove('is-hovered'); if (!hasUserPaused && !reducedMotion.matches) { paused = false; start(); } });
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', event => { if (!root.contains(event.relatedTarget) && !hasUserPaused && !reducedMotion.matches) { paused = false; start(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  reducedMotion.addEventListener?.('change', event => { if (event.matches) { paused = true; stop(); } start(); });
  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { go(current - 1); restartIfRunning(); }
    if (event.key === 'ArrowRight') { go(current + 1); restartIfRunning(); }
  });
  // Real pointer-follow halo and restrained tilt are enabled only for mouse/trackpad.
  if (!touchMode) {
    viewport.addEventListener('pointermove', event => {
      const rect = viewport.getBoundingClientRect();
      viewport.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
      viewport.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
      viewport.classList.add('has-pointer');
    });
    viewport.addEventListener('pointerleave', () => viewport.classList.remove('has-pointer'));
  }
  // Touch and pointer swipe navigation. Vertical page scrolling remains native.
  viewport.addEventListener('pointerdown', event => {
    if (event.target.closest('button,a')) return;
    pointerDown = { x: event.clientX, y: event.clientY, id: event.pointerId };
  }, { passive: true });
  viewport.addEventListener('pointerup', event => {
    if (!pointerDown) return;
    const dx = event.clientX - pointerDown.x, dy = event.clientY - pointerDown.y;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) { go(current + (dx < 0 ? 1 : -1)); restartIfRunning(); }
    pointerDown = null;
  }, { passive: true });
  viewport.addEventListener('pointercancel', () => { pointerDown = null; });
  render(); start();
})();

// Premium custom cursor: visible on mouse devices only, never blocks links or buttons.
(function initPointerFollower() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cursor = document.createElement('div'); cursor.className = 'pointer-follower'; cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span></span>';
  document.body.appendChild(cursor);
  let raf = 0, x = -100, y = -100, tx = -100, ty = -100;
  document.addEventListener('pointermove', event => {
    tx = event.clientX; ty = event.clientY; cursor.classList.add('is-visible');
    if (!raf) raf = requestAnimationFrame(function update() {
      x += (tx - x) * .24; y += (ty - y) * .24;
      cursor.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      raf = (Math.abs(tx-x) + Math.abs(ty-y) > .4) ? requestAnimationFrame(update) : 0;
    });
  }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  document.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'));
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  document.querySelectorAll('a,button,[role="button"]').forEach(el => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-interactive'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-interactive'));
  });
})();

// Marketplace-style product image zoom: click to open a clean full-screen viewer.
(function initProductImageZoom() {
  const modal = document.createElement('div');
  modal.className = 'product-zoom-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Product image zoom');
  modal.hidden = true;
  modal.innerHTML = '<button type="button" class="zoom-close" aria-label="Close image zoom">×</button><button type="button" class="zoom-prev" aria-label="Previous product image">←</button><figure><img alt=""><figcaption>Use + / − to zoom. Press Esc to close.</figcaption></figure><button type="button" class="zoom-next" aria-label="Next product image">→</button><div class="zoom-tools"><button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" data-zoom="reset" aria-label="Reset zoom">Reset</button><button type="button" data-zoom="in" aria-label="Zoom in">+</button></div>';
  document.body.appendChild(modal);
  const largeImage = modal.querySelector('figure img');
  const candidates = () => [...document.querySelectorAll('.catalog-image img, .featured-product-image img, .gallery-photo img, #stage-product-image')].filter(img => img.src && !img.closest('.product-zoom-modal'));
  let index = 0, scale = 1, previousFocus = null;
  function applyScale() { largeImage.style.transform = `scale(${scale})`; }
  function showImage(img) {
    const list = candidates(); index = Math.max(0, list.indexOf(img));
    largeImage.src = img.dataset.zoomSrc || img.currentSrc || img.src; largeImage.alt = img.alt || 'YASH TECH product image';
    scale = 1; applyScale(); modal.hidden = false; document.body.classList.add('zoom-open'); modal.querySelector('.zoom-close').focus();
  }
  function close() { modal.hidden = true; document.body.classList.remove('zoom-open'); if (previousFocus?.focus) previousFocus.focus(); }
  function move(delta) { const list = candidates(); if (!list.length) return; index = (index + delta + list.length) % list.length; const img = list[index]; largeImage.src = img.dataset.zoomSrc || img.currentSrc || img.src; largeImage.alt = img.alt || 'YASH TECH product image'; scale = 1; applyScale(); }
  document.addEventListener('click', event => {
    const heroZoom = event.target.closest('.hero-zoom-trigger');
    if (heroZoom) { event.preventDefault(); event.stopPropagation(); previousFocus = heroZoom; showImage(document.querySelector('#stage-product-image')); return; }
    const img = event.target.closest('.catalog-image img, .featured-product-image img, .gallery-photo img');
    if (!img) return;
    event.preventDefault(); previousFocus = img; showImage(img);
  });
  modal.querySelector('.zoom-close').addEventListener('click', close);
  modal.querySelector('.zoom-prev').addEventListener('click', () => move(-1));
  modal.querySelector('.zoom-next').addEventListener('click', () => move(1));
  modal.querySelectorAll('[data-zoom]').forEach(btn => btn.addEventListener('click', () => { const action = btn.dataset.zoom; scale = action === 'reset' ? 1 : Math.max(1, Math.min(4, scale + (action === 'in' ? .5 : -.5))); applyScale(); }));
  modal.addEventListener('click', event => { if (event.target === modal) close(); });
  document.addEventListener('keydown', event => { if (modal.hidden) return; if (event.key === 'Escape') close(); if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1); });
  let startX = 0;
  modal.addEventListener('touchstart', event => { startX = event.changedTouches[0].clientX; }, {passive:true});
  modal.addEventListener('touchend', event => { const dx = event.changedTouches[0].clientX - startX; if (Math.abs(dx) > 65) move(dx < 0 ? 1 : -1); }, {passive:true});
})();

// Instagram: embed only verified public Reel permalinks configured in reels-config.js.
(function renderInstagramReels() {
  const wall = document.querySelector('#reel-wall');
  if (!wall) return;
  const valid = (window.YASH_REELS || []).filter(item => {
    if (!item || typeof item.url !== 'string') return false;
    try { const url = new URL(item.url); return url.protocol === 'https:' && url.hostname === 'www.instagram.com' && /^\/reel\/[A-Za-z0-9_-]+\/?$/.test(url.pathname); }
    catch { return false; }
  }).slice(0, 10);
  if (!valid.length) {
    wall.innerHTML = '<div class="reel-loading"><span class="reel-orbit">▶</span><strong>Product demos</strong><p>Public Reel embeds appear here once their individual links are added to <code>reels-config.js</code>.</p><a href="https://www.instagram.com/yashtechcctv/reels/" target="_blank" rel="noopener noreferrer">Watch Reels on Instagram ↗</a></div><div class="reel-loading"><span class="reel-orbit">▶</span><strong>Installation clips</strong><p>Swipe horizontally to browse each Reel in this single-row showcase.</p><a href="https://www.instagram.com/yashtechcctv/reels/" target="_blank" rel="noopener noreferrer">Explore the Reel gallery ↗</a></div><div class="reel-loading"><span class="reel-orbit">◎</span><strong>Follow YASH TECH</strong><p>See new products and security updates from the official account.</p><a href="https://www.instagram.com/yashtechcctv/" target="_blank" rel="noopener noreferrer">Follow on Instagram ↗</a></div>';
  } else {
    wall.replaceChildren();
    valid.forEach((item, index) => {
      const card = document.createElement('article'); card.className = 'reel-card';
      const quote = document.createElement('blockquote'); quote.className = 'instagram-media';
      quote.setAttribute('data-instgrm-permalink', item.url); quote.setAttribute('data-instgrm-version', '14');
      quote.style.cssText = 'background:#fff;border:0;margin:0 auto;max-width:100%;width:100%;';
      const link = document.createElement('a'); link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = item.label || `YASH TECH Reel ${index + 1}`;
      quote.appendChild(link); card.appendChild(quote); wall.appendChild(card);
    });
    if (!document.querySelector('script[data-instagram-embed]')) {
      const embedScript = document.createElement('script'); embedScript.src = 'https://www.instagram.com/embed.js'; embedScript.async = true; embedScript.dataset.instagramEmbed = 'true';
      embedScript.onload = () => window.instgrm?.Embeds?.process?.(); document.body.appendChild(embedScript);
    } else window.instgrm?.Embeds?.process?.();
  }
  const scroll = direction => wall.scrollBy({ left: direction * Math.max(280, wall.clientWidth * .72), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  document.querySelector('#reel-prev')?.addEventListener('click', () => scroll(-1));
  document.querySelector('#reel-next')?.addEventListener('click', () => scroll(1));
})();
