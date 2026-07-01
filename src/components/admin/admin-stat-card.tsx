interface AdminStatCardProps {
  detail: string;
  label: string;
  value: number | string;
}

export function AdminStatCard({ detail, label, value }: AdminStatCardProps) {
  return (
    <article className="admin-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}
