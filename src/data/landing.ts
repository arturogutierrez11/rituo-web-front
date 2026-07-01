import type { Product } from "@/types/product";
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

export const products: Product[] = [
  {
    id: "rituo-tag-one",
    name: "Rituo Tag One",
    description: "Tarjeta NFC + packaging premium + acceso a rituales de foco.",
    price: 19900,
    currency: "ARS",
    image: "/images/rituo-one.png",
    imageAlt: "Packaging abierto de Rituo Tag One",
    variant: "one",
    label: "Para empezar",
    features: ["1 tag NFC", "Packaging premium"],
  },
  {
    id: "rituo-tag-family",
    name: "Rituo Tag Family",
    description:
      "Tarjeta NFC + packaging premium + acceso a rituales de foco, webs bloqueadas y control.",
    price: 59900,
    currency: "ARS",
    image: "/images/rituo-family-new.png",
    imageAlt: "Padre usando Rituo para bloquear aplicaciones",
    variant: "family",
    label: "Para acompañar",
    features: ["Control familiar", "Apps y horarios"],
  },
  {
    id: "rituo-empresas",
    name: "Rituo Empresas",
    description:
      "Equipá a tu equipo con tags NFC y rituales de foco pensados para organizaciones.",
    price: 19900,
    currency: "ARS",
    image: "/images/rituo-hero.png",
    imageAlt: "Pack de tarjetas NFC Rituo para empresas",
    variant: "business",
    label: "Para equipos",
    ctaLabel: "Comprar para mi equipo",
    features: ["Más de 10 tags", "Onboarding para equipos", "Soporte directo"],
    minimumQuantity: 11,
  },
];
