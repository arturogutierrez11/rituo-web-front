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

        <p className="hero__eyebrow-chip">App + Tarjeta NFC</p>

        <h1>Volvé al presente.</h1>

        <p className="hero__desc">
          Rituo bloquea las apps que te distraen y solo las desbloqueás
          acercando tu Rituo Tag, una tarjeta física. Ese pequeño gesto
          convierte el impulso de abrir el celular en una decisión consciente.
        </p>

        <div className="hero__ctas">
          <a href="#comprar" className="btn btn--primary">
            Comprar mi Rituo
          </a>
          <a href="#como-funciona" className="btn btn--ghost">
            Cómo funciona →
          </a>
        </div>
      </div>
    </section>
  );
}
