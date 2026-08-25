"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { formatCurrency } from "@/lib/format-currency";
import { formatDateTime } from "@/lib/format-date";
import type { InventoryMovement, ProductStock } from "@/types/inventory";
import type { Warehouse } from "@/types/warehouse";

interface InventoryPanelProps {
  products: ProductStock[];
  commercialProducts: ProductStock[];
  movements: InventoryMovement[];
  warehouses: Warehouse[];
}

const MOVEMENT_LABELS: Record<InventoryMovement["movementType"], string> = {
  sale: "Venta",
  cancellation: "Cancelación",
  return: "Devolución",
  gift: "Regalo / donación",
  restock: "Ingreso de mercadería",
  adjustment: "Ajuste por conteo",
};

const TABS = [
  { key: "stock", label: "Stock" },
  { key: "prices", label: "Precios" },
  { key: "restock", label: "Ingresar mercadería" },
  { key: "gift", label: "Regalo / donación" },
  { key: "adjust", label: "Ajustar stock" },
  { key: "movements", label: "Movimientos" },
  { key: "warehouses", label: "Depósitos" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function productLabel(products: ProductStock[], productId: string) {
  const product = products.find((item) => item.id === productId);
  return product ? `${product.name} (${product.sku})` : productId.slice(0, 8);
}

function currentStockFor(products: ProductStock[], sku: string, warehouseId: string) {
  const product = products.find((item) => item.sku === sku);
  return (
    product?.stockByWarehouse.find((entry) => entry.warehouseId === warehouseId)
      ?.stock ?? 0
  );
}

function warehouseLabel(warehouses: Warehouse[], warehouseId: string | null) {
  if (!warehouseId) {
    return "—";
  }
  return warehouses.find((item) => item.id === warehouseId)?.name ?? "—";
}

const EMPTY_WAREHOUSE_FORM = {
  name: "",
  document: "",
  addressStreet: "",
  addressStreetNumber: "",
  addressCity: "",
  addressState: "",
  addressZipcode: "",
  addressPhone: "",
  addressEmail: "",
};

export function InventoryPanel({
  products,
  commercialProducts,
  movements,
  warehouses,
}: InventoryPanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("stock");
  const [restockForm, setRestockForm] = useState({
    sku: products[0]?.sku ?? "",
    warehouseId: warehouses[0]?.id ?? "",
    quantity: "1",
    note: "",
    occurredAt: todayInputValue(),
  });
  const [giftForm, setGiftForm] = useState({
    sku: products[0]?.sku ?? "",
    warehouseId: warehouses[0]?.id ?? "",
    quantity: "1",
    note: "",
    occurredAt: todayInputValue(),
  });
  const [warehouseForm, setWarehouseForm] = useState(EMPTY_WAREHOUSE_FORM);
  const [adjustForm, setAdjustForm] = useState({
    sku: products[0]?.sku ?? "",
    warehouseId: warehouses[0]?.id ?? "",
    newStock: String(
      currentStockFor(products, products[0]?.sku ?? "", warehouses[0]?.id ?? ""),
    ),
    note: "",
    occurredAt: todayInputValue(),
  });
  const [loading, setLoading] = useState<
    "restock" | "gift" | "warehouse" | "adjust" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState("");
  const [savingPriceId, setSavingPriceId] = useState<string | null>(null);

  function startEditPrice(product: ProductStock) {
    setEditingPriceId(product.id);
    setPriceDraft(String(product.price));
    setError(null);
  }

  function cancelEditPrice() {
    setEditingPriceId(null);
    setPriceDraft("");
  }

  async function savePrice(productId: string) {
    const price = Number(priceDraft);

    if (!Number.isFinite(price) || price < 0) {
      setError("El precio tiene que ser un número mayor o igual a 0.");
      return;
    }

    setSavingPriceId(productId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/inventory/products/${productId}/price`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos actualizar el precio");
      }

      setEditingPriceId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setSavingPriceId(null);
    }
  }

  async function submitRestock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("restock");
    setError(null);

    try {
      const response = await fetch("/api/admin/inventory/restock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: restockForm.sku,
          warehouseId: restockForm.warehouseId,
          quantity: Number(restockForm.quantity),
          note: restockForm.note || undefined,
          occurredAt: restockForm.occurredAt || undefined,
        }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos registrar el ingreso");
      }

      setRestockForm((prev) => ({ ...prev, quantity: "1", note: "" }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setLoading(null);
    }
  }

  async function submitGift(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("gift");
    setError(null);

    try {
      const response = await fetch("/api/admin/inventory/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: giftForm.sku,
          warehouseId: giftForm.warehouseId,
          quantity: Number(giftForm.quantity),
          occurredAt: giftForm.occurredAt,
          note: giftForm.note || undefined,
        }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos registrar el regalo");
      }

      setGiftForm((prev) => ({ ...prev, quantity: "1", note: "" }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setLoading(null);
    }
  }

  async function submitAdjust(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("adjust");
    setError(null);

    try {
      const response = await fetch("/api/admin/inventory/adjustments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: adjustForm.sku,
          warehouseId: adjustForm.warehouseId,
          newStock: Number(adjustForm.newStock),
          occurredAt: adjustForm.occurredAt || undefined,
          note: adjustForm.note || undefined,
        }),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos ajustar el stock");
      }

      setAdjustForm((prev) => ({ ...prev, note: "" }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setLoading(null);
    }
  }

  async function submitWarehouse(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("warehouse");
    setError(null);

    try {
      const response = await fetch("/api/admin/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(warehouseForm),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos crear el depósito");
      }

      setWarehouseForm(EMPTY_WAREHOUSE_FORM);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="admin-tabs" role="tablist" aria-label="Secciones de inventario">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`admin-tab${activeTab === tab.key ? " is-active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
            role="tab"
            aria-selected={activeTab === tab.key}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="order-detail__error" role="alert">
          {error}
        </p>
      )}

      {activeTab === "stock" && (
        <section className="admin-card">
          <div className="admin-card__head">
            <div>
              <span>Stock</span>
              <h2>Stock por SKU y depósito</h2>
            </div>
            <p>{products.length} SKUs</p>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Producto</th>
                  {warehouses.map((warehouse) => (
                    <th key={warehouse.id}>{warehouse.name}</th>
                  ))}
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.sku}</strong>
                    </td>
                    <td>{product.name}</td>
                    {warehouses.map((warehouse) => {
                      const stock =
                        product.stockByWarehouse.find(
                          (entry) => entry.warehouseId === warehouse.id,
                        )?.stock ?? 0;
                      return (
                        <td key={warehouse.id}>
                          <span
                            className={`inventory-stock${stock === 0 ? " is-empty" : ""}`}
                          >
                            {stock}
                          </span>
                        </td>
                      );
                    })}
                    <td>
                      <span
                        className={`inventory-stock${product.stock === 0 ? " is-empty" : ""}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "prices" && (
        <section className="admin-card">
          <div className="admin-card__head">
            <div>
              <span>Checkout</span>
              <h2>Precio de los productos comerciales</h2>
            </div>
            <p>{commercialProducts.length} productos</p>
          </div>

          {commercialProducts.length === 0 ? (
            <div className="admin-empty">
              <strong>No pudimos cargar el catálogo comercial.</strong>
              <p>Probá actualizar la página.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Producto</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {commercialProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.sku}</strong>
                      </td>
                      <td>{product.name}</td>
                      <td>
                        {editingPriceId === product.id ? (
                          <div className="inventory-price-edit">
                            <input
                              autoFocus
                              className="inventory-price-input"
                              min={0}
                              onChange={(event) => setPriceDraft(event.target.value)}
                              step="1"
                              type="number"
                              value={priceDraft}
                            />
                            <button
                              className="admin-refresh"
                              disabled={savingPriceId === product.id}
                              onClick={() => savePrice(product.id)}
                              type="button"
                            >
                              {savingPriceId === product.id ? "…" : "Guardar"}
                            </button>
                            <button
                              className="order-action"
                              disabled={savingPriceId === product.id}
                              onClick={cancelEditPrice}
                              type="button"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            className="inventory-price-button"
                            onClick={() => startEditPrice(product)}
                            type="button"
                          >
                            {formatCurrency(product.price, product.currency)}
                            <span aria-hidden="true">✎</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === "restock" && (
        <section className="admin-card">
          <div className="admin-card__head">
            <div>
              <span>Mercadería</span>
              <h2>Ingresar mercadería nueva</h2>
            </div>
          </div>

          <form className="inventory-form" onSubmit={submitRestock}>
            <label>
              SKU
              <select
                value={restockForm.sku}
                onChange={(event) =>
                  setRestockForm((prev) => ({ ...prev, sku: event.target.value }))
                }
              >
                {products.map((product) => (
                  <option key={product.sku} value={product.sku}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Depósito
              <select
                value={restockForm.warehouseId}
                onChange={(event) =>
                  setRestockForm((prev) => ({
                    ...prev,
                    warehouseId: event.target.value,
                  }))
                }
              >
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Unidades
              <input
                type="number"
                min={1}
                value={restockForm.quantity}
                onChange={(event) =>
                  setRestockForm((prev) => ({ ...prev, quantity: event.target.value }))
                }
              />
            </label>
            <label>
              Fecha
              <input
                type="date"
                value={restockForm.occurredAt}
                onChange={(event) =>
                  setRestockForm((prev) => ({ ...prev, occurredAt: event.target.value }))
                }
              />
            </label>
            <label className="inventory-form__note">
              Nota (opcional)
              <input
                type="text"
                placeholder="Ej: compra a proveedor X"
                value={restockForm.note}
                onChange={(event) =>
                  setRestockForm((prev) => ({ ...prev, note: event.target.value }))
                }
              />
            </label>
            <button className="admin-refresh" disabled={loading === "restock"} type="submit">
              {loading === "restock" ? "Guardando…" : "Registrar ingreso"}
            </button>
          </form>
        </section>
      )}

      {activeTab === "gift" && (
        <section className="admin-card">
          <div className="admin-card__head">
            <div>
              <span>Salidas</span>
              <h2>Regalo / donación</h2>
            </div>
          </div>

          <form className="inventory-form" onSubmit={submitGift}>
            <label>
              SKU
              <select
                value={giftForm.sku}
                onChange={(event) =>
                  setGiftForm((prev) => ({ ...prev, sku: event.target.value }))
                }
              >
                {products.map((product) => (
                  <option key={product.sku} value={product.sku}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Depósito
              <select
                value={giftForm.warehouseId}
                onChange={(event) =>
                  setGiftForm((prev) => ({
                    ...prev,
                    warehouseId: event.target.value,
                  }))
                }
              >
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Unidades
              <input
                type="number"
                min={1}
                value={giftForm.quantity}
                onChange={(event) =>
                  setGiftForm((prev) => ({ ...prev, quantity: event.target.value }))
                }
              />
            </label>
            <label>
              Fecha del regalo
              <input
                type="date"
                required
                value={giftForm.occurredAt}
                onChange={(event) =>
                  setGiftForm((prev) => ({ ...prev, occurredAt: event.target.value }))
                }
              />
            </label>
            <label className="inventory-form__note">
              Destinatario / motivo
              <input
                type="text"
                placeholder="Ej: donación a colegio X"
                value={giftForm.note}
                onChange={(event) =>
                  setGiftForm((prev) => ({ ...prev, note: event.target.value }))
                }
              />
            </label>
            <button className="admin-refresh" disabled={loading === "gift"} type="submit">
              {loading === "gift" ? "Guardando…" : "Registrar regalo"}
            </button>
          </form>
        </section>
      )}

      {activeTab === "adjust" && (
        <section className="admin-card">
          <div className="admin-card__head">
            <div>
              <span>Conteo físico</span>
              <h2>Ajustar stock</h2>
            </div>
          </div>

          <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "-8px 0 12px" }}>
            Para cuando contás el stock a mano y no coincide con el sistema —
            poné el número real, no cuánto sumar o restar.
          </p>

          <form className="inventory-form" onSubmit={submitAdjust}>
            <label>
              SKU
              <select
                value={adjustForm.sku}
                onChange={(event) => {
                  const sku = event.target.value;
                  setAdjustForm((prev) => ({
                    ...prev,
                    sku,
                    newStock: String(currentStockFor(products, sku, prev.warehouseId)),
                  }));
                }}
              >
                {products.map((product) => (
                  <option key={product.sku} value={product.sku}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Depósito
              <select
                value={adjustForm.warehouseId}
                onChange={(event) => {
                  const warehouseId = event.target.value;
                  setAdjustForm((prev) => ({
                    ...prev,
                    warehouseId,
                    newStock: String(currentStockFor(products, prev.sku, warehouseId)),
                  }));
                }}
              >
                {warehouses.map((warehouse) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Stock real (conteo)
              <input
                type="number"
                min={0}
                value={adjustForm.newStock}
                onChange={(event) =>
                  setAdjustForm((prev) => ({ ...prev, newStock: event.target.value }))
                }
              />
            </label>
            <label>
              Fecha del conteo
              <input
                type="date"
                value={adjustForm.occurredAt}
                onChange={(event) =>
                  setAdjustForm((prev) => ({ ...prev, occurredAt: event.target.value }))
                }
              />
            </label>
            <label className="inventory-form__note">
              Nota (opcional)
              <input
                type="text"
                placeholder="Ej: conteo mensual de agosto"
                value={adjustForm.note}
                onChange={(event) =>
                  setAdjustForm((prev) => ({ ...prev, note: event.target.value }))
                }
              />
            </label>
            <button className="admin-refresh" disabled={loading === "adjust"} type="submit">
              {loading === "adjust" ? "Guardando…" : "Guardar ajuste"}
            </button>
          </form>
        </section>
      )}

      {activeTab === "movements" && (
        <section className="admin-card">
          <div className="admin-card__head">
            <div>
              <span>Trazabilidad</span>
              <h2>Últimos movimientos</h2>
            </div>
            <p>{movements.length} resultados</p>
          </div>

          {movements.length === 0 ? (
            <div className="admin-empty">
              <strong>Todavía no hay movimientos.</strong>
              <p>Cuando se venda, cancele, regale o ingrese stock, va a aparecer acá.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>SKU</th>
                    <th>Depósito</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Stock resultante</th>
                    <th>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr key={movement.id}>
                      <td>{formatDateTime(movement.occurredAt)}</td>
                      <td>{productLabel(products, movement.productId)}</td>
                      <td>{warehouseLabel(warehouses, movement.warehouseId)}</td>
                      <td>{MOVEMENT_LABELS[movement.movementType] ?? movement.movementType}</td>
                      <td>
                        {movement.quantityDelta > 0
                          ? `+${movement.quantityDelta}`
                          : movement.quantityDelta}
                      </td>
                      <td>{movement.stockAfter}</td>
                      <td>
                        {movement.note ??
                          (movement.orderId ? `Orden ${movement.orderId.slice(0, 8)}` : "—")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {activeTab === "warehouses" && (
        <>
          <section className="admin-card">
            <div className="admin-card__head">
              <div>
                <span>Logística</span>
                <h2>Depósitos</h2>
              </div>
              <p>{warehouses.length} activos</p>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Contacto</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((warehouse) => (
                    <tr key={warehouse.id}>
                      <td>
                        <strong>{warehouse.name}</strong>
                      </td>
                      <td>
                        {[
                          warehouse.addressStreet,
                          warehouse.addressCity,
                          warehouse.addressState,
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </td>
                      <td>{warehouse.addressPhone ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card__head">
              <div>
                <span>Logística</span>
                <h2>Registrar nuevo depósito</h2>
              </div>
            </div>

            <p style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "-8px 0 12px" }}>
              Se da de alta también como origen de envío en Zipnova — no hace falta
              cargarlo a mano en su dashboard.
            </p>

            <form className="inventory-form" onSubmit={submitWarehouse}>
              <label>
                Nombre
                <input
                  type="text"
                  placeholder="Ej: Depósito Centro"
                  required
                  value={warehouseForm.name}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                />
              </label>
              <label>
                CUIT / Documento
                <input
                  type="text"
                  placeholder="Ej: 20-12345678-6"
                  required
                  value={warehouseForm.document}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({
                      ...prev,
                      document: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Calle
                <input
                  type="text"
                  required
                  value={warehouseForm.addressStreet}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({
                      ...prev,
                      addressStreet: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Altura
                <input
                  type="text"
                  required
                  value={warehouseForm.addressStreetNumber}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({
                      ...prev,
                      addressStreetNumber: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Ciudad
                <input
                  type="text"
                  required
                  value={warehouseForm.addressCity}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({
                      ...prev,
                      addressCity: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Provincia
                <input
                  type="text"
                  required
                  value={warehouseForm.addressState}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({
                      ...prev,
                      addressState: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Código postal
                <input
                  type="text"
                  required
                  value={warehouseForm.addressZipcode}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({
                      ...prev,
                      addressZipcode: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Teléfono
                <input
                  type="text"
                  required
                  value={warehouseForm.addressPhone}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({
                      ...prev,
                      addressPhone: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  required
                  value={warehouseForm.addressEmail}
                  onChange={(event) =>
                    setWarehouseForm((prev) => ({
                      ...prev,
                      addressEmail: event.target.value,
                    }))
                  }
                />
              </label>
              <button className="admin-refresh" disabled={loading === "warehouse"} type="submit">
                {loading === "warehouse" ? "Creando…" : "Crear depósito"}
              </button>
            </form>
          </section>
        </>
      )}
    </>
  );
}
