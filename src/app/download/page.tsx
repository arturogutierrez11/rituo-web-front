import type { Metadata } from "next";

const APP_STORE_URL = "https://apps.apple.com/app/rituo/id6759930487";

export const metadata: Metadata = {
  title: "Descargá rituo — App Store y Google Play",
  description:
    "Descargá la app de rituo en App Store o Google Play y empezá a crear tus rituales de foco.",
};

export default function DownloadPage() {
  return (
    <main
      className="rt-page"
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(120% 110% at 88% 8%, #b7c3d6 0%, #6d7a9c 26%, #364069 52%, #212749 78%, #1a1f3c 100%)",
      }}
    >
      <div className="rt-noise" />

      {/* <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "linear-gradient(180deg, rgba(33,39,73,0.55) 0%, rgba(33,39,73,0) 100%)",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 32px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: "#fff" }}>
            rituo
          </span>
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--mist-400,#9CB2C6)",
              boxShadow: "0 0 10px rgba(156,178,198,0.80)",
              marginLeft: 2,
            }}
          />
        </div>
      </header> */}

      <section
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 820,
          margin: "0 auto",
          padding: "80px 24px 120px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#fff",
            fontSize: "clamp(36px,6vw,68px)",
            lineHeight: 1.08,
            margin: "0 0 24px",
            textWrap: "balance",
          }}
        >
          Tu rituo empieza acá.
        </h1>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.72)",
            fontSize: "clamp(15px,1.7vw,20px)",
            lineHeight: 1.6,
            margin: "0 0 40px",
            maxWidth: 520,
          }}
        >
          Descargá la app, vinculá tu tarjeta y elegí qué apps querés dejar afuera.
        </p>

        <div className="rd-badges" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Descargar en App Store"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding: "12px 24px",
              textDecoration: "none",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M16.365 1.43c0 1.14-.415 2.06-1.244 2.79-.878.79-1.902 1.208-2.964 1.12-.098-1.14.32-2.15 1.166-2.95C14.198.512 15.29.06 16.365 0c.049.24.049.48 0 1.43zM20.7 17.19c-.35.81-.77 1.58-1.26 2.31-.66.98-1.2 1.66-1.62 2.03-.65.62-1.35.94-2.1.96-.54.01-1.19-.15-1.94-.48-.75-.33-1.44-.49-2.07-.49-.66 0-1.36.16-2.11.49-.75.33-1.36.5-1.83.52-.72.03-1.42-.29-2.11-.97-.46-.4-1.02-1.11-1.7-2.13-.72-1.08-1.32-2.34-1.79-3.77-.5-1.55-.76-3.05-.76-4.5 0-1.66.36-3.1 1.07-4.3.56-.97 1.31-1.74 2.24-2.3.93-.56 1.94-.85 3.02-.87.58 0 1.34.18 2.29.53.94.36 1.55.54 1.81.54.19 0 .87-.21 2.02-.63 1.09-.39 2.01-.55 2.75-.49 2.03.16 3.56.97 4.57 2.42-1.82 1.1-2.72 2.64-2.7 4.61.02 1.54.57 2.82 1.65 3.83.49.47 1.04.83 1.65 1.09-.13.39-.27.76-.42 1.15z" />
            </svg>
            <span style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                Descargar en
              </span>
              <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                App Store
              </span>
            </span>
          </a>

          <span
            aria-label="Disponible en Google Play, muy pronto"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 14,
              padding: "12px 22px",
              position: "relative",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 3l16 9-16 9V3z" />
            </svg>
            <span style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                Disponible en
              </span>
              <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                Google Play
              </span>
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 999,
                padding: "5px 10px",
                marginLeft: 6,
              }}
            >
              Muy pronto
            </span>
          </span>
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "rgba(255,255,255,0.5)", margin: 0 }}>
          Ya disponible para iPhone. La versión para Android está en camino.
        </p>
      </section>
    </main>
  );
}
