const steps = [
  {
    num: "01",
    title: "Creá tu ritual",
    desc: "Elegí qué aplicaciones querés bloquear y cuándo querés hacerlo.",
  },
  {
    num: "02",
    title: "Empezá a enfocarte",
    desc: "Cuando el ritual comienza, las aplicaciones elegidas quedan bloqueadas automáticamente.",
  },
  {
    num: "03",
    title: "Desbloqueá solo si realmente lo necesitás",
    desc: "Si querés volver a acceder antes de terminar el ritual, acercá tu rituo card. Ese pequeño gesto convierte un impulso en una decisión.",
  },
];

export function HowItWorks() {
  return (
    <section className="steps-section" id="como-funciona" aria-labelledby="steps-title">
      <div className="steps-section__head container">
        <p className="eyebrow">Cómo funciona</p>
        <h2 id="steps-title">Tres pasos.<br />Un ritual.</h2>
      </div>

      <div className="steps-grid container" role="list">
        {steps.map((s) => (
          <article className="step-item" key={s.num} role="listitem">
            <span className="step-item__num" aria-hidden="true">{s.num}</span>
            <div className="step-item__body">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
