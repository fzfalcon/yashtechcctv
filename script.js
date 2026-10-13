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
