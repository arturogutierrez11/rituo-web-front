"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { LegalDocument } from "@/types/legal";

interface LegalDocumentsManagerProps {
  documents: LegalDocument[];
}

function documentTypeLabel(type: LegalDocument["type"]) {
  return type === "terms" ? "Términos y condiciones" : "Política de privacidad";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function LegalDocumentsManager({
  documents,
}: LegalDocumentsManagerProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setIsPublishing(true);
    setFeedback(null);

    const form = new FormData(formElement);
    const effectiveAt = String(form.get("effectiveAt"));
    const payload = {
      type: String(form.get("type")),
      version: String(form.get("version")),
      title: String(form.get("title")),
      content: String(form.get("content")),
      sourceUrl: String(form.get("sourceUrl") ?? ""),
      effectiveAt: new Date(effectiveAt).toISOString(),
    };

    try {
      const response = await fetch("/api/admin/legal-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos publicar el documento");
      }

      formElement.reset();
      setFeedback(
        "Versión publicada. Los usuarios deberán aceptarla cuando entre en vigencia.",
      );
      router.refresh();
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "No pudimos publicar el documento",
      );
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="legal-admin-grid">
      <section className="admin-card">
        <div className="admin-card__head">
          <div>
            <span>Nueva versión</span>
            <h2>Publicar documento</h2>
          </div>
          <p>No se puede editar después</p>
        </div>

        <form className="legal-admin-form" onSubmit={handleSubmit}>
          <div className="legal-admin-form__row">
            <label>
              Tipo
              <select name="type" defaultValue="terms" required>
                <option value="terms">Términos y condiciones</option>
                <option value="privacy">Política de privacidad</option>
              </select>
            </label>
            <label>
              Versión
              <input name="version" placeholder="1.1" maxLength={40} required />
            </label>
          </div>

          <label>
            Título
            <input
              name="title"
              placeholder="Términos y Condiciones Generales Rituo"
              maxLength={180}
              required
            />
          </label>

          <label>
            Fecha de vigencia
            <input name="effectiveAt" type="datetime-local" required />
          </label>

          <label>
            URL pública del PDF (opcional)
            <input
              name="sourceUrl"
              type="url"
              placeholder="https://rituo.io/legal/documento.pdf"
            />
          </label>

          <label>
            Texto completo
            <textarea
              name="content"
              rows={18}
              placeholder="Pegá acá el contenido final del documento…"
              required
            />
          </label>

          <p className="legal-admin-form__notice">
            Al publicar, la versión activa anterior queda archivada. Su contenido,
            versión y hash permanecen intactos para conservar la evidencia de cada
            aceptación.
          </p>

          {feedback ? <p className="legal-admin-feedback">{feedback}</p> : null}

          <button className="admin-refresh" disabled={isPublishing} type="submit">
            {isPublishing ? "Publicando…" : "Publicar nueva versión"}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-card__head">
          <div>
            <span>Auditoría</span>
            <h2>Historial inmutable</h2>
          </div>
          <p>{documents.length} versiones</p>
        </div>

        <div className="legal-version-list">
          {documents.map((document) => (
            <article className="legal-version" key={document.id}>
              <div>
                <span>{documentTypeLabel(document.type)}</span>
                <h3>
                  {document.title} · v{document.version}
                </h3>
                <p>
                  Vigente desde {formatDate(document.effectiveAt)} · publicada{" "}
                  {formatDate(document.publishedAt)}
                </p>
              </div>
              <div className="legal-version__meta">
                {document.isActive ? <strong>Versión activa</strong> : null}
                <code title={document.contentHash}>
                  SHA-256 {document.contentHash.slice(0, 12)}…
                </code>
                {document.sourceUrl ? (
                  <a href={document.sourceUrl} target="_blank" rel="noreferrer">
                    Abrir documento
                  </a>
                ) : null}
              </div>
            </article>
          ))}
          {documents.length === 0 ? (
            <div className="admin-empty">
              <strong>Todavía no hay documentos.</strong>
              <p>La primera versión aparecerá después de desplegar el backend.</p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
