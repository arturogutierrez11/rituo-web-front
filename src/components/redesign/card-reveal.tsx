export function CardReveal() {
  return (
    <section
      className="rt-section-vpad rt-section-pad"
      style={{ position: "relative", width: "100%", background: "var(--paper,#fff)", padding: "160px 32px" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text-strong,#212749)",
            fontSize: "clamp(30px,4vw,52px)",
            margin: "0 0 64px",
            textWrap: "balance",
          }}
        >
          Para volver antes, necesitás esto.
        </h2>

        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: 340,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            isolation: "isolate",
            marginBottom: 56,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "min(76vw, 380px)",
              aspectRatio: "85.5 / 54",
              overflow: "hidden",
            }}
          >
            <video
              src="/videos/card-reveal-loop.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--text-strong,#212749)",
            fontSize: "clamp(22px,2.4vw,30px)",
            margin: "0 0 20px",
          }}
        >
          Ese segundo extra es todo.
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 18,
            lineHeight: 1.65,
            color: "var(--text-body,#4b5468)",
            margin: "0 auto",
            maxWidth: 560,
          }}
        >
          La tarjeta no está para impedirte usar el teléfono. Está para
          asegurarse de que, cuando vuelvas a usarlo, sea porque realmente lo
          elegiste.
        </p>
      </div>
    </section>
  );
}
