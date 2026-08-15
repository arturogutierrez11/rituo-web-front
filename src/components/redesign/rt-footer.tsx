const LINK_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 15,
  color: "var(--text-body, #4b5468)",
  textDecoration: "none",
};

const COLUMN_HEAD_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-faint,#8a93a6)",
  marginBottom: 16,
};

export function RtFooter() {
  return (
    <footer
      className="rt-section-pad"
      style={{
        width: "100%",
        background: "var(--paper-dim,#f4f6f8)",
        borderTop: "1px solid var(--border-subtle,#e4e8ee)",
        padding: "80px 32px 40px",
      }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div
          className="rt-footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)",
            gap: 48,
            marginBottom: 64,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: "-0.02em",
                color: "var(--text-strong,#212749)",
                marginBottom: 16,
              }}
            >
              rituo
            </div>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6, color: "var(--text-faint,#8a93a6)", margin: 0, maxWidth: 220 }}>
              diseñado para volver al presente
            </p>
          </div>

          <div>
            <div style={COLUMN_HEAD_STYLE}>Producto</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#como-funciona" style={LINK_STYLE}>Cómo funciona</a>
              <a href="#" style={LINK_STYLE}>Compatibilidad</a>
              <a href="#" style={LINK_STYLE}>Modos</a>
              <a href="#" style={LINK_STYLE}>Rituales</a>
            </div>
          </div>

          <div>
            <div style={COLUMN_HEAD_STYLE}>Soporte</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#faq" style={LINK_STYLE}>Preguntas frecuentes</a>
              <a href="#" style={LINK_STYLE}>Envíos</a>
              <a href="mailto:hello@rituo.io" style={LINK_STYLE}>hello@rituo.io</a>
            </div>
          </div>

          <div>
            <div style={COLUMN_HEAD_STYLE}>Rituo</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="#" style={LINK_STYLE}>Instagram</a>
              <a href="#" style={LINK_STYLE}>Términos</a>
              <a href="#" style={LINK_STYLE}>Privacidad</a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border-subtle,#e4e8ee)",
            paddingTop: 28,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--text-faint,#8a93a6)",
          }}
        >
          © 2026 Rituo · Volver al presente
        </div>
      </div>
    </footer>
  );
}
