const features = [
  {
    eyebrow: "Rituales",
    title: "Diseñá tu rutina de foco",
    description:
      "Creá rituales personalizados: elegí qué apps bloquear, horarios y duración. Una vez configurado, se activa con un solo gesto.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="4.5" y="2.5" width="11" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7h6M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    eyebrow: "Modos",
    title: "Bloqueo total de distracciones",
    description:
      "Modos de bloqueo por apps, categorías o dominios web. Controlá exactamente qué puede interrumpirte durante tu sesión.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="5.5" y="9.5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7.5 9.5V7a2.5 2.5 0 0 1 5 0v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    eyebrow: "Tag NFC",
    title: "Un gesto físico lo activa todo",
    description:
      "Acercá el tag a tu teléfono y el ritual comienza. Sin abrir la app, sin decisiones. El gesto físico marca el cambio de estado.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="1.5" fill="currentColor" />
        <path d="M7.5 10a2.5 2.5 0 0 1 2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12.5 10a2.5 2.5 0 0 1-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 10a5 5 0 0 1 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 10a5 5 0 0 1-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    eyebrow: "Estadísticas",
    title: "Seguí tu progreso día a día",
    description:
      "Sesiones completadas, racha de rituales y tiempo total en foco. Datos reales para reforzar el hábito.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3.5 15.5l4-5.5 3.5 2.5 4-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="15" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export function AppFeatures() {
  return (
    <section className="app-features" aria-labelledby="app-features-title">
      <div className="app-features__inner">
        <div className="app-features__heading">
          <p className="eyebrow">La app detrás del ritual</p>
          <h2 id="app-features-title" className="text-gradient">
            Todo el control,<br />en tu mano.
          </h2>
          <p className="app-features__sub">
            Rituo es la app que combina rituales de foco, bloqueo de apps y
            activación por NFC en una sola experiencia diseñada para el hábito real.
          </p>
        </div>

        <div className="app-features__grid">
          {features.map((f, i) => (
            <article className="feature-card" key={f.title} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="feature-card__top">
                <div className="feature-card__icon" aria-hidden="true">
                  {f.icon}
                </div>
                <span className="feature-card__eyebrow">{f.eyebrow}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
