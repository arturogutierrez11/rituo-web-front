import type { PaymentMethod } from "@/types/checkout";

/** Mismo descuento que aplica checkout.api — la verdad de negocio vive allá, esto es solo para mostrar el total antes de enviar. */
export const BANK_TRANSFER_DISCOUNT_RATE = 0.1;

export function discountFor(paymentMethod: PaymentMethod, subtotal: number) {
  return paymentMethod === "bank_transfer"
    ? Math.round(subtotal * BANK_TRANSFER_DISCOUNT_RATE)
    : 0;
}
