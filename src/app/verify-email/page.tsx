import type { Metadata } from "next";
import { Suspense } from "react";

import { VerifyEmailCard } from "@/components/auth/verify-email-card";

export const metadata: Metadata = {
  title: "Verificar email — rituo",
  description: "Confirmá tu email para activar tu cuenta de rituo.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailCard />
    </Suspense>
  );
}

function VerifyEmailLoading() {
  return (
    <main className="reset-page">
      <div className="reset-shell">
        <div className="reset-card">
          <div className="reset-card__header">
            <span>Verificación de cuenta</span>
            <h1>Cargando...</h1>
          </div>
        </div>
      </div>
    </main>
  );
}
