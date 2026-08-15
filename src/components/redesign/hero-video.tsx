export function HeroVideo() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 640,
        overflow: "hidden",
        background: "#0d1327",
      }}
    >
      <div className="rt-noise" />
      <div className="rt-fullbleed" style={{ position: "absolute", inset: 0 }}>
        <video
          src="/videos/hero-intro.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(18,22,45,0.35) 0%, rgba(18,22,45,0.15) 40%, rgba(18,22,45,0.6) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#fff",
            fontSize: "clamp(32px,5.2vw,68px)",
            lineHeight: 1.08,
            margin: "0 0 20px",
            maxWidth: 920,
            textWrap: "balance",
            animation: "rt-fadeUp 1.1s var(--ease-calm, ease-out) both",
          }}
        >
          Que tu atención vuelva a ser tuya.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.86)",
            fontSize: "clamp(15px,1.6vw,20px)",
            lineHeight: 1.6,
            margin: "0 0 44px",
            maxWidth: 520,
            animation: "rt-fadeUp 1.1s var(--ease-calm, ease-out) 0.15s both",
          }}
        >
          Rituo pone una decisión entre vos y las apps que te distraen.
        </p>
        <a
          href="#hero"
          aria-label="Descubrir Rituo"
          className="rt-btn rt-btn--on-dark"
          style={{ animation: "rt-fadeUp 1.1s var(--ease-calm, ease-out) 0.3s both" }}
        >
          Descubrir Rituo <span aria-hidden="true">→</span>
        </a>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          width: 1,
          height: 44,
          background: "rgba(255,255,255,0.4)",
        }}
      />
    </section>
  );
}
