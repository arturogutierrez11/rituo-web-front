"use client";

import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { FULLARG_SHIPPING_METHODS } from "@/data/fullarg-shipping-methods";

import { formatCurrency } from "@/lib/format-currency";
import { formatDateTime } from "@/lib/format-date";
import type { Order, ShippingStatusValue } from "@/types/order";
import type { ProductCommerce } from "@/types/product";
import type { Warehouse } from "@/types/warehouse";

interface OrdersTableProps {
  orders: Order[];
  products: ProductCommerce[];
  warehouses: Warehouse[];
  dispatchers: string[];
}

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
  payment_init_failed: "Falló al iniciar pago",
};

const SHIPPING_STATUS_LABELS: Record<ShippingStatusValue, string> = {
  pending_dispatch: "Por despachar",
  dispatched: "Despachada",
  shipped: "Enviada",
  delivered: "Entregada",
  cancelled: "Cancelada",
};

const SHIPPING_STATUS_OPTIONS: ShippingStatusValue[] = [
  "pending_dispatch",
  "dispatched",
  "shipped",
  "delivered",
  "cancelled",
];

/** Tope del desplegable de unidades (se amplía si la orden pide más). */
const FULLARG_MAX_UNITS = 20;

/** Logo en public/images/fullarg-logo.png (blanco, para fondo oscuro); si falta, se muestra el nombre. */
function FullargLogo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <b className="fullarg-wordmark">Fullarg</b>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      className="fullarg-logo"
      onError={() => setFailed(true)}
      src="/images/fullarg-logo.png"
    />
  );
}

const CHANNEL_LABELS: Record<Order["salesChannel"], string> = {
  mercadopago: "Mercado Pago",
  bank_transfer: "Transferencia",
  manual: "Venta manual",
};

/** Quién se encarga de despachar la orden, para verlo sin abrir el detalle. */
function logisticsSummary(order: Order): { label: string; detail: string | null } {
  if (order.fullargSalesOrder) {
    return {
      label: "Fullarg",
      detail: order.shippingTrackingNumber ?? order.fullargSalesOrder,
    };
  }

  if (order.shippingZipnovaShipmentId) {
    return {
      label: order.shippingCarrier ?? "Zipnova",
      detail: order.shippingTrackingNumber,
    };
  }

  if (order.shippingCarrier || order.shippingTrackingNumber) {
    return {
      label: order.shippingCarrier ?? "Envío manual",
      detail: order.shippingTrackingNumber,
    };
  }

  return { label: "Sin logística", detail: null };
}

