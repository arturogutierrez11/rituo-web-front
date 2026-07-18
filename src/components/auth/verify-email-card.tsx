"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type VerifyState = "loading" | "success" | "error";

export function VerifyEmailCard() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("Estamos confirmando tu email.");

  useEffect(() => {
    let isMounted = true;

    async function verifyEmail() {
      if (!token.trim()) {
        setState("error");
        setMessage("Este link no tiene token. Pedí uno nuevo desde la app.");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorPayload = (await response.json().catch(() => null)) as
            | { message?: string }
            | null;
          throw new Error(
            errorPayload?.message ??
              "No pudimos verificar tu email. Intentá nuevamente.",
          );
        }

        if (!isMounted) return;

        setState("success");
        setMessage("Listo. Tu email ya está verificado.");
      } catch (error) {
        if (!isMounted) return;

        setState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "No pudimos verificar tu email. Intentá nuevamente.",
        );
      }
    }

    void verifyEmail();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <section className="reset-page">
      <div className="reset-shell">
        <Link className="reset-brand" href="/" aria-label="Volver a rituo">
          <span>rituo</span>
          <i />
        </Link>

        <div className="reset-card">
          <div className="reset-card__header">
            <span>Verificación de cuenta</span>
            <h1>
              {state === "success"
                ? "Email confirmado"
                : state === "loading"
                  ? "Verificando..."
                  : "No pudimos verificarlo"}
            </h1>
            <p>{message}</p>
          </div>

          <div
            className={`reset-notice reset-notice--${
              state === "success" ? "success" : state === "error" ? "error" : "info"
            }`}
            role={state === "error" ? "alert" : "status"}
          >
            {state === "success"
              ? "Ya podés volver a la app y seguir usando rituo."
              : state === "loading"
                ? "Esto puede tardar unos segundos."
                : "Si el link venció, pedí otro desde la app."}
          </div>
        </div>
      </div>
    </section>
  );
}
