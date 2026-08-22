import { newsletter, initNewsletter } from '../JS/components/newsletter.js';
import { showToast } from '../JS/components/toast.js';

const contactDetails = [
  ['Visit us', '18, Park Street\nBengaluru, KA 560001'],
  ['Call us', '+91 80 4112 0198\nMon-Fri, 9am-6pm'],
  ['Write to us', 'hello@swooshstore.in\nWe reply within one business day'],
  ['Business hours', 'Monday-Friday: 9am-6pm\nSaturday: 10am-4pm']
];
const faqs = [
  ['When will my order arrive?', 'Most orders arrive within 3-5 business days. You will receive tracking details as soon as your order leaves our studio.'],
  ['How do I start a return?', 'Start from your order confirmation or contact our support team. Returns are free within 30 days for unworn items.'],
  ['Can I change my order?', 'We begin preparing orders quickly, but our support team will always check what is possible before dispatch.'],
  ['Which payment methods do you accept?', 'We accept major cards, UPI, and supported digital wallets through our secure checkout.']
];
const socialLinks = [['Instagram', 'IG', 'https://www.instagram.com/'], ['X (Twitter)', 'X', 'https://x.com/'], ['Facebook', 'f', 'https://www.facebook.com/'], ['YouTube', '>', 'https://www.youtube.com/']];

export function render() {
  return `<section class="contact-page" data-page="contact">
    <header class="contact-hero"><div class="section-shell reveal"><p class="eyebrow">Get in touch <span></span></p><h1>Let's make<br><em>moves together.</em></h1><p>Whether you need help with an order or simply want to say hello, our team is here.</p></div></header>
    <section class="contact-main section-shell"><div class="contact-details">${contactDetails.map(([title, text]) => `<article><span aria-hidden="true">+</span><h2>${title}</h2><p>${text.replace('\n', '<br>')}</p></article>`).join('')}</div><section class="contact-form-panel" aria-labelledby="contact-form-title"><div><p class="eyebrow eyebrow--dark">Send a message</p><h2 id="contact-form-title">How can we help?</h2><p>Tell us a little about what you need and we'll get back to you shortly.</p></div><form data-contact-form novalidate><label>Full Name<input name="name" autocomplete="name" required aria-describedby="name-error"></label><small id="name-error" data-error-for="name"></small><label>Email<input name="email" type="email" autocomplete="email" required aria-describedby="email-error"></label><small id="email-error" data-error-for="email"></small><label>Subject<input name="subject" required aria-describedby="subject-error"></label><small id="subject-error" data-error-for="subject"></small><label>Message<textarea name="message" rows="5" required aria-describedby="message-error"></textarea></label><small id="message-error" data-error-for="message"></small><button class="contact-submit" type="submit">Send message <span aria-hidden="true">-></span></button><p class="contact-form__status" data-contact-status aria-live="polite"></p></form></section></section>
    <section class="contact-map section-shell"><div class="contact-map__visual" role="img" aria-label="Location graphic for the Bengaluru studio"><span></span><i>Our Bengaluru studio</i></div><div><p class="eyebrow eyebrow--dark">Find us</p><h2>Come say<br>hello.</h2><p>Our Bengaluru studio is near Park Street. Use the address above to plan your visit.</p></div></section>
    <section class="contact-faq section-shell"><div><p class="eyebrow eyebrow--dark">Helpful answers</p><h2>Frequently asked.</h2></div><div>${faqs.map(([question, answer], index) => `<details ${index === 0 ? 'open' : ''}><summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`).join('')}</div></section>
    <section class="contact-social section-shell" aria-labelledby="social-title"><div><p class="eyebrow eyebrow--dark">Follow the movement</p><h2 id="social-title">Stay in the loop.</h2></div><div class="contact-social__links">${socialLinks.map(([name, mark, url]) => `<a href="${url}" target="_blank" rel="noreferrer" aria-label="Nike on ${name} (opens in a new tab)"><span aria-hidden="true">${mark}</span>${name}</a>`).join('')}</div></section>
    ${newsletter()}</section>`;
}

function validateField(form, field) {
  const error = form.querySelector(`[data-error-for="${field.name}"]`);
  const label = field.name === 'name' ? 'full name' : field.name;
  const message = field.validity.valueMissing ? `Please enter your ${label}.` : field.validity.typeMismatch ? 'Enter a valid email address.' : '';
  error.textContent = message;
  field.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

export function init() {
  initNewsletter();
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const status = form.querySelector('[data-contact-status]');
  form.addEventListener('input', (event) => {
    if (event.target.name) validateField(form, event.target);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = [...form.elements].filter((field) => field.name);
    const valid = fields.every((field) => validateField(form, field));
    if (!valid) {
      status.textContent = 'Please review the highlighted fields.';
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    form.reset();
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
    form.querySelectorAll('[data-error-for]').forEach((error) => { error.textContent = ''; });
    status.textContent = "Thanks - your message has been sent. We'll be in touch soon.";
    showToast('Thanks - your message has been sent.');
  });
}
