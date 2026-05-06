import React, { useContext, useMemo, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import useLeaderboard from '../../hooks/useLeaderboard.js';
import '../../styles/LeaderboardPage.css';
import LearnerLayout from '../../components/learner/LearnerLayout.jsx';
import { useLearnerStats } from '../../hooks/useLearnerStats.js';


// ─── constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, label: 'Forensics',      icon: '🔬', slug: 'forensics'    },
  { id: 2, label: 'Cryptography',   icon: '🔐', slug: 'cryptography' },
  { id: 3, label: 'Rev Eng',        icon: '⚙️',  slug: 'rev-eng'      },
];

const TABS = ['global', 'weekly', 'monthly', 'category'];

// ─── helpers ──────────────────────────────────────────────────────────────────
function Loader() {
  return (
    <div className="lb-loader">
      <div className="lb-loader__ring" />
      <span>Fetching rankings…</span>
    </div>
  );
}

function ErrorBanner({ message }) {
  return <div className="lb-error">⚠ {message}</div>;
}

function RankMedal({ rank }) {
  if (rank === 1) return <span className="medal">🥇</span>;
  if (rank === 2) return <span className="medal">🥈</span>;
  if (rank === 3) return <span className="medal">🥉</span>;
  return null;
}

function UserRowHighlight({ rank, isCurrentUser, children }) {
  let cls = 'lb-table__row';
  if (rank === 1) cls += ' lb-table__row--gold';
  else if (rank === 2) cls += ' lb-table__row--silver';
  else if (rank === 3) cls += ' lb-table__row--bronze';
  if (isCurrentUser) cls += ' lb-table__row--highlight';
  return <tr className={cls}>{children}</tr>;
}

// ─── rank tier label ──────────────────────────────────────────────────────────
function rankTierLabel(rank) {
  if (!rank) return null;
  if (rank === 1)   return { label: 'CHAMPION',   cls: 'tier--gold'   };
  if (rank <= 3)    return { label: 'ELITE',       cls: 'tier--silver' };
  if (rank <= 10)   return { label: 'TOP 10',      cls: 'tier--bronze' };
  if (rank <= 50)   return { label: 'RANKED',      cls: 'tier--top50'  };
  return { label: 'CONTENDER', cls: 'tier--default' };
}

