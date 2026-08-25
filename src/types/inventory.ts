export type MovementType = "sale" | "cancellation" | "return" | "gift" | "restock";

export interface ProductWarehouseStock {
  warehouseId: string;
  warehouseSlug: string;
  warehouseName: string;
  stock: number;
}

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
  stockByWarehouse: ProductWarehouseStock[];
}

export interface InventoryMovement {
  id: string;
  productId: string;
  movementType: MovementType;
  quantityDelta: number;
  stockAfter: number;
  orderId: string | null;
  warehouseId: string | null;
  note: string | null;
  occurredAt: string;
  createdAt: string;
}

export interface RestockPayload {
  sku: string;
  warehouseId: string;
  quantity: number;
  note?: string;
  occurredAt?: string;
}

export interface RecordGiftPayload {
  sku: string;
  warehouseId: string;
  quantity: number;
  occurredAt: string;
  note?: string;
}
