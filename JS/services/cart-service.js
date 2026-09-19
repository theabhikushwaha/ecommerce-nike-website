import { STORAGE_KEYS } from '../config/constants.js';
import { emitStoreChange } from './store-events.js';

export function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
}

export function addToCart({ id, quantity = 1, size, color }) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === id && entry.size === size && entry.color === color);
  if (item) item.quantity = (item.quantity || 1) + quantity;
  else cart.push({ id, quantity, size, color });
  saveCart(cart);
  emitStoreChange('cart', 'add', id);
  return cart;
}

export function updateCartQuantity({ id, size, color, quantity }) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === id && entry.size === size && entry.color === color);
  if (!item) return cart;
  item.quantity = Math.max(1, Number(quantity) || 1);
  saveCart(cart);
  emitStoreChange('cart', 'update', id);
  return cart;
}

export function removeFromCart({ id, size, color }) {
  const cart = getCart().filter((entry) => !(entry.id === id && entry.size === size && entry.color === color));
  saveCart(cart);
  emitStoreChange('cart', 'remove', id);
  return cart;
}
