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
  const [showPassword, setShowPassword] = useState(false);
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
      <section className="admin-login__shell">
        <aside className="admin-login__brand" aria-hidden="true">
          <span className="admin-login__wordmark">
            rituo<i />
          </span>

          <div className="admin-login__pitch">
            <span>Panel interno</span>
            <h2>Todo Rituo en un solo lugar.</h2>
            <ul>
              <li>Órdenes, pagos y envíos al día</li>
              <li>Inventario y depósitos</li>
              <li>Versiones de la app y avisos legales</li>
            </ul>
          </div>

          <small>Acceso exclusivo para el equipo.</small>
        </aside>

        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__header">
            <span className="admin-login__wordmark admin-login__wordmark--small">
              rituo<i />
            </span>
            <h1>Iniciá sesión</h1>
            <p>Ingresá con tu cuenta del equipo para entrar al panel.</p>
          </div>

          <label className="admin-login__field">
            <span>Email</span>
            <input
              autoComplete="username"
              autoFocus
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@rituo.io"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="admin-login__field">
            <span>Contraseña</span>
            <div className="admin-login__password">
              <input
                autoComplete="current-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((value) => !value)}
                type="button"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </label>

          {status === "error" && (
            <p className="admin-login__error" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="admin-login__submit"
            disabled={status === "loading"}
            type="submit"
          >
            {status === "loading" ? (
              <>
                <span className="admin-login__spinner" aria-hidden="true" />
                Ingresando…
              </>
            ) : (
              "Ingresar"
            )}
          </button>

          <p className="admin-login__help">
            ¿Problemas para entrar? Pedile a otra persona del equipo que revise tu acceso.
          </p>
        </form>
      </section>
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
