import { productsMarketing } from "@/data/landing";
import type { Product, ProductCommerce } from "@/types/product";

/** Combina el contenido de marketing (local) con el catálogo real (checkout.api) por slug. */
export function mergeProducts(commerce: ProductCommerce[]): Product[] {
  return commerce
    .map((item) => {
      const marketing = productsMarketing.find((m) => m.slug === item.slug);
      return marketing ? { ...marketing, ...item } : null;
    })
    .filter((product): product is Product => product !== null);
}

export function mergeProduct(
  commerce: ProductCommerce[],
  slug: string,
): Product | null {
  return mergeProducts(commerce).find((product) => product.slug === slug) ?? null;
}
