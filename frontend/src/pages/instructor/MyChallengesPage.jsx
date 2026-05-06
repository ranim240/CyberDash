import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar  from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import challengesApi from '../../api/challenges';
import Topbar from './instructorTopBar.jsx';
import { useChallenges } from '../../hooks/useChallengesInstructor';

// ── Difficulty colours (mirrors LEVEL_COLOR from courses) ─────────────
const DIFF_COLOR = {
  easy:   { color: 'var(--accent3)', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)'  },
  medium: { color: 'var(--amber)',   bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)'  },
  hard:   { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)'   },
};

const CATEGORIES = [
  { id: 'category_001_4e71cb38', name: 'Web Security' },
  { id: 'category_002_d07228d0', name: 'Cryptography' },
  { id: 'category_003_6eb8edcf', name: 'Network Security' },
  { id: 'category_004_780cf6bc', name: 'System Administration' },
  { id: 'category_005_b70e6d49', name: 'Reverse Engineering' },
];

const getCategoryName = (id) => CATEGORIES.find(c => c.id === id)?.name || id || '—';

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

// ── Challenge Card (grid item) with delete icon next to difficulty ────
function ChallengeCard({ challenge, onDelete }) {
  const navigate = useNavigate();
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const diff = DIFF_COLOR[challenge.difficulty?.toLowerCase()] ?? DIFF_COLOR.easy;
  const status = STATUS_MAP[challenge.status] ?? STATUS_MAP.draft;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await challengesApi.remove(challenge.challenge_id);
      onDelete(challenge.challenge_id);
    } catch {
      onDelete(challenge.challenge_id);
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
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
        onClick={() => navigate(`/instructor/challenges/${challenge.challenge_id}`)}
      >
        {/* Difficulty colour strip */}
        <div style={{ height: 3, background: diff.color, opacity: 0.6 }} />

        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title + difficulty badge + delete icon */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.3, flex: 1 }}>
              {challenge.title}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 8px',
                borderRadius: 20, border: `1px solid ${diff.border}`,
                background: diff.bg, color: diff.color,
              }}>
                {challenge.difficulty?.toUpperCase() ?? '—'}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDel(true); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: 'var(--danger)',
                  padding: '4px',
                  lineHeight: 1,
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label="Delete challenge"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: 13, color: 'var(--muted2)', lineHeight: 1.55, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {challenge.description || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No description.</span>}
          </p>

          {/* Meta row: points, category, status, created */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 'auto' }}>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 8px',
              borderRadius: 20, border: '1px solid var(--border)',
              background: 'var(--bg3)', color: 'var(--accent)',
            }}>
              ⚑ {challenge.points ?? 0} pts
            </span>
            {challenge.category_id && (
              <span style={{
                fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 8px',
                borderRadius: 20, border: '1px solid var(--border)',
                background: 'var(--bg3)', color: 'var(--muted2)',
              }}>
                {getCategoryName(challenge.category_id)}
              </span>
            )}
            <span className={`status-badge ${status.cls}`} style={{ fontSize: 10, padding: '2px 8px' }}>
              {status.label}
            </span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>
              {formatDate(challenge.created_at)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Filters Bar (difficulty, status, search) ─────────────────────────
function FiltersBar({ filterDiff, setFilterDiff, filterStatus, setFilterStatus, search, setSearch, total }) {
  const selectStyle = {
    padding: '7px 12px',
    background: 'var(--bg3)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    color: 'var(--text)',
    fontFamily: 'var(--mono)',
    fontSize: 11,
    outline: 'none',
    cursor: 'pointer',
    letterSpacing: 1,
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: 16, marginBottom: 28, flexWrap: 'wrap',
    }}>
      <div style={{ position: 'relative', flex: 2, minWidth: 200 }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
        }}>
          ⌕
        </span>
        <input
          type="text"
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '9px 12px 9px 32px',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 4, color: 'var(--text)',
            fontFamily: 'var(--body)', fontSize: 14,
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      <select style={selectStyle} value={filterDiff} onChange={(e) => setFilterDiff(e.target.value)}>
        <option value="all">All Difficulties</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <select style={selectStyle} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="pending">Pending</option>
        <option value="closed">Closed</option>
      </select>

      {(filterDiff !== 'all' || filterStatus !== 'all' || search) && (
        <button
          className="act-btn"
          style={{
            fontSize: 11,
            borderColor: 'var(--muted)',
            color: 'var(--muted)',
            backgroundColor: 'transparent',
          }}
          onClick={() => {
            setFilterDiff('all');
            setFilterStatus('all');
            setSearch('');
          }}
        >
          ✕ Clear
        </button>
      )}

      <span style={{
        marginLeft: 'auto',
        fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
      }}>
        {total} CHALLENGE{total !== 1 ? 'S' : ''}
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function MyChallengesPage() {
  const navigate = useNavigate();
  const { challenges, setChallenges, loading, usingMock } = useChallenges();

  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleDelete = (id) =>
    setChallenges(p => p.filter(c => c.challenge_id !== id));

  const filtered = challenges.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchDiff   = filterDiff   === 'all' || c.difficulty?.toLowerCase() === filterDiff;
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchDiff && matchStatus;
  });

  if (loading) return (
    <div className="layout">
      <Sidebar />
      <div className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>LOADING...</p>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Topbar/ >
          {/* Page header */}
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

          {/* Stats row (similar to instructor courses) */}
          {!loading && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20, marginBottom: 32,
            }}>
              {[
                { label: 'TOTAL CHALLENGES', value: challenges.length, color: 'var(--accent)' },
                { label: 'ACTIVE', value: challenges.filter(c => c.status === 'active').length, color: 'var(--accent3)' },
                { label: 'DRAFT / PENDING', value: challenges.filter(c => c.status === 'draft' || c.status === 'pending').length, color: 'var(--amber)' },
              ].map(stat => (
                <div key={stat.label} className="stat-card" style={{ padding: '20px 24px' }}>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-value" style={{ fontSize: 28, color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main card with filters and grid */}
          <div className="card" style ={{background: 'transparent',border:"0px"}}>
            <FiltersBar
              filterDiff={filterDiff}
              setFilterDiff={setFilterDiff}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              search={search}
              setSearch={setSearch}
              total={filtered.length}
            />

            {filtered.length === 0 ? (
              <div style={{
                padding: '56px 0', textAlign: 'center',
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, }}>
                {filtered.map(challenge => (
                  <ChallengeCard key={challenge.challenge_id} challenge={challenge} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}