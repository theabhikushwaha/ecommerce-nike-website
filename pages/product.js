import { getProductBySlug, getProducts } from '../JS/services/catalog-service.js';
import { addToCart } from '../JS/services/cart-service.js';
import { getWishlist, toggleWishlist } from '../JS/services/wishlist-service.js';
import { formatCurrency } from '../JS/utils/currency.js';
import { quantitySelector } from '../JS/components/quantity-selector.js';
import { productGrid } from '../JS/components/product-grid.js';

const allSizes = [5, 6, 7, 8, 9, 10, 11, 12];
let state;

function detailsFor(product) {
  const discount = product.id === 'air-max-dn8' ? 10 : product.id === 'dunk-low-retro' ? 15 : 0;
  const stock = product.availability === 'out-of-stock' ? 0 : product.availability === 'low-stock' ? 3 : 8;
  return {
    discount, stock, reviewCount: Math.round(product.rating * 83), sku: `NK-${product.model.replace(/[^A-Za-z0-9]/g, '').toUpperCase()}-${product.id.slice(-3).toUpperCase()}`,
    features: ['Engineered comfort for all-day movement', 'Responsive cushioning with stable support', 'Durable traction designed for daily wear'],
    materials: 'Breathable textile upper with synthetic overlays, soft foam midsole, and durable rubber outsole.',
    care: 'Wipe clean with a damp cloth. Air dry away from direct heat. Do not machine wash.',
    reviews: [
      { name: 'Arjun M.', date: '12 June 2026', rating: 5, comment: 'Light, comfortable, and beautifully finished. The fit felt right from the first wear.' },
      { name: 'Nisha K.', date: '28 May 2026', rating: 4, comment: 'Great support for long days on my feet. The colour is even better in person.' },
      { name: 'Dev R.', date: '03 May 2026', rating: 5, comment: 'Premium feel throughout and the cushioning is excellent for everyday training.' }
    ]
  };
}

function art(product, color, thumbnail = false) {
  return `<div class="product-detail__art product-art product-art--${product.art} product-art--color-${color}${thumbnail ? ' product-detail__art--thumb' : ''}" role="img" aria-label="${product.name} in ${color}"><span class="product-art__shoe" aria-hidden="true"></span></div>`;
}

function price(product) {
  const { discount } = state.detail;
  const salePrice = discount ? Math.round(product.price * (1 - discount / 100)) : product.price;
  return `<div class="product-price"><strong>${formatCurrency(salePrice)}</strong>${discount ? `<del>${formatCurrency(product.price)}</del><span>${discount}% off</span>` : ''}</div>`;
}

function productNotFound() { return `<section class="product-not-found section-shell"><p class="eyebrow eyebrow--dark">Product unavailable</p><h1>We couldn't find<br>that shoe.</h1><a class="button" href="#/shop">Explore the shop</a></section>`; }

