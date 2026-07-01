import { formatDateTime } from "@/lib/format-date";
import type { WaitlistLead } from "@/types/waitlist";

interface WaitlistTableProps {
  leads: WaitlistLead[];
}

function getInitials(lead: WaitlistLead) {
  return `${lead.firstName.at(0) ?? ""}${lead.lastName.at(0) ?? ""}`.toUpperCase();
}

function getFullName(lead: WaitlistLead) {
  return `${lead.firstName} ${lead.lastName}`.trim();
}

export function WaitlistTable({ leads }: WaitlistTableProps) {
  if (leads.length === 0) {
    return (
      <div className="admin-empty">
        <strong>Todavía no hay registros.</strong>
        <p>Cuando alguien se sume a la preventa, va a aparecer en esta lista.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Lead</th>
            <th>Contacto</th>
            <th>Sistema</th>
            <th>Fechas</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>
                <div className="admin-lead">
                  <span className="admin-lead__avatar">{getInitials(lead)}</span>
                  <span>
                    <strong>{getFullName(lead)}</strong>
                    <small>{lead.id}</small>
                  </span>
                </div>
              </td>
              <td>
                <div className="admin-contact">
                  <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  <span>{lead.phoneNumber}</span>
                </div>
              </td>
              <td>
                <span
                  className={`admin-os admin-os--${lead.operatingSystem.toLowerCase()}`}
                >
                  {lead.operatingSystem}
                </span>
              </td>
              <td>
                <div className="admin-date">
                  <strong>{formatDateTime(lead.createdAt)}</strong>
                  <small>Actualizado {formatDateTime(lead.updatedAt)}</small>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
