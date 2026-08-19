import type { Metadata } from "next";
import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { formatCurrency } from "@/lib/format-currency";
import { formatDateTime } from "@/lib/format-date";
import { listInventoryProducts, listOrders } from "@/services/checkout-api";
import { getWaitlistLeads } from "@/services/waitlist-admin";
import type { Order } from "@/types/order";
import type { ProductStock } from "@/types/inventory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rituo Admin | Panel",
  description: "Resumen general de ventas, envíos e inventario de Rituo.",
};

const ORDER_STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
  cancelled: "Cancelada",
  payment_init_failed: "Falló al iniciar pago",
};

function sortByDateDesc<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export default async function RituoAdminHomePage() {
  let orders: Order[] = [];
  let products: ProductStock[] = [];
  let waitlistCount: number | null = null;
  let errorMessage: string | null = null;

  try {
    [orders, products] = await Promise.all([listOrders(), listInventoryProducts()]);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "No pudimos cargar el resumen.";
  }

  try {
    waitlistCount = (await getWaitlistLeads()).length;
  } catch {
    waitlistCount = null;
  }

  const approvedOrders = orders.filter((order) => order.status === "approved");
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const revenue = approvedOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingDispatch = approvedOrders.filter(
    (order) => order.shippingStatus === "pending_dispatch",
  ).length;
  const currency = orders[0]?.currency ?? "ARS";

  const recentOrders = sortByDateDesc(orders).slice(0, 6);
  const cardsStock = products.find((product) => product.sku === "TARJETA0001");

  return (
    <main className="admin-shell">
      <AdminSidebar />

      <section className="admin-main" aria-label="Panel general">
        <header className="admin-topbar">
          <div className="admin-title-block">
            <span className="admin-kicker">Rituo Admin</span>
            <h1>Panel</h1>
            <p>Resumen de ventas, envíos e inventario en un vistazo.</p>
          </div>

          <div className="admin-actions">
            <span className="admin-status">
              <span />
              Datos en vivo
            </span>
            <Link className="admin-refresh" href="/rituo-admin/panel">
              Actualizar
            </Link>
          </div>
        </header>

        {errorMessage && (
          <div className="admin-error">
            <strong>No se pudo cargar todo el resumen.</strong>
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="admin-stats" aria-label="Métricas principales">
          <AdminStatCard
            detail={`${approvedOrders.length} órdenes aprobadas`}
            label="Recaudado"
            value={formatCurrency(revenue, currency)}
          />
          <AdminStatCard
            detail="Esperando pago"
            label="Pendientes"
            value={pendingOrders.length}
          />
          <AdminStatCard
            detail="Aprobadas sin despachar"
            label="Por despachar"
            value={pendingDispatch}
          />
          <AdminStatCard
            detail="Pool físico compartido"
            label="Tarjetas en stock"
            value={cardsStock ? cardsStock.stock : "—"}
          />
        </div>

        <div className="admin-panel-grid">
          <section className="admin-card">
            <div className="admin-card__head">
              <div>
                <span>Compras</span>
                <h2>Órdenes recientes</h2>
              </div>
              <Link className="admin-refresh" href="/rituo-admin/orders">
                Ver todas
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="admin-empty">
                <strong>Todavía no hay órdenes.</strong>
                <p>Cuando entre una compra, va a aparecer acá.</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table admin-table--compact">
                  <thead>
                    <tr>
                      <th>Orden</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>{order.id.slice(0, 8)}</strong>
                          <br />
                          <small>{formatDateTime(order.createdAt)}</small>
                        </td>
                        <td>
                          {order.customerFirstName} {order.customerLastName}
                        </td>
                        <td>{formatCurrency(order.total, order.currency)}</td>
                        <td>
                          <span
                            className={`order-status-badge order-status-badge--${order.status}`}
                          >
                            {ORDER_STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="admin-card">
            <div className="admin-card__head">
              <div>
                <span>Catálogo</span>
                <h2>Stock físico</h2>
              </div>
              <Link className="admin-refresh" href="/rituo-admin/inventory">
                Gestionar
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="admin-empty">
                <strong>No pudimos leer el inventario.</strong>
                <p>Revisá la sección de inventario para más detalle.</p>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table admin-table--compact">
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
            )}

            {waitlistCount !== null && (
              <p className="admin-panel-aside-note">
                {waitlistCount} personas en la{" "}
                <Link href="/rituo-admin/waitlist">lista de espera</Link>.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
