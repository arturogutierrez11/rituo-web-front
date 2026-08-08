import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad | Rituo",
  description: "Política de Privacidad de Rituo, versión 1.1.",
};

export default function PrivacyPolicyPage() {
  const pdfUrl = "/legal/politica-de-privacidad-1.1.pdf";

  return (
    <main className="legal-public">
      <header className="legal-public__header">
        <Link className="admin-brand" href="/">
          <span className="admin-brand__word">rituo</span>
          <span className="admin-brand__dot" />
        </Link>
        <div>
          <span>Versión 1.1</span>
          <h1>Política de privacidad</h1>
          <p>Vigente desde el 8 de agosto de 2026.</p>
        </div>
        <a className="admin-refresh" href={pdfUrl} download>
          Descargar PDF
        </a>
      </header>

      <iframe
        className="legal-public__document"
        src={pdfUrl}
        title="Política de Privacidad Rituo versión 1.1"
      />
    </main>
  );
}
