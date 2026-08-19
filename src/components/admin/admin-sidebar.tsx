"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const sections = [
  {
    href: "/rituo-admin/panel",
    label: "Panel",
    description: "Resumen general",
    shortLabel: "HM",
  },
  {
    href: "/rituo-admin/orders",
    label: "Órdenes",
    description: "Compras y pagos",
    shortLabel: "OR",
  },
  {
    href: "/rituo-admin/inventory",
    label: "Inventario",
    description: "Stock y trazabilidad",
    shortLabel: "IN",
  },
  {
    href: "/rituo-admin/waitlist",
    label: "Lista de espera",
    description: "Leads de preventa",
    shortLabel: "WL",
  },
  {
    href: "/rituo-admin/legal",
    label: "Documentos legales",
    description: "Versiones y publicación",
    shortLabel: "TC",
  },
  {
    href: "/rituo-admin/app-update",
    label: "Versión de la app",
    description: "Avisos de actualización",
    shortLabel: "APP",
  },
  {
    href: "/rituo-admin/support-reset",
    label: "Rescate de usuario",
    description: "Liberar restricciones",
    shortLabel: "SOS",
  },
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    function handleBeforeInstall(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/rituo-admin/login");
    router.refresh();
  }

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  return (
    <>
      <div className="admin-mobile-topbar">
        <button
          aria-label="Abrir menú"
          className="admin-mobile-topbar__menu"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
        <span className="admin-mobile-topbar__brand">rituo</span>
      </div>

      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar${isOpen ? " is-open" : ""}`}
        aria-label="Panel de administración"
      >
        <button
          aria-label="Cerrar menú"
          className="admin-sidebar__close"
          onClick={() => setIsOpen(false)}
          type="button"
        >
          ×
        </button>

        <div>
          <Link className="admin-brand" href="/" aria-label="Volver a Rituo">
            <span className="admin-brand__word">rituo</span>
            <span className="admin-brand__dot" />
          </Link>

          <div className="admin-sidebar__intro">
            <span>Admin</span>
            <strong>Panel de rituo</strong>
            <p>Gestión interna de la plataforma, la app y sus contenidos.</p>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Secciones">
          {sections.map((section) => (
            <Link
              className={`admin-nav__item${
                pathname === section.href ? " is-active" : ""
              }`}
              href={section.href}
              key={section.href}
              onClick={() => setIsOpen(false)}
            >
              <span className="admin-nav__icon">{section.shortLabel}</span>
              <span>
                <strong>{section.label}</strong>
                <small>{section.description}</small>
              </span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <span>Acceso interno</span>
          <strong>Rituo Admin</strong>
          {installPrompt && (
            <button
              className="admin-sidebar__install"
              onClick={handleInstall}
              type="button"
            >
              Instalar en el escritorio
            </button>
          )}
          <button
            className="admin-sidebar__logout"
            onClick={handleLogout}
            type="button"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
