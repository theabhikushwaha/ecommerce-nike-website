import { getProducts, getProductById } from '../JS/services/catalog-service.js';
import { addToCart } from '../JS/services/cart-service.js';
import { getWishlist, toggleWishlist } from '../JS/services/wishlist-service.js';
import { filterPanel } from '../JS/components/filter-panel.js';
import { productGrid } from '../JS/components/product-grid.js';
import { emptyState } from '../JS/components/empty-state.js';

const PAGE_SIZE = 6;
const defaultFilters = { query: '', category: '', brand: '', minPrice: '', maxPrice: '', size: '', color: '', availability: '', sort: 'featured' };
let state = { ...defaultFilters, visibleCount: PAGE_SIZE };
let scheduledRender;

function activeProducts() { return getProducts({ ...state, minPrice: state.minPrice === '' ? 0 : Number(state.minPrice), maxPrice: state.maxPrice === '' ? Infinity : Number(state.maxPrice) }); }

function skeletons() { return Array.from({ length: 3 }, () => '<article class="catalog-skeleton" aria-hidden="true"><div></div><i></i><i></i></article>').join(''); }

function renderProducts() {
  const container = document.querySelector('[data-shop-results]');
  if (!container) return;
  const matched = activeProducts();
  const visible = matched.slice(0, state.visibleCount);
  const wishlist = getWishlist();
  document.querySelector('[data-result-count]').textContent = `${matched.length} ${matched.length === 1 ? 'style' : 'styles'}`;
  container.innerHTML = matched.length ? productGrid(visible, wishlist) : emptyState();
  document.querySelector('[data-load-more]').hidden = visible.length >= matched.length || !matched.length;
  document.querySelector('[data-load-more]').textContent = `Load more (${matched.length - visible.length} remaining)`;
}

function renderFilterPanel() {
  const panel = document.querySelector('[data-filter-slot]');
  if (panel) panel.innerHTML = filterPanel(state);
}

function requestRender({ resetResults = true, filters = false } = {}) {
  if (resetResults) state.visibleCount = PAGE_SIZE;
  cancelAnimationFrame(scheduledRender);
  scheduledRender = requestAnimationFrame(() => {
    if (filters) renderFilterPanel();
    renderProducts();
  });
}

function clearFilters() { state = { ...defaultFilters, visibleCount: PAGE_SIZE }; renderFilterPanel(); renderProducts(); }

export function render() {
  return `<section class="shop-page" data-page="shop">
    <header class="shop-hero"><div class="section-shell"><p class="eyebrow">Nike footwear <span></span></p><h1>Find your<br><em>next move.</em></h1><p>Performance-led footwear for every pace, practice, and possibility.</p></div></header>
    <section class="shop-content section-shell">
      <div class="shop-toolbar"><div><p class="eyebrow eyebrow--dark">The collection</p><h2>All shoes</h2></div><div class="shop-toolbar__controls"><label class="shop-search"><span class="sr-only">Search products</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.8"/><path d="m16 16 4 4"/></svg><input type="search" data-search placeholder="Search by name, category or model" autocomplete="off"></label><button class="filter-toggle" type="button" data-action="toggle-filters" aria-expanded="false" aria-controls="shop-filters">Filters</button><label class="sort-select"><span class="sr-only">Sort products</span><select data-sort><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="name-asc">Name: A–Z</option><option value="name-desc">Name: Z–A</option></select></label></div></div>
      <div class="shop-layout"><aside class="shop-filters" id="shop-filters" data-filter-slot aria-label="Product filters"></aside><div class="shop-results"><div class="shop-results__top"><p data-result-count aria-live="polite">Loading styles</p><button type="button" data-action="clear-filters">Reset</button></div><div class="catalog-grid" data-shop-results aria-busy="true">${skeletons()}</div><button class="load-more" type="button" data-load-more>Load more</button></div></div>
    </section>
  </section>`;
}

export function init() {
  const shop = document.querySelector('[data-page="shop"]');
  renderFilterPanel();
  const search = document.querySelector('[data-search]');
  search.addEventListener('input', () => { state.query = search.value; requestRender(); });
  document.querySelector('[data-sort]').addEventListener('change', (event) => { state.sort = event.target.value; requestRender(); });
  shop.addEventListener('change', handleFilterChange);
  shop.addEventListener('click', handleAction);
  window.setTimeout(() => { document.querySelector('[data-shop-results]')?.setAttribute('aria-busy', 'false'); renderProducts(); }, 180);
}

function handleFilterChange(event) {
  if (!event.target.closest('[data-component="filter-panel"]')) return;
  state[event.target.name] = event.target.value;
  requestRender();
}

function handleAction(event) {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action || !document.querySelector('[data-page="shop"]')) return;
  if (action === 'clear-filters') { clearFilters(); return; }
  if (action === 'toggle-filters') { const sidebar = document.querySelector('.shop-filters'); const button = event.target.closest('button'); sidebar.classList.toggle('is-open'); button.setAttribute('aria-expanded', sidebar.classList.contains('is-open')); return; }
  if (action === 'cart') {
    const id = event.target.closest('[data-product-id]').dataset.productId;
    const product = getProductById(id);
    addToCart({ id, size: product.sizes[0], color: product.colors[0] }); event.target.textContent = 'Added'; window.setTimeout(() => { event.target.textContent = 'Add to bag'; }, 1100); return;
  }
  if (action === 'wishlist') {
    const id = event.target.closest('[data-product-id]').dataset.productId;
    toggleWishlist(id); renderProducts();
  }
  if (action === 'load-more') { state.visibleCount += PAGE_SIZE; renderProducts(); }
}
