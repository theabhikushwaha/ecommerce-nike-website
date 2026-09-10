import { formatCurrency } from '../utils/currency.js';

export function productCard(product, wishlist = []) {
  const isSaved = wishlist.includes(product.id);
  return `<article class="catalog-card" data-product-id="${product.id}">
    <div class="catalog-card__visual product-art product-art--${product.art}" role="img" aria-label="${product.name} in ${product.colors[0]}">
      ${product.badge ? `<span class="catalog-card__badge">${product.badge}</span>` : ''}
      <button class="catalog-card__wish ${isSaved ? 'is-saved' : ''}" type="button" data-action="wishlist" aria-label="${isSaved ? 'Remove' : 'Add'} ${product.name} ${isSaved ? 'from' : 'to'} wishlist" aria-pressed="${isSaved}">♡</button>
      <span class="product-art__shoe" aria-hidden="true"></span>
    </div>
    <div class="catalog-card__content">
      <p class="catalog-card__category">${product.category} · ${product.model}</p>
      <div class="catalog-card__title"><h3>${product.name}</h3><strong>${formatCurrency(product.price)}</strong></div>
      <p class="catalog-card__description">${product.description}</p>
      <p class="catalog-card__rating" aria-label="Rated ${product.rating} out of 5">★ <span>${product.rating}</span></p>
      <div class="catalog-card__actions"><button class="catalog-card__cart" type="button" data-action="cart">Add to bag</button><a href="#/product?slug=${product.slug}">View details <span aria-hidden="true">→</span></a></div>
    </div>
  </article>`;
}
