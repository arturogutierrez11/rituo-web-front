/**
 * Opciones del desplegable "Enviar a Fullarg". El `value` se manda tal cual como
 * `shipping_method` en create_order.
 *
 * ⚠️ La doc pública de Fullarg no lista los valores válidos (solo menciona
 * `shipping_method` como alias de Flex). Los valores de abajo son una suposición
 * hasta que Fullarg confirme los códigos reales: si rechazan alguno, el panel
 * muestra su error y alcanza con corregir el `value` acá.
 */
export interface FullargShippingMethodOption {
  value: string;
  label: string;
}

export const FULLARG_SHIPPING_METHODS: FullargShippingMethodOption[] = [
  { value: "", label: "Que decida Fullarg" },
  { value: "flex", label: "Flex (envío en el día)" },
  { value: "andreani", label: "Andreani" },
  { value: "oca", label: "OCA" },
  { value: "correo_argentino", label: "Correo Argentino" },
];
