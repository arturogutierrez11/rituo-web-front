import { RtReveal } from "./rt-reveal";

const APP_PILLS = ["Instagram", "TikTok", "WhatsApp", "Mail", "X"];

export function AppsPills() {
  return (
    <section
      className="rt-section-vpad rt-section-pad"
      style={{
        position: "relative",
        width: "100%",
        background:
          "radial-gradient(120% 140% at 75% 25%, #7f97b3 0%, #33456a 30%, #16203f 60%, #0d1327 100%)",
        padding: "160px 32px",
        overflow: "hidden",
      }}
    >
      <div className="rt-noise" />
      <div style={{ position: "relative", maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#fff",
            fontSize: "clamp(28px,3.8vw,48px)",
            lineHeight: 1.28,
            margin: "0 0 32px",
            textWrap: "balance",
          }}
        >
          No queremos que uses menos el teléfono.
          <br />
          Queremos que decidas cuándo usarlo.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 18,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.72)",
            margin: "0 auto 56px",
            maxWidth: 480,
          }}
        >
          Elegís qué apps querés dejar afuera. Rituo se ocupa del resto.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          {APP_PILLS.map((label, i) => (
            <RtReveal key={label} delayMs={i * 90}>
              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 999,
                  padding: "10px 20px",
                  textDecoration: "line-through",
                }}
              >
                {label}
              </span>
            </RtReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
