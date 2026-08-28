const option = (label, value, field, current) => `<label class="filter-option"><input type="radio" name="${field}" value="${value}" ${current === value ? 'checked' : ''}><span>${label}</span></label>`;
const section = (title, content) => `<fieldset class="filter-group"><legend>${title}</legend>${content}</fieldset>`;

export function filterPanel(filters = {}) {
  return `<form class="filter-panel" data-component="filter-panel">
    <div class="filter-panel__top"><h2>Filters</h2><button type="button" data-action="clear-filters">Clear all</button></div>
    ${section('Category', ['All', 'Running', 'Lifestyle', 'Training'].map((item) => option(item, item === 'All' ? '' : item.toLowerCase(), 'category', filters.category)).join(''))}
    ${section('Brand', option('Nike', 'Nike', 'brand', filters.brand))}
    ${section('Price range', `<div class="price-inputs"><label>Min <input type="number" name="minPrice" min="0" step="500" placeholder="0" value="${filters.minPrice ?? ''}"></label><label>Max <input type="number" name="maxPrice" min="0" step="500" placeholder="20,000" value="${filters.maxPrice ?? ''}"></label></div>`)}
    ${section('Shoe size', [5, 6, 7, 8, 9, 10, 11].map((size) => option(String(size), size, 'size', String(filters.size || ''))).join(''))}
    ${section('Color', ['Black', 'White', 'Blue', 'Red', 'Orange', 'Green', 'Purple', 'Brown', 'Gold'].map((item) => option(item, item.toLowerCase(), 'color', filters.color)).join(''))}
    ${section('Availability', [['In stock', 'in-stock'], ['Low stock', 'low-stock'], ['Out of stock', 'out-of-stock']].map(([label, value]) => option(label, value, 'availability', filters.availability)).join(''))}
  </form>`;
}
