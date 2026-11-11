/**
 * Opciones del desplegable "Enviar a Fullarg". El `value` se manda tal cual como
 * `shipping_method` (raíz del body de create_order).
 *
 * Confirmado por Fullarg: es texto libre, no un enum. "Flex" (o "same_day" /
 * "envío en el día") es envío en el día; para correo va el nombre del carrier,
 * por ejemplo "Andreani" o "Correo Argentino". Cualquier texto con "flex" se toma
 * como Flex. Un carrier mal escrito NO da error: queda como texto en la
 * "Modalidad" de Fullarg, así que respetá el nombre exacto.
 */
export interface FullargShippingMethodOption {
  value: string;
  label: string;
}

export const FULLARG_SHIPPING_METHODS: FullargShippingMethodOption[] = [
  { value: "", label: "Sin especificar (sale “sin dato”)" },
  { value: "Flex", label: "Flex (envío en el día)" },
  { value: "Andreani", label: "Andreani" },
  { value: "Correo Argentino", label: "Correo Argentino" },
];
