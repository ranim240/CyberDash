import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import './LearnerLayout.css';

const NAV_ITEMS = [
  { to: '/learner/dashboard',   icon: '▦',  label: 'Dashboard'    },
  { to: '/learner/courses',     icon: '◈',  label: 'Courses'      },
  { to: '/learner/browse',      icon: '◉',  label: 'Challenges'   },
  { to: '/learner/leaderboard', icon: '◆',  label: 'Leaderboard'  },
  { to: '/learner/badges',      icon: '◎',  label: 'Badges'       },
  { to: '/learner/profile',     icon: '◯',  label: 'Profile'      },
  { to: '/learner/settings',    icon: '⊙',  label: 'Settings'     },
  { to: '/learner/report-incident', icon: 'Ⓡ', label: 'Report Incident' },
];

const getLevelTitle = (level = 1) => {
  if (level >= 10) return 'Elite Hacker';
  if (level >= 7)  return 'Senior Hacker';
  if (level >= 4)  return 'Junior Hacker';
  return 'Novice';
};

export default function LearnerLayout({ children, stats }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const level    = stats?.current_level ?? 1;
  const xp       = stats?.xp_points     ?? 0;
  const xpNeeded = level * 100;
  const xpPct    = Math.min(100, Math.round((xp % xpNeeded) / xpNeeded * 100));
  const username = user?.username ?? 'Learner';

  return (
    <div className={`ll-root ${collapsed ? 'll-root--collapsed' : ''}`}>

      {/* ── SIDEBAR ── */}
      <aside className="ll-sidebar">

        {/* logo + toggle */}
        <div className="ll-sidebar__top">
          <div className="ll-logo">
            <span className="ll-logo__icon">⬡</span>
            {!collapsed && <span className="ll-logo__name">CTF<em>Lab</em></span>}
          </div>
          <button
            className="ll-toggle"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? '›' : '‹'}
          </button>
        </div>

        {/* nav */}
        <nav className="ll-nav">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `ll-nav__item ${isActive ? 'll-nav__item--active' : ''}`
              }
              title={collapsed ? label : undefined}
            >
              <span className="ll-nav__icon">{icon}</span>
              {!collapsed && <span className="ll-nav__label">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* user card en bas */}
        <div className="ll-user">
          <div className="ll-user__avatar">
            {username[0].toUpperCase()}
          </div>

          {!collapsed && (
            <div className="ll-user__info">
              <span className="ll-user__name">{username}</span>
              <span className="ll-user__title">
                Lv.{level} · {getLevelTitle(level)}
              </span>

              {/* barre XP */}
              <div className="ll-user__xp-wrap">
                <div className="ll-user__xp-bar">
                  <div
                    className="ll-user__xp-fill"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
                <span className="ll-user__xp-label">{xp} XP</span>
              </div>
            </div>
          )}

          {!collapsed && (
            <button
              className="ll-logout"
              onClick={handleLogout}
              title="Log out"
            >
              ⏻
            </button>
          )}

          {collapsed && (
            <button
              className="ll-logout ll-logout--collapsed"
              onClick={handleLogout}
              title="Log out"
            >
              ⏻
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="ll-content">
        {children}
      </div>

    </div>
  );
}