import type { ShippingMethod } from "@/types/checkout";

export const shippingPrices: Record<ShippingMethod, number> = {
  standard: 0
};

export const shippingLabels: Record<
  ShippingMethod,
  { title: string; description: string }
> = {
  standard: { title: "Envío estándar", description: "3 a 5 días hábiles" }
  // express: { title: "Envío express", description: "1 a 2 días hábiles" },
};
