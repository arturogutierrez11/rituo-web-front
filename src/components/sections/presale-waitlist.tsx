import { WaitlistForm } from "@/components/waitlist/waitlist-form";

const presaleSteps = [
  {
    number: "01",
    title: "Te anotás",
    description: "Guardamos tus datos para avisarte antes de abrir la venta pública.",
  },
  {
    number: "02",
    title: "Elegís tu tanda",
    description: "Te compartimos disponibilidad, precio final y tiempos de entrega.",
  },
  {
    number: "03",
    title: "Reservás primero",
    description: "Vas a tener prioridad para comprar tu Rituo Tag cuando salga.",
  },
];

export function PresaleWaitlist() {
  return (
    <section className="presale" id="comprar" aria-labelledby="presale-title">
      <div className="presale__copy">
        <p className="eyebrow">Preventa Rituo</p>
        <h2 id="presale-title">Entrá primero a la próxima tanda.</h2>
        <p className="presale__lead">
          Estamos preparando la primera preventa. Dejá tus datos y te avisamos
          antes de abrir stock, con prioridad para reservar tu tag personal,
          familiar o para equipos.
        </p>

        <div className="presale__status" aria-label="Estado de la preventa">
          <span />
          Lista prioritaria abierta
        </div>

        <div className="presale__steps">
          {presaleSteps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="presale__form-wrap">
        <div className="presale__halo" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <WaitlistForm />
      </div>
    </section>
  );
}
