export type MovementType = "sale" | "cancellation" | "return" | "gift" | "restock";

export interface ProductStock {
  id: string;
  slug: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  stock: number;
  isActive: boolean;
  isInternal: boolean;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  movementType: MovementType;
  quantityDelta: number;
  stockAfter: number;
  orderId: string | null;
  note: string | null;
  occurredAt: string;
  createdAt: string;
}

export interface RestockPayload {
  sku: string;
  quantity: number;
  note?: string;
  occurredAt?: string;
}

export interface RecordGiftPayload {
  sku: string;
  quantity: number;
  occurredAt: string;
  note?: string;
}
