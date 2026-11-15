import type { Metadata } from "next";
import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { OrdersAnalytics } from "@/components/admin/orders-analytics";
import { listOrders } from "@/services/checkout-api";
import type { Order } from "@/types/order";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rituo Admin | Analítica",
  description: "Gráficos y métricas de las órdenes de Rituo.",
};

export default async function RituoAdminAnalyticsPage() {
  let orders: Order[] = [];
  let errorMessage: string | null = null;

  try {
    orders = await listOrders();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "No pudimos cargar las órdenes.";
  }

  return (
    <main className="admin-shell">
      <AdminSidebar />

      <section className="admin-main" aria-label="Analítica de órdenes">
        <header className="admin-topbar">
          <div className="admin-title-block">
            <span className="admin-kicker">Rituo Admin</span>
            <h1>Analítica</h1>
            <p>Cómo se mueven las ventas: ingresos, pagos, envíos y de dónde vienen las órdenes.</p>
          </div>

          <div className="admin-actions">
            <span className="admin-status">
              <span />
              Datos en vivo
            </span>
            <Link className="admin-refresh" href="/rituo-admin/analytics">
              Actualizar
            </Link>
          </div>
        </header>

        {errorMessage ? (
          <section className="admin-card">
            <div className="admin-error">
              <strong>No se pudieron cargar los datos.</strong>
              <p>{errorMessage}</p>
            </div>
          </section>
        ) : (
          <OrdersAnalytics orders={orders} />
        )}
      </section>
    </main>
  );
}
