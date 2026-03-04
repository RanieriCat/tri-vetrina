export const CART_KEY = 'shop-cart';

export const cartScript = `
const CART_KEY = '${'shop-cart'}';
const readCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
const writeCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const itemKey = (item) => [item.slug, item.variant || 'base'].join('::');
const addToCart = (product) => {
  const cart = readCart();
  const found = cart.find((item) => itemKey(item) === itemKey(product));
  if (found) found.qty += 1;
  else cart.push({ ...product, qty: 1 });
  writeCart(cart);
};
window.shopCart = { readCart, writeCart, addToCart };
`;
