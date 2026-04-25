import React from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useSession } from '../../hooks/useSession.js';
import './SessionPage.css';

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const DIFF_CONFIG = {
  easy   : { label: 'Easy',   cls: 'easy'   },
  medium : { label: 'Medium', cls: 'medium' },
  hard   : { label: 'Hard',   cls: 'hard'   },
};

function DiffPip({ difficulty }) {
  const cfg = DIFF_CONFIG[difficulty?.toLowerCase()] ?? { label: difficulty, cls: 'easy' };
  return <span className={`sp-pip sp-pip--${cfg.cls}`}>{cfg.label}</span>;
}

function Loader() {
  return (
    <div className="sp-loader">
      <div className="sp-loader__ring" />
      <span>Loading session…</span>
    </div>
  );
}

// ─── écran succès ─────────────────────────────────────────────────────────────
function SuccessScreen({ challenge, points, elapsed, attempts, onBack }) {
  return (
    <div className="sp-success">
      <div className="sp-success__glow" />
      <div className="sp-success__icon">🏆</div>
      <h1 className="sp-success__title">Flag Captured!</h1>
      <p className="sp-success__sub">{challenge?.title}</p>

      <div className="sp-success__stats">
        <div className="sp-success__stat">
          <span className="sp-success__stat-value">+{points}</span>
          <span className="sp-success__stat-label">XP earned</span>
        </div>
        <div className="sp-success__stat">
          <span className="sp-success__stat-value">{formatTime(elapsed)}</span>
          <span className="sp-success__stat-label">Time</span>
        </div>
        <div className="sp-success__stat">
          <span className="sp-success__stat-value">{attempts}</span>
          <span className="sp-success__stat-label">Attempt{attempts !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="sp-success__actions">
        <button className="sp-btn sp-btn--primary" onClick={onBack}>
          Browse More Challenges
        </button>
        <Link to="/learner/dashboard" className="sp-btn sp-btn--ghost">
          Dashboard
        </Link>
      </div>
    </div>
  );
}

// ─── écran abandon ────────────────────────────────────────────────────────────
function AbandonedScreen({ challenge, onBack }) {
  return (
    <div className="sp-abandoned">
      <div className="sp-abandoned__icon">🚩</div>
      <h1 className="sp-abandoned__title">Session Abandoned</h1>
      <p className="sp-abandoned__sub">{challenge?.title}</p>
      <div className="sp-success__actions">
        <button className="sp-btn sp-btn--primary" onClick={onBack}>
          Browse Challenges
        </button>
        <Link to="/learner/dashboard" className="sp-btn sp-btn--ghost">
          Dashboard
        </Link>
      </div>
    </div>
  );
}

// ─── page principale ──────────────────────────────────────────────────────────
export default function SessionPage() {
  const { sessionId }  = useParams();
  const location       = useLocation();
  const navigate       = useNavigate();

  // challengeId passé en state depuis ChallengeDetailPage
  const challengeId = location.state?.challengeId;

  const {
    challenge,
    loading,
    error,
    elapsed,
    answer, setAnswer,
    submitting,
    submitError,
    result,
    attempts,
    handleSubmit,
    abandoning,
    abandoned,
    handleAbandon,
  } = useSession(sessionId, challengeId);

  // Enter pour soumettre
  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const goBack = () => navigate('/learner/browse');

  // ── render états spéciaux ────────────────────────────────────────────────
  if (loading) return <Loader />;

  if (error) return (
    <main className="sp-page">
      <div className="sp-error">{error}</div>
      <Link to="/learner/browse" className="sp-back">← Back to challenges</Link>
    </main>
  );

  if (result?.is_correct) return (
    <main className="sp-page">
      <SuccessScreen
        challenge={challenge}
        points={result.points}
        elapsed={elapsed}
        attempts={attempts}
        onBack={goBack}
      />
    </main>
  );

  if (abandoned) return (
    <main className="sp-page">
      <AbandonedScreen challenge={challenge} onBack={goBack} />
    </main>
  );

  // ── session active ────────────────────────────────────────────────────────
  return (
    <main className="sp-page">

      {/* ── TOPBAR ── */}
      <div className="sp-topbar">
        <div className="sp-topbar__left">
          <Link to="/learner/browse" className="sp-back-btn">← Challenges</Link>
          {challenge && <DiffPip difficulty={challenge.difficulty} />}
        </div>

        {/* chrono */}
        <div className="sp-timer">
          <span className="sp-timer__icon">⏱</span>
          <span className="sp-timer__value">{formatTime(elapsed)}</span>
        </div>

        {/* abandon */}
        <button
          className="sp-abandon-btn"
          onClick={handleAbandon}
          disabled={abandoning}
        >
          {abandoning ? 'Abandoning…' : 'Abandon'}
        </button>
      </div>

      <div className="sp-layout">

        {/* ── CHALLENGE INFO ── */}
        <div className="sp-main">
          <div className="sp-challenge-header">
            <h1 className="sp-challenge-title">
              {challenge?.title ?? 'Challenge'}
            </h1>
            <span className="sp-challenge-pts">{challenge?.points} pts</span>
          </div>

          <div className="sp-description">
            {challenge?.description
              ? challenge.description.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))
              : <p className="sp-muted">No description available.</p>
            }
          </div>
        </div>

        {/* ── SUBMISSION BOX ── */}
        <aside className="sp-sidebar">

          <div className="sp-submit-card">
            <h2 className="sp-submit-card__title">Submit Flag</h2>

            {/* feedback tentatives */}
            <div className="sp-attempts">
              <span className="sp-attempts__label">Attempts</span>
              <span className="sp-attempts__value">{attempts}</span>
            </div>

            {/* feedback dernière tentative */}
            {attempts > 0 && !result?.is_correct && (
              <div className="sp-feedback sp-feedback--wrong">
                ✗ Wrong flag — try again
              </div>
            )}

            {submitError && (
              <div className="sp-feedback sp-feedback--error">{submitError}</div>
            )}

            {/* input */}
            <div className="sp-input-wrap">
              <input
                className="sp-input"
                type="text"
                placeholder="CTF{your_flag_here}"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={submitting}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <button
              className="sp-submit-btn"
              onClick={handleSubmit}
              disabled={!answer.trim() || submitting}
            >
              {submitting
                ? <><span className="sp-submit-btn__spinner" /> Checking…</>
                : '⚡ Submit Flag'
              }
            </button>

            <p className="sp-submit-hint">
              Press <kbd>Enter</kbd> to submit
            </p>
          </div>

          {/* infos session */}
          <div className="sp-info-card">
            <div className="sp-info-row">
              <span>Session ID</span>
              <span className="sp-info-row__mono">
                {sessionId?.slice(0, 8)}…
              </span>
            </div>
            <div className="sp-info-row">
              <span>Difficulty</span>
              <DiffPip difficulty={challenge?.difficulty} />
            </div>
            <div className="sp-info-row">
              <span>Points</span>
              <span className="sp-info-row__gold">{challenge?.points} pts</span>
            </div>
          </div>

        </aside>
      </div>
    </main>
  );
}