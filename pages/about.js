import { newsletter, initNewsletter } from '../JS/components/newsletter.js';

const team = [['Maya Rao', 'Creative Director', 'Shapes the stories and details that make every launch feel personal.'], ['Arjun Mehta', 'Head of Product', 'Turns athlete insight into comfort you can feel from the first step.'], ['Zoya Khan', 'Member Experience', 'Makes every interaction as considered as the product itself.']];
const featureIcons = {
  quality: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7L5.2 8l4.7-.7L12 3Z"/></svg>',
  shipping: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v11H3zM14 10h3l4 4v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>',
  secure: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.7 3 8 7 10 4-2 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  returns: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V4m0 0h4M4 4l4 4a8 8 0 1 1-1.2 10"/></svg>',
  support: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><path d="M4 13h3v5H5a1 1 0 0 1-1-1v-4Zm13 0h3v4a1 1 0 0 1-1 1h-2v-5ZM17 18c0 2-2 3-5 3"/></svg>',
  authentic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></svg>'
};
const serviceFeatures = [['quality', 'Well-made materials', 'Materials selected for regular wear, training, and the miles in between.'], ['shipping', 'Delivery updates', 'Clear delivery updates from checkout to your door.'], ['secure', 'Secure checkout', 'Payments are handled with modern security standards.'], ['returns', 'Easy returns', 'Try your pair at home, then return unworn items within 30 days.'], ['support', 'Helpful support', 'Get practical help when you need it.'], ['authentic', 'Quality checked', 'Every pair is checked for comfort, fit, and finish.']];
const values = [['↗', 'Innovation', 'We stay curious, test relentlessly, and turn athlete insight into better movement.'], ['◌', 'Sustainability', 'We make considered choices that help leave a lighter step for tomorrow.'], ['◒', 'Performance', 'Every material and detail earns its place through real-world motion.'], ['✦', 'Customer First', 'We design every interaction around clarity, confidence, and care.']];

export function render() {
  return `<section class="about-page" data-page="about"><header class="about-hero"><div class="section-shell"><p class="eyebrow">Our story <span></span></p><h1>Made for the<br><em>way you move.</em></h1><p>We believe performance is personal: a feeling of confidence, possibility, and forward motion.</p></div><div class="about-hero__banner" role="img" aria-label="Abstract Nike-inspired performance shoe illustration"><span class="product-art__shoe" aria-hidden="true"></span></div></header>
  <section class="about-story section-shell"><div><p class="eyebrow eyebrow--dark">More than product</p><h2>Movement is<br>our medium.</h2></div><div class="about-story__copy"><p>We create footwear for the moments that matter: the early run, the first rep, the long walk home, and everything in between.</p><div class="about-story__pillars"><article><b>Vision</b><p>A world where every person can discover the joy of movement.</p></article><article><b>Mission</b><p>Bring inspiration and innovation to every athlete—wherever they are.</p></article><article><b>Innovation</b><p>Listen closely, test relentlessly, and make every step feel better.</p></article><article><b>Performance</b><p>Comfort, confidence, and craft working together in motion.</p></article><article><b>Sustainability</b><p>Designing more thoughtfully for a lighter footprint tomorrow.</p></article></div></div></section>
  <section class="about-values"><div class="section-shell"><p class="eyebrow">What guides us</p><h2>Built on<br>better ideas.</h2><div class="about-values__grid">${values.map(([icon, title, text]) => `<article><span aria-hidden="true">${icon}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></div></section>
  <section class="about-features section-shell"><div class="section-heading"><div><p class="eyebrow eyebrow--dark">The Swoosh standard</p><h2>Why choose us.</h2></div><p class="heading-note">Practical details that make shopping simpler.</p></div><div class="about-features__grid">${serviceFeatures.map(([icon, title, text]) => `<article><span class="about-feature__icon">${featureIcons[icon]}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div></section>
  <section class="about-stats"><div class="section-shell"><p class="eyebrow">By the numbers</p><div class="about-stats__grid"><article><strong data-counter="250" data-suffix="K+">0</strong><span>Happy customers</span></article><article><strong data-counter="1.8" data-suffix="M+">0</strong><span>Products sold</span></article><article><strong data-counter="42" data-suffix="+">0</strong><span>Countries served</span></article><article><strong data-counter="18" data-suffix="">0</strong><span>Years of experience</span></article></div></div></section>
  <section class="about-team section-shell"><div class="section-heading"><div><p class="eyebrow eyebrow--dark">The people behind the pace</p><h2>Meet the team.</h2></div></div><div class="about-team__grid">${team.map(([name, position, bio], index) => `<article><div class="about-team__portrait about-team__portrait--${index + 1}" role="img" aria-label="Team profile for ${name}"><span>${name.split(' ').map((part) => part[0]).join('')}</span></div><p>${position}</p><h3>${name}</h3><small>${bio}</small></article>`).join('')}</div></section>${newsletter()}</section>`;
}

export function init() {
  initNewsletter();
  const counters = document.querySelectorAll('[data-page="about"] [data-counter]');
  const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target; const target = Number(element.dataset.counter); const started = performance.now();
    const draw = (now) => { const progress = Math.min((now - started) / 900, 1); const value = target * (1 - (1 - progress) ** 3); element.textContent = `${target % 1 ? value.toFixed(1) : Math.round(value)}${element.dataset.suffix}`; if (progress < 1) requestAnimationFrame(draw); };
    requestAnimationFrame(draw); currentObserver.unobserve(element);
  }), { threshold: 0.35 });
  counters.forEach((counter) => observer.observe(counter));
}