function matchesQuery(order: Order, query: string): boolean {
  const haystack = [
    order.id,
    order.customerFirstName,
    order.customerLastName,
    order.customerEmail,
    order.customerPhone,
    order.productName,
    order.productSku,
    order.shippingCity,
    order.shippingProvince,
    order.shippingCarrier,
    order.shippingTrackingNumber,
    order.fullargSalesOrder,
    order.assignedDispatcher,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span className={`order-status-badge order-status-badge--${status}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function ShippingStatusBadge({ status }: { status: ShippingStatusValue }) {
  return (
    <span className={`shipping-status-badge shipping-status-badge--${status}`}>
      {SHIPPING_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function OrdersTable({
  orders,
  products,
  warehouses,
  dispatchers,
}: OrdersTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [shippingFilter, setShippingFilter] = useState<ShippingStatusValue | "all">(
    "all",
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!expandedId) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExpandedId(null);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expandedId]);
  const [shipFormId, setShipFormId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorByOrder, setErrorByOrder] = useState<Record<string, string>>({});
  const [pendingShippingStatus, setPendingShippingStatus] = useState<
    Record<string, ShippingStatusValue>
  >({});
  const [fullargUnitsByOrder, setFullargUnitsByOrder] = useState<
    Record<string, number>
  >({});
  const [fullargMethodByOrder, setFullargMethodByOrder] = useState<
    Record<string, string>
  >({});
  const [labelWarehouseByOrder, setLabelWarehouseByOrder] = useState<
    Record<string, string>
  >({});

  if (orders.length === 0) {
    return (
      <div className="admin-empty">
        <strong>No hay órdenes para este filtro.</strong>
        <p>Cuando entre una compra nueva, va a aparecer acá.</p>
      </div>
    );
  }

  const shippingCounts = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.shippingStatus] = (acc[order.shippingStatus] ?? 0) + 1;
    return acc;
  }, {});
  const visibleOrders = orders.filter(
    (order) =>
      (shippingFilter === "all" || order.shippingStatus === shippingFilter) &&
      matchesQuery(order, query.trim()),
  );

  async function runAction(
    orderId: string,
    action:
      | "cancel"
      | "confirm-transfer"
      | "ship"
      | "resync"
      | "shipping-status"
      | "invoice-status"
      | "return"
      | "shipping-label"
      | "shipping-label/reset"
      | "send-to-fullarg"
      | "reserve-stock"
      | "assign-dispatcher",
    body?: unknown,
  ) {
    setLoadingId(orderId);
    setErrorByOrder((prev) => ({ ...prev, [orderId]: "" }));

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos completar la acción");
      }

      setShipFormId(null);
      router.refresh();
    } catch (error) {
      setErrorByOrder((prev) => ({
        ...prev,
        [orderId]: error instanceof Error ? error.message : "Ocurrió un error",
      }));
    } finally {
      setLoadingId(null);
    }
  }

  function handleShipSubmit(event: React.FormEvent<HTMLFormElement>, orderId: string) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    void runAction(orderId, "ship", {
      warehouseId: labelWarehouseByOrder[orderId] ?? warehouses[0]?.id,
      carrier: (formData.get("carrier") as string) || undefined,
      trackingNumber: (formData.get("trackingNumber") as string) || undefined,
      labelUrl: (formData.get("labelUrl") as string) || undefined,
    });
  }

  const selectedOrder = orders.find((order) => order.id === expandedId) ?? null;

  function closeDrawer() {
    setExpandedId(null);
    setShipFormId(null);
  }

  function defaultFullargUnits(order: Order): number {
    const product = products.find((item) => item.sku === order.productSku);
    return order.quantity * (product?.bundleUnits ?? 1);
  }

  function renderFullargBox(order: Order, isLoading: boolean) {
    if (order.fullargSalesOrder) {
      return (
        <section className="fullarg-box fullarg-box--sent">
          <div className="fullarg-box__head">
            <strong>Enviada a</strong>
            <FullargLogo />
          </div>
          <p>
            {order.fullargSalesOrder}
            {order.fullargStatus ? ` · ${order.fullargStatus}` : ""}
          </p>
          {order.fullargSentAt && (
            <small>El {formatDateTime(order.fullargSentAt)}</small>
          )}
        </section>
      );
    }

    if (order.status !== "approved" || order.shippingZipnovaShipmentId) {
      return null;
    }

    const orderUnits = defaultFullargUnits(order);
    const units = fullargUnitsByOrder[order.id] ?? orderUnits;
    const method = fullargMethodByOrder[order.id] ?? "";
    const methodLabel =
      FULLARG_SHIPPING_METHODS.find((option) => option.value === method)?.label ??
      "Que decida Fullarg";
    const maxUnits = Math.max(FULLARG_MAX_UNITS, orderUnits);

    return (
      <section className="fullarg-box">
        <div className="fullarg-box__head">
          <strong>Despachar con</strong>
          <FullargLogo />
        </div>

        <div className="fullarg-box__fields">
          <label>
            <span>Unidades a enviar</span>
            <select
              disabled={isLoading}
              onChange={(event) =>
                setFullargUnitsByOrder((prev) => ({
                  ...prev,
                  [order.id]: Number(event.target.value),
                }))
              }
              value={units}
            >
              {Array.from({ length: maxUnits }, (_, index) => index + 1).map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "unidad" : "unidades"}
                  {count === orderUnits ? " · lo que pide la orden" : ""}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Operador logístico</span>
            <select
              disabled={isLoading}
              onChange={(event) =>
                setFullargMethodByOrder((prev) => ({
                  ...prev,
                  [order.id]: event.target.value,
                }))
              }
              value={method}
            >
              {FULLARG_SHIPPING_METHODS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {units !== orderUnits && (
          <p className="fullarg-box__hint">
            La orden pide {orderUnits} {orderUnits === 1 ? "unidad" : "unidades"} y vas a
            mandar {units}. Sirve, por ejemplo, para regalos.
          </p>
        )}

        <button
          className="fullarg-send"
          disabled={isLoading}
          onClick={() => {
            if (
              window.confirm(
                `Se le envían a Fullarg los datos de esta orden para que la empaqueten y despachen.\n\nUnidades: ${units}\nOperador: ${methodLabel}\n\n¿Confirmás?`,
              )
            ) {
              void runAction(order.id, "send-to-fullarg", {
                quantity: units,
                ...(method ? { shippingMethod: method } : {}),
              });
            }
          }}
          type="button"
        >
          <span>{isLoading ? "Enviando a" : "Enviar a"}</span>
          <FullargLogo />
        </button>
      </section>
    );
  }

  function renderDetail(order: Order) {
    const isLoading = loadingId === order.id;
    const error = errorByOrder[order.id];
    const selectedShippingStatus =
      pendingShippingStatus[order.id] ?? order.shippingStatus;
    const isInvoiced = order.invoiceStatus === "invoiced";

    return (
                      <div className="order-detail">
                        {renderFullargBox(order, isLoading)}

                        <div className="order-detail__grid">
                          <div>
                            <span>Envío</span>
                            <p>
                              {order.shippingAddress}
                              {order.shippingFloor && `, Piso ${order.shippingFloor}`}
                              {order.shippingApartment &&
                                `, Depto ${order.shippingApartment}`}
                              , {order.shippingCity}, {order.shippingProvince} (
                              {order.shippingPostalCode})
                            </p>
                            {order.shippingNotes && (
                              <p>Observaciones: {order.shippingNotes}</p>
                            )}
                            {/* <p>
                              {order.shippingMethod === "express"
                                ? "Envío express"
                                : "Envío estándar"}
                            </p> */}
                          </div>
                          <div>
                            <span>Facturación</span>
                            <p>DNI {order.billingDni}</p>
                            {order.isBusinessPurchase && (
                              <p>
                                {order.billingBusinessName} — CUIT {order.billingCuit}
                              </p>
                            )}
                            {!order.billingUseShippingAddress && order.billingAddress && (
                              <p>
                                {order.billingAddress}, {order.billingCity},{" "}
                                {order.billingProvince} ({order.billingPostalCode})
                              </p>
                            )}
                          </div>
                          {order.salesChannel === "bank_transfer" ? (
                            <div>
                              <span>Transferencia bancaria</span>
                              <p>
                                {order.status === "pending"
                                  ? "Esperando acreditación"
                                  : "Acreditada"}
                              </p>
                              <p>
                                Descuento:{" "}
                                {formatCurrency(order.discountAmount, order.currency)}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <span>Mercado Pago</span>
                              <p>Pago: {order.mpPaymentId ?? "—"}</p>
                              <p>Estado MP: {order.mpPaymentStatus ?? "—"}</p>
                            </div>
                          )}
                          <div>
                            <span>Detalle de envío</span>
                            {order.fullargSalesOrder ? (
                              <>
                                <p>Fullarg · {order.fullargSalesOrder}</p>
                                {order.fullargSentAt && (
                                  <p>Enviada a Fullarg el {formatDateTime(order.fullargSentAt)}</p>
                                )}
                                {order.fullargStatus && (
                                  <p>Último aviso: {order.fullargStatus}</p>
                                )}
                                {order.shippingTrackingNumber && (
                                  <p>
                                    {order.shippingCarrier ?? "Seguimiento"} ·{" "}
                                    {order.shippingTrackingNumber}
                                  </p>
                                )}
                              </>
                            ) : order.shippingZipnovaShipmentId ? (
                              <>
                                <p>
                                  {order.shippingCarrier ?? "Correo Argentino"}
                                  {order.shippingTrackingNumber
                                    ? ` · ${order.shippingTrackingNumber}`
                                    : ""}
                                </p>
                                {order.shippingRealCost !== null && (
                                  <p>
                                    Costo real:{" "}
                                    {formatCurrency(order.shippingRealCost, order.currency)}
                                  </p>
                                )}
                                {order.shippedAt && (
                                  <p>Enviada el {formatDateTime(order.shippedAt)}</p>
                                )}
                                {order.shippingZipnovaStatus && (
                                  <p>Zipnova: {order.shippingZipnovaStatus}</p>
                                )}
                              </>
                            ) : (
                              <p>Todavía no se generó la etiqueta.</p>
                            )}
                          </div>
                        </div>

                        <div className="order-detail__controls">
                          <div className="order-status-control">
                            <span>Estado de envío</span>
                            <div className="order-status-control__row">
                              <select
                                value={selectedShippingStatus}
                                onChange={(event) => {
                                  const value = event.target.value as ShippingStatusValue;
                                  setPendingShippingStatus((prev) => ({
                                    ...prev,
                                    [order.id]: value,
                                  }));
                                  setShipFormId(value === "shipped" ? order.id : null);
                                }}
                              >
                                {SHIPPING_STATUS_OPTIONS.map((option) => (
                                  <option key={option} value={option}>
                                    {SHIPPING_STATUS_LABELS[option]}
                                  </option>
                                ))}
                              </select>
                              {selectedShippingStatus !== order.shippingStatus &&
                                selectedShippingStatus !== "shipped" && (
                                  <button
                                    className="admin-refresh"
                                    disabled={isLoading}
                                    onClick={() =>
                                      runAction(order.id, "shipping-status", {
                                        status: selectedShippingStatus,
                                      })
                                    }
                                    type="button"
                                  >
                                    Guardar estado
                                  </button>
                                )}
                            </div>
                          </div>

                          <div className="order-status-control">
                            <span>Facturación</span>
                            <div className="order-status-control__row">
                              <span
                                className={`invoice-status-badge${isInvoiced ? " is-invoiced" : ""}`}
                              >
                                {isInvoiced ? "Facturada" : "No facturada"}
                                {isInvoiced && order.invoicedAt
                                  ? ` · ${formatDateTime(order.invoicedAt)}`
                                  : ""}
                              </span>
                              <button
                                className="admin-refresh"
                                disabled={isLoading}
                                onClick={() =>
                                  runAction(order.id, "invoice-status", {
                                    invoiced: !isInvoiced,
                                  })
                                }
                                type="button"
                              >
                                {isInvoiced ? "Marcar no facturada" : "Marcar facturada"}
                              </button>
                            </div>
                          </div>

                          <div className="order-status-control">
                            <span>Responsable</span>
                            <div className="order-status-control__row">
                              <select
                                disabled={isLoading}
                                onChange={(event) =>
                                  runAction(order.id, "assign-dispatcher", {
                                    dispatcher: event.target.value || null,
                                  })
                                }
                                onClick={(event) => event.stopPropagation()}
                                value={order.assignedDispatcher ?? ""}
                              >
                                <option value="">Sin asignar</option>
                                {dispatchers.map((dispatcher) => (
                                  <option key={dispatcher} value={dispatcher}>
                                    {dispatcher}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {shipFormId === order.id && warehouses.length > 0 && (
                          <form
                            className="order-ship-form"
                            onSubmit={(event) => handleShipSubmit(event, order.id)}
                          >
                            <select
                              onChange={(event) =>
                                setLabelWarehouseByOrder((prev) => ({
                                  ...prev,
                                  [order.id]: event.target.value,
                                }))
                              }
                              value={labelWarehouseByOrder[order.id] ?? warehouses[0].id}
                            >
                              {warehouses.map((warehouse) => (
                                <option key={warehouse.id} value={warehouse.id}>
                                  {warehouse.name}
                                </option>
                              ))}
                            </select>
                            <input
                              name="carrier"
                              placeholder="Transportista (ej: Moto, Entrega en persona, Correo Argentino)"
                            />
                            <input
                              name="trackingNumber"
                              placeholder="N° de seguimiento (opcional)"
                            />
                            <input
                              name="labelUrl"
                              placeholder="Link de la etiqueta (opcional)"
                            />
                            <button className="admin-refresh" disabled={isLoading} type="submit">
                              Confirmar envío
                            </button>
                          </form>
                        )}

                        {error && (
                          <p className="order-detail__error" role="alert">
                            {error}
                          </p>
                        )}

                        <div className="order-detail__actions">
                          {order.status === "approved" &&
                            !order.shippingZipnovaShipmentId &&
                            !order.fullargSalesOrder &&
                            warehouses.length > 0 && (
                              <div className="order-detail__label-picker">
                                <select
                                  disabled={isLoading}
                                  onChange={(event) =>
                                    setLabelWarehouseByOrder((prev) => ({
                                      ...prev,
                                      [order.id]: event.target.value,
                                    }))
                                  }
                                  onClick={(event) => event.stopPropagation()}
                                  value={
                                    labelWarehouseByOrder[order.id] ?? warehouses[0].id
                                  }
                                >
                                  {warehouses.map((warehouse) => (
                                    <option key={warehouse.id} value={warehouse.id}>
                                      {warehouse.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  className="order-action"
                                  disabled={isLoading}
                                  onClick={() =>
                                    runAction(order.id, "reserve-stock", {
                                      warehouseId:
                                        labelWarehouseByOrder[order.id] ??
                                        warehouses[0].id,
                                    })
                                  }
                                  type="button"
                                >
                                  {isLoading ? "Asignando…" : "Asignar depósito"}
                                </button>
                                <button
                                  className="order-action"
                                  disabled={isLoading}
                                  onClick={() =>
                                    runAction(order.id, "shipping-label", {
                                      warehouseId:
                                        labelWarehouseByOrder[order.id] ??
                                        warehouses[0].id,
                                    })
                                  }
                                  type="button"
                                >
                                  {isLoading ? "Generando…" : "Generar etiqueta de envío"}
                                </button>
                              </div>
                            )}
                          {order.shippingZipnovaShipmentId && (
                            <a
                              className="order-action"
                              href={`/api/admin/orders/${order.id}/shipping-label`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Descargar etiqueta
                            </a>
                          )}
                          {order.shippingZipnovaShipmentId && (
                            <button
                              className="order-action order-action--danger"
                              disabled={isLoading}
                              onClick={() => {
                                const confirmed = window.confirm(
                                  "Esto solo tiene sentido si ya anulaste este envío del lado de Zipnova. Va a devolver el stock reservado y te va a dejar generar una etiqueta nueva. ¿Confirmás?",
                                );
                                if (confirmed) {
                                  runAction(order.id, "shipping-label/reset");
                                }
                              }}
                              type="button"
                            >
                              {isLoading ? "Reiniciando…" : "Reintentar etiqueta"}
                            </button>
                          )}
                          {order.status === "pending" &&
                            order.salesChannel === "bank_transfer" && (
                              <button
                                className="order-action"
                                disabled={isLoading}
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `¿Confirmás que la transferencia de ${formatCurrency(order.total, order.currency)} ya se acreditó? Se aprueba la orden y se le manda el mail de confirmación al cliente.`,
                                    )
                                  ) {
                                    void runAction(order.id, "confirm-transfer");
                                  }
                                }}
                                type="button"
                              >
                                {isLoading ? "Confirmando…" : "Confirmar transferencia"}
                              </button>
                            )}
                          {order.status === "pending" && (
                            <button
                              className="order-action order-action--danger"
                              disabled={isLoading}
                              onClick={() => runAction(order.id, "cancel")}
                              type="button"
                            >
                              Cancelar orden
                            </button>
                          )}
                          {order.salesChannel !== "bank_transfer" && (
                            <button
                              className="order-action"
                              disabled={isLoading}
                              onClick={() => runAction(order.id, "resync")}
                              type="button"
                            >
                              {isLoading ? "Verificando…" : "Verificar pago con MP"}
                            </button>
                          )}
                          {order.status === "approved" && (
                            <button
                              className="order-action"
                              disabled={isLoading}
                              onClick={() => runAction(order.id, "return")}
                              type="button"
                            >
                              Registrar devolución
                            </button>
                          )}
                        </div>
                      </div>
    );
  }

  return (
    <>
      <div className="orders-toolbar">
        <label className="orders-search">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="m13.2 13.2 3.6 3.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
          </svg>
          <input
            aria-label="Buscar órdenes"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por cliente, email, ciudad, producto, seguimiento…"
            type="search"
            value={query}
          />
        </label>

        <div className="orders-chips" role="group" aria-label="Filtrar por envío">
          <button
            className={`orders-chip${shippingFilter === "all" ? " is-active" : ""}`}
            onClick={() => setShippingFilter("all")}
            type="button"
          >
            Todos <b>{orders.length}</b>
          </button>
          {SHIPPING_STATUS_OPTIONS.map((option) => (
            <button
              className={`orders-chip${shippingFilter === option ? " is-active" : ""}`}
              key={option}
              onClick={() => setShippingFilter(option)}
              type="button"
            >
              {SHIPPING_STATUS_LABELS[option]} <b>{shippingCounts[option] ?? 0}</b>
            </button>
          ))}
        </div>
      </div>

      {visibleOrders.length === 0 && (
        <div className="admin-empty">
          <strong>Ninguna orden coincide.</strong>
          <p>Probá con otra búsqueda o quitá el filtro de envío.</p>
        </div>
      )}

      <div className="admin-table-wrap">
      <table className="admin-table orders-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Total</th>
            <th>Pago</th>
            <th>Envío</th>
            <th>Responsable</th>
          </tr>
        </thead>
        <tbody>
          {visibleOrders.map((order) => {
            const logistics = logisticsSummary(order);
            const isExpanded = expandedId === order.id;
            const isInvoiced = order.invoiceStatus === "invoiced";

            return (
              <Fragment key={order.id}>
                <tr
                  className={`order-row${isExpanded ? " is-open" : ""}`}
                  onClick={() => setExpandedId(order.id)}
                >
                  <td data-label="Orden">
                    <div className="admin-date">
                      <strong className="orders-id">#{order.id.slice(0, 8)}</strong>
                      <small>{formatDateTime(order.createdAt)}</small>
                    </div>
                  </td>
                  <td data-label="Cliente">
                    <div className="admin-contact">
                      <a href={`mailto:${order.customerEmail}`} onClick={(e) => e.stopPropagation()}>
                        {order.customerFirstName} {order.customerLastName}
                      </a>
                      <span>{order.customerEmail}</span>
                      <span>
                        {order.shippingCity}, {order.shippingProvince}
                      </span>
                    </div>
                  </td>
                  <td data-label="Producto">
                    <div className="admin-contact">
                      <strong className="orders-product">
                        {order.productName} <em>×{order.quantity}</em>
                      </strong>
                      <span>{order.productSku}</span>
                    </div>
                  </td>
                  <td data-label="Total">
                    <div className="admin-contact">
                      <strong className="orders-total">
                        {formatCurrency(order.total, order.currency)}
                      </strong>
                      <span>{CHANNEL_LABELS[order.salesChannel] ?? order.salesChannel}</span>
                    </div>
                  </td>
                  <td data-label="Pago">
                    <div className="orders-stack">
                      <StatusBadge status={order.status} />
                      {isInvoiced && <span className="order-invoiced-tag">Facturada</span>}
                    </div>
                  </td>
                  <td data-label="Envío">
                    <div className="orders-stack">
                      <ShippingStatusBadge status={order.shippingStatus} />
                      <span className="orders-logistics">
                        <b>{logistics.label}</b>
                        {logistics.detail && <small>{logistics.detail}</small>}
                      </span>
                    </div>
                  </td>
                  <td data-label="Responsable">
                    <span
                      className={`orders-owner${order.assignedDispatcher ? "" : " is-empty"}`}
                    >
                      {order.assignedDispatcher ?? "Sin asignar"}
                    </span>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
      </div>

      {selectedOrder && (
        <>
          <div className="order-drawer-overlay" onClick={closeDrawer} />
          <aside
            aria-label={`Detalle de la orden ${selectedOrder.id.slice(0, 8)}`}
            aria-modal="true"
            className="order-drawer"
            role="dialog"
          >
            <header className="order-drawer__head">
              <div>
                <span>Orden</span>
                <h2>#{selectedOrder.id.slice(0, 8)}</h2>
                <small>{formatDateTime(selectedOrder.createdAt)}</small>
              </div>
              <button
                aria-label="Cerrar detalle"
                className="order-drawer__close"
                onClick={closeDrawer}
                type="button"
              >
                ×
              </button>
            </header>

            <div className="order-drawer__summary">
              <div>
                <strong>
                  {selectedOrder.customerFirstName} {selectedOrder.customerLastName}
                </strong>
                <a href={`mailto:${selectedOrder.customerEmail}`}>
                  {selectedOrder.customerEmail}
                </a>
                {selectedOrder.customerPhone && <span>{selectedOrder.customerPhone}</span>}
              </div>
              <div>
                <strong>
                  {formatCurrency(selectedOrder.total, selectedOrder.currency)}
                </strong>
                <span>
                  {selectedOrder.productName} ×{selectedOrder.quantity}
                </span>
              </div>
              <div className="order-drawer__badges">
                <StatusBadge status={selectedOrder.status} />
                <ShippingStatusBadge status={selectedOrder.shippingStatus} />
              </div>
            </div>

            <div className="order-drawer__body">{renderDetail(selectedOrder)}</div>
          </aside>
        </>
      )}
    </>
  );
}
