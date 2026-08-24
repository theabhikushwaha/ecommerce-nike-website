import { getProducts } from '../JS/services/catalog-service.js';
import { getWishlist, toggleWishlist } from '../JS/services/wishlist-service.js';
import { addToCart } from '../JS/services/cart-service.js';
import { productGrid } from '../JS/components/product-grid.js';
import { escapeHTML } from '../JS/utils/html.js';

const HISTORY_KEY = 'swoosh-recent-searches';
let query = '';

function recentSearches() {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(history) ? history.filter((item) => typeof item === 'string').slice(0, 5) : [];
  } catch {
    return [];
  }
}
function saveSearch(value) { if (!value) return; localStorage.setItem(HISTORY_KEY, JSON.stringify([value, ...recentSearches().filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 5))); }
function clearHistory() { localStorage.removeItem(HISTORY_KEY); }
function results() { return getProducts({ query }).slice(0, 12); }

function searchBody() {
  const products = results();
  const suggestions = query ? products.slice(0, 5) : [];
  const history = recentSearches();
  const safeQuery = escapeHTML(query);
  return `<div class="search-panel"><label class="search-input"><span class="sr-only">Search the catalog</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.8"/><path d="m16 16 4 4"/></svg><input data-search-input type="search" value="${safeQuery}" autocomplete="off" placeholder="Search shoes, sport, or style"><button data-action="clear-search" type="button" aria-label="Clear search" ${query ? '' : 'hidden'}>×</button></label><div class="search-suggestions" data-search-suggestions>${suggestions.length ? suggestions.map((product) => `<a href="#/product?slug=${product.slug}"><span>${product.name}</span><small>${product.category}</small></a>`).join('') : !query && history.length ? `<div class="search-history"><div><b>Recent searches</b><button type="button" data-action="clear-history">Clear</button></div>${history.map((item) => `<button type="button" data-search-term="${escapeHTML(item)}">${escapeHTML(item)}</button>`).join('')}</div>` : ''}</div></div><div class="search-results" data-search-results>${query ? products.length ? `<p class="search-results__count">${products.length} result${products.length === 1 ? '' : 's'} for <b>"${safeQuery}"</b></p><div class="catalog-grid">${productGrid(products, getWishlist())}</div>` : `<section class="experience-empty"><div class="experience-empty__art" aria-hidden="true">⌕</div><h2>No matches found.</h2><p>Try a different style, sport, or product name.</p><a class="experience-button" href="#/shop">Browse all shoes</a></section>` : `<section class="search-intro"><p>Start typing to explore performance footwear, new releases, and classics.</p></section>`}</div>`;
}

function highlight(scope) {
  if (!query) return;
  const expression = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  scope.querySelectorAll('.catalog-card__title h3,.catalog-card__category,.catalog-card__description').forEach((element) => { element.innerHTML = element.textContent.replace(expression, '<mark>$1</mark>'); });
}

function rerender() {
  const page = document.querySelector('[data-page="search"]');
  if (!page) return;
  page.querySelector('[data-search-body]').innerHTML = searchBody();
  const input = page.querySelector('[data-search-input]'); input.focus(); input.setSelectionRange(query.length, query.length);
  highlight(page);
}

export function render({ query: params }) {
  query = params.get('q') || '';
  return `<section class="search-page" data-page="search"><header class="experience-hero"><div class="section-shell"><p class="eyebrow">Search <span></span></p><h1>Find your<br><em>next favourite.</em></h1></div></header><section class="search-content section-shell" data-search-body>${searchBody()}</section></section>`;
}

export function init() {
  const page = document.querySelector('[data-page="search"]');
  highlight(page);
  page?.addEventListener('input', (event) => { if (event.target.matches('[data-search-input]')) { query = event.target.value.trim(); rerender(); } });
  page?.addEventListener('keydown', (event) => { if (event.target.matches('[data-search-input]') && event.key === 'Enter') saveSearch(query); });
  page?.addEventListener('click', (event) => {
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'clear-search') { query = ''; rerender(); return; }
    if (action === 'clear-history') { clearHistory(); rerender(); return; }
    const term = event.target.closest('[data-search-term]');
    if (term) { query = term.dataset.searchTerm; rerender(); return; }
    const button = event.target.closest('[data-action]'); const card = button?.closest('[data-product-id]');
    if (!button || !card) return;
    const product = getProducts().find((item) => item.id === card.dataset.productId);
    if (button.dataset.action === 'wishlist') { const saved = toggleWishlist(product.id).includes(product.id); button.classList.toggle('is-saved', saved); button.setAttribute('aria-pressed', saved); }
    if (button.dataset.action === 'cart') addToCart({ id: product.id, size: product.sizes[0], color: product.colors[0] });
  });
}
