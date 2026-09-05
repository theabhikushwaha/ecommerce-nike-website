import { showToast } from './toast.js';

const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg>';

export function newsletter() {
  return `<section class="newsletter" data-component="newsletter"><div class="newsletter__orb" aria-hidden="true"></div><div class="section-shell newsletter__inner reveal"><p class="eyebrow">Nike members get more</p><h2>Stay one step<br>ahead.</h2><p>Join us for first access to new releases, member-only drops, and stories made to move you.</p><form class="newsletter__form" novalidate><label class="sr-only" for="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required aria-describedby="newsletter-status"><button type="submit" aria-label="Subscribe">${arrow}</button></form><small id="newsletter-status" data-newsletter-status role="status">By signing up, you agree to receive Nike news and offers.</small></div></section>`;
}

export function initNewsletter(scope = document) {
  scope.querySelector('[data-component="newsletter"] .newsletter__form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.querySelector('input');
    const status = form.closest('[data-component="newsletter"]').querySelector('[data-newsletter-status]');
    if (!input.checkValidity()) { input.focus(); status.textContent = 'Enter a valid email address to subscribe.'; return; }
    form.classList.add('is-submitted');
    input.value = '';
    status.textContent = "You're on the list. Watch your inbox for the next drop.";
    showToast('You are on the Nike member list.');
  });
}
