import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import { useCourses } from '../../hooks/useCourses';
import coursesApi from '../../api/courses';

const LEVEL_COLOR = {
  beginner:     { color: 'var(--accent3)', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)' },
  intermediate: { color: 'var(--amber)',   bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' },
  advanced:     { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)'  },
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

// ── Confirm Modal ─────────────────────────────────────────────────────
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
          <button
            className="btn btn-danger"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Yes, Proceed'}
          </button>
          <button
            className="btn btn-outline"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Instructor Course Card ──────────────────────────────────────────
function InstructorCourseCard({ course, onTogglePublish, onDelete }) {
  const navigate = useNavigate();
  const levelStyle = LEVEL_COLOR[course.level] ?? LEVEL_COLOR.beginner;

  return (
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
      onClick={() => navigate(`/instructor/courses/${course.course_id}`)}
    >
      <div style={{ height: 3, background: levelStyle.color, opacity: 0.6 }} />
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Header: title + level badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.3 }}>
            {course.title}
          </h3>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 8px', flexShrink: 0,
            borderRadius: 20, border: `1px solid ${levelStyle.border}`,
            background: levelStyle.bg, color: levelStyle.color,
          }}>
            {course.level?.toUpperCase() ?? '—'}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 13, color: 'var(--muted2)', lineHeight: 1.55, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.description || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No description.</span>}
        </p>

        {/* Meta row: duration + created date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 'auto' }}>
          {course.estimated_duration && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 8px',
              borderRadius: 20, border: '1px solid var(--border)',
              background: 'var(--bg3)', color: 'var(--muted2)',
            }}>
              ⏱ {course.estimated_duration < 60 ? `${course.estimated_duration}m` : `${Math.floor(course.estimated_duration / 60)}h ${course.estimated_duration % 60}m`}
            </span>
          )}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>
            {formatDate(course.created_at)}
          </span>
        </div>

        {/* Action buttons (publish/unpublish, delete) */}
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            className={`btn ${course.is_published ? 'btn-outline' : 'btn-teal'}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: 11, padding: '6px 0' }}
            onClick={(e) => { e.stopPropagation(); onTogglePublish(course); }}
          >
            {course.is_published ? 'Unpublish' : 'Publish'}
          </button>
          <button
            className="btn btn-danger"
            style={{ flex: 1, justifyContent: 'center', fontSize: 11, padding: '6px 0' }}
            onClick={(e) => { e.stopPropagation(); onDelete(course); }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Filters Bar ─────────────────────────────────────────────────────
function FiltersBar({ filter, setFilter, search, setSearch, total }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap',
    }}>
      <div style={{ position: 'relative', flex: 2, minWidth: 200 }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
        }}>
          ⌕
        </span>
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '9px 12px 9px 34px',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 4, color: 'var(--text)',
            fontFamily: 'var(--body)', fontSize: 14,
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {['all', 'published', 'draft'].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`act-btn ${filter === f ? 'act-pub' : ''}`}
          style={{
            borderColor: filter === f ? 'var(--accent3)' : 'var(--muted)',
            color: filter === f ? 'var(--accent3)' : 'var(--muted)',
            textTransform: 'uppercase', fontSize: 11,
            letterSpacing: 1, backgroundColor: 'transparent',
          }}
        >
          {f}
        </button>
      ))}

      <span style={{
        marginLeft: 'auto',
        fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
      }}>
        {total} COURSE{total !== 1 ? 'S' : ''}
      </span>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────
export default function MyCoursesPage() {
  const navigate = useNavigate();
  const { courses, setCourses, loading, error } = useCourses();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    type: null,
    course: null,
    loading: false,
  });

  const closeModal = () => setModal({ open: false, type: null, course: null, loading: false });

  const handleTogglePublish = (course) => {
    setModal({ open: true, type: 'publish', course, loading: false });
  };

  const confirmTogglePublish = async () => {
    const { course } = modal;
    setModal(prev => ({ ...prev, loading: true }));
    try {
      await coursesApi.togglePublish(course.course_id);
      setCourses(prev => prev.map(c =>
        c.course_id === course.course_id ? { ...c, is_published: !c.is_published } : c
      ));
      closeModal();
    } catch {
      alert('Failed to update publish status. Please try again.');
      closeModal();
    }
  };

  const handleDelete = (course) => {
    setModal({ open: true, type: 'delete', course, loading: false });
  };

  const confirmDelete = async () => {
    const { course } = modal;
    setModal(prev => ({ ...prev, loading: true }));
    try {
      await coursesApi.remove(course.course_id);
      setCourses(prev => prev.filter(c => c.course_id !== course.course_id));
      closeModal();
    } catch {
      alert('Failed to delete course. Please try again.');
      closeModal();
    }
  };

  // Filter logic
  const filtered = courses.filter(c => {
    const matchStatus =
      filter === 'all' ? true :
      filter === 'published' ? c.is_published : !c.is_published;
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const modalTitle = modal.type === 'publish'
    ? (modal.course?.is_published ? 'Unpublish Course' : 'Publish Course')
    : 'Delete Course';
  const modalMessage = modal.type === 'publish'
    ? (modal.course?.is_published
        ? `Are you sure you want to unpublish "${modal.course?.title}"? It will no longer be visible to learners.`
        : `Are you sure you want to publish "${modal.course?.title}"? It will become visible to learners.`)
    : `Are you sure you want to delete "${modal.course?.title}"? This action cannot be undone and will also delete all associated lessons.`;

  return (
    <>
      <Navbar />
      <div className="layout">
        <Sidebar />
        <div className="main">
          {modal.open && (
            <ConfirmModal
              title={modalTitle}
              message={modalMessage}
              onConfirm={modal.type === 'publish' ? confirmTogglePublish : confirmDelete}
              onCancel={closeModal}
              loading={modal.loading}
            />
          )}

          {/* Header */}
          <div className="topbar" style={{ marginBottom: 28 }}>
            <div>
              <div className="page-title" style={{ fontSize: 20 }}>My Courses</div>
            </div>
          </div>

          {/* Stats row (optional, keep for instructor overview) */}
          {!loading && !error && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20, marginBottom: 32,
            }}>
              {[
                { label: 'TOTAL COURSES', value: courses.length, color: 'var(--accent)' },
                { label: 'PUBLISHED', value: courses.filter(c => c.is_published).length, color: 'var(--accent3)' },
                { label: 'DRAFTS', value: courses.filter(c => !c.is_published).length, color: 'var(--amber)' },
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

          {/* Filters and card grid */}
          <div className="card"style ={{background: 'transparent',border:"0px"}}>
            <FiltersBar
              filter={filter} setFilter={setFilter}
              search={search} setSearch={setSearch}
              total={filtered.length}
            />

            {loading && (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>LOADING...</p>
              </div>
            )}

            {error && !loading && (
              <div style={{
                padding: '16px', background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4,
                fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--danger)', letterSpacing: 1,
              }}>
                ✕ FETCH ERROR — {error}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div style={{ padding: '56px 0', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 6 }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: 1, marginBottom: 12 }}>
                  {search || filter !== 'all' ? 'NO COURSES MATCH YOUR FILTERS' : 'NO COURSES YET'}
                </p>
                {courses.length === 0 && (
                  <button className="btn btn-outline" style={{ fontSize: 11 }} onClick={() => navigate('/instructor/courses/create')}>
                    + Create First Course
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {filtered.map(course => (
                  <InstructorCourseCard
                    key={course.course_id}
                    course={course}
                    onTogglePublish={handleTogglePublish}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}