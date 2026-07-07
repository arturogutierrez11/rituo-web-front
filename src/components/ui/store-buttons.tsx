import type { ReactNode } from "react";

// TODO: reemplazar por las URLs reales cuando la app esté publicada.
const APP_STORE_URL = "#";
const PLAY_STORE_URL = "#";

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M13.2 6.7c-.85-.05-1.6.47-2.02.47-.43 0-1.1-.45-1.8-.43-.93.01-1.79.55-2.27 1.38-.97 1.68-.25 4.16.7 5.52.47.68 1.02 1.44 1.74 1.42.7-.03.96-.45 1.8-.45.85 0 1.09.45 1.82.43.75-.01 1.22-.68 1.68-1.36.53-.77.75-1.52.76-1.56-.02-.01-1.46-.56-1.48-2.22-.02-1.39 1.13-2.06 1.18-2.09-.65-.96-1.65-1.06-2.11-1.09Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M11.4 5.6c.38-.46.64-1.1.56-1.75-.56.03-1.24.38-1.65.85-.36.41-.68 1.07-.58 1.7.61.05 1.24-.29 1.67-.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 3.6c0-.9.98-1.46 1.76-1.02l9.3 5.4c.78.45.78 1.59 0 2.04l-9.3 5.4c-.78.44-1.76-.12-1.76-1.02V3.6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StoreLinkConfig {
  id: "app-store" | "google-play";
  href: string;
  eyebrow: string;
  label: string;
  icon: ReactNode;
}

const stores: StoreLinkConfig[] = [
  {
    id: "app-store",
    href: APP_STORE_URL,
    eyebrow: "Descargar en",
    label: "App Store",
    icon: <AppleIcon />,
  },
  {
    id: "google-play",
    href: PLAY_STORE_URL,
    eyebrow: "Disponible en",
    label: "Google Play",
    icon: <GooglePlayIcon />,
  },
];

interface StoreButtonsProps {
  /** La app todavía no está publicada: los botones llevan a la lista de espera. */
  comingSoon?: boolean;
  fallbackHref?: string;
}

export function StoreButtons({ comingSoon = false, fallbackHref = "/#lista-de-espera" }: StoreButtonsProps) {
  return (
    <div className="store-buttons">
      {stores.map((store) => (
        <a
          key={store.id}
          className="store-button"
          href={comingSoon ? fallbackHref : store.href}
          {...(comingSoon ? {} : { target: "_blank", rel: "noopener noreferrer" })}
        >
          <span className="store-button__icon" aria-hidden="true">
            {store.icon}
          </span>
          <span className="store-button__copy">
            <span className="store-button__eyebrow">{store.eyebrow}</span>
            <span className="store-button__label">{store.label}</span>
          </span>
          {comingSoon && <span className="store-button__badge">Muy pronto</span>}
        </a>
      ))}
    </div>
  );
}
