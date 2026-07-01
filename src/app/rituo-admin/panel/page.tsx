import type { Metadata } from "next";
import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { WaitlistTable } from "@/components/admin/waitlist-table";
import { formatDateTime } from "@/lib/format-date";
import { getWaitlistLeads } from "@/services/waitlist-admin";
import type { WaitlistLead } from "@/types/waitlist";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rituo Admin | Lista de espera",
  description: "Panel interno para revisar los leads de la lista de espera de Rituo.",
};

function sortLeadsByDate(leads: WaitlistLead[]) {
  return [...leads].sort(
    (first, second) =>
      Date.parse(second.createdAt) - Date.parse(first.createdAt),
  );
}

export default async function RituoAdminPanelPage() {
  let leads: WaitlistLead[] = [];
  let errorMessage: string | null = null;

  try {
    leads = sortLeadsByDate(await getWaitlistLeads());
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "No pudimos cargar la lista de espera.";
  }

  const iosLeads = leads.filter((lead) => lead.operatingSystem === "iOS").length;
  const androidLeads = leads.filter(
    (lead) => lead.operatingSystem === "Android",
  ).length;
  const latestLead = leads.at(0);

  return (
    <main className="admin-shell">
      <AdminSidebar />

      <section className="admin-main" aria-label="Lista de espera">
        <header className="admin-topbar">
          <div className="admin-title-block">
            <span className="admin-kicker">Rituo Admin</span>
            <h1>Lista de espera</h1>
            <p>Personas que dejaron sus datos para entrar en la preventa.</p>
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

        <div className="admin-stats" aria-label="Resumen de leads">
          <AdminStatCard
            detail="Total de registros"
            label="Leads"
            value={leads.length}
          />
          <AdminStatCard
            detail="Usuarios Apple"
            label="iOS"
            value={iosLeads}
          />
          <AdminStatCard
            detail="Usuarios Android"
            label="Android"
            value={androidLeads}
          />
          <AdminStatCard
            detail={latestLead ? formatDateTime(latestLead.createdAt) : "Sin datos"}
            label="Último ingreso"
            value={latestLead ? latestLead.firstName : "-"}
          />
        </div>

        <section className="admin-card">
          <div className="admin-card__head">
            <div>
              <span>Preventa</span>
              <h2>Leads registrados</h2>
            </div>
            <p>{leads.length} registros</p>
          </div>

          {errorMessage ? (
            <div className="admin-error">
              <strong>No se pudo cargar la lista.</strong>
              <p>{errorMessage}</p>
            </div>
          ) : (
            <WaitlistTable leads={leads} />
          )}
        </section>
      </section>
    </main>
  );
}
