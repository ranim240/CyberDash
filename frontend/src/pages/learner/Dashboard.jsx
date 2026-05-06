import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLearnerStats } from '../../hooks/useLearnerStats.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import LearnerLayout from '../../components/learner/LearnerLayout.jsx';
import StatsCard from '../../components/learner/StatsCard.jsx';
import BadgeList from '../../components/learner/BadgeList.jsx';
import './Dashboard.css';

// ─── helpers ──────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="dash-loader">
      <div className="dash-loader__ring" />
      <span>Loading dashboard…</span>
    </div>
  );
}

function ErrorBanner({ message }) {
  return <div className="dash-error">{message}</div>;
}

function ProgressBar({ value = 0 }) {
  const pct = Math.min(100, Math.max(0, Math.round(value)));
  return (
    <div className="prog-bar" aria-label={`${pct}% complete`}>
      <div className="prog-bar__fill" style={{ width: `${pct}%` }} />
      <span className="prog-bar__label">{pct}%</span>
    </div>
  );
}

function StatusPip({ status }) {
  const map = {
    not_started : { label: 'Not started', cls: 'neutral' },
    in_progress : { label: 'In progress', cls: 'warn'    },
    completed   : { label: 'Completed',   cls: 'success' },
  };
  const s = map[status] ?? map.not_started;
  return <span className={`diff-pip diff-pip--${s.cls}`}>{s.label}</span>;
}

const statusToPct = { not_started: 0, in_progress: 50, completed: 100 };

function EnrollmentsSection({ enrollments = [] }) {
  if (!enrollments.length) {
    return (
      <div className="dash-empty-box">
        <p>You haven't enrolled in any courses yet.</p>
        <Link to="/learner/browse" className="dash-btn dash-btn--ghost">
          Browse Challenges →
        </Link>
      </div>
    );
  }
  return (
    <ul className="enroll-list">
      {enrollments.map((e) => (
        <li key={e.course_id} className="enroll-item">
          <div className="enroll-item__header">
            <span className="enroll-item__title">{e.title}</span>
            <StatusPip status={e.completion_status} />
          </div>
          <ProgressBar value={statusToPct[e.completion_status] ?? 0} />
          <div className="enroll-item__meta">
            <span className="enroll-item__date">
              Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
            </span>
            <Link to={`/learner/courses/${e.course_id}/progress`} className="enroll-item__link">
              Continue →
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

function RecentSessions({ sessions = [] }) {
  if (!sessions.length) return <p className="dash-empty">No recent sessions found.</p>;

  const statusLabel = {
    completed : { text: 'Completed', cls: 'success' },
    abandoned : { text: 'Abandoned', cls: 'danger'  },
    active    : { text: 'Active',    cls: 'warn'    },
  };

  return (
    <ul className="session-list">
      {sessions.map((s) => {
        const st = statusLabel[s.status] ?? { text: s.status, cls: 'neutral' };
        return (
          <li key={s.session_id} className="session-item">
            <div className="session-item__info">
              <span className="session-item__challenge">{s.challenge_title}</span>
              <span className={`session-item__status session-item__status--${st.cls}`}>{st.text}</span>
            </div>
            <div className="session-item__meta">
              <span className={`diff-pip diff-pip--${s.difficulty?.toLowerCase() ?? 'easy'}`}>
                {s.difficulty ?? '—'}
              </span>
              <span>{new Date(s.started_at).toLocaleDateString()}</span>
              <span>{s.attempt_count} attempt{s.attempt_count !== 1 ? 's' : ''}</span>
              {s.status === 'completed' && s.points > 0 && (
                <span className="session-item__xp">+{s.points} pts</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── page principale ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user }                             = useContext(AuthContext);
  const { dashboard, stats, loading, error } = useLearnerStats();

  if (loading) return <LearnerLayout stats={null}><Loader /></LearnerLayout>;
  if (error)   return <LearnerLayout stats={null}><ErrorBanner message={error} /></LearnerLayout>;

  const s        = stats      ?? {};
  const d        = dashboard  ?? {};
  const profile  = d.profile  ?? {};

  const xpPoints = s.xp_points     ?? profile.xp_points ?? 0;
  const level    = s.current_level ?? 1;
  const xpNeeded = level * 100;
  const xpPct    = Math.min(100, Math.round((xpPoints % xpNeeded) / xpNeeded * 100));
  const username = user?.username ?? profile.username ?? 'Learner';

  return (
    <LearnerLayout stats={s}>
      <div className="dashboard">

        {/* ── TOPBAR ── */}
        <div className="dash-topbar">
          <div>
            <h1 className="dash-topbar__title">Dashboard</h1>
            <p className="dash-topbar__sub">
              Welcome back, <span className="dash-topbar__name">{username}</span>
            </p>
          </div>
          <Link to="/learner/browse" className="dash-btn dash-btn--primary">
            ⚡ New Challenge
          </Link>
        </div>

        {/* ── STATS ── */}
        <section className="dash-section">
          <h2 className="dash-section__title">Overview</h2>
          <div className="stats-grid">
            <StatsCard icon="🎯" label="Challenges solved" value={s.solved_challenges ?? 0}   accent="green"  />
            <StatsCard icon="⚡" label="Total XP"          value={`${xpPoints} XP`}            accent="cyan"   />
            <StatsCard icon="🔥" label="Streak"            value={`${s.streak ?? 0}d`}         accent="orange" sub="days in a row" />
            <StatsCard icon="📊" label="Success rate"      value={`${s.success_rate ?? 0}%`}   accent="purple" />
            <StatsCard icon="🏅" label="Badges earned"     value={d.recentBadges?.length ?? 0} accent="gold"   />
            <StatsCard icon="📚" label="Courses enrolled"  value={d.enrollments?.length ?? 0}  accent="blue"   />
          </div>
        </section>

        {/* ── XP BAR ── */}
        <section className="dash-section">
          <div className="dash-xp-card">
            <div className="dash-xp-card__left">
              <span className="dash-xp-card__level">Lv.{level}</span>
              <span className="dash-xp-card__title-text">{s.title ?? 'Novice'}</span>
            </div>
            <div className="dash-xp-card__center">
              <div className="dash-xp-card__bar">
                <div className="dash-xp-card__fill" style={{ width: `${xpPct}%` }} />
              </div>
              <span className="dash-xp-card__label">
                {xpPoints} / {xpNeeded} XP — Level {level + 1} in sight
              </span>
            </div>
            <div className="dash-xp-card__right">
              <span className="dash-xp-card__pct">{xpPct}%</span>
            </div>
          </div>
        </section>

        {/* ── DEUX COLONNES ── */}
        <div className="dash-cols">
          <section className="dash-card">
            <div className="dash-card__header">
              <h2 className="dash-section__title">My Courses</h2>
              <Link to="/learner/courses" className="dash-link">View all →</Link>
            </div>
            <EnrollmentsSection enrollments={d.enrollments} />
          </section>

          <section className="dash-card">
            <div className="dash-card__header">
              <h2 className="dash-section__title">Recent Badges</h2>
              <Link to="/learner/badges" className="dash-link">View all →</Link>
            </div>
            <BadgeList badges={d.recentBadges} />
          </section>
        </div>

        {/* ── SESSIONS ── */}
        <section className="dash-card">
          <div className="dash-card__header">
            <h2 className="dash-section__title">Recent Sessions</h2>
            <Link to="/learner/browse" className="dash-link">View all →</Link>
          </div>
          <RecentSessions sessions={d.recentSessions ?? []} />
        </section>

      </div>
    </LearnerLayout>
  );
}