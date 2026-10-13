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
const phone = '919385898667';
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

// Featured product auto-slider: local product images only; pauses on hover/focus and respects reduced motion.
(function initHeroProductSlider() {
  const root = document.querySelector('#hero-product-carousel');
  const image = document.querySelector('#stage-product-image');
  if (!root || !image) return;
  const products = [
    { image: 'assets/catalog/product-04.jpg', alt: 'YASH TECH 4G solar PTZ security camera', type: 'SMART OUTDOOR SECURITY', name: '4G & Solar Cameras' },
    { image: 'assets/catalog/product-05.jpg', alt: 'YASH TECH smart Wi-Fi camera', type: 'CONNECTED HOME SECURITY', name: 'Smart Wi-Fi Cameras' },
    { image: 'assets/catalog/product-13.jpg', alt: 'YASH TECH indoor dome CCTV camera', type: 'INDOOR SURVEILLANCE', name: 'Indoor Dome Cameras' },
    { image: 'assets/catalog/product-22.jpeg', alt: 'YASH TECH NVR recording system', type: 'RECORDING & STORAGE', name: 'NVR Recording Systems' },
    { image: 'assets/catalog/product-21.jpg', alt: 'YASH TECH CCTV security product', type: 'PROFESSIONAL SECURITY', name: 'CCTV System Essentials' }
  ];
  const name = document.querySelector('#stage-product-name');
  const type = document.querySelector('#stage-product-type');
  const counter = document.querySelector('#stage-counter');
  const dots = document.querySelector('#stage-dots');
  let current = 0, timer = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(index) {
    current = (index + products.length) % products.length;
    const item = products[current];
    image.classList.add('is-changing');
    window.setTimeout(() => {
      image.src = item.image; image.alt = item.alt;
      name.textContent = item.name; type.textContent = item.type;
      const productLink = document.querySelector('#stage-product-link');
      if (productLink) productLink.setAttribute('aria-label', `Explore ${item.name}`);
      const zoomTrigger = document.querySelector('.hero-zoom-trigger');
      if (zoomTrigger) zoomTrigger.dataset.zoomSrc = item.image;
      counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(products.length).padStart(2, '0')}`;
      [...dots.children].forEach((dot, i) => { dot.classList.toggle('active', i === current); dot.setAttribute('aria-current', i === current ? 'true' : 'false'); });
      image.classList.remove('is-changing');
      image.classList.remove('is-entering');
      void image.offsetWidth;
      image.classList.add('is-entering');
      window.setTimeout(() => image.classList.remove('is-entering'), 850);
    }, 180);
  }
  products.forEach((item, i) => {
    const dot = document.createElement('button'); dot.type = 'button'; dot.className = 'stage-dot';
    dot.setAttribute('aria-label', `Show product ${i + 1}: ${item.name}`);
    dot.addEventListener('click', () => { show(i); restart(); }); dots.appendChild(dot);
  });
  function stop() { if (timer) window.clearInterval(timer); timer = null; }
  function start() { stop(); if (!reduceMotion) timer = window.setInterval(() => show(current + 1), 4200); }
  function restart() { start(); }
  document.querySelector('#stage-prev')?.addEventListener('click', () => { show(current - 1); restart(); });
  document.querySelector('#stage-next')?.addEventListener('click', () => { show(current + 1); restart(); });
  root.addEventListener('mouseenter', stop); root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop); root.addEventListener('focusout', start);
  show(0); start();
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
