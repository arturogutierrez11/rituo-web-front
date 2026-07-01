import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export function WaitlistSection() {
  return (
    <section className="wl-section" id="lista-de-espera" aria-labelledby="wl-title">
      <p className="eyebrow eyebrow--center">Lista de espera</p>
      <h2 id="wl-title">
        Sé el primero<br />en tenerlo.
      </h2>
      <p className="wl-section__sub">
        Estamos preparando la primera tanda. Dejá tus datos y te avisamos
        con prioridad antes de abrir la venta pública.
      </p>
      <div className="waitlist-wrap">
        <WaitlistForm />
      </div>
    </section>
  );
}
