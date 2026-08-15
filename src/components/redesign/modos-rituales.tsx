import Image from "next/image";

const RITUAL_TAGS = ["Trabajo", "Lectura", "Cena", "Entrenamiento", "Dormir"];

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text-accent, #495C78)",
        background: "var(--mist-100, #eef2f5)",
        borderRadius: 999,
        padding: "8px 16px",
      }}
    >
      {label}
    </span>
  );
}

export function ModosRituales() {
  return (
    <section
      className="rt-section-vpad rt-section-pad"
      style={{ width: "100%", background: "var(--paper,#fff)", padding: "140px 32px" }}
    >
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
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
            Dos formas de crear espacio
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
            Modos y rituales.
          </h2>
        </div>

        <div
          className="rt-grid-2"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 56 }}
        >
          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 340,
                marginBottom: 32,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <Image
                src="/images/redesign/modos.png"
                alt="Persona trabajando o entrenando, concentrada"
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                color: "var(--text-strong,#212749)",
                fontSize: 26,
                margin: "0 0 12px",
                letterSpacing: "-0.01em",
              }}
            >
              Modos
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-accent,#495C78)",
                margin: "0 0 16px",
              }}
            >
              Para cuando lo necesitás ahora.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 17,
                lineHeight: 1.65,
                color: "var(--text-body,#4b5468)",
                margin: 0,
              }}
            >
              Elegís las apps que querés bloquear y activás un Modo
              instantáneamente. Puede durar el tiempo que quieras.
            </p>
          </div>

          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 340,
                marginBottom: 32,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <Image
                src="/images/redesign/rituales.png"
                alt="Mesa compartida en una cena, luz cálida"
                fill
                sizes="(max-width: 860px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <h3
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                color: "var(--text-strong,#212749)",
                fontSize: 26,
                margin: "0 0 12px",
                letterSpacing: "-0.01em",
              }}
            >
              Rituales
            </h3>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-accent,#495C78)",
                margin: "0 0 16px",
              }}
            >
              Para los momentos que querés proteger todas las semanas.
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 17,
                lineHeight: 1.65,
                color: "var(--text-body,#4b5468)",
                margin: "0 0 20px",
              }}
            >
              Programás momentos recurrentes para dejar determinadas apps
              afuera automáticamente.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {RITUAL_TAGS.map((label) => (
                <Tag key={label} label={label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
