const features = [
  {
    title: "Se adapta a vos",
    desc: "Creá rituales con la duración, los horarios y las aplicaciones que elijas.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 6.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Protege tu atención",
    desc: "Las distracciones quedan afuera para que puedas enfocarte en lo que importa.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2.5L3.5 5.5v5c0 3.6 2.8 6.8 6.5 7.5 3.7-.7 6.5-3.9 6.5-7.5v-5L10 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Te devuelve la decisión",
    desc: "Para romper el foco antes de tiempo necesitás tu rituo Tag.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="2" fill="currentColor" />
        <path d="M7 10a3 3 0 0 1 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M13 10a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M4.5 10a5.5 5.5 0 0 1 5.5-5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M15.5 10a5.5 5.5 0 0 1-5.5 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function FeaturesStrip() {
  return (
    <section className="features-strip" aria-label="Por qué rituo">
      <div className="features-strip__grid container">
        {features.map((f) => (
          <div className="feature-card" key={f.title}>
            <div className="feature-card__icon" aria-hidden="true">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
