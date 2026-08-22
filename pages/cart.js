import { getCart, removeFromCart, updateCartQuantity, addToCart } from '../JS/services/cart-service.js';
import { getProductById, getProducts } from '../JS/services/catalog-service.js';
import { formatCurrency } from '../JS/utils/currency.js';
import { cartItem } from '../JS/components/cart-item.js';
import { productGrid } from '../JS/components/product-grid.js';
import { getWishlist, toggleWishlist } from '../JS/services/wishlist-service.js';
import { showToast } from '../JS/components/toast.js';

const PROMOS = Object.freeze({ NIKE10: 0.10, WELCOME15: 0.15 });
let state = { promo: '', message: '', messageType: '' };

function cartProducts() {
  return getCart().map((item) => ({ ...item, product: getProductById(item.id) })).filter((item) => item.product);
}

function totals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = Math.round(subtotal * (PROMOS[state.promo] || 0));
  const shipping = subtotal === 0 || subtotal >= 10000 ? 0 : 499;
  const tax = Math.round((subtotal - discount) * 0.05);
  return { subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax };
}

function emptyCart() {
  return `<section class="cart-empty" aria-labelledby="empty-cart-title"><div class="cart-empty__illustration" aria-hidden="true"><span></span><i></i></div><p class="eyebrow eyebrow--dark">Your bag is waiting</p><h1 id="empty-cart-title">Nothing here<br>yet.</h1><p>Find the pair that moves with you. Your next favourite is just a step away.</p><a class="cart-primary-button" href="#/shop">Continue shopping <span aria-hidden="true">→</span></a></section>`;
}

function summary(total) {
  const promoLabel = state.promo ? `${state.promo} applied` : 'Promo code';
  return `<aside class="cart-summary" aria-label="Order summary"><div class="cart-summary__heading"><p class="eyebrow eyebrow--dark">Order summary</p><h2>Your total.</h2></div>
    <dl><div><dt>Subtotal</dt><dd>${formatCurrency(total.subtotal)}</dd></div><div><dt>Estimated shipping</dt><dd>${total.shipping ? formatCurrency(total.shipping) : 'Free'}</dd></div><div><dt>Estimated tax</dt><dd>${formatCurrency(total.tax)}</dd></div><div class="cart-summary__discount"><dt>${promoLabel}</dt><dd>${total.discount ? `−${formatCurrency(total.discount)}` : '—'}</dd></div><div class="cart-summary__total"><dt>Total</dt><dd>${formatCurrency(total.total)}</dd></div></dl>
    <form class="promo-form" data-promo-form novalidate><label for="promo-code">Promo code</label><div><input id="promo-code" name="promo" value="${state.promo}" placeholder="Enter code" autocomplete="off"><button type="submit">Apply</button></div><p class="promo-form__message ${state.messageType}" data-promo-message aria-live="polite">${state.message}</p></form>
    <button class="cart-primary-button cart-checkout" type="button" data-action="checkout">Secure checkout <span aria-hidden="true">→</span></button><p class="checkout-status" data-checkout-status aria-live="polite"></p>
    <div class="payment-methods" aria-label="Accepted payment methods"><span>VISA</span><span>mastercard</span><span>UPI</span><span>Pay</span></div><div class="delivery-estimate"><b>Delivery estimate</b><span>Arrives in 3–5 business days</span></div><div class="trust-badges"><span>⌁ Free returns within 30 days</span><span>⌾ Encrypted & secure payment</span></div></aside>`;
}

function cartContent() {
  const items = cartProducts();
  if (!items.length) return emptyCart();
  const total = totals(items);
  return `<section class="cart-layout"><div class="cart-lines"><div class="cart-lines__top"><p>${items.reduce((count, item) => count + item.quantity, 0)} item${items.reduce((count, item) => count + item.quantity, 0) === 1 ? '' : 's'} in your bag</p><a href="#/shop">Continue shopping</a></div><div class="cart-items">${items.map(cartItem).join('')}</div><p class="cart-shipping-note">Free standard delivery on orders over ${formatCurrency(10000)}.</p></div>${summary(total)}</section>`;
}

