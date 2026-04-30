import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar  from '../../components/common/Sidebar';
import Topbar   from '../../components/common/Navbar';
import challengesApi from '../../api/challenges';
import { useChallenges } from '../../hooks/useChallengesInstructor';

// ── Difficulty colours (mirrors LEVEL_COLOR from courses) ─────────────
const DIFF_COLOR = {
  easy:   { color: 'var(--accent3)', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)'  },
  medium: { color: 'var(--amber)',   bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)'  },
  hard:   { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)'   },
};

const STATUS_MAP = {
  active:  { label: 'ACTIVE',  cls: 'status-pub'   },
  draft:   { label: 'DRAFT',   cls: 'status-draft'  },
  pending: { label: 'PENDING', cls: 'status-draft'  },
  closed:  { label: 'CLOSED',  cls: 'status-draft'  },
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

// ── Confirm modal (identical to CourseContentPage) ────────────────────
function ConfirmModal({ title, message, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="card" style={{ maxWidth: 400, width: '90%' }}>
        <h3 style={{ marginBottom: 12 }}>{title}</h3>
        <p style={{ marginBottom: 24, fontSize: 13, color: 'var(--muted2)' }}>{message}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-danger"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : '✕ Delete'}
          </button>
          <button className="btn btn-outline"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Challenge card ────────────────────────────────────────────────────
function ChallengeCard({ challenge, onDelete }) {
  const navigate              = useNavigate();
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const diff  = DIFF_COLOR[challenge.difficulty?.toLowerCase()] ?? DIFF_COLOR.easy;
  const status = STATUS_MAP[challenge.status] ?? STATUS_MAP.draft;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await challengesApi.remove(challenge.challenge_id);
      onDelete(challenge.challenge_id);
    } catch {
      onDelete(challenge.challenge_id); // optimistic
    } finally {
      setDeleting(false);
      setConfirmDel(false);
    }
  };

  return (
    <>
      {confirmDel && (
        <ConfirmModal
          title="Delete Challenge"
          message={`Are you sure you want to delete "${challenge.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDel(false)}
          loading={deleting}
        />
      )}

      <div
        className="card"
        style={{
          cursor: 'pointer',
          transition: 'border-color .2s',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}
        onClick={() => navigate(`/instructor/challenges/${challenge.challenge_id}`)}
      >
        {/* ── Top row ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>
              {challenge.title}
            </div>
            <p style={{
              fontSize: 13, color: 'var(--muted2)', lineHeight: 1.5,
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {challenge.description || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No description.</span>}
            </p>
          </div>

          {/* Actions */}
          <div
            style={{ display: 'flex', gap: 8, flexShrink: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="act-btn act-edit"
              style={{ fontSize: 11 }}
              onClick={() => navigate(`/instructor/challenges/${challenge.challenge_id}`)}>
              Edit
            </button>
            <button className="act-btn act-del"
              style={{ fontSize: 11 }}
              onClick={() => setConfirmDel(true)}>
              ✕
            </button>
          </div>
        </div>

        {/* ── Meta row ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Difficulty badge */}
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 11, padding: '3px 10px',
            borderRadius: 20, border: `1px solid ${diff.border}`,
            background: diff.bg, color: diff.color,
          }}>
            {challenge.difficulty?.toUpperCase() ?? '—'}
          </span>

          {/* Status badge */}
          <span className={`status-badge ${status.cls}`}>
            {status.label}
          </span>

          {/* Points */}
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 11, padding: '3px 10px',
            borderRadius: 20, border: '1px solid var(--border)',
            background: 'var(--bg3)', color: 'var(--accent)',
          }}>
            ⚑ {challenge.points ?? 0} pts
          </span>

          {/* Category */}
          {challenge.category_id && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 11, padding: '3px 10px',
              borderRadius: 20, border: '1px solid var(--border)',
              background: 'var(--bg3)', color: 'var(--muted2)',
            }}>
              {challenge.category_id}
            </span>
          )}

          <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
            {formatDate(challenge.created_at)}
          </span>
        </div>
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function MyChallengesPage() {
  const navigate = useNavigate();
  const { challenges, setChallenges, loading, usingMock } = useChallenges();

  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff]     = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleDelete = (id) =>
    setChallenges(p => p.filter(c => c.challenge_id !== id));

  // ── Filter ─────────────────────────────────────────────────────────
  const filtered = challenges.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff   = filterDiff   === 'all' || c.difficulty?.toLowerCase() === filterDiff;
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchDiff && matchStatus;
  });

  // ── Stats ──────────────────────────────────────────────────────────
  const active  = challenges.filter(c => c.status === 'active').length;
  const pending = challenges.filter(c => c.status === 'pending').length;
  const totalPts = challenges.reduce((acc, c) => acc + (c.points ?? 0), 0);

  const selectStyle = {
    padding: '7px 12px',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 4, color: 'var(--text)',
    fontFamily: 'var(--mono)', fontSize: 11,
    outline: 'none', cursor: 'pointer', letterSpacing: 1,
  };

  if (loading) return (
    <div className="layout">
      <Sidebar />
      <div className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>LOADING...</p>
      </div>
    </div>
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="topbar" style={{ marginBottom: 28 }}>
          <div>
            <div className="page-title" style={{ fontSize: 20 }}>My Challenges</div>
          </div>
        </div>

        {usingMock && (
          <div style={{
            padding: '8px 14px', marginBottom: 20,
            background: 'rgba(245,158,11,0.07)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 4, fontFamily: 'var(--mono)',
            fontSize: 11, color: 'var(--amber)', letterSpacing: 1,
          }}>
            ⚠ MOCK DATA — API unavailable or returned no results
          </div>
        )}

        {/* ── Two-column layout ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>

          {/* LEFT — stats + filters ─────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Stats card */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 20 }}>Overview</div>
              {[
                { label: 'Total',   value: challenges.length, color: 'var(--accent)'  },
                { label: 'Active',  value: active,            color: 'var(--accent3)' },
                { label: 'Pending', value: pending,           color: 'var(--amber)'   },
                { label: 'Points',  value: totalPts,          color: 'var(--purple, #a78bfa)' },
              ].map((s) => (
                <div key={s.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
                    {s.label.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--heading)', fontSize: 22, fontWeight: 700, color: s.color }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Filters card */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>Filters</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div>
                  <label style={{
                    display: 'block', fontFamily: 'var(--mono)', fontSize: 10,
                    color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
                  }}>Difficulty</label>
                  <select style={{ ...selectStyle, width: '100%' }}
                    value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)}>
                    <option value="all">All</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block', fontFamily: 'var(--mono)', fontSize: 10,
                    color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6,
                  }}>Status</label>
                  <select style={{ ...selectStyle, width: '100%' }}
                    value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                {(filterDiff !== 'all' || filterStatus !== 'all' || search) && (
                  <button className="act-btn"
                    style={{ fontSize: 11, borderColor: 'var(--muted)', color: 'var(--muted)', width: '100%', justifyContent: 'center' }}
                    onClick={() => { setFilterDiff('all'); setFilterStatus('all'); setSearch(''); }}>
                    ✕ Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — list ───────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Search bar */}
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--muted)', fontSize: 14,
              }}>⌕</span>
              <input
                style={{
                  width: '100%', padding: '10px 14px 10px 34px',
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 4, color: 'var(--text)',
                  fontFamily: 'var(--body)', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                }}
                placeholder="Search challenges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div style={{
                padding: '48px 0', textAlign: 'center',
                border: '1px dashed var(--border)', borderRadius: 6,
              }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: 1, marginBottom: 16 }}>
                  {challenges.length === 0 ? 'NO CHALLENGES YET' : 'NO RESULTS'}
                </p>
                {challenges.length === 0 && (
                  <button className="btn btn-outline" style={{ fontSize: 11 }}
                    onClick={() => navigate('/instructor/challenges/create')}>
                    + Create First Challenge
                  </button>
                )}
              </div>
            ) : (
              filtered.map(c => (
                <ChallengeCard key={c.challenge_id} challenge={c} onDelete={handleDelete} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}