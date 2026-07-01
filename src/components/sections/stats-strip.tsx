export function StatsStrip() {
  return (
    <div className="stats-strip" aria-label="Rituo en números">
      <div className="stats-strip__item">
        <span className="stats-strip__value">+3k</span>
        <span className="stats-strip__label">usuarios activos</span>
      </div>
      <div className="stats-strip__item">
        <span className="stats-strip__value">1&thinsp;toque</span>
        <span className="stats-strip__label">para activar el foco</span>
      </div>
      <div className="stats-strip__item">
        <span className="stats-strip__value">∞</span>
        <span className="stats-strip__label">rituales posibles</span>
      </div>
    </div>
  );
}
