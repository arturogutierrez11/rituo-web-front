export type ProductVariant = "one" | "family" | "business";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "ARS";
  image: string;
  imageAlt: string;
  variant: ProductVariant;
  label: string;
  ctaLabel?: string;
  features?: string[];
  minimumQuantity?: number;
}
