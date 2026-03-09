import {
  products as fallbackProducts,
  type Product,
  type ProductImage,
  type ProductVideo
} from '@/data/products';

export type ShopifyConfig = {
  storeDomain: string;
  apiVersion: string;
  storefrontToken: string;
};

export type ShopifyUserError = {
  field: string[] | null;
  message: string;
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
};

type ShopifyGraphQLError = {
  message: string;
};

type ShopifyGraphQLResponse<TData> = {
  data?: TData;
  errors?: ShopifyGraphQLError[];
};

type CartLineInput = {
  merchandiseId: string;
  quantity: number;
};

type CheckoutLine = {
  variantId?: string;
  quantity?: number;
};

type ShopifyImageNode = {
  url: string;
  altText: string | null;
  width?: number | null;
  height?: number | null;
};

type ShopifyVideoSource = {
  url: string;
  mimeType: string | null;
  format?: string | null;
  height?: number | null;
  width?: number | null;
};

type ShopifyMediaNode = {
  mediaContentType?: string | null;
  alt?: string | null;
  image?: ShopifyImageNode | null;
  previewImage?: ShopifyImageNode | null;
  sources?: ShopifyVideoSource[] | null;
  embeddedUrl?: string | null;
  host?: string | null;
  originUrl?: string | null;
};

type ShopifyProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string | null;
  productType: string;
  featuredImage: ShopifyImageNode | null;
  images?: {
    nodes: ShopifyImageNode[];
  } | null;
  media?: {
    nodes: ShopifyMediaNode[];
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
    }>;
  };
};

type GetProductsData = {
  products: {
    nodes: ShopifyProductNode[];
  };
};

type GetShopProductsOptions = {
  first?: number;
};

type CartCreateData = {
  cartCreate: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

type CartLinesAddData = {
  cartLinesAdd: {
    cart: ShopifyCart | null;
    userErrors: ShopifyUserError[];
  };
};

const DEFAULT_FIRST = 24;
const SHOPIFY_CART_STORAGE_KEY = 'shopify_cart_id';
const productsCache = new Map<number, Promise<Product[]>>();
const PRODUCTS_QUERY_WITH_MEDIA = `
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        description
        descriptionHtml
        productType
        featuredImage {
          url
          altText
          width
          height
        }
        images(first: 8) {
          nodes {
            url
            altText
            width
            height
          }
        }
        media(first: 8) {
          nodes {
            mediaContentType
            alt
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
            ... on Video {
              previewImage {
                url
                altText
                width
                height
              }
              sources {
                url
                mimeType
                format
                height
                width
              }
            }
            ... on ExternalVideo {
              embeddedUrl
              host
              originUrl
              previewImage {
                url
                altText
                width
                height
              }
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            title
          }
        }
      }
    }
  }
`;
const PRODUCTS_QUERY_BASIC = `
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        description
        descriptionHtml
        productType
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            title
          }
        }
      }
    }
  }
`;

const fallbackSlice = (first: number) => fallbackProducts.slice(0, Math.min(first, fallbackProducts.length));

const normalizeStoreDomain = (rawDomain: string) =>
  rawDomain
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/+$/, '')
    .split('/')[0];

const toPositiveQuantity = (value: number) => {
  if (!Number.isFinite(value) || value <= 0) return 1;
  return Math.floor(value);
};

const formatUserErrors = (userErrors: ShopifyUserError[]) =>
  userErrors
    .map((error) => {
      const field = Array.isArray(error.field) ? error.field.join('.') : '';
      return field ? `${field}: ${error.message}` : error.message;
    })
    .join(' | ');

const resolveShopifyConfig = (override: Partial<ShopifyConfig> = {}): ShopifyConfig => {
  const windowConfig =
    typeof window !== 'undefined' && window.__SHOPIFY_CONFIG__
      ? window.__SHOPIFY_CONFIG__
      : {};

  const storeDomain = normalizeStoreDomain(
    override.storeDomain ??
      windowConfig.storeDomain ??
      (import.meta.env.SHOPIFY_STORE_DOMAIN ?? '')
  );
  const apiVersion = (
    override.apiVersion ??
    windowConfig.apiVersion ??
    import.meta.env.SHOPIFY_API_VERSION ??
    ''
  ).trim();
  const storefrontToken = (
    override.storefrontToken ??
    windowConfig.storefrontToken ??
    import.meta.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN ??
    ''
  ).trim();

  if (!storeDomain || !apiVersion || !storefrontToken) {
    throw new Error('[shopify] Missing SHOPIFY_* configuration.');
  }

  return {
    storeDomain,
    apiVersion,
    storefrontToken
  };
};

