import type { Metadata } from "next";
import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { OrdersTable } from "@/components/admin/orders-table";
import { formatCurrency } from "@/lib/format-currency";
import { listOrders } from "@/services/checkout-api";
import type { Order, OrderStatusValue } from "@/types/order";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rituo Admin | Órdenes",
  description: "Panel interno para ver y gestionar las órdenes de compra de Rituo.",
};

const FILTERS: { label: string; value: OrderStatusValue | undefined }[] = [
  { label: "Todas", value: undefined },
  { label: "Pendientes", value: "pending" },
  { label: "Aprobadas", value: "approved" },
  { label: "Rechazadas", value: "rejected" },
  { label: "Canceladas", value: "cancelled" },
];

function sortOrdersByDate(orders: Order[]) {
  return [...orders].sort(
    (first, second) => Date.parse(second.createdAt) - Date.parse(first.createdAt),
  );
}

interface OrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function RituoAdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const { status } = await searchParams;
  const activeStatus = (status as OrderStatusValue | undefined) ?? undefined;

  let orders: Order[] = [];
  let errorMessage: string | null = null;

  try {
    orders = sortOrdersByDate(await listOrders(activeStatus));
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "No pudimos cargar las órdenes.";
  }

  const approvedOrders = orders.filter((order) => order.status === "approved");
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const revenue = approvedOrders.reduce((sum, order) => sum + order.total, 0);
  const currency = orders[0]?.currency ?? "ARS";

  return (
    <main className="admin-shell">
      <AdminSidebar />

      <section className="admin-main" aria-label="Órdenes">
        <header className="admin-topbar">
          <div className="admin-title-block">
            <span className="admin-kicker">Rituo Admin</span>
            <h1>Órdenes</h1>
            <p>Compras hechas desde la web, con su estado de pago y envío.</p>
          </div>

          <div className="admin-actions">
            <span className="admin-status">
              <span />
              Datos en vivo
            </span>
            <Link
              className="admin-refresh"
              href={activeStatus ? `/rituo-admin/orders?status=${activeStatus}` : "/rituo-admin/orders"}
            >
              Actualizar
            </Link>
          </div>
        </header>

        <div className="admin-stats" aria-label="Resumen de órdenes">
          <AdminStatCard detail="En este filtro" label="Órdenes" value={orders.length} />
          <AdminStatCard detail="Sin pagar todavía" label="Pendientes" value={pendingCount} />
          <AdminStatCard
            detail="Suma de órdenes aprobadas"
            label="Recaudado"
            value={formatCurrency(revenue, currency)}
          />
        </div>

        <div className="order-filters" aria-label="Filtrar por estado">
          {FILTERS.map((filter) => (
            <Link
              key={filter.label}
              className={`order-filter${activeStatus === filter.value ? " is-active" : ""}`}
              href={filter.value ? `/rituo-admin/orders?status=${filter.value}` : "/rituo-admin/orders"}
            >
              {filter.label}
            </Link>
          ))}
        </div>

        <section className="admin-card">
          <div className="admin-card__head">
            <div>
              <span>Compras</span>
              <h2>Órdenes registradas</h2>
            </div>
            <p>{orders.length} resultados</p>
          </div>

          {errorMessage ? (
            <div className="admin-error">
              <strong>No se pudo cargar la lista.</strong>
              <p>{errorMessage}</p>
            </div>
          ) : (
            <OrdersTable orders={orders} />
          )}
        </section>
      </section>
    </main>
  );
}
