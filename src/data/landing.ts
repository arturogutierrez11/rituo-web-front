import type { ProductMarketing } from "@/types/product";
import type { Step } from "@/types/step";

export const steps: Step[] = [
  {
    number: "01",
    title: "Creá un ritual en la app",
    description: "Configurá apps, horarios y reglas de concentración.",
    featured: true,
  },
  {
    number: "02",
    title: "Acercá tu Rituo Tag",
    description: "Un gesto físico para cortar la distracción.",
  },
  {
    number: "03",
    title: "Volvé a lo importante",
    description: "Tu teléfono queda en foco hasta que decidas cerrar el ritual.",
  },
];

/**
 * Contenido de marketing por slug — precio, stock y nombre "oficial" del
 * producto vienen de checkout.api (ver src/lib/merge-products.ts). Los slugs
 * acá tienen que matchear los `slug` que devuelve GET /products en checkout.api.
 */
export const productsMarketing: ProductMarketing[] = [
  {
    slug: "tag-one",
    description: "Tarjeta NFC + packaging premium + acceso a rituales de foco.",
    image: "/images/rituo-one.png",
    imageAlt: "Packaging abierto de Rituo Tag One",
    variant: "one",
    label: "Para empezar",
    features: ["1 tag NFC", "Packaging premium"],
  },
  {
    slug: "tag-two",
    description:
      "Pack de 2 tarjetas NFC + packaging premium + acceso a rituales de foco, webs bloqueadas y control.",
    image: "/images/rituo-family-new.png",
    imageAlt: "Padre usando Rituo para bloquear aplicaciones",
    variant: "family",
    label: "Para acompañar",
    features: ["2 tags NFC", "Control familiar", "Apps y horarios"],
  },
  {
    slug: "tag-ten",
    description:
      "Pack de 10 tags NFC y rituales de foco pensados para organizaciones.",
    image: "/images/rituo-hero.png",
    imageAlt: "Pack de tarjetas NFC Rituo para equipos",
    variant: "business",
    label: "Para equipos",
    ctaLabel: "Comprar para mi equipo",
    features: ["10 tags NFC", "Onboarding para equipos", "Soporte directo"],
  },
];