const assertNoUserErrors = (operation: string, userErrors: ShopifyUserError[]) => {
  if (!userErrors.length) return;
  throw new Error(`[shopify] ${operation} userErrors: ${formatUserErrors(userErrors)}`);
};

const mapProductImage = (
  image: ShopifyImageNode | null | undefined,
  fallbackAltText: string
): ProductImage | null => {
  const url = image?.url?.trim();
  if (!url) return null;

  const altText = (image?.altText ?? fallbackAltText).trim() || fallbackAltText;

  return {
    url,
    altText,
    width: image?.width ?? undefined,
    height: image?.height ?? undefined
  };
};

const dedupeProductImages = (images: Array<ProductImage | null | undefined>) => {
  const seen = new Set<string>();

  return images.filter((image): image is ProductImage => {
    if (!image?.url || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
};

const mapProductVideos = (node: ShopifyProductNode): ProductVideo[] =>
  (node.media?.nodes ?? []).flatMap((mediaNode) => {
    if (mediaNode.mediaContentType === 'VIDEO') {
      const source =
        mediaNode.sources?.find((candidate) => (candidate.mimeType ?? '').startsWith('video/')) ??
        mediaNode.sources?.[0];

      if (!source?.url) return [];

      return [
        {
          kind: 'hosted',
          url: source.url,
          altText: (mediaNode.alt ?? mediaNode.previewImage?.altText ?? node.title).trim() || node.title,
          poster: mediaNode.previewImage?.url ?? undefined,
          mimeType: source.mimeType ?? undefined
        }
      ];
    }

    if (mediaNode.mediaContentType === 'EXTERNAL_VIDEO') {
      const url = (mediaNode.embeddedUrl ?? mediaNode.originUrl ?? '').trim();
      if (!url) return [];

      return [
        {
          kind: 'external',
          url,
          altText: (mediaNode.alt ?? mediaNode.previewImage?.altText ?? node.title).trim() || node.title,
          poster: mediaNode.previewImage?.url ?? undefined,
          host: mediaNode.host ?? undefined
        }
      ];
    }

    return [];
  });

const mapShopifyProduct = (node: ShopifyProductNode): Product => {
  const parsedPrice = Number.parseFloat(node.priceRange?.minVariantPrice?.amount ?? '');
  const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;
  const firstVariant = node.variants?.nodes?.[0];
  const fallbackAltText = node.title?.trim() || 'Prodotto Shopify';
  const featuredImage = mapProductImage(node.featuredImage, fallbackAltText);
  const galleryImages = dedupeProductImages([
    featuredImage,
    ...(node.images?.nodes ?? []).map((imageNode) => mapProductImage(imageNode, fallbackAltText))
  ]);
  const videos = mapProductVideos(node);

  return {
    slug: node.handle,
    name: node.title,
    price,
    category: node.productType || 'Shopify',
    image:
      featuredImage?.url ||
      `https://picsum.photos/seed/shopify-${encodeURIComponent(node.handle || node.id)}/600/380`,
    shortDescription: node.description?.trim() || 'Descrizione non disponibile.',
    descriptionHtml: node.descriptionHtml?.trim() || '',
    inci: 'INCI non disponibile nel feed Shopify corrente.',
    source: 'shopify',
    galleryImages,
    videos,
    variantId: firstVariant?.id,
    variantTitle: firstVariant?.title
  };
};

export async function shopifyFetch<TData, TVariables = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
  config?: Partial<ShopifyConfig>
): Promise<TData> {
  const resolvedConfig = resolveShopifyConfig(config);

  let response: Response;
  try {
    response = await fetch(`https://${resolvedConfig.storeDomain}/api/${resolvedConfig.apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': resolvedConfig.storefrontToken
      },
      body: JSON.stringify({ query, variables })
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';
    throw new Error(`[shopify] Network error: ${message}`);
  }

  if (!response.ok) {
    throw new Error(`[shopify] HTTP ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as ShopifyGraphQLResponse<TData>;

  if (payload.errors?.length) {
    const message = payload.errors.map((error) => error.message).join(' | ');
    throw new Error(`[shopify] GraphQL error: ${message}`);
  }

  if (!payload.data) {
    throw new Error('[shopify] Empty GraphQL response data.');
  }

  return payload.data;
}

export async function createCart(
  variantId: string,
  quantity = 1,
  config?: Partial<ShopifyConfig>
): Promise<ShopifyCart> {
  const trimmedVariantId = variantId.trim();
  if (!trimmedVariantId) {
    throw new Error('[shopify] createCart requires a ProductVariant ID.');
  }

  const data = await shopifyFetch<CartCreateData, { lines: CartLineInput[] }>(
    `
      mutation cartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id
            checkoutUrl
            totalQuantity
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      lines: [
        {
          merchandiseId: trimmedVariantId,
          quantity: toPositiveQuantity(quantity)
        }
      ]
    },
    config
  );

  const result = data.cartCreate;
  assertNoUserErrors('cartCreate', result.userErrors || []);

  if (!result.cart) {
    throw new Error('[shopify] cartCreate returned an empty cart.');
  }

  return result.cart;
}

export async function addToCart(
  cartId: string,
  variantId: string,
  quantity = 1,
  config?: Partial<ShopifyConfig>
): Promise<ShopifyCart> {
  const trimmedCartId = cartId.trim();
  const trimmedVariantId = variantId.trim();

  if (!trimmedCartId) {
    throw new Error('[shopify] addToCart requires a cartId.');
  }

  if (!trimmedVariantId) {
    throw new Error('[shopify] addToCart requires a ProductVariant ID.');
  }

  const data = await shopifyFetch<CartLinesAddData, { cartId: string; lines: CartLineInput[] }>(
    `
      mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      cartId: trimmedCartId,
      lines: [
        {
          merchandiseId: trimmedVariantId,
          quantity: toPositiveQuantity(quantity)
        }
      ]
    },
    config
  );

  const result = data.cartLinesAdd;
  assertNoUserErrors('cartLinesAdd', result.userErrors || []);

  if (!result.cart) {
    throw new Error('[shopify] cartLinesAdd returned an empty cart.');
  }

  return result.cart;
}

export async function handleBuyNow(
  variantId: string,
  quantity = 1,
  config?: Partial<ShopifyConfig>
): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('[shopify] handleBuyNow must run in the browser.');
  }

  const trimmedVariantId = variantId.trim();
  if (!trimmedVariantId) {
    throw new Error('[shopify] handleBuyNow requires a ProductVariant ID.');
  }

  const safeQuantity = toPositiveQuantity(quantity);
  const existingCartId = window.localStorage.getItem(SHOPIFY_CART_STORAGE_KEY);

  let cart: ShopifyCart;

  if (existingCartId) {
    try {
      cart = await addToCart(existingCartId, trimmedVariantId, safeQuantity, config);
    } catch (error) {
      // If cartId is stale or invalid, create a new cart.
      window.localStorage.removeItem(SHOPIFY_CART_STORAGE_KEY);
      cart = await createCart(trimmedVariantId, safeQuantity, config);
      console.warn('[shopify] Existing cart was invalid. Created a new cart.', error);
    }
  } else {
    cart = await createCart(trimmedVariantId, safeQuantity, config);
  }

  window.localStorage.setItem(SHOPIFY_CART_STORAGE_KEY, cart.id);
  const checkoutUrl = cart.checkoutUrl;
  console.log('checkoutUrl:', checkoutUrl);
  try {
    const parsed = new URL(checkoutUrl);
    if (!parsed.pathname || parsed.pathname === '/') {
      console.warn('[shopify] checkoutUrl looks like homepage, not checkout.', checkoutUrl);
    }
  } catch {
    console.warn('[shopify] checkoutUrl is not a valid URL string.', checkoutUrl);
  }
  window.location.href = checkoutUrl;
}

export async function checkoutLocalCart(
  lines: CheckoutLine[],
  config?: Partial<ShopifyConfig>
): Promise<ShopifyCart> {
  if (!Array.isArray(lines) || !lines.length) {
    throw new Error('[shopify] Cart is empty.');
  }

  const normalized = lines
    .map((line) => ({
      merchandiseId: (line.variantId ?? '').trim(),
      quantity: toPositiveQuantity(line.quantity ?? 1)
    }))
    .filter((line) => line.merchandiseId);

  if (!normalized.length) {
    throw new Error('[shopify] Cart has no valid ProductVariant IDs.');
  }

  let cart = await createCart(normalized[0].merchandiseId, normalized[0].quantity, config);

  for (const line of normalized.slice(1)) {
    cart = await addToCart(cart.id, line.merchandiseId, line.quantity, config);
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(SHOPIFY_CART_STORAGE_KEY, cart.id);
  }

  return cart;
}

const fetchShopifyProducts = async (first: number) => {
  let data: GetProductsData | null = null;

  try {
    data = await shopifyFetch<GetProductsData, { first: number }>(PRODUCTS_QUERY_WITH_MEDIA, { first });
  } catch (error) {
    console.warn('[shopify] Products media query failed. Retrying with basic query.', error);
    data = await shopifyFetch<GetProductsData, { first: number }>(PRODUCTS_QUERY_BASIC, { first });
  }

  if (!data) return fallbackSlice(first);
  const nodes = data.products?.nodes;
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

declare global {
  interface Window {
    __SHOPIFY_CONFIG__?: Partial<ShopifyConfig>;
  }
}
