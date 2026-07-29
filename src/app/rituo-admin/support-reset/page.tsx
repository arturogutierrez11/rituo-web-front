import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SupportResetManager } from "@/components/admin/support-reset-manager";

export const metadata: Metadata = {
  title: "Rituo Admin | Rescate de usuario",
  description: "Liberación remota de restricciones para soporte.",
};

export default function SupportResetPage() {
  return (
    <main className="admin-shell">
      <AdminSidebar />
      <section className="admin-main" aria-label="Rescate de usuario">
        <header className="admin-topbar">
          <div className="admin-title-block">
            <span className="admin-kicker">Rituo Admin</span>
            <h1>Rescate de usuario</h1>
            <p>
              Usalo solamente cuando una persona quedó trabada. La liberación se
              completa cuando vuelve a abrir la app con internet.
            </p>
          </div>
          <span className="admin-status"><span />Soporte interno</span>
        </header>
        <SupportResetManager />
      </section>
    </main>
  );
}
