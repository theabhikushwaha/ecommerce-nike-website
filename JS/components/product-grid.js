import { productCard } from './product-card.js';
export function productGrid(products, wishlist = []) { return products.map((product) => productCard(product, wishlist)).join(''); }