// ─── hero rank card ───────────────────────────────────────────────────────────
function HeroRankCard({ user, data }) {
  const entry = useMemo(() => {
    if (!user || !data?.length) return null;
    return data.find((e) => e.user_name === user.username) || null;
  }, [user, data]);

  const position = useMemo(() => {
    if (!user || !data?.length) return null;
    const idx = data.findIndex((e) => e.user_name === user.username);
    return idx >= 0 ? idx + 1 : null;
  }, [user, data]);

  if (!user || !entry || !position) return null;

  const tier = rankTierLabel(position);

  return (
    <div className="lb-hero">
      <div className="lb-hero__bg-glow" />

      <div className="lb-hero__avatar">
        {user.username?.charAt(0).toUpperCase()}
        <div className="lb-hero__avatar-ring" />
      </div>

      <div className="lb-hero__info">
        <div className="lb-hero__name">
          {user.username}
          <span className="lb-hero__you">YOU</span>
        </div>
        <div className={`lb-hero__tier ${tier?.cls}`}>{tier?.label}</div>
      </div>

      <div className="lb-hero__stats">
        <div className="lb-hero__stat">
          <div className="lb-hero__stat-val">#{position}</div>
          <div className="lb-hero__stat-label">RANK</div>
        </div>
        <div className="lb-hero__divider" />
        <div className="lb-hero__stat">
          <div className="lb-hero__stat-val">{entry.xp_points?.toLocaleString() ?? 0}</div>
          <div className="lb-hero__stat-label">XP</div>
        </div>
        <div className="lb-hero__divider" />
        <div className="lb-hero__stat">
          <div className="lb-hero__stat-val">Lvl {entry.level ?? 1}</div>
          <div className="lb-hero__stat-label">LEVEL</div>
        </div>
      </div>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const { user } = useContext(AuthContext);
  const { stats } = useLearnerStats();
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [categoryId, setCategoryId]           = useState(CATEGORIES[0].id);
  const [searchTerm, setSearchTerm]           = useState('');
  const [currentPage, setCurrentPage]         = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data, loading, error } = useLeaderboard(leaderboardType, categoryId);

  const filteredData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    if (!searchTerm.trim()) return data;
    return data.filter((e) =>
      e.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const totalPages   = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  React.useEffect(() => { setCurrentPage(1); }, [leaderboardType, searchTerm, categoryId]);

  const handleTabChange = (type) => {
    setLeaderboardType(type);
    if (type !== 'category') setCategoryId(CATEGORIES[0].id);
  };

  if (loading && !data.length) return <Loader />;

  return (
    <LearnerLayout stats={stats}>
    <div className="leaderboard">
      {/* decorative layers */}
      <div className="leaderboard__scanline" />
      <div className="leaderboard__noise" />

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="lb-header">
        <div className="lb-header__left">
          <div className="lb-title-eyebrow">// CYBERDASH</div>
          <h1 className="lb-title">
            <span className="lb-title__main">LEADER</span>
            <span className="lb-title__accent">BOARD</span>
          </h1>
          <p className="lb-subtitle">Top performers across CyberDash</p>
        </div>
      </header>

      {/* ── Hero rank card ──────────────────────────────────────── */}
      <HeroRankCard user={user} data={data} />

      {error && <ErrorBanner message={error} />}

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="lb-tabs" role="tablist">
        {TABS.map((type) => (
          <button
            key={type}
            role="tab"
            aria-selected={leaderboardType === type}
            className={`lb-tab ${leaderboardType === type ? 'lb-tab--active' : ''}`}
            onClick={() => handleTabChange(type)}
          >
            {type === 'category' ? '⬡ Category' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Category pills (shown only when "category" tab active) ─ */}
      {leaderboardType === 'category' && (
        <div className="lb-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`lb-cat-pill ${categoryId === cat.id ? 'lb-cat-pill--active' : ''}`}
              onClick={() => setCategoryId(cat.id)}
            >
              <span className="lb-cat-pill__icon">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Controls row ─────────────────────────────────────────── */}
      <div className="lb-controls">
        <div className="lb-search">
          <span className="lb-search__icon">⌕</span>
          <input
            type="text"
            placeholder="Search by username…"
            className="lb-search__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="lb-search__clear" onClick={() => setSearchTerm('')}>✕</button>
          )}
        </div>

        <div className="lb-info__text">
          {filteredData.length > 0
            ? `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of ${filteredData.length} users`
            : '0 users'}
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      {filteredData.length > 0 ? (
        <div className="lb-table-wrapper">
          <table className="lb-table" aria-label="Leaderboard">
            <thead>
              <tr className="lb-table__header">
                <th className="lb-col lb-col--rank">Rank</th>
                <th className="lb-col lb-col--user">User</th>
                <th className="lb-col lb-col--xp">XP</th>
                <th className="lb-col lb-col--level">Level</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((entry, idx) => {
                const isCurrentUser = user && entry.user_name === user.username;
                return (
                  <UserRowHighlight key={`${entry.user_id ?? entry.user_name}-${entry.rank}-${idx}`}
                    rank={entry.rank}
                    isCurrentUser={isCurrentUser}
                  >
                    {/* Rank */}
                    <td className="lb-col lb-col--rank">
                      <div className={`rank-bar rank-bar--${
                        entry.rank === 1 ? 'gold'
                        : entry.rank === 2 ? 'silver'
                        : entry.rank === 3 ? 'bronze'
                        : entry.rank <= 10 ? 'top10'
                        : 'default'
                      }`}>
                        <RankMedal rank={entry.rank} />
                        <span className="rank-number">#{entry.rank}</span>
                      </div>
                    </td>

                    {/* User */}
                    <td className="lb-col lb-col--user">
                      <div className="user-cell">
                        <div className={`user-avatar user-avatar--${
                          entry.rank === 1 ? 'gold'
                          : entry.rank === 2 ? 'silver'
                          : entry.rank === 3 ? 'bronze'
                          : 'default'
                        }`}>
                          {entry.user_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-name">
                          {entry.user_name}
                          {isCurrentUser && <span className="user-badge">YOU</span>}
                        </div>
                      </div>
                    </td>

                    {/* XP */}
                    <td className="lb-col lb-col--xp">
                      <span className="xp-value">{entry.xp_points?.toLocaleString() || 0}</span>
                    </td>

                    {/* Level */}
                    <td className="lb-col lb-col--level">
                      <span className="level-badge">Lvl {entry.level || 1}</span>
                    </td>
                  </UserRowHighlight>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="lb-empty">
          <div className="lb-empty__icon">◈</div>
          <p>No users found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="lb-pagination">
          <button
            className="lb-pagination__btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Prev
          </button>
          <div className="lb-pagination__dots">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  className={`lb-pagination__dot ${currentPage === page ? 'lb-pagination__dot--active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                />
              );
            })}
          </div>
          <span className="lb-pagination__info">
            {currentPage} / {totalPages}
          </span>
          <button
            className="lb-pagination__btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
    </LearnerLayout>
  );
}