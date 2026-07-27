import type { Metadata } from "next";
import Link from "next/link";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LegalDocumentsManager } from "@/components/admin/legal-documents-manager";
import { getLegalDocuments } from "@/services/legal-admin";
import type { LegalDocument } from "@/types/legal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rituo Admin | Documentos legales",
  description: "Publicación y auditoría de documentos legales de Rituo.",
};

export default async function LegalAdminPage() {
  let documents: LegalDocument[] = [];
  let errorMessage: string | null = null;

  try {
    documents = await getLegalDocuments();
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "No pudimos cargar los documentos.";
  }

  return (
    <main className="admin-shell">
      <AdminSidebar />

      <section className="admin-main" aria-label="Documentos legales">
        <header className="admin-topbar">
          <div className="admin-title-block">
            <span className="admin-kicker">Rituo Admin</span>
            <h1>Documentos legales</h1>
            <p>
              Publicá versiones nuevas y conservá el texto exacto que aceptó cada
              usuario.
            </p>
          </div>

          <div className="admin-actions">
            <span className="admin-status">
              <span />
              Historial protegido
            </span>
            <Link className="admin-refresh" href="/rituo-admin/legal">
              Actualizar
            </Link>
          </div>
        </header>

        {errorMessage ? (
          <div className="admin-error">
            <strong>No se pudieron cargar los documentos.</strong>
            <p>{errorMessage}</p>
          </div>
        ) : (
          <LegalDocumentsManager documents={documents} />
        )}
      </section>
    </main>
  );
}
