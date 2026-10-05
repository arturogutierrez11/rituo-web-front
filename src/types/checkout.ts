export type ShippingMethod = "standard" ;

export type PaymentMethod = "mercadopago" | "bank_transfer";

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
  floor?: string;
  apartment?: string;
  notes?: string;
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

export interface CheckoutTracking {
  fbp: string | null;
  fbc: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
}

export interface CheckoutRequestPayload {
  productSlug: string;
  quantity: number;
  shippingMethod: ShippingMethod;
  paymentMethod?: PaymentMethod;
  customer: CheckoutCustomer;
  shippingAddress: CheckoutAddress;
  billing: CheckoutBilling;
  tracking?: CheckoutTracking;
}
