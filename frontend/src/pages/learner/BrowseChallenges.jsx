import React from 'react';
import { Link } from 'react-router-dom';
import LearnerLayout from '../../components/learner/LearnerLayout.jsx';
import { useChallenges } from '../../hooks/useChallenges.js';
import './BrowseChallenges.css';

// ─── constantes ──────────────────────────────────────────────────────────────
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const DIFF_CONFIG = {
  easy   : { label: 'Easy',   cls: 'easy'   },
  medium : { label: 'Medium', cls: 'medium' },
  hard   : { label: 'Hard',   cls: 'hard'   },
};

const SORT_OPTIONS = [
  { value: 'created_at|desc', label: 'Newest first'    },
  { value: 'created_at|asc',  label: 'Oldest first'    },
  { value: 'points|desc',     label: 'Most points'     },
  { value: 'points|asc',      label: 'Fewest points'   },
];

// ─── sous-composants ─────────────────────────────────────────────────────────
function DiffPip({ difficulty }) {
  const cfg = DIFF_CONFIG[difficulty?.toLowerCase()] ?? { label: difficulty, cls: 'easy' };
  return <span className={`bc-pip bc-pip--${cfg.cls}`}>{cfg.label}</span>;
}

function ChallengeCard({ challenge }) {
  return (
    <Link
      to={`/learner/challenges/${challenge.challenge_id}`}
      className="bc-card"
    >
      <div className="bc-card__top">
        <DiffPip difficulty={challenge.difficulty} />
        <span className="bc-card__points">{challenge.points} pts</span>
      </div>

      <h3 className="bc-card__title">{challenge.title}</h3>

      <p className="bc-card__desc">
        {challenge.description
          ? challenge.description.slice(0, 90) + (challenge.description.length > 90 ? '…' : '')
          : 'No description provided.'}
      </p>

      <div className="bc-card__footer">
        {challenge.category_name && (
          <span className="bc-card__cat">{challenge.category_name}</span>
        )}
        <span className="bc-card__cta">View challenge →</span>
      </div>
    </Link>
  );
}

function FilterBar({ filters, updateFilter, resetFilters, total }) {
  const handleSort = (e) => {
    const [sortBy, order] = e.target.value.split('|');
    updateFilter('sortBy', sortBy);
    updateFilter('order', order);
  };

  const sortValue = `${filters.sortBy}|${filters.order}`;

  return (
    <div className="bc-filters">
      {/* difficultés */}
      <div className="bc-filters__group">
        <button
          className={`bc-filter-btn ${!filters.difficulty ? 'bc-filter-btn--active' : ''}`}
          onClick={() => updateFilter('difficulty', '')}
        >
          All
        </button>
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            className={`bc-filter-btn bc-filter-btn--${d} ${filters.difficulty === d ? 'bc-filter-btn--active' : ''}`}
            onClick={() => updateFilter('difficulty', d)}
          >
            {DIFF_CONFIG[d].label}
          </button>
        ))}
      </div>

      {/* tri */}
      <div className="bc-filters__right">
        <span className="bc-filters__count">{total} challenge{total !== 1 ? 's' : ''}</span>
        <select
          className="bc-select"
          value={sortValue}
          onChange={handleSort}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {(filters.difficulty || filters.category_id) && (
          <button className="bc-reset-btn" onClick={resetFilters}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  // génère les numéros à afficher : toujours 1, last, et ±1 autour de la page courante
  const pages = [...new Set([
    1,
    totalPages,
    page - 1, page, page + 1,
  ])].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  return (
    <div className="bc-pagination">
      <button
        className="bc-page-btn"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >←</button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        return (
          <React.Fragment key={p}>
            {prev && p - prev > 1 && <span className="bc-page-dots">…</span>}
            <button
              className={`bc-page-btn ${p === page ? 'bc-page-btn--active' : ''}`}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          </React.Fragment>
        );
      })}

      <button
        className="bc-page-btn"
        disabled={page >= totalPages}
        onClick={() => onPage(page + 1)}
      >→</button>
    </div>
  );
}

function SkeletonCard() {
  return <div className="bc-card bc-card--skeleton" aria-hidden="true" />;
}

// ─── page principale ──────────────────────────────────────────────────────────
export default function BrowseChallenges() {
  const {
    challenges,
    total,
    totalPages,
    filters,
    loading,
    error,
    updateFilter,
    resetFilters,
  } = useChallenges();

  return (
    <LearnerLayout>
    <main className="browse">

      {/* ── HEADER ── */}
      <div className="browse__header">
        <div>
          <h1 className="browse__title">Challenges</h1>
          <p className="browse__sub">Pick a challenge, start a session, capture the flag.</p>
        </div>

      </div>

      {/* ── FILTRES ── */}
      <FilterBar
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        total={total}
      />

      {/* ── ERREUR ── */}
      {error && <div className="bc-error">{error}</div>}

      {/* ── GRILLE ── */}
      <div className="bc-grid">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : challenges.length > 0
            ? challenges.map((c) => <ChallengeCard key={c.challenge_id} challenge={c} />)
            : (
              <div className="bc-empty">
                <span className="bc-empty__icon">🔍</span>
                <p>No challenges found for these filters.</p>
                <button className="bc-reset-btn" onClick={resetFilters}>Reset filters</button>
              </div>
            )
        }
      </div>

      {/* ── PAGINATION ── */}
      <Pagination
        page={filters.page}
        totalPages={totalPages}
        onPage={(p) => updateFilter('page', p)}
      />

    </main>
    </LearnerLayout>
  );
}