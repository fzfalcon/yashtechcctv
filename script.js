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

// Instagram: only render official embeds from explicitly configured, verified public Reel URLs.
(function renderInstagramReels() {
  const wall = document.querySelector('#reel-wall');
  if (!wall) return;
  const valid = (window.YASH_REELS || []).filter(item => {
    if (!item || typeof item.url !== 'string') return false;
    try { const url = new URL(item.url); return url.protocol === 'https:' && url.hostname === 'www.instagram.com' && /^\/reel\/[A-Za-z0-9_-]+\/?$/.test(url.pathname); }
    catch { return false; }
  }).slice(0, 6);
  if (!valid.length) {
    wall.innerHTML = '<div class="reel-loading"><span class="reel-orbit">◎</span><strong>Product demos, on camera.</strong><p>Add verified public Reel links in <code>reels-config.js</code> to display the live Instagram embeds here.</p><a href="https://www.instagram.com/yashtechcctv/reels/" target="_blank" rel="noopener noreferrer">Watch latest Reels ↗</a></div><div class="reel-loading"><span class="reel-orbit">↗</span><strong>Installation inspiration.</strong><p>Show real installation clips and product walkthroughs from the official account.</p><a href="https://www.instagram.com/yashtechcctv/reels/" target="_blank" rel="noopener noreferrer">Explore the Reel gallery ↗</a></div><div class="reel-loading"><span class="reel-orbit">✳</span><strong>Follow YASH TECH.</strong><p>Security tips and new product content from Ramanathapuram.</p><a href="https://www.instagram.com/yashtechcctv/" target="_blank" rel="noopener noreferrer">Follow on Instagram ↗</a></div>';
    return;
  }
  wall.replaceChildren();
  valid.forEach((item, index) => {
    const card = document.createElement('article'); card.className = 'reel-card';
    const quote = document.createElement('blockquote'); quote.className = 'instagram-media';
    quote.setAttribute('data-instgrm-permalink', item.url); quote.setAttribute('data-instgrm-version', '14');
    quote.style.cssText = 'background:#fff;border:0;margin:0 auto;max-width:540px;width:100%;';
    const link = document.createElement('a'); link.href = item.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = item.label || `YASH TECH Reel ${index + 1}`;
    quote.appendChild(link); card.appendChild(quote); wall.appendChild(card);
  });
  if (!document.querySelector('script[data-instagram-embed]')) {
    const embedScript = document.createElement('script'); embedScript.src = 'https://www.instagram.com/embed.js'; embedScript.async = true; embedScript.dataset.instagramEmbed = 'true';
    embedScript.onload = () => window.instgrm?.Embeds?.process?.(); document.body.appendChild(embedScript);
  } else window.instgrm?.Embeds?.process?.();
})();
