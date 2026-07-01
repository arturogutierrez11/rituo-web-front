import { InteractiveTag } from "@/components/hero/interactive-tag";
import { ButtonLink } from "@/components/ui/button-link";

export function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__copy">
        <p className="eyebrow">Tu atención vuelve a ser tuya</p>
        <h1>
          Una pausa,
          <br />
          por elección.
        </h1>
        <p className="hero__sub">
          Un tag NFC que convierte un gesto físico en modo foco real.
          Acercalo a tu teléfono y comenzá tu ritual — sin fricciones.
        </p>
        <div className="hero__ctas">
          <ButtonLink href="#comprar" variant="light">
            Sumarme a la preventa →
          </ButtonLink>
          <ButtonLink href="#como-funciona" variant="ghost">
            Cómo funciona
          </ButtonLink>
        </div>
        <div className="hero__chips" aria-label="Beneficios clave">
          <span><i aria-hidden="true" />Ritual en un toque</span>
          <span><i aria-hidden="true" />Apps bloqueadas automáticamente</span>
          <span><i aria-hidden="true" />NFC instantáneo</span>
        </div>
      </div>
      <div className="hero__visual" aria-label="Rituo Tag NFC interactivo">
        <InteractiveTag />
      </div>
    </section>
  );
}
