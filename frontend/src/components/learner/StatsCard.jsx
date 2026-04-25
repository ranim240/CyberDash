import React from 'react';
import './StatsCard.css';

export default function StatsCard({ icon, label, value, sub, accent }) {
  return (
    <div className={`stats-card ${accent ? `stats-card--${accent}` : ''}`}>
      <div className="stats-card__icon">{icon}</div>
      <div className="stats-card__body">
        <span className="stats-card__value">{value}</span>
        <span className="stats-card__label">{label}</span>
        {sub && <span className="stats-card__sub">{sub}</span>}
      </div>
    </div>
  );
}