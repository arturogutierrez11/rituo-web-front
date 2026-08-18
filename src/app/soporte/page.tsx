import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Soporte — rituo",
  description: "Contactá al equipo de soporte de rituo por email o WhatsApp.",
};

export default function SupportPage() {
  return (
    <main className="rt-page rsp-page">
      <div className="rt-noise" />

      <header className="rsp-topbar">
        <div className="rsp-topbar__inner">
          <Link className="rsp-logo" href="/">
            rituo
          </Link>
        </div>
      </header>

      <section className="rsp-grid">
        <div>
          <p className="rsp-eyebrow">Soporte Rituo</p>
          <h1 className="rsp-title">
            Estamos
            <br />
            para
            <br />
            <em>ayudarte.</em>
          </h1>
          <p className="rsp-lead">
            Si tenés una consulta sobre tu tag, la app o tu cuenta, contanos qué pasó.
            Nuestro equipo va a acompañarte para resolverlo.
          </p>

          <div className="rsp-rows">
            <a
              className="rsp-row"
              href="https://wa.me/5491158479025"
              rel="noreferrer"
              target="_blank"
            >
              <div className="rsp-row__left">
                <span className="rsp-row__icon" aria-hidden="true">
                  WA
                </span>
                <div>
                  <p className="rsp-row__title">WhatsApp</p>
                  <p className="rsp-row__sub">+54 9 11 5847-9025</p>
                </div>
              </div>
              <span className="rsp-row__cta">Chat ↗</span>
            </a>
            <a className="rsp-row" href="mailto:hello@rituo.io">
              <div className="rsp-row__left">
                <span className="rsp-row__icon" aria-hidden="true">
                  @
                </span>
                <div>
                  <p className="rsp-row__title">Email directo</p>
                  <p className="rsp-row__sub">hello@rituo.io</p>
                </div>
              </div>
              <span className="rsp-row__cta">Escribir ↗</span>
            </a>
          </div>
        </div>

        <ContactForm
          description="Dejanos el mayor detalle posible y te responderemos al email que indiques."
          eyebrow="Soporte por email"
          footerText="Si es urgente, escribinos por WhatsApp."
          subjectPlaceholder="Ej: No puedo activar mi tag"
          title="Contanos qué pasó"
        />
      </section>
    </main>
  );
}
