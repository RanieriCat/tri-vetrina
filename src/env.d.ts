/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SHOPIFY_STORE_DOMAIN?: string;
  readonly SHOPIFY_API_VERSION?: string;
  readonly SHOPIFY_STOREFRONT_PUBLIC_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
