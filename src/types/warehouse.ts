export interface Warehouse {
  id: string;
  slug: string;
  name: string;
  addressStreet: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZipcode: string | null;
  addressPhone: string | null;
  addressEmail: string | null;
  priority: number;
  isActive: boolean;
}

export interface CreateWarehousePayload {
  name: string;
  addressStreet: string;
  addressStreetNumber: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  addressPhone: string;
  addressEmail: string;
}
