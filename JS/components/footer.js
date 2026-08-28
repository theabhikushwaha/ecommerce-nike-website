export function renderFooter(container) {
  container.dataset.component = 'site-footer';
  container.innerHTML = `<div class="footer section-shell"><div class="footer__top"><a class="brand" href="#/" aria-label="Nike home"><span class="brand__mark">NIKE</span></a><div><p>Find a store</p><p>Become a member</p><p>Send us feedback</p></div><div><p>Help</p><p>Order status</p><p>Delivery</p><p>Returns</p></div><div><p>About Nike</p><p>News</p><p>Careers</p><p>Investors</p></div></div><div class="footer__bottom"><span>© 2026 Nike, Inc. All Rights Reserved</span><span>India / English</span><span>Guides &nbsp; Terms &nbsp; Privacy</span></div></div>`;
}
