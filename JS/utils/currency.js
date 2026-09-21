export function formatCurrency(value, locale = 'en-IN', currency = 'INR') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}
