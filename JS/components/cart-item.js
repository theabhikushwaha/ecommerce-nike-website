import { formatCurrency } from '../utils/currency.js';
import { quantitySelector } from './quantity-selector.js';

export function cartItem({ product, quantity, size, color }) {
  const sizeLabel = size || 'Standard';
  const colorLabel = color || product.colors[0];
  return `<article class="cart-item" data-cart-item data-product-id="${product.id}" data-size="${size || ''}" data-color="${color || ''}">
    <a class="cart-item__art product-art product-art--${product.art} product-art--color-${colorLabel}" href="#/product?slug=${product.slug}" aria-label="View ${product.name}"><span class="product-art__shoe" aria-hidden="true"></span></a>
    <div class="cart-item__details">
      <div class="cart-item__heading"><div><p>${product.category} · ${product.brand}</p><h2><a href="#/product?slug=${product.slug}">${product.name}</a></h2></div><strong>${formatCurrency(product.price * quantity)}</strong></div>
      <p class="cart-item__options">Size <b>${sizeLabel}</b><span></span>Colour <b>${colorLabel}</b></p>
      <div class="cart-item__footer">${quantitySelector({ value: quantity, max: 8 })}<span class="cart-item__unit-price">${formatCurrency(product.price)} each</span><div class="cart-item__actions"><button type="button" data-action="save-for-later">Save for later</button><button type="button" data-action="remove-cart-item" aria-label="Remove ${product.name} from bag">Remove</button></div></div>
    </div>
  </article>`;
}
