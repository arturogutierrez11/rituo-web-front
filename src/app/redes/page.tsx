import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redes y contacto — rituo",
  description: "Encontrá a rituo en redes sociales o escribinos directamente.",
};

const CHANNELS = [
  {
    mono: "WA",
    name: "WhatsApp",
    handle: "+54 9 11 5847-9025",
    cta: "Abrir chat",
    href: "https://wa.me/5491158479025",
  },
  {
    mono: "IG",
    name: "Instagram",
    handle: "@rituo.io",
    cta: "Seguir",
    href: "https://www.instagram.com/rituo.io/",
  },
  {
    mono: "in",
    name: "LinkedIn",
    handle: "rituo.io",
    cta: "Conectar",
    href: "https://www.linkedin.com/company/rituo-io/",
  },
  {
    mono: "@",
    name: "Email",
    handle: "hello@rituo.io",
    cta: "Escribir",
    href: "mailto:hello@rituo.io",
  },
];

export default function SocialsPage() {
  return (
    <main
      className="rt-page"
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(120% 110% at 88% 4%, #b7c3d6 0%, #6d7a9c 24%, #364069 48%, #212749 74%, #1a1f3c 100%)",
      }}
    >
      <div className="rt-noise" />

      <section
        className="rs-grid"
        style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "140px 32px" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <span style={{ width: 24, height: 1, background: "rgba(255,255,255,0.4)" }} />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Estamos cerca
            </span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#fff",
              fontSize: "clamp(40px,6vw,84px)",
              lineHeight: 0.98,
              margin: "0 0 28px",
            }}
          >
            Encontranos
            <br />
            <span style={{ color: "var(--mist-400,#9CB2C6)" }}>en línea.</span>
          </h1>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              color: "rgba(255,255,255,0.68)",
              fontSize: 18,
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 420,
            }}
          >
            Novedades, ideas para recuperar tu atención y un canal directo para hablar con nosotros.
          </p>
        </div>

        <div
          style={{
            background: "rgba(15,20,40,0.35)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24,
            overflow: "hidden",
            backdropFilter: "blur(8px)",
          }}
        >
          {CHANNELS.map((channel) => {
            const external = channel.href.startsWith("http");

            return (
              <a
                key={channel.name}
                href={channel.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="rs-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 24,
                  padding: "26px 32px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20, minWidth: 0 }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 700,
                      fontSize: 14,
                      color: "#fff",
                    }}
                  >
                    {channel.mono}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 19, color: "#fff", marginBottom: 4 }}>
                      {channel.name}
                    </div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "rgba(255,255,255,0.55)" }}>
                      {channel.handle}
                    </div>
                  </div>
                </div>
                <div
                  className="rs-row-cta"
                  style={{
                    flexShrink: 0,
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--mist-400,#9CB2C6)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {channel.cta} ↗
                </div>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
