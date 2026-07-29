"use client";

import { FormEvent, useState } from "react";
import type { SupportResetRequest, SupportResetUser } from "@/types/support-reset";

export function SupportResetManager() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SupportResetUser[]>([]);
  const [selected, setSelected] = useState<SupportResetUser | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [reason, setReason] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [created, setCreated] = useState<SupportResetRequest | null>(null);

  async function search(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setFeedback(null);
    setSelected(null);
    try {
      const response = await fetch(
        `/api/admin/support-reset/users?query=${encodeURIComponent(query)}`,
      );
      const data = (await response.json()) as SupportResetUser[] | { message?: string };
      if (!response.ok) throw new Error("message" in data ? data.message : "No pudimos buscar");
      setUsers(data as SupportResetUser[]);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No pudimos buscar");
    } finally {
      setLoading(false);
    }
  }

  async function reset() {
    if (!selected) return;
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/support-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selected.id,
          confirmationEmail: confirmation,
          reason,
          revokeTag: false,
        }),
      });
      const data = (await response.json()) as SupportResetRequest | { message?: string };
      if (!response.ok) throw new Error("message" in data ? data.message : "No pudimos liberar la cuenta");
      setCreated(data as SupportResetRequest);
      setUsers([]);
      setSelected(null);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No pudimos liberar la cuenta");
    } finally {
      setLoading(false);
    }
  }

  const canReset =
    selected &&
    confirmation.trim().toLowerCase() === selected.email.toLowerCase() &&
    reason.trim().length >= 8 &&
    acknowledged &&
    !loading;

  return (
    <div className="legal-admin-grid">
      <section className="admin-card">
        <div className="admin-card__head">
          <div><span>Paso 1</span><h2>Buscar usuario</h2></div>
          <p>Por email o ID</p>
        </div>
        <form className="legal-admin-form" onSubmit={search}>
          <label>
            Email del usuario
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="usuario@email.com"
              minLength={3}
              required
            />
          </label>
          <button className="admin-refresh" disabled={loading} type="submit">
            {loading ? "Buscando…" : "Buscar"}
          </button>
        </form>
        {users.map((user) => (
          <button
            className={`support-user${selected?.id === user.id ? " is-selected" : ""}`}
            key={user.id}
            onClick={() => {
              setSelected(user);
              setCreated(null);
              setConfirmation("");
              setReason("");
              setAcknowledged(false);
            }}
            type="button"
          >
            <span><strong>{user.email}</strong><small>{user.displayName ?? user.id}</small></span>
            <span>{user.ritualCount} rituales · {user.modeCount} modos</span>
          </button>
        ))}
      </section>

      <section className="admin-card">
        <div className="admin-card__head">
          <div><span>Paso 2</span><h2>Rescate remoto</h2></div>
          <p>Acción destructiva</p>
        </div>
        {created ? (
          <div className="admin-empty">
            <strong>Orden enviada para {created.userEmail}</strong>
            <p>
              Los datos fueron eliminados del servidor. El iPhone quitará las
              restricciones cuando el usuario abra rituo con conexión a internet.
            </p>
          </div>
        ) : selected ? (
          <div className="legal-admin-form">
            <div className="support-reset-summary">
              <strong>{selected.email}</strong>
              <p>
                Se eliminarán {selected.ritualCount} rituales y {selected.modeCount} modos,
                sus sesiones y bloqueos. La cuenta, el login, los términos y el tag se conservan.
              </p>
              {selected.pendingResetId ? <b>Ya existe una orden pendiente.</b> : null}
            </div>
            <label>
              Motivo del rescate
              <textarea
                rows={4}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Ej.: el usuario quedó bloqueado luego de finalizar un ritual."
              />
            </label>
            <label>
              Escribí el email para confirmar
              <input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder={selected.email}
              />
            </label>
            <label className="support-confirm">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
              />
              Entiendo que los rituales, modos e historial asociado no se pueden recuperar.
            </label>
            <button
              className="support-reset-button"
              disabled={!canReset || Boolean(selected.pendingResetId)}
              onClick={reset}
              type="button"
            >
              Liberar restricciones
            </button>
          </div>
        ) : (
          <div className="admin-empty">
            <strong>Seleccioná primero una cuenta.</strong>
            <p>Revisá cuidadosamente el email antes de ejecutar el rescate.</p>
          </div>
        )}
        {feedback ? <div className="admin-error"><strong>Error</strong><p>{feedback}</p></div> : null}
      </section>
    </div>
  );
}
