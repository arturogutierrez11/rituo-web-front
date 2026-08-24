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
    image: "/images/redesign/product-packaging.jpg",
    imageAlt: "Packaging abierto de Rituo Tag One",
    variant: "one",
    label: "Para empezar",
    packSize: 1,
    features: ["Tarjeta rituo NFC + acceso lifetime a app"],
    checkoutName: "rituo one",
  },
];
