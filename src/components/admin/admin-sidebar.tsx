import Link from "next/link";

const sections = [
  {
    href: "/rituo-admin/panel",
    label: "Lista de espera",
    description: "Leads de preventa",
    shortLabel: "WL",
  },
];

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar" aria-label="Panel de administración">
      <div>
        <Link className="admin-brand" href="/" aria-label="Volver a Rituo">
          <span className="admin-brand__word">rituo</span>
          <span className="admin-brand__dot" />
        </Link>

        <div className="admin-sidebar__intro">
          <span>Admin</span>
          <strong>Panel de preventa</strong>
          <p>Control simple para revisar los interesados que entran desde la landing.</p>
        </div>
      </div>

      <nav className="admin-nav" aria-label="Secciones">
        {sections.map((section) => (
          <Link
            className="admin-nav__item is-active"
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
        <strong>Rituo Landing</strong>
      </div>
    </aside>
  );
}
