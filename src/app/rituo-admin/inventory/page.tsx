import type { Metadata } from "next";
import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { InventoryPanel } from "@/components/admin/inventory-panel";
import {
  listAllProducts,
  listInventoryMovements,
  listInventoryProducts,
} from "@/services/checkout-api";
import type { InventoryMovement, ProductStock } from "@/types/inventory";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rituo Admin | Inventario",
  description: "Panel interno para ver y gestionar el stock de tarjetas y packaging de Rituo.",
};

export default async function RituoAdminInventoryPage() {
  let products: ProductStock[] = [];
  let commercialProducts: ProductStock[] = [];
  let movements: InventoryMovement[] = [];
  let errorMessage: string | null = null;

  try {
    [products, movements] = await Promise.all([
      listInventoryProducts(),
      listInventoryMovements(),
    ]);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "No pudimos cargar el inventario.";
  }

  try {
    commercialProducts = (await listAllProducts()).filter(
      (product) => !product.isInternal,
    );
  } catch {
    commercialProducts = [];
  }

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const outOfStock = products.filter((product) => product.stock === 0).length;

  return (
    <main className="admin-shell">
      <AdminSidebar />

      <section className="admin-main" aria-label="Inventario">
        <header className="admin-topbar">
          <div className="admin-title-block">
            <span className="admin-kicker">Rituo Admin</span>
            <h1>Inventario</h1>
            <p>Stock de tarjetas y packaging, con trazabilidad de cada movimiento.</p>
          </div>

          <div className="admin-actions">
            <span className="admin-status">
              <span />
              Datos en vivo
            </span>
            <Link className="admin-refresh" href="/rituo-admin/inventory">
              Actualizar
            </Link>
          </div>
        </header>

        <div className="admin-stats" aria-label="Resumen de inventario">
          <AdminStatCard detail="Entre todos los SKUs" label="Unidades en stock" value={totalStock} />
          <AdminStatCard detail="SKUs con stock 0" label="Sin stock" value={outOfStock} />
          <AdminStatCard detail="Últimos 100" label="Movimientos" value={movements.length} />
        </div>

        {errorMessage ? (
          <div className="admin-error">
            <strong>No se pudo cargar el inventario.</strong>
            <p>{errorMessage}</p>
          </div>
        ) : (
          <InventoryPanel
            commercialProducts={commercialProducts}
            products={products}
            movements={movements}
          />
        )}
      </section>
    </main>
  );
}
