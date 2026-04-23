import { useState, useEffect } from 'react';
import api from '../services/api';

// ── Hook ─────────────────────────────────────────────────────────────
function useChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    api.get('/challenges/myChallenges')
      .then((res) => {
        // your backend wraps data in { success: true, data: [...] }
        const payload = res.data;
        setChallenges(Array.isArray(payload) ? payload : payload.data ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { challenges, loading, error };
}

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
  const { challenges, loading, error } = useChallenges();

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div>
          <div className="api-label">// INSTRUCTOR VIEW</div>
          <div className="card-title">My Challenges</div>
        </div>
        {!loading && !error && (
          <span
            className="status-badge status-active"
            style={{ fontSize: 11 }}
          >
            {challenges.length} TOTAL
          </span>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ padding: '32px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>
            LOADING...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{
          padding: '20px 16px',
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 4,
          fontFamily: 'var(--mono)',
          fontSize: 12,
          color: 'var(--danger)',
          letterSpacing: 1,
        }}>
          ✕ FETCH ERROR — {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && challenges.length === 0 && (
        <div style={{ padding: '32px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 1 }}>
            NO CHALLENGES FOUND
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && challenges.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Points</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((ch) => (
              <tr key={ch.challenge_id}>
                {/* Title */}
                <td style={{ fontWeight: 600, color: 'var(--text)', maxWidth: 180 }}>
                  <span style={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {ch.title}
                  </span>
                </td>

                {/* Difficulty */}
                <td>
                  <span className={diffClass(ch.difficulty)}>
                    {ch.difficulty?.toUpperCase() ?? '—'}
                  </span>
                </td>

                {/* Points */}
                <td>
                  <span style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 14,
                    color: 'var(--amber)',
                    fontWeight: 700,
                  }}>
                    {ch.points ?? 0} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>pts</span>
                  </span>
                </td>

                {/* Status */}
                <td>
                  <span className={statusClass(ch.status)}>
                    {ch.status?.toUpperCase() ?? '—'}
                  </span>
                </td>

                {/* Created */}
                <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
                  {formatDate(ch.created_at)}
                </td>

                {/* Actions */}
                <td>
                  <div className="action-btns">
                    <button className="act-btn act-edit">Edit</button>
                    <button className="act-btn act-del">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}