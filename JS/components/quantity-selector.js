export function quantitySelector({ value = 1, min = 1, max = 8 } = {}) {
  return `<div class="quantity-selector" data-component="quantity-selector" data-value="${value}" aria-label="Quantity selector">
    <button type="button" data-action="decrease-quantity" aria-label="Decrease quantity" ${value <= min ? 'disabled' : ''}>−</button>
    <output data-quantity-value aria-live="polite">${value}</output>
    <button type="button" data-action="increase-quantity" aria-label="Increase quantity" ${value >= max ? 'disabled' : ''}>+</button>
  </div>`;
}
