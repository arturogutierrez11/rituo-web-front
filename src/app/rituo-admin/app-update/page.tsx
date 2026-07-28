import type { Metadata } from "next";
import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AppUpdateManager } from "@/components/admin/app-update-manager";
import { getAppUpdateConfiguration } from "@/services/app-update-admin";
import type { AppUpdateConfiguration } from "@/types/app-update";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rituo Admin | Versión de la app",
  description: "Configuración remota de actualizaciones de Rituo para iOS.",
};

export default async function AppUpdateAdminPage() {
  let configuration: AppUpdateConfiguration | null = null;
  let errorMessage: string | null = null;

  try {
    configuration = await getAppUpdateConfiguration();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "No pudimos cargar la configuración.";
  }

  return (
    <main className="admin-shell">
      <AdminSidebar />

      <section className="admin-main" aria-label="Versión de la app">
        <header className="admin-topbar">
          <div className="admin-title-block">
            <span className="admin-kicker">Rituo Admin</span>
            <h1>Versión de la app</h1>
            <p>
              Avisá a los usuarios cuando exista una versión nueva y definí desde
              qué build la actualización será obligatoria.
            </p>
          </div>

          <div className="admin-actions">
            <span className="admin-status">
              <span />
              Configuración remota
            </span>
            <Link className="admin-refresh" href="/rituo-admin/app-update">
              Actualizar
            </Link>
          </div>
        </header>

        {errorMessage ? (
          <div className="admin-error">
            <strong>No se pudo cargar la configuración.</strong>
            <p>{errorMessage}</p>
          </div>
        ) : (
          <AppUpdateManager configuration={configuration} />
        )}
      </section>
    </main>
  );
}
