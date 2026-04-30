import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Topbar  from '../../components/common/Navbar';
import { useCourses } from '../../hooks/useCourses';
import coursesApi from '../../api/courses';

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: '2-digit',
      })
    : '—';

// ── Confirm Modal (same as in CourseContentPage) ─────────────────────
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

// ── Filters bar (unchanged) ─────────────────────────────────────────
function FiltersBar({ filter, setFilter, search, setSearch, total }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: 16, marginBottom: 28, flexWrap: 'wrap',
    }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
        <span style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)',
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
            width: '100%', padding: '10px 12px 10px 32px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 4, color: 'var(--text)',
            fontFamily: 'var(--body)', fontSize: 14,
            outline: 'none',
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

// ── Main Page ────────────────────────────────────────────────────────
export default function MyCoursesPage() {
  const navigate = useNavigate();
  const { courses, setCourses, loading, error } = useCourses(); // note: setCourses is needed for optimistic updates
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal state
  const [modal, setModal] = useState({
    open: false,
    type: null,        // 'publish' or 'delete'
    course: null,
    loading: false,
  });

  const closeModal = () => setModal({ open: false, type: null, course: null, loading: false });

  // ── Publish / Unpublish handler ──────────────────────────────────
  const handleTogglePublish = async (course) => {
    setModal({
      open: true,
      type: 'publish',
      course,
      loading: false,
    });
  };

  const confirmTogglePublish = async () => {
    const { course } = modal;
    setModal(prev => ({ ...prev, loading: true }));
    try {
      // The backend toggles automatically when PATCH /courses/:id/publish is called without body
      await coursesApi.togglePublish(course.course_id);
      // Optimistically update local state
      setCourses(prevCourses =>
        prevCourses.map(c =>
          c.course_id === course.course_id
            ? { ...c, is_published: !c.is_published }
            : c
        )
      );
      closeModal();
    } catch {
      alert('Failed to update publish status. Please try again.');
      closeModal();
    }
  };

  // ── Delete handler ────────────────────────────────────────────────
  const handleDelete = async (course) => {
    setModal({
      open: true,
      type: 'delete',
      course,
      loading: false,
    });
  };

  const confirmDelete = async () => {
    const { course } = modal;
    setModal(prev => ({ ...prev, loading: true }));
    try {
      await coursesApi.remove(course.course_id);
      // Remove from local state
      setCourses(prevCourses => prevCourses.filter(c => c.course_id !== course.course_id));
      closeModal();
    } catch {
      alert('Failed to delete course. Please try again.');
      closeModal();
    }
  };

  // Apply filters
  const filtered = courses.filter((c) => {
    const matchStatus =
      filter === 'all'       ? true :
      filter === 'published' ? c.is_published : !c.is_published;
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Get modal title and message
  const modalTitle = modal.type === 'publish'
    ? (modal.course?.is_published ? 'Unpublish Course' : 'Publish Course')
    : 'Delete Course';
  const modalMessage = modal.type === 'publish'
    ? (modal.course?.is_published
        ? `Are you sure you want to unpublish "${modal.course?.title}"? It will no longer be visible to learners.`
        : `Are you sure you want to publish "${modal.course?.title}"? It will become visible to learners.`)
    : `Are you sure you want to delete "${modal.course?.title}"? This action cannot be undone and will also delete all associated lessons.`;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main" style={{ marginLeft: 20 }}>
        <Topbar />

        {/* Modal */}
        {modal.open && (
          <ConfirmModal
            title={modalTitle}
            message={modalMessage}
            onConfirm={modal.type === 'publish' ? confirmTogglePublish : confirmDelete}
            onCancel={closeModal}
            loading={modal.loading}
          />
        )}

        {/* Page header */}
        <div className="topbar" style={{ marginBottom: 32 }}>
          <div>
            <div className="page-title">My Courses</div>
          </div>
        </div>

        {/* Stats row */}
        {!loading && !error && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20, marginBottom: 32,
          }}>
            {[
              { label: 'TOTAL COURSES', value: courses.length, color: 'var(--accent)' },
              { label: 'PUBLISHED', value: courses.filter(c => c.is_published).length, color: 'var(--accent3)' },
              { label: 'DRAFTS', value: courses.filter(c => !c.is_published).length, color: 'var(--amber)' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card" style={{ padding: '20px 24px' }}>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value" style={{ fontSize: 28, color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main card */}
        <div className="card">
          <FiltersBar
            filter={filter} setFilter={setFilter}
            search={search} setSearch={setSearch}
            total={filtered.length}
          />

          {/* Loading / Error / Empty states */}
          {loading && (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>
                LOADING...
              </p>
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
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 1 }}>
                {search || filter !== 'all' ? 'NO COURSES MATCH YOUR FILTERS' : 'NO COURSES YET'}
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && filtered.length > 0 && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course.course_id} >
                    <td style={{ maxWidth: 300 }}>
                      <span style={{
                        display: 'block', fontWeight: 600, color: 'var(--text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }} onClick={() => navigate(`/instructor/courses/${course.course_id}`)}>
                        {course.title}
                      </span>
                      {course.description && (
                        <span style={{
                          display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 3,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {course.description}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${course.is_published ? 'status-pub' : 'status-draft'}`}>
                        {course.is_published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
                      {formatDate(course.created_at)}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className={`act-btn ${course.is_published ? 'act-del' : 'act-pub'}`}
                          onClick={() => handleTogglePublish(course)}
                        >
                          {course.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          className="act-btn act-del"
                          onClick={() => handleDelete(course)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}