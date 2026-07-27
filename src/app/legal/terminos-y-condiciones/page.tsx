import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones | Rituo",
  description: "Términos y Condiciones Generales de Rituo, versión 1.0.",
};

export default function TermsPage() {
  const pdfUrl = "/legal/terminos-y-condiciones-1.0.pdf";

  return (
    <main className="legal-public">
      <header className="legal-public__header">
        <Link className="admin-brand" href="/">
          <span className="admin-brand__word">rituo</span>
          <span className="admin-brand__dot" />
        </Link>
        <div>
          <span>Versión 1.0</span>
          <h1>Términos y condiciones</h1>
          <p>Vigentes desde el 27 de julio de 2026.</p>
        </div>
        <a className="admin-refresh" href={pdfUrl} download>
          Descargar PDF
        </a>
      </header>

      <iframe
        className="legal-public__document"
        src={pdfUrl}
        title="Términos y Condiciones Generales Rituo versión 1.0"
      />
    </main>
  );
}
