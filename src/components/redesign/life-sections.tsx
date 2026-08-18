import Image from "next/image";

import { RtReveal } from "./rt-reveal";

const LIFE_LINES = [
  { line: "Trabajar sin interrumpirte.", image: "/images/redesign/life-trabajar-02.jpg" },
  { line: "Leer sin tener que resistirte.", image: "/images/redesign/life-travel.jpg"},
  { line: "Estar con amigos sin estar en otro lado.", image: "/images/redesign/life-amigos.jpg" },
  { line: "Aburrirte un rato.", image: "/images/redesign/life-aburrir.jpg" }
  //{ line: "Estar acá.", image: null },
];

export function LifeSections() {
  return (
    <>
      {LIFE_LINES.map(({ line, image }) => (
        <section
          key={line}
          style={{
            position: "relative",
            width: "100%",
            height: "85vh",
            minHeight: 480,
            overflow: "hidden",
            background:
              "radial-gradient(120% 140% at 75% 25%, #7f97b3 0%, #33456a 30%, #16203f 60%, #0d1327 100%)",
          }}
        >
          <div className="rt-noise" />
          {image && (
            <div className="rt-fullbleed" style={{ position: "absolute", inset: 0 }}>
              <Image src={image} alt="" fill sizes="100vw" style={{ objectFit: "cover" }} />
            </div>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(18,22,45,0.1), rgba(18,22,45,0.5))",
              pointerEvents: "none",
            }}
          />
          <RtReveal
            durationMs={900}
            translateY={24}
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 32px",
              textAlign: "center",
            }}
          >
            <p
              className="rt-life-text"
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#fff",
                fontSize: "clamp(28px, 4.5vw, 56px)",
                lineHeight: 1.15,
                margin: 0,
                maxWidth: 760,
              }}
            >
              {line}
            </p>
          </RtReveal>
        </section>
      ))}
    </>
  );
}
