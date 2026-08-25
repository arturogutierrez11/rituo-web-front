export type OrderStatusValue =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "payment_init_failed";

export type ShippingStatusValue =
  | "pending_dispatch"
  | "dispatched"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;

  productSku: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  currency: string;
  subtotal: number;

  shippingMethod: string;
  shippingPrice: number;
  total: number;

  status: OrderStatusValue;

  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;

  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;

  billingDni: string;
  billingUseShippingAddress: boolean;
  billingAddress: string | null;
  billingCity: string | null;
  billingProvince: string | null;
  billingPostalCode: string | null;
  isBusinessPurchase: boolean;
  billingCuit: string | null;
  billingBusinessName: string | null;

  mpPreferenceId: string | null;
  mpPaymentId: string | null;
  mpPaymentStatus: string | null;
  mpPaymentStatusDetail: string | null;

  salesChannel: "mercadopago" | "manual";
  manualPaymentMethod: string | null;
  manualPaymentNote: string | null;

  shippingStatus: ShippingStatusValue;
  shippingCarrier: string | null;
  shippingTrackingNumber: string | null;
  shippingLabelUrl: string | null;
  shippedAt: string | null;
  shippingRealCost: number | null;
  shippingZipnovaShipmentId: string | null;
  shippingZipnovaStatus: string | null;

  invoiceStatus: string | null;
  invoicedAt: string | null;

  approvedAt: string | null;
  emailSentAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface MarkOrderShippedPayload {
  carrier?: string;
  trackingNumber?: string;
  labelUrl?: string;
}

export interface CreateManualOrderPayload {
  productSlug: string;
  quantity: number;
  shippingMethod: "standard" | "express";
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  billing: {
    dni: string;
    useShippingAddress: boolean;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    isBusinessPurchase: boolean;
    cuit?: string;
    businessName?: string;
  };
  manualPaymentMethod: string;
  manualPaymentNote?: string;
}
