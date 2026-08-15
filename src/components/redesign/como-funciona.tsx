const STEPS = [
  { num: "01", title: "Elegí", desc: "Qué apps querés dejar afuera." },
  { num: "02", title: "Activá", desc: "Usá un Modo ahora o programá un Ritual." },
  { num: "03", title: "Volvé cuando quieras", desc: "Si decidís salir antes, buscá tu tarjeta." },
];

export function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="rt-section-vpad rt-section-pad"
      style={{ width: "100%", background: "var(--paper,#fff)", padding: "140px 32px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-accent,#495C78)",
              marginBottom: 16,
            }}
          >
            Cómo funciona
          </div>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--text-strong,#212749)",
              fontSize: "clamp(30px,3.6vw,46px)",
              margin: 0,
            }}
          >
            Tres pasos.
          </h2>
        </div>
        <div className="rt-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 48 }}>
          {STEPS.map((step) => (
            <div key={step.num}>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  color: "var(--mist-400,#9CB2C6)",
                  fontSize: 52,
                  letterSpacing: "-0.02em",
                  margin: "0 0 20px",
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  color: "var(--text-strong,#212749)",
                  fontSize: 22,
                  margin: "0 0 12px",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: "var(--text-body,#4b5468)",
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
