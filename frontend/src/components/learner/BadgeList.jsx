import React from 'react';
import './BadgeList.css';

export default function BadgeList({ badges = [] }) {
  if (!badges.length) {
    return <p className="badge-list__empty">No badges earned yet. Complete challenges to earn badges!</p>;
  }

  return (
    <div className="badge-list">
      {badges.map((badge) => (
        <div key={badge.id} className="badge-item" title={badge.description}>
          <div className="badge-item__icon">
            {badge.icon_url ? (
              <img src={badge.icon_url} alt={badge.name} />
            ) : (
              <span className="badge-item__fallback">{badge.name[0]}</span>
            )}
          </div>
          <span className="badge-item__name">{badge.name}</span>
        </div>
      ))}
    </div>
  );
}