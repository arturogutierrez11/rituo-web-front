"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { AppUpdateConfiguration } from "@/types/app-update";

interface AppUpdateManagerProps {
  configuration: AppUpdateConfiguration | null;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AppUpdateManager({
  configuration,
}: AppUpdateManagerProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      platform: "ios" as const,
      latestVersion: String(form.get("latestVersion")),
      latestBuild: Number(form.get("latestBuild")),
      minimumBuild: Number(form.get("minimumBuild")),
      title: String(form.get("title")),
      message: String(form.get("message")),
      storeUrl: String(form.get("storeUrl")),
      isActive: String(form.get("isActive")) === "true",
    };

    try {
      const response = await fetch("/api/admin/app-update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "No pudimos guardar la configuración");
      }

      setFeedback(
        "Configuración guardada. La app la verificará al abrirse o volver al primer plano.",
      );
      router.refresh();
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "No pudimos guardar la configuración",
      );
    } finally {
      setIsSaving(false);
    }
  }

  const latestBuild = configuration?.latestBuild ?? 25;

  return (
    <div className="legal-admin-grid">
      <section className="admin-card">
        <div className="admin-card__head">
          <div>
            <span>Publicación</span>
            <h2>Configurar actualización</h2>
          </div>
          <p>Plataforma iOS</p>
        </div>

        <form className="legal-admin-form" onSubmit={handleSubmit}>
          <div className="legal-admin-form__row">
            <label>
              Última versión
              <input
                name="latestVersion"
                defaultValue={configuration?.latestVersion ?? "1.0"}
                placeholder="1.1.0"
                maxLength={40}
                required
              />
            </label>
            <label>
              Última build
              <input
                name="latestBuild"
                type="number"
                min={1}
                step={1}
                defaultValue={latestBuild}
                required
              />
            </label>
          </div>

          <label>
            Build mínima permitida
            <input
              name="minimumBuild"
              type="number"
              min={1}
              step={1}
              defaultValue={configuration?.minimumBuild ?? latestBuild}
              required
            />
          </label>

          <p className="legal-admin-form__notice">
            Las builds inferiores a la mínima verán un aviso obligatorio. Para
            forzar a todos los usuarios anteriores a actualizar, usá el mismo
            número en “Última build” y “Build mínima”.
          </p>

          <label>
            Título del aviso
            <input
              name="title"
              defaultValue={
                configuration?.title ?? "Hay una nueva versión de rituo"
              }
              maxLength={180}
              required
            />
          </label>

          <label>
            Mensaje
            <textarea
              name="message"
              rows={6}
              defaultValue={
                configuration?.message ??
                "Actualizá la app para seguir usando las últimas mejoras y protecciones."
              }
              required
            />
          </label>

          <label>
            URL de App Store
            <input
              name="storeUrl"
              type="url"
              defaultValue={configuration?.storeUrl ?? ""}
              placeholder="https://apps.apple.com/app/id0000000000"
              required
            />
          </label>

          <label>
            Estado del aviso
            <select
              name="isActive"
              defaultValue={String(configuration?.isActive ?? true)}
            >
              <option value="true">Activo</option>
              <option value="false">Desactivado</option>
            </select>
          </label>

          {feedback ? <p className="legal-admin-feedback">{feedback}</p> : null}

          <button className="admin-refresh" disabled={isSaving} type="submit">
            {isSaving ? "Guardando…" : "Guardar configuración"}
          </button>
        </form>
      </section>

      <section className="admin-card">
        <div className="admin-card__head">
          <div>
            <span>Estado actual</span>
            <h2>Vista publicada</h2>
          </div>
          <p>{configuration?.isActive ? "Activa" : "Inactiva"}</p>
        </div>

        {configuration ? (
          <div className="app-update-preview">
            <span>iOS · v{configuration.latestVersion}</span>
            <strong>Build {configuration.latestBuild}</strong>
            <p>
              Obligatoria para builds anteriores a{" "}
              <b>{configuration.minimumBuild}</b>.
            </p>
            <div>
              <h3>{configuration.title}</h3>
              <p>{configuration.message}</p>
            </div>
            <a href={configuration.storeUrl} target="_blank" rel="noreferrer">
              Abrir URL de App Store
            </a>
            <small>Actualizada {formatDate(configuration.updatedAt)}</small>
          </div>
        ) : (
          <div className="admin-empty">
            <strong>Todavía no hay una configuración publicada.</strong>
            <p>Completá el formulario para crear la primera.</p>
          </div>
        )}
      </section>
    </div>
  );
}
