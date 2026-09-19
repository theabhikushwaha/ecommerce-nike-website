export function emitStoreChange(store, action, productId) {
  window.dispatchEvent(new CustomEvent('store:change', { detail: { store, action, productId } }));
}
