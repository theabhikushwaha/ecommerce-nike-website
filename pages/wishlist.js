import { getWishlist, toggleWishlist } from '../JS/services/wishlist-service.js';
import { getProductById } from '../JS/services/catalog-service.js';
import { addToCart } from '../JS/services/cart-service.js';
import { productGrid } from '../JS/components/product-grid.js';

function savedProducts() { return getWishlist().map(getProductById).filter(Boolean); }

function emptyWishlist() {
  return `<section class="experience-empty" aria-labelledby="wishlist-empty-title"><div class="experience-empty__art" aria-hidden="true">♡</div><p class="eyebrow eyebrow--dark">Your saved styles</p><h1 id="wishlist-empty-title">Nothing saved<br>just yet.</h1><p>Tap the heart on any pair to keep it close for later.</p><a class="experience-button" href="#/shop">Explore shoes <span aria-hidden="true">-></span></a></section>`;
}

function content() {
  const products = savedProducts();
  return products.length ? `<div class="wishlist-grid catalog-grid">${productGrid(products, getWishlist())}</div>` : emptyWishlist();
}

export function render() {
  const products = savedProducts();
  return `<section class="wishlist-page" data-page="wishlist"><header class="experience-hero"><div class="section-shell"><p class="eyebrow">Wishlist <span></span></p><h1>Saved for<br><em>your next move.</em></h1><p>${products.length ? `${products.length} style${products.length === 1 ? '' : 's'} ready whenever you are.` : 'The pairs you love, gathered in one place.'}</p></div></header><section class="wishlist-content section-shell" data-wishlist-content>${content()}</section></section>`;
}

export function init() {
  const page = document.querySelector('[data-page="wishlist"]');
  page?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const card = button.closest('[data-product-id]');
    if (!card) return;
    const product = getProductById(card.dataset.productId);
    if (button.dataset.action === 'wishlist') { toggleWishlist(product.id); page.querySelector('[data-wishlist-content]').innerHTML = content(); }
    if (button.dataset.action === 'cart') { addToCart({ id: product.id, size: product.sizes[0], color: product.colors[0] }); }
  });
}
