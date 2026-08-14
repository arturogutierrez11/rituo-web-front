"use client";

import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";

import { formatCurrency } from "@/lib/format-currency";
import { formatDateTime } from "@/lib/format-date";
import type { Order } from "@/types/order";

interface OrdersTableProps {
  orders: Order[];
}

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
  payment_init_failed: "Falló al iniciar pago",
};

function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span className={`order-status-badge order-status-badge--${status}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [shipFormId, setShipFormId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorByOrder, setErrorByOrder] = useState<Record<string, string>>({});

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
    action: "cancel" | "ship" | "resync",
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
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const isLoading = loadingId === order.id;
            const error = errorByOrder[order.id];

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
                    {order.shippedAt && (
                      <span className="order-shipped-tag">Enviada</span>
                    )}
                  </td>
                  <td>
                    <div className="admin-date">
                      <strong>{formatDateTime(order.createdAt)}</strong>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="order-detail-row">
                    <td colSpan={6}>
                      <div className="order-detail">
                        <div className="order-detail__grid">
                          <div>
                            <span>Envío</span>
                            <p>
                              {order.shippingAddress}, {order.shippingCity},{" "}
                              {order.shippingProvince} ({order.shippingPostalCode})
                            </p>
                            <p>
                              {order.shippingMethod === "express"
                                ? "Envío express"
                                : "Envío estándar"}
                            </p>
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
                            <span>Envío físico</span>
                            {order.shippedAt ? (
                              <>
                                <p>Enviada el {formatDateTime(order.shippedAt)}</p>
                                <p>
                                  {order.shippingCarrier ?? "Sin transportista"}
                                  {order.shippingTrackingNumber
                                    ? ` · ${order.shippingTrackingNumber}`
                                    : ""}
                                </p>
                              </>
                            ) : (
                              <p>Todavía no se marcó como enviada.</p>
                            )}
                          </div>
                        </div>

                        {shipFormId === order.id && (
                          <form
                            className="order-ship-form"
                            onSubmit={(event) => handleShipSubmit(event, order.id)}
                          >
                            <input name="carrier" placeholder="Transportista (opcional)" />
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
                          {order.status === "approved" && !order.shippedAt && (
                            <button
                              className="order-action"
                              disabled={isLoading}
                              onClick={() =>
                                setShipFormId((current) =>
                                  current === order.id ? null : order.id,
                                )
                              }
                              type="button"
                            >
                              Marcar enviada
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
