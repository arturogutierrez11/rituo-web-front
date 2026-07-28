"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    href: "/rituo-admin/panel",
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
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar" aria-label="Panel de administración">
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
      </div>
    </aside>
  );
}
