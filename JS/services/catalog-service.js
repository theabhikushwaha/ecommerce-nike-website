import { products } from '../data/products.js';

export function getProducts(filters = {}) {
  const query = (filters.query || '').trim().toLowerCase();
  const result = products.filter((product) => {
    const searchable = `${product.name} ${product.category} ${product.model}`.toLowerCase();
    return (!query || searchable.includes(query))
      && (!filters.category || product.category === filters.category)
      && (!filters.brand || product.brand === filters.brand)
      && (!filters.color || product.colors.includes(filters.color))
      && (!filters.size || product.sizes.includes(Number(filters.size)))
      && (!filters.availability || product.availability === filters.availability)
      && product.price >= (filters.minPrice ?? 0)
      && product.price <= (filters.maxPrice ?? Infinity);
  });
  return sortProducts(result, filters.sort);
}

export function sortProducts(productsToSort, sort = 'featured') {
  const sorted = [...productsToSort];
  const directions = {
    featured: (a, b) => Number(b.featured) - Number(a.featured) || Number(b.newest) - Number(a.newest),
    newest: (a, b) => Number(b.newest) - Number(a.newest),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'name-asc': (a, b) => a.name.localeCompare(b.name),
    'name-desc': (a, b) => b.name.localeCompare(a.name)
  };
  return sorted.sort(directions[sort] || directions.featured);
}

export function getProductBySlug(slug) { return products.find((product) => product.slug === slug); }
export function getProductById(id) { return products.find((product) => product.id === id); }
