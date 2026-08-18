"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

function isSafeNextPath(value: string | null): value is string {
  return !!value && value.startsWith("/") && !value.startsWith("//");
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        message?: string;
      };

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.message ?? "Credenciales inválidas.");
        return;
      }

      const nextParam = searchParams.get("next");
      router.replace(isSafeNextPath(nextParam) ? nextParam : "/rituo-admin/panel");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("No pudimos conectar con el servidor. Probá de nuevo.");
    }
  }

  return (
    <main className="admin-login">
      <form className="admin-login__card waitlist-form" onSubmit={handleSubmit}>
        <div className="waitlist-form__header">
          <span>Rituo Admin</span>
          <strong>Iniciá sesión</strong>
        </div>

        <label>
          Email
          <input
            autoComplete="username"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@rituo.io"
            required
            type="email"
            value={email}
          />
        </label>

        <label>
          Contraseña
          <input
            autoComplete="current-password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
            type="password"
            value={password}
          />
        </label>

        <button
          className="waitlist-form__submit"
          disabled={status === "loading"}
          type="submit"
        >
          {status === "loading" ? "Ingresando..." : "Ingresar"}
        </button>

        {status === "error" && (
          <p className="waitlist-form__notice waitlist-form__notice--error" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
