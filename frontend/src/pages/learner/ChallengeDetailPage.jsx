import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getChallengeById, getChallengeFiles } from '../../api/challenges.js';
import { startSession } from '../../api/sessions.js';
import './ChallengeDetailPage.css';
import LearnerLayout from '../../components/learner/LearnerLayout.jsx';

// ─── helpers ──────────────────────────────────────────────────────────────────
const DIFF_CONFIG = {
  easy   : { label: 'Easy',   cls: 'easy'   },
  medium : { label: 'Medium', cls: 'medium' },
  hard   : { label: 'Hard',   cls: 'hard'   },
};

function DiffPip({ difficulty }) {
  const cfg = DIFF_CONFIG[difficulty?.toLowerCase()] ?? { label: difficulty, cls: 'easy' };
  return <span className={`cd-pip cd-pip--${cfg.cls}`}>{cfg.label}</span>;
}

function FileItem({ file }) {
  return (
    <a
      href={file.file_path}
      target="_blank"
      rel="noopener noreferrer"
      className="cd-file"
    >
      <span className="cd-file__icon">📎</span>
      <span className="cd-file__name">{file.file_name}</span>
      {file.file_size && (
        <span className="cd-file__size">
          {(file.file_size / 1024).toFixed(1)} KB
        </span>
      )}
    </a>
  );
}

function Loader() {
  return (
    <div className="cd-loader">
      <div className="cd-loader__ring" />
      <span>Loading challenge…</span>
    </div>
  );
}

function ErrorBanner({ message }) {
  return <div className="cd-error">{message}</div>;
}

// ─── page principale ──────────────────────────────────────────────────────────
export default function ChallengeDetailPage() {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [challenge,  setChallenge]  = useState(null);
  const [files,      setFiles]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [starting,   setStarting]   = useState(false);
  const [startError, setStartError] = useState(null);

  // ── fetch challenge + fichiers ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [chalRes, filesRes] = await Promise.all([
          getChallengeById(id),
          getChallengeFiles(id).catch(() => ({ data: [] })), // fichiers optionnels
        ]);

        if (!cancelled) {
          setChallenge(chalRes.data);
          // la route retourne { success, data } — on gère les deux cas
          const filesData = filesRes.data?.data ?? filesRes.data ?? [];
          setFiles(Array.isArray(filesData) ? filesData : []);
        }
      } catch (err) {
        if (!cancelled)
          setError(err?.response?.data?.message || 'Challenge not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  // ── démarrer une session ──────────────────────────────────────────────────
  const handleStart = async () => {
    try {
      setStarting(true);
      setStartError(null);

      const res        = await startSession(id);
      const sessionData = res.data?.data ?? res.data;
      const sessionId  = sessionData?.session_id;
      const duration   = sessionData?.duration   ?? null;
      const timeLeft   = sessionData?.time_left  ?? duration;

      navigate(`/learner/sessions/${sessionId}`, {
        state: {
          challengeId : id,
          duration    : duration,
          timeLeft    : timeLeft,
        }
      });
    } catch (err) {
      setStartError(err?.response?.data?.message || 'Failed to start session');
      setStarting(false);
    }
  };

  // ── render ────────────────────────────────────────────────────────────────
  if (loading)  return <LearnerLayout><Loader /></LearnerLayout>;
  if (error)    return (
    <LearnerLayout>
    <main className="cd-page">
      <ErrorBanner message={error} />
      <Link to="/learner/browse" className="cd-back">← Back to challenges</Link>
    </main>
    </LearnerLayout>
  );

  const c = challenge?.data ?? challenge; // gère { success, data: {...} } ou direct

  return (
    <LearnerLayout>
    <main className="cd-page">

      {/* ── BREADCRUMB ── */}
      <nav className="cd-breadcrumb">
        <Link to="/learner/dashboard">Dashboard</Link>
        <span>/</span>
        <Link to="/learner/browse">Challenges</Link>
        <span>/</span>
        <span className="cd-breadcrumb__current">{c.title}</span>
      </nav>

      <div className="cd-layout">

        {/* ── COLONNE PRINCIPALE ── */}
        <div className="cd-main">

          {/* header */}
          <div className="cd-header">
            <div className="cd-header__top">
              <DiffPip difficulty={c.difficulty} />
              {c.category_name && (
                <span className="cd-cat">{c.category_name}</span>
              )}
              <span className="cd-points">{c.points} pts</span>
            </div>
            <h1 className="cd-title">{c.title}</h1>
          </div>

          {/* description */}
          <section className="cd-section">
            <h2 className="cd-section__title">Description</h2>
            <div className="cd-description">
              {c.description
                ? c.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                : <p className="cd-muted">No description provided.</p>
              }
            </div>
          </section>

          {/* fichiers */}
          {files.length > 0 && (
            <section className="cd-section">
              <h2 className="cd-section__title">Files</h2>
              <div className="cd-files">
                {files.map((f) => (
                  <FileItem key={f.file_id} file={f} />
                ))}
              </div>
            </section>
          )}

        </div>

        {/* ── SIDEBAR ── */}
        <aside className="cd-sidebar">

          <div className="cd-sidebar__card">
            <h3 className="cd-sidebar__title">Challenge info</h3>

            <div className="cd-info-row">
              <span className="cd-info-row__label">Difficulty</span>
              <DiffPip difficulty={c.difficulty} />
            </div>
            <div className="cd-info-row">
              <span className="cd-info-row__label">Points</span>
              <span className="cd-info-row__value cd-info-row__value--gold">{c.points}</span>
            </div>
            {c.category_name && (
              <div className="cd-info-row">
                <span className="cd-info-row__label">Category</span>
                <span className="cd-info-row__value">{c.category_name}</span>
              </div>
            )}
            <div className="cd-info-row">
              <span className="cd-info-row__label">Status</span>
              <span className="cd-info-row__value cd-info-row__value--green">Active</span>
            </div>
            <div className="cd-info-row">
              <span className="cd-info-row__label">Time limit</span>
              <span className="cd-info-row__value cd-info-row__value--cyan">
                {{ easy: '30 min', medium: '60 min', hard: '90 min' }[c.difficulty?.toLowerCase()] ?? '60 min'}
              </span>
            </div>
            {c.created_at && (
              <div className="cd-info-row">
                <span className="cd-info-row__label">Added</span>
                <span className="cd-info-row__value">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* bouton start */}
          {startError && <div className="cd-start-error">{startError}</div>}

          <button
            className="cd-start-btn"
            onClick={handleStart}
            disabled={starting}
          >
            {starting
              ? <><span className="cd-start-btn__spinner" /> Starting…</>
              : '⚡ Start Challenge'
            }
          </button>

          <Link to="/learner/browse" className="cd-browse-btn">
            ← Back to challenges
          </Link>

        </aside>
      </div>

    </main>
    </LearnerLayout>
  );
}