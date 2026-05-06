import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useSession }    from '../../hooks/useSession.js';
import { getChallengeFiles } from '../../api/challenges.js';
import LearnerLayout     from '../../components/learner/LearnerLayout.jsx';
import './SessionPage.css';

// ─── helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds) {
  if (seconds === null || seconds === undefined) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

// ─── timer bar ────────────────────────────────────────────────────────────────
function TimerBar({ timeLeft, duration }) {
  const pct     = duration ? Math.max(0, Math.round((timeLeft / duration) * 100)) : 100;
  const isLow   = pct <= 25;
  const isCrit  = pct <= 10;

  return (
    <div className="sp-timer-bar-wrap">
      <div className={`sp-timer-bar ${isCrit ? 'sp-timer-bar--crit' : isLow ? 'sp-timer-bar--low' : ''}`}>
        <div className="sp-timer-bar__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── écran succès ─────────────────────────────────────────────────────────────
function SuccessScreen({ challenge, points, timeLeft, duration, attempts, badges, onBack }) {
  const elapsed = duration ? duration - timeLeft : 0;
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
          <span className="sp-success__stat-label">Time taken</span>
        </div>
        <div className="sp-success__stat">
          <span className="sp-success__stat-value">{attempts}</span>
          <span className="sp-success__stat-label">Attempt{attempts !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* badges gagnés */}
      {badges?.length > 0 && (
        <div className="sp-success__badges">
          <p className="sp-success__badges-title">🏅 Badges earned</p>
          <div className="sp-success__badges-list">
            {badges.map((b) => (
              <div key={b.badge_id} className="sp-success__badge" title={b.description}>
                {b.icon_url
                  ? <img src={b.icon_url} alt={b.name} />
                  : <span>{b.name[0]}</span>
                }
                <span>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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

// ─── écran abandon / expiration ───────────────────────────────────────────────
function EndedScreen({ challenge, expired, onBack }) {
  return (
    <div className="sp-abandoned">
      <div className="sp-abandoned__icon">{expired ? '⏰' : '🚩'}</div>
      <h1 className="sp-abandoned__title">
        {expired ? 'Time Expired!' : 'Session Abandoned'}
      </h1>
      <p className="sp-abandoned__sub">{challenge?.title}</p>
      {expired && (
        <p className="sp-abandoned__hint">Your session has been automatically closed.</p>
      )}
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
  const { sessionId } = useParams();
  const location      = useLocation();
  const navigate      = useNavigate();

  // challengeId + timeLeft passés en state depuis ChallengeDetailPage
  const challengeId      = location.state?.challengeId;
  const initialTimeLeft  = location.state?.timeLeft  ?? null;
  const initialDuration  = location.state?.duration  ?? null;

  const {
    challenge, loading, error,
    timeLeft, setTimeLeft, duration, setDuration, expired,
    answer, setAnswer, submitting, submitError, result, attempts,
    handleSubmit, abandoning, abandoned, handleAbandon,
  } = useSession(sessionId, challengeId, initialTimeLeft);

  // fichiers du challenge
  const [files, setFiles] = useState([]);

  // initialiser duration depuis le state dès le montage
  useEffect(() => {
    if (initialDuration) setDuration(initialDuration);
    if (initialTimeLeft) setTimeLeft(initialTimeLeft);
  }, []);  // ← une seule fois au montage

  // fetch fichiers
  useEffect(() => {
    if (!challengeId) return;
    getChallengeFiles(challengeId)
      .then((res) => {
        const f = res.data?.data ?? res.data ?? [];
        setFiles(Array.isArray(f) ? f : []);
      })
      .catch(() => setFiles([]));
  }, [challengeId]);

  const onKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(); };
  const goBack    = () => navigate('/learner/browse');

  // ── couleur timer selon temps restant ────────────────────────────────────
  const pct      = duration && timeLeft !== null ? (timeLeft / duration) * 100 : 100;
  const timerCls = pct <= 10 ? 'sp-timer--crit' : pct <= 25 ? 'sp-timer--low' : '';

  // ── états spéciaux ────────────────────────────────────────────────────────
  if (loading) return <LearnerLayout><Loader /></LearnerLayout>;

  if (error) return (
    <LearnerLayout>
      <main className="sp-page">
        <div className="sp-error">{error}</div>
        <Link to="/learner/browse" className="sp-back">← Back to challenges</Link>
      </main>
    </LearnerLayout>
  );

  if (result?.is_correct) return (
    <LearnerLayout>
      <main className="sp-page">
        <SuccessScreen
          challenge={challenge}
          points={result.points}
          timeLeft={timeLeft}
          duration={duration}
          attempts={attempts}
          badges={result.badges}
          onBack={goBack}
        />
      </main>
    </LearnerLayout>
  );

  if (abandoned || expired) return (
    <LearnerLayout>
      <main className="sp-page">
        <EndedScreen challenge={challenge} expired={expired} onBack={goBack} />
      </main>
    </LearnerLayout>
  );

  // ── session active ────────────────────────────────────────────────────────
  return (
    <LearnerLayout>
      <main className="sp-page">

        {/* ── TOPBAR ── */}
        <div className="sp-topbar">
          <div className="sp-topbar__left">
            <Link to="/learner/browse" className="sp-back-btn">← Challenges</Link>
            {challenge && <DiffPip difficulty={challenge.difficulty} />}
          </div>

          {/* timer */}
          <div className={`sp-timer ${timerCls}`}>
            <span className="sp-timer__icon">⏱</span>
            <span className="sp-timer__value">{formatTime(timeLeft)}</span>
            {duration && (
              <span className="sp-timer__total">/ {formatTime(duration)}</span>
            )}
          </div>

          <button
            className="sp-abandon-btn"
            onClick={handleAbandon}
            disabled={abandoning}
          >
            {abandoning ? 'Abandoning…' : 'Abandon'}
          </button>
        </div>

        {/* barre de progression du timer */}
        <TimerBar timeLeft={timeLeft} duration={duration} />

        <div className="sp-layout">

          {/* ── CHALLENGE INFO + FICHIERS ── */}
          <div className="sp-main">
            <div className="sp-challenge-header">
              <h1 className="sp-challenge-title">
                {challenge?.title ?? 'Challenge'}
              </h1>
              <span className="sp-challenge-pts">{challenge?.points} pts</span>
            </div>

            {/* description */}
            <div className="sp-description">
              {challenge?.description
                ? challenge.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                : <p className="sp-muted">No description available.</p>
              }
            </div>

            {/* fichiers à télécharger */}
            {files.length > 0 && (
              <div className="sp-files">
                <h3 className="sp-files__title">📎 Files</h3>
                <div className="sp-files__list">
                  {files.map((f) => (
                    <a
                      key={f.file_id}
                      href={`${import.meta.env.VITE_API_URL?.replace('/api','') ?? 'http://localhost:3000'}${f.file_path}`}
                      download={f.file_name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sp-file-item"
                    >
                      <span className="sp-file-item__icon">⬇</span>
                      <span className="sp-file-item__name">{f.file_name}</span>
                      {f.file_size && (
                        <span className="sp-file-item__size">
                          {formatFileSize(f.file_size)}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SUBMISSION BOX ── */}
          <aside className="sp-sidebar">
            <div className="sp-submit-card">
              <h2 className="sp-submit-card__title">Submit Flag</h2>

              <div className="sp-attempts">
                <span className="sp-attempts__label">Attempts</span>
                <span className="sp-attempts__value">{attempts}</span>
              </div>

              {attempts > 0 && !result?.is_correct && (
                <div className="sp-feedback sp-feedback--wrong">
                  ✗ Wrong flag — try again
                </div>
              )}

              {submitError && (
                <div className="sp-feedback sp-feedback--error">{submitError}</div>
              )}

              <div className="sp-input-wrap">
                <input
                  className="sp-input"
                  type="text"
                  placeholder="FLAG{your_flag_here}"
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
                <span className="sp-info-row__mono">{sessionId?.slice(0, 8)}…</span>
              </div>
              <div className="sp-info-row">
                <span>Difficulty</span>
                <DiffPip difficulty={challenge?.difficulty} />
              </div>
              <div className="sp-info-row">
                <span>Points</span>
                <span className="sp-info-row__gold">{challenge?.points} pts</span>
              </div>
              <div className="sp-info-row">
                <span>Time limit</span>
                <span className="sp-info-row__mono">{formatTime(duration)}</span>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </LearnerLayout>
  );
}