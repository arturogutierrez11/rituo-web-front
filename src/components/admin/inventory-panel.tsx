"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { formatCurrency } from "@/lib/format-currency";
import { formatDateTime } from "@/lib/format-date";
import type { InventoryMovement, ProductStock } from "@/types/inventory";

interface InventoryPanelProps {
  products: ProductStock[];
  commercialProducts: ProductStock[];
  movements: InventoryMovement[];
}

const MOVEMENT_LABELS: Record<InventoryMovement["movementType"], string> = {
  sale: "Venta",
  cancellation: "Cancelación",
  return: "Devolución",
  gift: "Regalo / donación",
  restock: "Ingreso de mercadería",
};

const TABS = [
  { key: "stock", label: "Stock" },
  { key: "prices", label: "Precios" },
  { key: "restock", label: "Ingresar mercadería" },
  { key: "gift", label: "Regalo / donación" },
  { key: "movements", label: "Movimientos" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}

function productLabel(products: ProductStock[], productId: string) {
  const product = products.find((item) => item.id === productId);
  return product ? `${product.name} (${product.sku})` : productId.slice(0, 8);
}

export function InventoryPanel({
  products,
  commercialProducts,
  movements,
}: InventoryPanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("stock");
  const [restockForm, setRestockForm] = useState({
    sku: products[0]?.sku ?? "",
    quantity: "1",
    note: "",
    occurredAt: todayInputValue(),
  });
  const [giftForm, setGiftForm] = useState({
    sku: products[0]?.sku ?? "",
    quantity: "1",
    note: "",
    occurredAt: todayInputValue(),
  });
  const [loading, setLoading] = useState<"restock" | "gift" | null>(null);
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
              <h2>Stock por SKU</h2>
            </div>
            <p>{products.length} SKUs</p>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Producto</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.sku}</strong>
                    </td>
                    <td>{product.name}</td>
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
    </>
  );
}
