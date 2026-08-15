export type ProductVariant = "one" | "family" | "business";

/** Contenido de marketing, propio de la web (no vive en checkout.api). */
export interface ProductMarketing {
  slug: string;
  image: string;
  imageAlt: string;
  variant: ProductVariant;
  label: string;
  description: string;
  ctaLabel?: string;
  badge?: string;
  /** How many physical cards this SKU bundles (1, 2, 10). Drives the "×N" pack badge. */
  packSize: number;
  features?: string[];
}

/** Datos comerciales: fuente de verdad es checkout.api. */
export interface ProductCommerce {
  slug: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  inStock: boolean;
}

/** Lo que consumen los componentes: marketing + comercial combinados por slug. */
export interface Product extends ProductMarketing, ProductCommerce {}
