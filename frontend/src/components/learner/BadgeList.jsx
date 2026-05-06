import React from 'react';
import './BadgeList.css';

export default function BadgeList({ badges = [] }) {
  if (!badges.length) {
    return (
      <p className="badge-list__empty">
        No badges earned yet. Complete challenges to earn badges!
      </p>
    );
  }

  return (
    <div className="badge-list">
      {badges.map((badge) => (
        // vrais champs DB : badge_id, name, description, icon_url, xp_bonus, awarded_at
        <div
          key={badge.badge_id}
          className="badge-item"
          title={badge.description ?? badge.name}
        >
          <div className="badge-item__icon">
            {badge.icon_url
              ? <img src={badge.icon_url} alt={badge.name} />
              : <span className="badge-item__fallback">{badge.name[0].toUpperCase()}</span>
            }
          </div>
          <span className="badge-item__name">{badge.name}</span>
          {badge.xp_bonus > 0 && (
            <span className="badge-item__xp">+{badge.xp_bonus} XP</span>
          )}
        </div>
      ))}
    </div>
  );
}