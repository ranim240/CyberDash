import { useCourses } from '../hooks/useCourses';
import { useNavigate } from 'react-router-dom';

// ── Helpers ───────────────────────────────────────────────────────────
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: '2-digit',
      })
    : '—';

// ── Component ─────────────────────────────────────────────────────────
export default function CoursesTable() {
  const { courses, loading, error } = useCourses();
  const navigate = useNavigate();

  // Sort by created_at (most recent first) and take first 3
  const recentCourses = [...courses]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3);

  

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div>
          
          <div className="card-title">Recent Courses</div>
        </div>
        {!loading && !error && (
          <span className="status-badge status-active" style={{ fontSize: 11 }}>
            {courses.length} TOTAL
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ padding: '32px 0', textAlign: 'center' }}>
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
          borderRadius: 4,
          fontFamily: 'var(--mono)', fontSize: 12,
          color: 'var(--danger)', letterSpacing: 1,
        }}>
          ✕ FETCH ERROR — {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && courses.length === 0 && (
        <div style={{ padding: '32px 0', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 13,
            color: 'var(--muted)', letterSpacing: 1,
          }}>
            NO COURSES FOUND
          </p>
        </div>
      )}

      {/* Table – only if there are courses */}
      {!loading && !error && courses.length > 0 && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentCourses.map((course) => (
                <tr key={course.course_id} onClick={() => navigate(`/instructor/courses/${course.course_id}`)}>
                  {/* Title + description */}
                  <td style={{ fontWeight: 600, color: 'var(--text)', maxWidth: 200 }}>
                    <span style={{
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
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
                </tr>
              ))}
            </tbody>
          </table>


          {/* "View All" button – only if more than 3 courses exist */}
          
            <div style={{ marginTop: 24, textAlign: 'right' }}>
               <div className="card-footer">
              <button
                className="btn btn-outline"
                onClick={() => navigate('/instructor/courses')}
                style={{ fontSize: 12, padding: '8px 16px' }}
              >
                VIEW ALL COURSES →
              </button></div>
            </div>
          
        </>
      )}
    </div>
  );
}