export const CART_KEY = 'shop-cart';

export const cartScript = `
const CART_KEY = '${'shop-cart'}';
const toFinite = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};
const toQty = (value) => {
  const qty = Math.floor(toFinite(value, 1));
  return qty > 0 ? qty : 1;
};
const sanitizeItem = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const slug = String(raw.slug || '').trim();
  if (!slug) return null;

  return {
    slug,
    name: String(raw.name || slug),
    price: toFinite(raw.price, 0),
    category: String(raw.category || ''),
    image: String(raw.image || ''),
    shortDescription: String(raw.shortDescription || ''),
    inci: String(raw.inci || ''),
    variantId: raw.variantId ? String(raw.variantId) : undefined,
    variantTitle: raw.variantTitle ? String(raw.variantTitle) : undefined,
    variant: raw.variant ? String(raw.variant) : undefined,
    qty: toQty(raw.qty)
  };
};
const readCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeItem).filter(Boolean);
  } catch {
    return [];
  }
};
const writeCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(Array.isArray(cart) ? cart : []));
const itemKey = (item) => [item.slug, item.variant || 'base'].join('::');
const addToCart = (product) => {
  const safeProduct = sanitizeItem({ ...product, qty: 1 });
  if (!safeProduct) throw new Error('Invalid product payload');

  const cart = readCart();
  const found = cart.find((item) => itemKey(item) === itemKey(safeProduct));
  if (found) found.qty += 1;
  else cart.push(safeProduct);
  writeCart(cart);
};
window.shopCart = { readCart, writeCart, addToCart };
`;