function recommendations(items) {
  const selected = new Set(items.map((item) => item.product.id));
  return getProducts({ sort: 'featured' }).filter((product) => !selected.has(product.id)).slice(0, 3);
}

function renderContent() {
  const page = document.querySelector('[data-page="cart"]');
  if (!page) return;
  const items = cartProducts();
  page.querySelector('[data-cart-content]').innerHTML = cartContent();
  page.querySelector('[data-cart-recommendations]').innerHTML = productGrid(recommendations(items), getWishlist());
}

export function render() {
  const items = cartProducts();
  return `<section class="cart-page" data-page="cart"><header class="cart-hero"><div class="section-shell"><p class="eyebrow">Nike bag <span></span></p><h1>Your bag,<br><em>considered.</em></h1></div></header><div class="cart-content section-shell" data-cart-content>${cartContent()}</div><section class="cart-recommendations section-shell"><div class="cart-recommendations__heading"><div><p class="eyebrow eyebrow--dark">Complete the look</p><h2>Made to move<br>together.</h2></div><a href="#/shop">Shop all shoes →</a></div><div class="catalog-grid" data-cart-recommendations>${productGrid(recommendations(items), getWishlist())}</div></section></section>`;
}

function cartItemFrom(button) {
  const item = button.closest('[data-cart-item]');
  return { id: item.dataset.productId, size: item.dataset.size || undefined, color: item.dataset.color || undefined };
}

export function init() {
  const page = document.querySelector('[data-page="cart"]');
  if (!page) return;
  page.addEventListener('submit', (event) => {
    if (!event.target.matches('[data-promo-form]')) return;
    event.preventDefault();
    const code = new FormData(event.target).get('promo').trim().toUpperCase();
    if (PROMOS[code]) { state = { promo: code, message: `${code} applied to your order.`, messageType: 'is-success' }; showToast(`${code} applied to your order.`); }
    else { state = { promo: '', message: code ? 'That code is not available. Try NIKE10 or WELCOME15.' : 'Enter a promo code to apply it.', messageType: 'is-error' }; showToast(state.message, 'error'); }
    renderContent();
  });
  page.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'increase-quantity' || action === 'decrease-quantity') {
      const entry = cartItemFrom(button); const current = getCart().find((item) => item.id === entry.id && item.size === entry.size && item.color === entry.color);
      const quantity = Math.max(1, (current?.quantity || 1) + (action === 'increase-quantity' ? 1 : -1));
      updateCartQuantity({ ...entry, quantity });
      const line = button.closest('[data-cart-item]'); line.classList.add('is-updating'); window.setTimeout(renderContent, 160);
      return;
    }
    if (action === 'remove-cart-item') {
      const line = button.closest('[data-cart-item]'); line.classList.add('is-removing');
      window.setTimeout(() => { removeFromCart(cartItemFrom(button)); renderContent(); }, 220);
      return;
    }
    if (action === 'save-for-later') {
      const status = page.querySelector('[data-checkout-status]');
      if (status) status.textContent = 'Save for later is not available in this demo.';
      return;
    }
    if (action === 'checkout') { page.querySelector('[data-checkout-status]').textContent = 'Checkout is not available in this demo.'; return; }
    if (action === 'wishlist') {
      const card = button.closest('[data-product-id]');
      const saved = toggleWishlist(card.dataset.productId).includes(card.dataset.productId);
      button.classList.toggle('is-saved', saved); button.setAttribute('aria-pressed', saved);
      button.setAttribute('aria-label', `${saved ? 'Remove' : 'Add'} ${getProductById(card.dataset.productId).name} ${saved ? 'from' : 'to'} wishlist`);
      return;
    }
    if (action === 'cart') {
      const product = getProductById(button.closest('[data-product-id]').dataset.productId);
      addToCart({ id: product.id, size: product.sizes[0], color: product.colors[0] });
      button.textContent = 'Added'; window.setTimeout(() => { button.textContent = 'Add to bag'; }, 1000);
    }
  });
}


// export function render() { return '<section data-page="cart"></section>'; }

export function render() { return '<section data-page="cart"></section>'; }
