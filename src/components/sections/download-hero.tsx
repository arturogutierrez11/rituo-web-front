import { StoreButtons } from "@/components/ui/store-buttons";

const features = [
  "Rituales por apps y horarios",
  "Estadísticas de tu foco",
  "Desbloqueo físico con tu Tag",
];

export function DownloadHero() {
  return (
    <section className="download-hero" id="descargar">
      <p className="eyebrow eyebrow--center">Descargá rituo</p>
      <h1>
        Tu ritual, <em>en tu bolsillo.</em>
      </h1>

      <p className="download-hero__desc">
        Configurá tus rituales de foco, activalos con un toque de tu Rituo
        Tag y volvé al presente, todos los días.
      </p>

      <ul className="download-hero__features">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <StoreButtons />

      <p className="download-hero__note">
        Ya disponible para iPhone. La versión para Android está en camino.
      </p>
    </section>
  );
}
