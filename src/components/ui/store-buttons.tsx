import type { ReactNode } from "react";

const APP_STORE_URL = "https://apps.apple.com/app/rituo/id6759930487";

function AppleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
      <path d="M14.86 3.5c.09 1.02-.3 2-.86 2.7-.58.71-1.55 1.27-2.5 1.19-.11-1 .35-2.02.91-2.68.62-.73 1.66-1.28 2.45-1.21Z" />
      <path d="M17.9 15.55c-.32.75-.7 1.44-1.15 2.08-.61.87-1.11 1.47-1.5 1.8-.6.55-1.24.83-1.93.85-.5.01-1.09-.14-1.78-.44-.69-.3-1.32-.44-1.9-.44-.6 0-1.25.14-1.95.44-.7.3-1.27.46-1.7.47-.66.03-1.32-.26-1.96-.86-.42-.36-.94-.98-1.58-1.87-.68-.95-1.24-2.05-1.68-3.32-.47-1.37-.7-2.7-.7-3.98 0-1.47.32-2.73.95-3.8.5-.85 1.16-1.53 1.99-2.02.83-.49 1.72-.75 2.68-.76.53 0 1.23.16 2.12.49.88.33 1.45.5 1.7.5.19 0 .82-.19 1.86-.58 1-.36 1.83-.51 2.51-.45 1.85.15 3.25.88 4.17 2.19-1.66 1.01-2.48 2.42-2.46 4.24.01 1.42.52 2.6 1.53 3.55.45.44.96.78 1.53 1.02-.12.36-.25.7-.4 1.05Z" />
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
  status: "live" | "soon";
  icon: ReactNode;
}

const stores: StoreLinkConfig[] = [
  {
    id: "app-store",
    href: APP_STORE_URL,
    eyebrow: "Descargar en",
    label: "App Store",
    status: "live",
    icon: <AppleIcon />,
  },
  {
    id: "google-play",
    href: "#",
    eyebrow: "Disponible en",
    label: "Google Play",
    status: "soon",
    icon: <GooglePlayIcon />,
  },
];

export function StoreButtons() {
  return (
    <div className="store-buttons">
      {stores.map((store) => {
        const content = (
          <>
            <span className="store-button__icon" aria-hidden="true">
              {store.icon}
            </span>
            <span className="store-button__copy">
              <span className="store-button__eyebrow">{store.eyebrow}</span>
              <span className="store-button__label">{store.label}</span>
            </span>
            {store.status === "soon" && (
              <span className="store-button__badge">Muy pronto</span>
            )}
          </>
        );

        if (store.status === "soon") {
          return (
            <span
              key={store.id}
              className="store-button store-button--soon"
              aria-disabled="true"
            >
              {content}
            </span>
          );
        }

        return (
          <a
            key={store.id}
            className="store-button"
            href={store.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}
