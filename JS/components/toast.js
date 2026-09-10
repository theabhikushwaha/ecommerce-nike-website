const messages = {
  'cart:add': 'Added to your bag.',
  'cart:remove': 'Removed from your bag.',
  'wishlist:add': 'Saved to your wishlist.',
  'wishlist:remove': 'Removed from your wishlist.'
};

export function showToast(message, type = 'success') {
  const region = document.querySelector('[data-toast-region]');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
  toast.innerHTML = `<span aria-hidden="true">${type === 'error' ? '!' : '✓'}</span><p>${message}</p><button type="button" aria-label="Dismiss notification">×</button>`;
  region.append(toast);
  const close = () => { toast.classList.add('is-leaving'); window.setTimeout(() => toast.remove(), 220); };
  toast.querySelector('button').addEventListener('click', close);
  window.setTimeout(close, 3600);
}

export function initToasts() {
  window.addEventListener('store:change', (event) => {
    const message = messages[`${event.detail.store}:${event.detail.action}`];
    if (message) showToast(message);
  });
}
