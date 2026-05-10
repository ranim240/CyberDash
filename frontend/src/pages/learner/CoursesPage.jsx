import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LearnerLayout from '../../components/learner/LearnerLayout.jsx';
import { getEnrollments } from '../../api/learner.js';
import coursesApi from '../../api/courses.js';
import './CoursesPage.css';

const statusLabel = {
  not_started: 'Not started',
  in_progress: 'In progress',
  completed: 'Completed',
};

// ── Lesson row component ────────────────────────────────────────────
function LessonRow({ item, index, enrolled }) {
  const [expanded, setExpanded] = useState(false);
  const isLocked = !enrolled;
  const isPublished = item.is_published !== false;
  const canOpen = enrolled && isPublished;

  const handleClick = () => {
    if (canOpen) {
      setExpanded(!expanded);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 18px',
          background: 'var(--bg-raised)',
          border: '1px solid rgba(0, 212, 255, 0.12)',
          borderRadius: 6,
          cursor: canOpen ? 'pointer' : 'default',
          transition: 'border-color .15s',
          opacity: (!isPublished && enrolled) ? 0.5 : 1,
        }}
        onMouseEnter={e => { if (canOpen) e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.22)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.12)'; }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 6, flexShrink: 0,
          background: 'var(--bg-surface)', border: '1px solid rgba(0, 212, 255, 0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: enrolled ? 'var(--neon-cyan)' : 'var(--text-muted)',
        }}>
          {isLocked ? '🔒' : String(index + 1).padStart(2, '0')}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: isLocked ? 'var(--text-muted)' : 'var(--text-primary)' }}>
            {item.title}
          </div>
          {isLocked && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1, marginTop: 3 }}>
              ENROLL TO UNLOCK
            </div>
          )}
          {isPublished === false && enrolled && (
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--neon-amber)', letterSpacing: 1, marginTop: 3 }}>
              COMING SOON
            </div>
          )}
        </div>

        {canOpen && (
          <span style={{ color: 'var(--text-muted)', fontSize: 14, transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>
            ▶
          </span>
        )}
      </div>

      {/* Expanded content */}
      {expanded && canOpen && (
        <div style={{
          marginTop: 6, marginBottom: 12, marginLeft: 46,
          padding: '16px 20px',
          background: 'var(--bg-surface)',
          border: '1px solid rgba(0, 212, 255, 0.12)',
          borderRadius: 6,
          color: 'var(--text-secondary)',
          fontSize: 14, lineHeight: 1.6,
        }}>
          {item.data || <span style={{ fontStyle: 'italic' }}>No detailed content yet.</span>}
        </div>
      )}
    </div>
  );
}

// ── Course detail card with lessons ─────────────────────────────────
function CourseDetailCard({ enrollment, contents, enrolled }) {
  const [expanded, setExpanded] = useState(false);

  const lessons = contents || [];
  const publishedLessons = lessons.filter((l) => l.is_published !== false).length;

  return (
    <div className="courses-page__detail-card">
      <div className="courses-page__detail-header">
        <div>
          <h2 className="courses-page__detail-title">{enrollment.title}</h2>
          <p className="courses-page__detail-copy">{enrollment.description}</p>
        </div>
        <div className="courses-page__detail-meta">
          <span className="courses-page__tag">{statusLabel[enrollment.completion_status] ?? 'Unknown'}</span>
          <span className={`courses-page__status courses-page__status--${enrollment.completion_status}`}>
            {statusLabel[enrollment.completion_status] ?? 'Unknown'}
          </span>
          {publishedLessons > 0 && (
            <span className="courses-page__tag" style={{ color: 'var(--neon-cyan)', background: 'rgba(0, 212, 255, 0.08)' }}>
              📚 {publishedLessons} lesson{publishedLessons !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {lessons.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="courses-page__lessons-toggle"
          >
            <span style={{ fontSize: 12, transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>▶</span>
            {expanded ? 'Hide lessons' : 'Show lessons'} ({lessons.length})
          </button>

          {expanded && (
            <div className="courses-page__lessons-list">
              {lessons.map((lesson, idx) => (
                <LessonRow key={lesson.content_id} item={lesson} index={idx} enrolled={enrolled} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="courses-page__detail-actions">
        <Link to={`/learner/courses/${enrollment.course_id}/progress`} className="btn btn-outline">
          View progress
        </Link>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [courseContents, setCourseContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Fetch enrollments
        const enrollRes = await getEnrollments();
        const enrollData = Array.isArray(enrollRes.data) ? enrollRes.data : enrollRes.data?.data ?? [];

        if (!cancelled) {
          setEnrollments(enrollData);

          // Fetch contents for each course
          const contentMap = {};
          await Promise.all(
            enrollData.map(async (enrollment) => {
              try {
                const contentRes = await coursesApi.getContents(enrollment.course_id);
                const contents = Array.isArray(contentRes.data) ? contentRes.data : contentRes.data?.data ?? [];
                const normalizedContents = contents.map((item) => ({
                  ...item,
                  is_published:
                    item.is_published === undefined
                      ? true
                      : item.is_published === true || item.is_published === 'true',
                }));
                contentMap[enrollment.course_id] = normalizedContents;
              } catch (err) {
                contentMap[enrollment.course_id] = [];
              }
            })
          );

          if (!cancelled) {
            setCourseContents(contentMap);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Unable to load courses.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <LearnerLayout>
      <main className="courses-page">
        <header className="courses-page__header">
          <div>
            <h1 className="courses-page__title">My Courses</h1>
            <p className="courses-page__sub">Track your training, view your status, and access your progression.</p>
          </div>
          <button onClick={() => navigate('/learner/browse')} className="btn btn-teal" style={{ alignSelf: 'center' }}>
            Browse Challenges
          </button>
        </header>

        {loading && (
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
            Loading courses…
          </p>
        )}

        {error && <div className="courses-page__empty">{error}</div>}

        {!loading && !error && enrollments.length === 0 && (
          <div className="courses-page__empty">
            <h2>No courses found</h2>
            <p>You are not enrolled in any courses yet. Explore challenges and enroll in a training course.</p>
            <button onClick={() => navigate('/learner/browse')} className="btn btn-purple" style={{ marginTop: '1rem' }}>
              Browse Challenges
            </button>
          </div>
        )}

        {!loading && !error && enrollments.length > 0 && (
          <div className="courses-page__detail-grid">
            {enrollments.map((enrollment) => (
              <CourseDetailCard
                key={enrollment.course_id}
                enrollment={enrollment}
                contents={courseContents[enrollment.course_id] || []}
                enrolled={true}
              />
            ))}
          </div>
        )}
      </main>
    </LearnerLayout>
  );
}
