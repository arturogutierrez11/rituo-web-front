import Image from "next/image";

const focusSignals = [
  "Apps bloqueadas",
  "Ritual activo",
  "Foco en curso",
];

export function AppExperience() {
  return (
    <section className="app-experience" aria-labelledby="app-experience-title">
      <div className="app-experience__copy">
        <p className="eyebrow">La app marca el ritmo</p>
        <h2 id="app-experience-title">
          Configurá una vez.
          Activá con un toque.
        </h2>
        <p>
          Creá tus rituales de foco en la app — elegí qué apps bloquear,
          cuánto tiempo y cuándo. Después, un solo gesto con el tag NFC
          lo activa todo. Sin fricciones, sin configuraciones en el momento.
        </p>

        <div className="app-experience__signals" aria-label="Estados de foco">
          {focusSignals.map((signal) => (
            <span key={signal}>
              <i aria-hidden="true" />
              {signal}
            </span>
          ))}
        </div>
      </div>

      <div className="app-experience__visual" aria-label="Vista de la app Rituo">
        <div className="app-experience__ring app-experience__ring--one" />
        <div className="app-experience__ring app-experience__ring--two" />
        <div className="app-experience__ring app-experience__ring--three" />

        <div className="app-experience__phone">
          <Image
            src="/images/rituo-app-screen.png"
            alt="Pantalla de la app Rituo mostrando un ritual activo"
            width={477}
            height={865}
            sizes="(max-width: 800px) 78vw, 330px"
          />
        </div>

        <div className="app-experience__floating app-experience__floating--top">
          <span aria-hidden="true">01</span>
          <strong>Elegís un ritual</strong>
        </div>
        <div className="app-experience__floating app-experience__floating--bottom">
          <span aria-hidden="true" />
          <strong>Tag NFC detectado</strong>
        </div>
      </div>
    </section>
  );
}
