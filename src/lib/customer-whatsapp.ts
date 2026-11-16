/**
 * Arma el número que pide wa.me (solo dígitos, con código de país) a partir de
 * lo que tipeó el cliente. Acepta los formatos habituales en Argentina:
 * "+54 9 11 5847-9025", "11 5847 9025", "011 15 5847 9025", "(0351) 15-612-3456".
 * Los números de otros países se respetan si vienen con "+" o "00".
 * Devuelve null si no se puede armar un número confiable.
 */
export function toWhatsAppNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  let digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  const isInternational = trimmed.startsWith("+") || digits.startsWith("00");
  if (digits.startsWith("00")) digits = digits.slice(2);

  if (isInternational && !digits.startsWith("54")) {
    return digits.length >= 8 && digits.length <= 15 ? digits : null;
  }

  // Ninguna característica argentina empieza con 54, así que ese prefijo es el país.
  let local = digits.startsWith("54") ? digits.slice(2) : digits;

  // Prefijo troncal "0" y marca de celular "9": ninguno forma parte del número.
  local = local.replace(/^0+/, "");
  if (local.startsWith("9")) local = local.slice(1);

  // Con el "15" de celular quedan 12 dígitos: se lo saca después del código de área (2 a 4 dígitos).
  if (local.length === 12) {
    for (const areaLength of [2, 3, 4]) {
      if (local.slice(areaLength, areaLength + 2) === "15") {
        local = local.slice(0, areaLength) + local.slice(areaLength + 2);
        break;
      }
    }
  }

  return local.length === 10 ? `549${local}` : null;
}

export function buildWhatsAppUrl(
  phone: string | null | undefined,
  message?: string,
): string | null {
  const number = toWhatsAppNumber(phone);
  if (!number) return null;

  return message
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${number}`;
}
