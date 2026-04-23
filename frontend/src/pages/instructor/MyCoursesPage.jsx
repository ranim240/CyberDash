import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Topbar  from '../../components/common/Navbar';
import { useCourses } from '../../hooks/useCourses';
console.log("we are in my courses page");
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: '2-digit',
      })
    : '—';

// ── Filters bar ───────────────────────────────────────────────────────
function FiltersBar({ filter, setFilter, search, setSearch, total }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      gap: 16, marginBottom: 28, flexWrap: 'wrap',
    }}>
      {/* Search */}
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

      {/* Status filter */}
      {['all', 'published', 'draft'].map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`act-btn ${filter === f ? 'act-pub' : ''}`}
          style={{
            borderColor: filter === f ? 'var(--accent3)' : 'var(--border)',
            color: filter === f ? 'var(--accent3)' : 'var(--muted)',
            textTransform: 'uppercase', fontSize: 11,
            letterSpacing: 1,
          }}
        >
          {f}
        </button>
      ))}

      {/* Count */}
      <span style={{
        marginLeft: 'auto',
        fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)',
      }}>
        {total} COURSE{total !== 1 ? 'S' : ''}
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function MyCoursesPage() {
  const navigate              = useNavigate();
  const { courses, loading, error } = useCourses();
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');

  // Apply filters
  const filtered = courses.filter((c) => {
    const matchStatus =
      filter === 'all'       ? true :
      filter === 'published' ? c.is_published :
                               !c.is_published;
    const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="layout">
      <Sidebar />

      <div className="main" style={{ marginLeft: 20 }}>
        <Topbar />

        {/* Page header */}
        <div className="topbar" style={{ marginBottom: 32 }}>
          <div>
            <div className="api-label">// INSTRUCTOR PANEL</div>
            <div className="page-title">My Courses</div>
            <div className="page-sub">Manage and monitor your course catalog</div>
          </div>
          <button
            className="btn btn-teal"
            onClick={() => navigate('/instructor/courses/create')}
          >
            + New Course
          </button>
        </div>

        {/* Stats row */}
        {!loading && !error && (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20, marginBottom: 32,
          }}>
            {[
              { label: 'TOTAL COURSES',     value: courses.length,                         color: 'var(--accent)'  },
              { label: 'PUBLISHED',          value: courses.filter(c => c.is_published).length,  color: 'var(--accent3)' },
              { label: 'DRAFTS',             value: courses.filter(c => !c.is_published).length, color: 'var(--amber)'  },
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

          {/* Loading */}
          {loading && (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{
                fontFamily: 'var(--mono)', fontSize: 13,
                color: 'var(--muted)', letterSpacing: 2,
              }}>
                LOADING...
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div style={{
              padding: '16px',
              background: 'rgba(239,68,68,0.07)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 4, fontFamily: 'var(--mono)',
              fontSize: 12, color: 'var(--danger)', letterSpacing: 1,
            }}>
              ✕ FETCH ERROR — {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{
                fontFamily: 'var(--mono)', fontSize: 13,
                color: 'var(--muted)', letterSpacing: 1,
              }}>
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
                  <tr key={course.course_id}>
                    {/* Title + description */}
                    <td style={{ maxWidth: 300 }}>
                      <span style={{
                        display: 'block', fontWeight: 600,
                        color: 'var(--text)', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {course.title}
                      </span>
                      {course.description && (
                        <span style={{
                          display: 'block', fontSize: 12,
                          color: 'var(--muted)', marginTop: 3,
                          overflow: 'hidden', textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {course.description}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td>
                      <span className={`status-badge ${course.is_published ? 'status-pub' : 'status-draft'}`}>
                        {course.is_published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </td>

                    {/* Created */}
                    <td style={{
                      fontFamily: 'var(--mono)', fontSize: 12,
                      color: 'var(--muted)',
                    }}>
                      {formatDate(course.created_at)}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-btns">
                        <button
                          className="act-btn act-edit"
                          onClick={() => navigate(`/instructor/courses/${course.course_id}/edit`)}
                        >
                          Edit
                        </button>
                        <button className={`act-btn ${course.is_published ? 'act-del' : 'act-pub'}`}>
                          {course.is_published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button className="act-btn act-del">Delete</button>
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