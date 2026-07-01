import Image from "next/image";

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__inner">
        {/* Circle mark — mirrors the app splash screen */}
        <div className="hero__mark" aria-hidden="true">
          <div className="hero__mark-ring" />
          <div className="hero__mark-glow" />
          <Image
            src="/images/rituo-logo-white.png"
            alt=""
            width={843}
            height={488}
            className="hero__mark-logo"
            priority
          />
        </div>

        <h1>Volvé al presente.</h1>

        <p className="hero__desc">
          rituo convierte el impulso de abrir una app en una decisión
          consciente, agregando un pequeño ritual entre vos y las distracciones.
        </p>

        <div className="hero__ctas">
          <a href="#lista-de-espera" className="btn btn--primary">
            Sumarme a la lista
          </a>
          <a href="#como-funciona" className="btn btn--ghost">
            Cómo funciona →
          </a>
        </div>
      </div>
    </section>
  );
}
