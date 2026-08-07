import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "Soporte — rituo",
  description: "Contactá al equipo de soporte de rituo por email o WhatsApp.",
};

export default function SupportPage() {
  return (
    <main>
      <Header />
      <section className="support-page">
        <div className="support-page__intro">
          <span className="eyebrow">Soporte rituo</span>
          <h1>Estamos para<br /><em>ayudarte.</em></h1>
          <p>
            Si tenés una consulta sobre tu tag, la app o tu cuenta, contanos qué pasó.
            Nuestro equipo va a acompañarte para resolverlo.
          </p>

          <div className="support-channels" aria-label="Canales de soporte directo">
            <a
              className="support-channel"
              href="https://wa.me/5491158479025"
              rel="noreferrer"
              target="_blank"
            >
              <span aria-hidden="true">WA</span>
              <span>
                <strong>WhatsApp</strong>
                <small>+54 9 11 5847-9025</small>
              </span>
              <b>Chat ↗</b>
            </a>
            <a className="support-channel" href="mailto:hello@rituo.io">
              <span aria-hidden="true">@</span>
              <span>
                <strong>Email directo</strong>
                <small>hello@rituo.io</small>
              </span>
              <b>Escribir ↗</b>
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
      <Footer />
    </main>
  );
}
