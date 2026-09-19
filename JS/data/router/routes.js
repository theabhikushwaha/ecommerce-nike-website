export const routes = [
  { path: '/', title: 'Home', description: 'Discover Nike footwear built for every pace, practice, and possibility.', load: () => import('../../pages/home.js') },
  { path: '/shop', title: 'Shop', description: 'Explore Nike performance footwear for running, training, and everyday movement.', load: () => import('../../pages/shop.js') },
  { path: '/product', title: 'Product', description: 'Explore Nike footwear details, available colours, sizes, and performance features.', load: () => import('../../pages/product.js') },
  { path: '/search', title: 'Search', description: 'Search the Nike footwear collection.', load: () => import('../../pages/search.js') },
  { path: '/wishlist', title: 'Wishlist', description: 'View your saved Nike styles.', load: () => import('../../pages/wishlist.js') },
  { path: '/cart', title: 'Shopping bag', description: 'Review the Nike styles in your shopping bag.', load: () => import('../../pages/cart.js') },
  { path: '/checkout', title: 'Checkout', description: 'Continue to checkout.', load: () => import('../../pages/checkout.js') },
  { path: '/account', title: 'Account', description: 'Manage your Nike account.', load: () => import('../../pages/account.js') },
  { path: '/about', title: 'About', description: 'Learn about Nike and the movement behind our footwear.', load: () => import('../../pages/about.js') },
  { path: '/contact', title: 'Contact', description: 'Get in touch with Nike support.', load: () => import('../../pages/contact.js') },
  { path: '*', title: 'Page not found', description: 'The page you requested could not be found.', load: () => import('../../pages/not-found.js') },
];
