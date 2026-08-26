"use client";

import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { formatCurrency } from "@/lib/format-currency";
import { formatDateTime } from "@/lib/format-date";
import type { Order, ShippingStatusValue } from "@/types/order";
import type { Warehouse } from "@/types/warehouse";

interface OrdersTableProps {
  orders: Order[];
  warehouses: Warehouse[];
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

export function OrdersTable({ orders, warehouses }: OrdersTableProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shipFormId, setShipFormId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorByOrder, setErrorByOrder] = useState<Record<string, string>>({});
  const [pendingShippingStatus, setPendingShippingStatus] = useState<
    Record<string, ShippingStatusValue>
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

  async function runAction(
    orderId: string,
    action:
      | "cancel"
      | "ship"
      | "resync"
      | "shipping-status"
      | "invoice-status"
      | "return"
      | "shipping-label",
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

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th>Total</th>
            <th>Pago</th>
            <th>Envío</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const isLoading = loadingId === order.id;
            const error = errorByOrder[order.id];
            const selectedShippingStatus =
              pendingShippingStatus[order.id] ?? order.shippingStatus;
            const isInvoiced = order.invoiceStatus === "invoiced";

            return (
              <Fragment key={order.id}>
                <tr
                  className="order-row"
                  onClick={() =>
                    setExpandedId((current) => (current === order.id ? null : order.id))
                  }
                >
                  <td>
                    <div className="admin-lead">
                      <span>
                        <strong>{order.id.slice(0, 8)}</strong>
                        <small>{order.productSku}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-contact">
                      <a href={`mailto:${order.customerEmail}`} onClick={(e) => e.stopPropagation()}>
                        {order.customerFirstName} {order.customerLastName}
                      </a>
                      <span>{order.customerEmail}</span>
                    </div>
                  </td>
                  <td>
                    {order.productName} × {order.quantity}
                  </td>
                  <td>{formatCurrency(order.total, order.currency)}</td>
                  <td>
                    <StatusBadge status={order.status} />
                    {isInvoiced && <span className="order-invoiced-tag">Facturada</span>}
                  </td>
                  <td>
                    <ShippingStatusBadge status={order.shippingStatus} />
                  </td>
                  <td>
                    <div className="admin-date">
                      <strong>{formatDateTime(order.createdAt)}</strong>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="order-detail-row">
                    <td colSpan={7}>
                      <div className="order-detail">
                        <div className="order-detail__grid">
                          <div>
                            <span>Envío</span>
                            <p>
                              {order.shippingAddress}, {order.shippingCity},{" "}
                              {order.shippingProvince} ({order.shippingPostalCode})
                            </p>
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
                          <div>
                            <span>Mercado Pago</span>
                            <p>Pago: {order.mpPaymentId ?? "—"}</p>
                            <p>Estado MP: {order.mpPaymentStatus ?? "—"}</p>
                          </div>
                          <div>
                            <span>Detalle de envío</span>
                            {order.shippingZipnovaShipmentId ? (
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
                          <button
                            className="order-action"
                            disabled={isLoading}
                            onClick={() => runAction(order.id, "resync")}
                            type="button"
                          >
                            {isLoading ? "Verificando…" : "Verificar pago con MP"}
                          </button>
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
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
