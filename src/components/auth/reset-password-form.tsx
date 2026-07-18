"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const hasToken = token.trim().length > 0;
  const canSubmit = useMemo(
    () =>
      hasToken &&
      newPassword.length >= 8 &&
      newPassword === newPasswordConfirmation &&
      submitState !== "loading",
    [hasToken, newPassword, newPasswordConfirmation, submitState],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!hasToken) {
      setSubmitState("error");
      setMessage("El link no tiene token. Pedí uno nuevo desde la app.");
      return;
    }

    if (newPassword.length < 8) {
      setSubmitState("error");
      setMessage("La contraseña tiene que tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== newPasswordConfirmation) {
      setSubmitState("error");
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    setSubmitState("loading");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
          newPasswordConfirmation,
        }),
      });

      if (!response.ok) {
        const errorPayload = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;

        throw new Error(
          errorPayload?.message ??
            "No pudimos cambiar la contraseña. Intentá nuevamente.",
        );
      }

      setSubmitState("success");
      setMessage("Listo. Ya podés volver a la app e iniciar sesión.");
      setNewPassword("");
      setNewPasswordConfirmation("");
    } catch (error) {
      setSubmitState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "No pudimos cambiar la contraseña. Intentá nuevamente.",
      );
    }
  }

  return (
    <section className="reset-page">
      <div className="reset-shell">
        <Link className="reset-brand" href="/" aria-label="Volver a rituo">
          <span>rituo</span>
          <i />
        </Link>

        <div className="reset-card">
          <div className="reset-card__header">
            <span>Recuperación de cuenta</span>
            <h1>Cambiá tu contraseña</h1>
            <p>
              Elegí una nueva contraseña para volver a entrar a rituo desde la
              app.
            </p>
          </div>

          {!hasToken ? (
            <div className="reset-notice reset-notice--error" role="alert">
              Este link no tiene token o está incompleto. Volvé a pedir la
              recuperación desde la app.
            </div>
          ) : null}

          <form className="reset-form" onSubmit={handleSubmit}>
            <label>
              Nueva contraseña
              <input
                autoComplete="new-password"
                disabled={!hasToken || submitState === "loading"}
                minLength={8}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                type="password"
                value={newPassword}
              />
            </label>

            <label>
              Repetir contraseña
              <input
                autoComplete="new-password"
                disabled={!hasToken || submitState === "loading"}
                minLength={8}
                onChange={(event) =>
                  setNewPasswordConfirmation(event.target.value)
                }
                placeholder="Repetí la contraseña"
                required
                type="password"
                value={newPasswordConfirmation}
              />
            </label>

            <button className="reset-submit" disabled={!canSubmit} type="submit">
              {submitState === "loading"
                ? "Guardando..."
                : "Guardar contraseña"}
            </button>
          </form>

          {message ? (
            <div
              className={`reset-notice reset-notice--${submitState === "success" ? "success" : "error"}`}
              role={submitState === "success" ? "status" : "alert"}
            >
              {message}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
