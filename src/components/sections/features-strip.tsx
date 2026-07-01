const features = [
  {
    title: "Rituales personalizados",
    desc: "Creá sesiones de foco con apps bloqueadas, duración y horarios. Cada ritual es tuyo.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3.5" y="2" width="11" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 6.5h6M6 9h6M6 11.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Bloqueo total de apps",
    desc: "Bloqueá apps, categorías o dominios web. Control exacto sobre qué puede interrumpirte.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="4.5" y="8.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6.5 8.5V6.5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Activación por NFC",
    desc: "Sin abrir la app. Sin desbloquear el teléfono. Un gesto basta para activar el foco.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
        <path d="M6.5 9a2.5 2.5 0 0 1 2.5-2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11.5 9a2.5 2.5 0 0 1-2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M4 9a5 5 0 0 1 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M14 9a5 5 0 0 1-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function FeaturesStrip() {
  return (
    <section className="features-strip container" aria-label="Características principales">
      <div className="features-strip__grid">
        {features.map((f) => (
          <div className="feature-pill" key={f.title}>
            <div className="feature-pill__icon" aria-hidden="true">{f.icon}</div>
            <div className="feature-pill__copy">
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
