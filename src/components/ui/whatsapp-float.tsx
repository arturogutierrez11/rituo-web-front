"use client";

import { usePathname } from "next/navigation";

import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

const WHATSAPP_SUPPORT_URL = "https://w.app/9lrral";

/** Botón flotante de WhatsApp en todo el sitio público (no en el panel interno). */
export function WhatsAppFloat() {
  const pathname = usePathname();

  if (pathname.startsWith("/rituo-admin")) {
    return null;
  }

  return (
    <a
      aria-label="Escribinos por WhatsApp"
      className="wa-float"
      href={WHATSAPP_SUPPORT_URL}
      rel="noopener noreferrer"
      target="_blank"
    >
      <WhatsAppIcon size={30} />
    </a>
  );
}
