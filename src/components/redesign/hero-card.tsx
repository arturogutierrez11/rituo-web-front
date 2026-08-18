import { RtButton } from "./rt-button";

export function HeroCard() {
  return (
    <section
      id="hero"
      className="rt-section-pad"
      style={{
        position: "relative",
        width: "100%",
        background: "var(--paper,#fff)",
        padding: "120px 32px 140px",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-accent, #495C78)",
            marginBottom: 20,
          }}
        >
          Rituo
        </div>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text-strong,#212749)",
            fontSize: "clamp(34px,4vw,56px)",
            lineHeight: 1.06,
            margin: "0 0 26px",
          }}
        >
          Elegí cuándo volver.
        </h2>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 18,
            lineHeight: 1.65,
            color: "var(--text-body,#4b5468)",
            margin: "0 auto 44px",
            maxWidth: 460,
          }}
        >
          Rituo te permite dejar afuera las apps que no querés usar y pone
          un gesto real en el medio antes de volver a ellas.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <RtButton variant="primary" href="#producto">
            Comprar Rituo
          </RtButton>
          <RtButton variant="ghost" href="#como-funciona">
            Cómo funciona
          </RtButton>
        </div>
      </div>
    </section>
  );
}
