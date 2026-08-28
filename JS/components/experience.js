import { getCart } from '../services/cart-service.js';
import { getWishlist } from '../services/wishlist-service.js';

let revealObserver;
let scrollFrame;

function updateCounters() {
  const wishlistCount = getWishlist().length;
  const cartCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('[data-wishlist-count]').forEach((element) => { element.textContent = wishlistCount; element.hidden = !wishlistCount; });
  document.querySelectorAll('[data-cart-count]').forEach((element) => { element.textContent = cartCount; element.hidden = !cartCount; });
}

function updateScrollUI() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('[data-scroll-progress]')?.style.setProperty('transform', `scaleX(${max > 0 ? window.scrollY / max : 0})`);
  document.querySelector('[data-back-to-top]')?.classList.toggle('is-visible', window.scrollY > 500);
  document.querySelector('#site-header')?.classList.toggle('is-scrolled', window.scrollY > 18);
}

function scheduleScrollUI() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => { scrollFrame = undefined; updateScrollUI(); });
}

function setMenuOpen(open) {
  const header = document.querySelector('#site-header');
  const toggle = header?.querySelector('.nav__toggle');
  if (!header || !toggle) return;
  header.classList.toggle('is-menu-open', open);
  document.body.classList.toggle('nav-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

export function syncExperience(path = window.location.hash.slice(1).split('?')[0] || '/') {
  updateCounters();
  document.querySelectorAll('[data-nav-path]').forEach((link) => {
    const active = link.dataset.navPath === path;
    link.classList.toggle('is-active', active);
    link.toggleAttribute('aria-current', active);
  });
  updateScrollUI();
}

export function observeReveals() {
  revealObserver?.disconnect();
  document.querySelectorAll('#app .catalog-card, #app .cart-item, #app .contact-details article, #app .about-values__grid article, #app .about-features__grid article, #app .review-list article').forEach((item) => item.classList.add('reveal'));
  const items = document.querySelectorAll('#app .reveal');
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => item.classList.add('is-revealed'));
    return;
  }
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px' });
  items.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
    revealObserver.observe(item);
  });
}

export function initExperience() {
  document.body.insertAdjacentHTML('afterbegin', '<div class="scroll-progress" data-scroll-progress aria-hidden="true"></div><div class="toast-region" data-toast-region aria-live="polite" aria-atomic="false"></div><button class="back-to-top" data-back-to-top type="button" aria-label="Back to top">↑</button>');
  window.addEventListener('scroll', scheduleScrollUI, { passive: true });
  window.addEventListener('resize', scheduleScrollUI, { passive: true });
  window.addEventListener('store:change', updateCounters);
  document.querySelector('[data-back-to-top]').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelector('#site-header').addEventListener('click', (event) => {
    const toggle = event.target.closest('.nav__toggle');
    const link = event.target.closest('.nav__links a');
    if (!toggle && !link) return;
    setMenuOpen(toggle ? !document.querySelector('#site-header').classList.contains('is-menu-open') : false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.querySelector('#site-header')?.classList.contains('is-menu-open')) {
      setMenuOpen(false);
      document.querySelector('.nav__toggle')?.focus();
    }
  });
  updateScrollUI();
}