export function render({ query }) {
  const product = getProductBySlug(query.get('slug'));
  if (!product) return productNotFound();
  state = { product, detail: detailsFor(product), color: product.colors[0], size: '', quantity: 1 };
  const { detail } = state;
  const isSaved = getWishlist().includes(product.id);
  const related = getProducts({ category: product.category }).filter((item) => item.id !== product.id).slice(0, 3);
  return `<section class="product-page" data-page="product">
    <nav class="breadcrumbs section-shell" aria-label="Breadcrumb"><a href="#/">Home</a><span>→</span><a href="#/shop">Shop</a><span>→</span><a href="#/shop">${product.category}</a><span>→</span><span aria-current="page">${product.name}</span></nav>
    <section class="product-detail section-shell">
      <div class="product-gallery"><div class="product-gallery__main" data-main-image>${art(product, state.color)}</div><div class="product-gallery__thumbs" role="group" aria-label="Choose product colour">${product.colors.map((color) => `<button type="button" data-action="select-color" data-color="${color}" class="${color === state.color ? 'is-active' : ''}" aria-label="View ${color} colour" aria-pressed="${color === state.color}">${art(product, color, true)}</button>`).join('')}</div></div>
      <div class="product-summary"><p class="eyebrow eyebrow--dark">${product.brand} · ${product.category}</p><h1>${product.name}</h1><div class="product-rating" aria-label="Rated ${product.rating} out of 5 stars">★★★★★ <a href="#/product?slug=${product.slug}&anchor=reviews">${product.rating} (${detail.reviewCount} reviews)</a></div>${price(product)}
        <p class="product-summary__description">${product.description} Designed to make every step feel effortless.</p><dl class="product-meta"><div><dt>SKU</dt><dd>${detail.sku}</dd></div><div><dt>Availability</dt><dd class="availability availability--${product.availability}">${detail.stock ? product.availability.replace('-', ' ') : 'Out of stock'}</dd></div></dl>
        <fieldset class="product-options"><legend>Colour <strong data-selected-color>${state.color}</strong></legend><div class="color-swatches">${product.colors.map((color) => `<button type="button" class="swatch swatch--${color} ${color === state.color ? 'is-active' : ''}" data-action="select-color" data-color="${color}" aria-label="Select ${color}" aria-pressed="${color === state.color}"></button>`).join('')}</div></fieldset>
        <fieldset class="product-options"><legend>Size <strong data-selected-size>${state.size || 'Select a size'}</strong></legend><div class="size-grid">${allSizes.map((size) => `<button type="button" data-action="select-size" data-size="${size}" ${!product.sizes.includes(size) || !detail.stock ? 'disabled' : ''} aria-pressed="false">${size}</button>`).join('')}</div><p class="size-note">${detail.stock ? 'Select your usual size. Unavailable sizes are disabled.' : 'This product is currently unavailable.'}</p></fieldset>
        <div class="purchase-row">${quantitySelector({ max: detail.stock || 1 })}<button class="purchase-button" type="button" data-action="add-cart" ${!detail.stock ? 'disabled' : ''}>Add to bag</button></div><button class="buy-now" type="button" data-action="buy-now" ${!detail.stock ? 'disabled' : ''}>Buy now</button>
        <div class="product-utility"><button type="button" data-action="wishlist" aria-pressed="${isSaved}">${isSaved ? '♥ Saved to wishlist' : '♡ Add to wishlist'}</button><button type="button" data-action="share">Share product</button></div><p class="product-status" data-product-status aria-live="polite"></p>
      </div>
    </section>
    <section class="product-information section-shell"><details open><summary>Overview <span>+</span></summary><p>${product.description} This ${product.category} silhouette combines considered design with everyday versatility.</p></details><details><summary>Features <span>+</span></summary><ul>${detail.features.map((feature) => `<li>${feature}</li>`).join('')}</ul></details><details><summary>Materials <span>+</span></summary><p>${detail.materials}</p></details><details><summary>Specifications <span>+</span></summary><p>Model: ${product.model}<br>Category: ${product.category}<br>SKU: ${detail.sku}</p></details><details><summary>Care instructions <span>+</span></summary><p>${detail.care}</p></details></section>
    <section class="related-products section-shell"><div class="product-section-heading"><div><p class="eyebrow eyebrow--dark">Keep moving</p><h2>Pairs well with.</h2></div><a href="#/shop">View all shoes →</a></div><div class="catalog-grid related-grid">${productGrid(related, getWishlist())}</div></section>
    <section class="reviews section-shell" id="reviews"><div><p class="eyebrow eyebrow--dark">Community feedback</p><h2>Built for<br>real movement.</h2></div><div class="review-summary"><strong>${product.rating}</strong><div><p class="review-stars">★★★★★</p><p>Based on ${detail.reviewCount} reviews</p></div><div class="rating-bars" aria-label="Rating distribution"><span><i style="width:82%"></i></span><span><i style="width:14%"></i></span><span><i style="width:4%"></i></span></div></div><div class="review-list">${detail.reviews.map((review) => `<article><div><p class="review-stars">${'★'.repeat(review.rating)}<span>${'★'.repeat(5 - review.rating)}</span></p><time>${review.date}</time></div><h3>${review.name}</h3><p>${review.comment}</p></article>`).join('')}</div></section>
  </section>`;
}

