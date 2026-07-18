import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Cambiar contraseña — rituo",
  description: "Elegí una nueva contraseña para recuperar tu cuenta de rituo.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordLoading() {
  return (
    <main className="reset-page">
      <div className="reset-shell">
        <div className="reset-card">
          <div className="reset-card__header">
            <span>Recuperación de cuenta</span>
            <h1>Cargando...</h1>
          </div>
        </div>
      </div>
    </main>
  );
}
