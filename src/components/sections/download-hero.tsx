import Image from "next/image";

import { StoreButtons } from "@/components/ui/store-buttons";

export function DownloadHero() {
  return (
    <section className="download-hero" id="descargar">
      <p className="eyebrow eyebrow--center">Descargá rituo</p>
      <h1>
        Tu ritual, <em>en tu bolsillo.</em>
      </h1>

      <p className="download-hero__desc">
        La app de rituo llega a App Store y Google Play. Configurá tus
        rituales de foco, activalos con un toque de tu Rituo Tag y volvé al
        presente, todos los días.
      </p>

      <StoreButtons comingSoon />

      <p className="download-hero__note">
        Todavía estamos puliendo el lanzamiento. Sumate a la lista de espera
        y te avisamos apenas esté disponible para descargar.
      </p>

      <div className="download-hero__visual" aria-hidden="true">
        <div className="download-hero__glow" />
        <div className="download-hero__phone">
          <Image
            src="/images/rituo-app-screen.png"
            alt=""
            width={477}
            height={865}
            sizes="(max-width: 800px) 70vw, 300px"
            priority
          />
        </div>
      </div>
    </section>
  );
}
