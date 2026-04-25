import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLearnerStats } from '../../hooks/useLearnerStats.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import StatsCard from '../../components/learner/StatsCard.jsx';
import BadgeList from '../../components/learner/BadgeList.jsx';
import './Dashboard.css';

// ─── tiny helpers ────────────────────────────────────────────────────────────
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

// ─── sub-sections ────────────────────────────────────────────────────────────
// completion_status → pourcentage visuel
const statusToPct = { not_started: 0, in_progress: 50, completed: 100 };

function EnrollmentsSection({ enrollments = [] }) {
  if (!enrollments.length) {
    return (
      <div className="dash-card dash-card--empty">
        <p>You haven't enrolled in any courses yet.</p>
        <Link to="/learner/browse" className="dash-btn dash-btn--ghost">Browse Challenges →</Link>
      </div>
    );
  }

  return (
    <ul className="enroll-list">
      {enrollments.map((e) => (
        // course_id, title, description, enrolled_at, completion_status  ← vrais champs DB
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
          // vrais champs : session_id, challenge_title, difficulty, points, started_at, attempt_count, status
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
              {s.status === 'completed' && s.points > 0 &&
                <span className="session-item__xp">+{s.points} pts</span>
              }
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { dashboard, stats, loading, error } = useLearnerStats();

  if (loading) return <Loader />;
  if (error) return <ErrorBanner message={error} />;

  // ── vrais champs DB ──────────────────────────────────────────────────────
  const s = stats ?? {};
  const d = dashboard ?? {};

  // profile vient de dashboard.profile (getDashboard)
  const profile = d.profile ?? {};

  // XP : on affiche xp_points / seuil du niveau suivant (100 * current_level)
  const xpPoints  = s.xp_points      ?? profile.xp_points ?? 0;
  const level     = s.current_level  ?? 1;
  const xpNeeded  = level * 100;                          // seuil simple (adaptez si vous avez une vraie table levels)
  const xpPct     = Math.min(100, Math.round((xpPoints % xpNeeded) / xpNeeded * 100));

  // username : depuis AuthContext OU profile
  const username  = user?.username ?? profile.username ?? 'Learner';

  return (
    <main className="dashboard">
      {/* ── HERO ── */}
      <section className="dash-hero">
        <div className="dash-hero__left">
          <div className="dash-hero__avatar">
            {user?.avatar
              ? <img src={user.avatar} alt={username} />
              : <span>{username[0].toUpperCase()}</span>}
          </div>
          <div className="dash-hero__info">
            <h1 className="dash-hero__name">{username}</h1>
            {/* title et current_level viennent de getStats() — calculés backend */}
            <p className="dash-hero__role">
              Level {level} · {s.title ?? 'Novice'}
            </p>
            <div className="xp-bar-wrap">
              <div className="xp-bar">
                <div className="xp-bar__fill" style={{ width: `${xpPct}%` }} />
              </div>
              <span className="xp-bar__label">{xpPoints} / {xpNeeded} XP</span>
            </div>
          </div>
        </div>
        <div className="dash-hero__actions">
          <Link to="/learner/browse" className="dash-btn dash-btn--primary">Browse Challenges</Link>
          <Link to="/learner/profile" className="dash-btn dash-btn--ghost">My Profile</Link>
        </div>
      </section>

      {/* ── STATS GRID ── */}
      <section className="dash-section">
        <h2 className="dash-section__title">Overview</h2>
        <div className="stats-grid">
          {/* solved_challenges ← getStats() */}
          <StatsCard icon="🎯" label="Challenges solved" value={s.solved_challenges ?? 0} accent="green" />
          {/* xp_points ← getStats() */}
          <StatsCard icon="⚡" label="Total XP" value={`${xpPoints} XP`} accent="cyan" />
          {/* streak ← getStats() */}
          <StatsCard icon="🔥" label="Current streak" value={`${s.streak ?? 0}d`} sub="days in a row" accent="orange" />
          {/* success_rate ← getStats() calculé backend */}
          <StatsCard icon="📊" label="Success rate" value={`${s.success_rate ?? 0}%`} accent="purple" />
          {/* recentBadges ← getDashboard() */}
          <StatsCard icon="🏅" label="Badges earned" value={d.recentBadges?.length ?? 0} accent="gold" />
          {/* enrollments ← getEnrollments() */}
          <StatsCard icon="📚" label="Enrolled courses" value={d.enrollments?.length ?? 0} accent="blue" />
        </div>
      </section>

      {/* ── TWO-COLUMN: enrollments + badges ── */}
      <div className="dash-cols">
        <section className="dash-card dash-section">
          <h2 className="dash-section__title">My Courses</h2>
          {/* enrollments : [ { course_id, title, description, enrolled_at, completion_status } ] */}
          <EnrollmentsSection enrollments={d.enrollments} />
        </section>

        <section className="dash-card dash-section">
          <h2 className="dash-section__title">Badges</h2>
          {/* recentBadges : [ { badge_id, name, description, icon_url, xp_bonus, awarded_at } ] */}
          <BadgeList badges={d.recentBadges} />
        </section>
      </div>

      {/* ── RECENT SESSIONS ── */}
      <section className="dash-card dash-section">
        <div className="dash-section__header">
          <h2 className="dash-section__title">Recent Sessions</h2>
          <Link to="/learner/browse" className="dash-link">View all →</Link>
        </div>
        {/* recentSessions n'est pas encore dans getDashboard() — voir note ci-dessous */}
        <RecentSessions sessions={d.recentSessions ?? []} />
      </section>
    </main>
  );
}