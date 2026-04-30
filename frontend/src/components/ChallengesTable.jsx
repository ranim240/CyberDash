import { useNavigate } from "react-router-dom";
import { useChallenges } from "../hooks/useChallengesInstructor";

// ── Mock fallback data ────────────────────────────────────────────────
const MOCK_CHALLENGES = [
  { challenge_id: 'ch-001', title: 'SQL Injection 101',         difficulty: 'easy',   points: 100, status: 'active',  created_at: '2024-11-10T08:00:00Z' },
  { challenge_id: 'ch-002', title: 'XSS Filter Bypass',         difficulty: 'medium', points: 250, status: 'active',  created_at: '2024-12-01T10:30:00Z' },
  { challenge_id: 'ch-003', title: 'Buffer Overflow Basics',    difficulty: 'hard',   points: 500, status: 'pending', created_at: '2025-01-15T14:00:00Z' },
  { challenge_id: 'ch-004', title: 'JWT Token Forgery',         difficulty: 'medium', points: 300, status: 'active',  created_at: '2025-02-20T09:00:00Z' },
  { challenge_id: 'ch-005', title: 'Blind SSRF Exploitation',   difficulty: 'hard',   points: 600, status: 'pending', created_at: '2025-03-05T11:00:00Z' },
];

// ── Helpers ───────────────────────────────────────────────────────────
const diffClass = (d) => {
  if (!d) return 'diff-badge';
  const map = { easy: 'diff-easy', medium: 'diff-med', hard: 'diff-hard' };
  return `diff-badge ${map[d.toLowerCase()] ?? ''}`;
};

const statusClass = (s) => {
  if (!s) return 'status-badge';
  const map = { active: 'status-active', published: 'status-pub', draft: 'status-draft', pending: 'status-draft' };
  return `status-badge ${map[s.toLowerCase()] ?? 'status-draft'}`;
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

// ── Component ─────────────────────────────────────────────────────────
export default function ChallengesTable() {
  const navigate = useNavigate();
  const { challenges, loading, error, usingMock } = useChallenges();

  // Sort by created_at (most recent first) and take first 3
  const recentChallenges = [...challenges]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);



  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div>
          
          <div className="card-title">Recent Challenges</div>
        </div>
        {!loading && !error && (
          <span className="status-badge status-active" style={{ fontSize: 11 }}>
            {challenges.length} TOTAL
          </span>
        )}
      </div>

      {/* Mock warning */}
      {usingMock && (
        <div style={{
          padding: '8px 14px', marginBottom: 16,
          background: 'rgba(245,158,11,0.07)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 4, fontFamily: 'var(--mono)',
          fontSize: 11, color: 'var(--amber)', letterSpacing: 1,
        }}>
          ⚠ MOCK DATA — API unavailable or returned no results
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ padding: '32px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>
            LOADING...
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{
          padding: '20px 16px',
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 4, fontFamily: 'var(--mono)',
          fontSize: 12, color: 'var(--danger)', letterSpacing: 1,
        }}>
          ✕ FETCH ERROR — {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && challenges.length === 0 && (
        <div style={{ padding: '32px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 1 }}>
            NO CHALLENGES FOUND
          </p>
        </div>
      )}

      {/* Table – only if there are challenges */}
      {!loading && !error && challenges.length > 0 && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Difficulty</th>
                <th>Points</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentChallenges.map((ch) => (
                <tr key={ch.challenge_id} onClick={() => navigate(`/instructor/challenges/${ch.challenge_id}`)}>
                  <td style={{ fontWeight: 600, color: 'var(--text)', maxWidth: 180 }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ch.title}
                    </span>
                  </td>
                  <td>
                    <span className={diffClass(ch.difficulty)}>
                      {ch.difficulty?.toUpperCase() ?? '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--amber)', fontWeight: 700 }}>
                      {ch.points ?? 0} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>pts</span>
                    </span>
                  </td>
                  <td>
                    <span className={statusClass(ch.status)}>
                      {ch.status ?? '—'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
                    {formatDate(ch.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          
            <div style={{ marginTop: 24, textAlign: 'right' }}>
               <button
                className="btn btn-outline"
                onClick={() => navigate(`/instructor/challenges/`)}
                style={{ fontSize: 12, padding: '8px 16px' }}
              >
                VIEW ALL CHALLENGES →
              </button>
            </div>
          
        </>
      )}
    </div>
  );
}