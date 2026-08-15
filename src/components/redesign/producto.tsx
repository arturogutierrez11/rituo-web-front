import Image from "next/image";

import { RtButton } from "./rt-button";

const TILES = [
  { id: "product-card", src: "/images/redesign/product-card.jpg", alt: "Tarjeta Rituo sola" },
  { id: "product-packaging", src: "/images/redesign/product-packaging.jpg", alt: "Packaging Rituo" },
  { id: "product-phone", src: "/images/redesign/product-phone.png", alt: "Teléfono junto a la tarjeta" },
];

const FEATURES = [
  "Tarjeta Rituo NFC",
  "Suscripción lifetime a la app",
  "Envío gratis",
  "Compatible con iOS",
];

export function Producto() {
  return (
    <section
      id="producto"
      className="rt-section-pad"
      style={{ width: "100%", background: "var(--paper,#fff)", padding: "140px 32px 60px" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--text-strong,#212749)",
            fontSize: "clamp(32px,4vw,52px)",
            lineHeight: 1.12,
            margin: "0 0 64px",
            textAlign: "center",
          }}
        >
          Parece una tarjeta.
          <br />
          Es un ritual.
        </h2>

        <div
          className="rt-grid-3 rt-product-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 24, marginBottom: 72 }}
        >
          {TILES.map((tile) => (
            <div
              key={tile.id}
              className="rt-product-tile"
              style={{ position: "relative", width: "100%", height: 320, borderRadius: 20, overflow: "hidden" }}
            >
              <Image src={tile.src} alt={tile.alt} fill sizes="(max-width: 860px) 100vw, 33vw" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14, marginBottom: 12 }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                color: "var(--text-strong,#212749)",
                fontSize: 42,
                letterSpacing: "-0.02em",
              }}
            >
              $49.990
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                color: "var(--text-faint,#8a93a6)",
                fontSize: 22,
                textDecoration: "line-through",
              }}
            >
              $69.990
            </span>
          </div>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-accent,#495C78)",
              margin: "0 0 32px",
            }}
          >
            EARLY BIRD
          </p>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "0 0 40px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontFamily: "var(--font-sans)",
              fontSize: 16,
              color: "var(--text-body,#4b5468)",
            }}
          >
            {FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <RtButton variant="primary" href="/checkout?product=tag-one">
            Comprar Rituo
          </RtButton>
        </div>
      </div>
    </section>
  );
}
