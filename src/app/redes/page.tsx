import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { InstagramEmbed } from "@/components/social/instagram-embed";

export const metadata: Metadata = {
  title: "Redes y contacto — rituo",
  description: "Encontrá a rituo en redes sociales o escribinos directamente.",
};

const channels = [
  {
    shortName: "WA",
    name: "WhatsApp",
    handle: "+54 9 11 5847-9025",
    href: "https://wa.me/5491158479025",
    cta: "Abrir chat",
  },
  {
    shortName: "IG",
    name: "Instagram",
    handle: "@rituo.io",
    href: "https://www.instagram.com/rituo.io/",
    cta: "Seguir",
  },
  {
    shortName: "in",
    name: "LinkedIn",
    handle: "rituo.io",
    href: "https://www.linkedin.com/company/rituo-io/",
    cta: "Conectar",
  },
  {
    shortName: "@",
    name: "Email",
    handle: "hello@rituo.io",
    href: "mailto:hello@rituo.io",
    cta: "Escribir",
  },
];

export default function SocialsPage() {
  return (
    <main>
      <Header />
      <section className="socials-hero">
        <div className="socials-hero__intro">
          <span className="eyebrow">Estamos cerca</span>
          <h1>Encontranos<br /><em>en línea.</em></h1>
          <p>
            Novedades, ideas para recuperar tu atención y un canal directo para hablar con nosotros.
          </p>
        </div>

        <div className="socials-grid" aria-label="Canales de Rituo">
          {channels.map((channel) => {
            const external = channel.href.startsWith("http");

            return (
              <a
                className="social-card"
                href={channel.href}
                key={channel.name}
                rel={external ? "noreferrer" : undefined}
                target={external ? "_blank" : undefined}
              >
                <span className="social-card__icon" aria-hidden="true">{channel.shortName}</span>
                <span className="social-card__content">
                  <strong>{channel.name}</strong>
                  <small>{channel.handle}</small>
                </span>
                <span className="social-card__cta">{channel.cta} ↗</span>
              </a>
            );
          })}
        </div>
      </section>

      <section className="social-post-section">
        <div className="social-post-section__heading">
          <span className="eyebrow eyebrow--center">Desde Instagram</span>
          <h2>Conocé más sobre rituo</h2>
          <p>Mirá nuestra última publicación y seguinos para acompañar todo lo que viene.</p>
        </div>
        <InstagramEmbed permalink="https://www.instagram.com/reel/DaTkzKeKnQh/" />
      </section>

      <section className="contact-section">
        <ContactForm />
      </section>
      <Footer />
    </main>
  );
}
