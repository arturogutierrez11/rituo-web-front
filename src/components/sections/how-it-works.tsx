const steps = [
  {
    num: "01",
    title: "Creá tu ritual en la app",
    desc: "Elegí qué apps bloquear, cuánto tiempo y en qué horarios. Configuralo una sola vez.",
  },
  {
    num: "02",
    title: "Acercá tu Rituo Tag",
    desc: "Un gesto físico que le dice a tu cerebro que empezó algo diferente. Cero fricciones.",
  },
  {
    num: "03",
    title: "Volvé a lo que importa",
    desc: "Tu teléfono queda en modo foco hasta que decidás terminar el ritual.",
  },
];

export function HowItWorks() {
  return (
    <section className="steps-section container" id="como-funciona" aria-labelledby="steps-title">
      <div className="steps-section__head">
        <p className="eyebrow">Simple por diseño</p>
        <h2 id="steps-title">
          Tres pasos.<br />Un ritual.
        </h2>
      </div>

      <div className="steps-grid" role="list">
        {steps.map((s) => (
          <article className="step-item" key={s.num} role="listitem">
            <div className="step-item__num" aria-hidden="true">{s.num}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <span className="step-item__ghost" aria-hidden="true">{s.num}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
