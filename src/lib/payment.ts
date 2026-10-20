import type { PaymentMethod } from "@/types/checkout";

/**
 * Mismos descuentos que aplica checkout.api — la verdad de negocio vive allá,
 * esto es solo para mostrar el total antes de enviar y en la landing.
 */
export const BANK_TRANSFER_DISCOUNT_RATE = 0.1;

export const COMBO_DISCOUNT_TIERS: { minQuantity: number; rate: number }[] = [
  { minQuantity: 3, rate: 0.1 },
  { minQuantity: 2, rate: 0.05 },
];

export function comboDiscountRate(quantity: number) {
  return (
    COMBO_DISCOUNT_TIERS.find((tier) => quantity >= tier.minQuantity)?.rate ?? 0
  );
}

export function comboDiscountFor(subtotal: number, quantity: number) {
  return Math.round(subtotal * comboDiscountRate(quantity));
}

export function transferDiscountFor(
  paymentMethod: PaymentMethod,
  subtotal: number,
) {
  return paymentMethod === "bank_transfer"
    ? Math.round(subtotal * BANK_TRANSFER_DISCOUNT_RATE)
    : 0;
}
