import { products as fallbackProducts, type Product } from '@/data/products';

type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

type ShopifyProductsPayload = {
  data?: {
    products?: {
      nodes?: ShopifyProductNode[];
    };
  };
  errors?: Array<{
    message?: string;
  }>;
};

type GetShopProductsOptions = {
  first?: number;
};

const DEFAULT_FIRST = 24;
const productsCache = new Map<number, Promise<Product[]>>();

const fallbackSlice = (first: number) => fallbackProducts.slice(0, Math.min(first, fallbackProducts.length));

const normalizeStoreDomain = (rawDomain: string) =>
  rawDomain
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .split('/')[0];

const getConfig = () => {
  const storeDomain = normalizeStoreDomain(import.meta.env.SHOPIFY_STORE_DOMAIN ?? '');
  const apiVersion = (import.meta.env.SHOPIFY_API_VERSION ?? '').trim();
  const storefrontToken = (import.meta.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN ?? '').trim();

  if (!storeDomain || !apiVersion || !storefrontToken) return null;
  return { storeDomain, apiVersion, storefrontToken };
};

const mapShopifyProduct = (node: ShopifyProductNode): Product => {
  const parsedPrice = Number.parseFloat(node.priceRange?.minVariantPrice?.amount ?? '');
  const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;

  return {
    slug: node.handle,
    name: node.title,
    price,
    category: node.productType || 'Shopify',
    image: node.featuredImage?.url || `https://picsum.photos/seed/shopify-${encodeURIComponent(node.handle || node.id)}/600/380`,
    shortDescription: node.description?.trim() || 'Descrizione non disponibile.',
    inci: 'INCI non disponibile nel feed Shopify corrente.'
  };
};

const fetchShopifyProducts = async (first: number) => {
  const config = getConfig();
  if (!config) return fallbackSlice(first);

  const response = await fetch(`https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': config.storefrontToken
    },
    body: JSON.stringify({
      query: `
        query Products($first: Int!) {
          products(first: $first) {
            nodes {
              id
              title
              handle
              description
              productType
              featuredImage {
                url
                altText
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      `,
      variables: { first }
    })
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ShopifyProductsPayload;
  if (payload.errors?.length) {
    const messages = payload.errors.map((error) => error.message || 'Unknown GraphQL error').join(' | ');
    throw new Error(messages);
  }

  const nodes = payload.data?.products?.nodes;
  if (!Array.isArray(nodes) || nodes.length === 0) return fallbackSlice(first);
  return nodes.map(mapShopifyProduct);
};

export const getShopProducts = async ({ first = DEFAULT_FIRST }: GetShopProductsOptions = {}) => {
  const safeFirst = Number.isFinite(first) && first > 0 ? Math.floor(first) : DEFAULT_FIRST;

  if (!productsCache.has(safeFirst)) {
    productsCache.set(
      safeFirst,
      fetchShopifyProducts(safeFirst).catch((error) => {
        console.error('[shopify] Products fetch failed. Falling back to local demo data.', error);
        return fallbackSlice(safeFirst);
      })
    );
  }

  return productsCache.get(safeFirst) as Promise<Product[]>;
};
