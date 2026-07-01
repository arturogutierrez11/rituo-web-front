import { steps } from "@/data/landing";

const stepIcons = [
  <svg key="app" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4.5" y="2.5" width="11" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7.5 7h5M7.5 10h5M7.5 13h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  <svg key="nfc" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
    <path d="M7 10a3 3 0 0 1 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13 10a3 3 0 0 1-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4.5 10a5.5 5.5 0 0 1 5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15.5 10a5.5 5.5 0 0 1-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  <svg key="focus" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="10" r="1" fill="currentColor"/>
  </svg>,
];

export function HowItWorks() {
  return (
    <section className="how-it-works" id="como-funciona">
      <div className="section-heading">
        <p className="eyebrow">Simple por diseño</p>
        <h2>Tres pasos,<br />un ritual.</h2>
      </div>
      <div className="steps">
        {steps.map((step, index) => (
          <article className="step-card" key={step.number} data-step={step.number}>
            <div className="step-card__icon" aria-hidden="true">
              {stepIcons[index]}
            </div>
            <span className="step-card__number">
              {step.number}
              {step.featured && <i aria-hidden="true">✦</i>}
            </span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