function updateSelection() {
  const page = document.querySelector('[data-page="product"]');
  page.querySelector('[data-main-image]').innerHTML = art(state.product, state.color);
  page.querySelectorAll('[data-action="select-color"]').forEach((button) => { const active = button.dataset.color === state.color; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', active); });
  page.querySelectorAll('[data-action="select-size"]').forEach((button) => { const active = button.dataset.size === state.size; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', active); });
  page.querySelector('[data-selected-color]').textContent = state.color;
  page.querySelector('[data-selected-size]').textContent = state.size || 'Select a size';
}

function updateQuantity() {
  const control = document.querySelector('[data-component="quantity-selector"]');
  control.dataset.value = state.quantity; control.querySelector('[data-quantity-value]').textContent = state.quantity;
  control.querySelector('[data-action="decrease-quantity"]').disabled = state.quantity <= 1;
  control.querySelector('[data-action="increase-quantity"]').disabled = state.quantity >= state.detail.stock;
}

export function init() {
  const page = document.querySelector('[data-page="product"]');
  if (!page || !state) return;
  page.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]'); if (!button) return;
    const { action } = button.dataset;
    if (action === 'select-color') { state.color = button.dataset.color; updateSelection(); }
    if (action === 'select-size') { state.size = button.dataset.size; updateSelection(); }
    if (action === 'increase-quantity') { state.quantity = Math.min(state.quantity + 1, state.detail.stock); updateQuantity(); }
    if (action === 'decrease-quantity') { state.quantity = Math.max(state.quantity - 1, 1); updateQuantity(); }
    if (action === 'wishlist') {
      const productId = button.closest('[data-product-id]')?.dataset.productId || state.product.id;
      const saved = toggleWishlist(productId).includes(productId);
      if (button.closest('.catalog-card')) { button.classList.toggle('is-saved', saved); button.setAttribute('aria-pressed', saved); }
      else { button.textContent = saved ? '♥ Saved to wishlist' : '♡ Add to wishlist'; button.setAttribute('aria-pressed', saved); }
    }
    if (action === 'cart') {
      const product = getProducts().find((item) => item.id === button.closest('[data-product-id]').dataset.productId);
      addToCart({ id: product.id, size: product.sizes[0], color: product.colors[0] });
      button.textContent = 'Added'; window.setTimeout(() => { button.textContent = 'Add to bag'; }, 1200);
    }
    if (action === 'add-cart' || action === 'buy-now') {
      const status = page.querySelector('[data-product-status]');
      if (!state.size) { status.textContent = 'Select a size before adding to bag.'; page.querySelector('[data-action="select-size"]:not([disabled])')?.focus(); return; }
      addToCart({ id: state.product.id, quantity: state.quantity, size: state.size, color: state.color });
      status.textContent = action === 'buy-now' ? 'Ready for checkout — your bag has been updated.' : `${state.quantity} item${state.quantity > 1 ? 's' : ''} added to your bag.`;
      if (action === 'add-cart') { button.textContent = 'Added to bag'; window.setTimeout(() => { button.textContent = 'Add to bag'; }, 1200); }
    }
    if (action === 'share') {
      const status = page.querySelector('[data-product-status]');
      const shareData = { title: state.product.name, text: state.product.description, url: window.location.href };
      try { if (navigator.share) await navigator.share(shareData); else { await navigator.clipboard?.writeText(window.location.href); status.textContent = 'Product link copied to your clipboard.'; } } catch { status.textContent = 'Share cancelled.'; }
    }
  });
}
