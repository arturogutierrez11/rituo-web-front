import Image from "next/image";

export function Hero() {
  return (
    <section className="hero" id="inicio">
      {/* Background orbs */}
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__bg-orb hero__bg-orb--1" />
        <div className="hero__bg-orb hero__bg-orb--2" />
      </div>

      {/* Copy */}
      <div className="hero__copy">
        <p className="eyebrow eyebrow--center">App de foco · Tag NFC</p>
        <h1>
          Una pausa,<br />
          <em>por elección.</em>
        </h1>
        <p className="hero__desc">
          Acercá el tag NFC a tu teléfono. Las distracciones desaparecen.
          Volvés a lo que importa — sin decisiones, sin fricciones.
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

      {/* Product visual */}
      <div className="hero__product" aria-label="Rituo Tag NFC">
        <div className="hero__product-glow" aria-hidden="true" />
        <div className="hero__product-img-wrap">
          <Image
            src="/images/rituo-one.png"
            alt="Rituo Tag NFC — activa el modo foco con un gesto"
            width={1256}
            height={838}
            className="hero__product-img"
            priority
          />
        </div>
      </div>
    </section>
  );
}
