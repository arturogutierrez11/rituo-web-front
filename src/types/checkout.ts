export type ShippingMethod = "standard" | "express";

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CheckoutAddress {
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface CheckoutBilling {
  dni: string;
  useShippingAddress: boolean;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  isBusinessPurchase: boolean;
  cuit?: string;
  businessName?: string;
}

export interface CheckoutRequestPayload {
  productSlug: string;
  quantity: number;
  shippingMethod: ShippingMethod;
  customer: CheckoutCustomer;
  shippingAddress: CheckoutAddress;
  billing: CheckoutBilling;
}
