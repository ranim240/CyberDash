import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LearnerLayout from '../../components/learner/LearnerLayout.jsx';
import coursesApi from '../../api/courses';
import { getProgress, updateProgress } from '../../api/learner.js';
import './CourseProgressPage.css';

const statusMap = {
  not_started: { label: 'Not started', className: 'course-progress__status--not_started' },
  in_progress: { label: 'In progress', className: 'course-progress__status--in_progress' },
  completed:   { label: 'Completed',   className: 'course-progress__status--completed' },
};

const completionSteps = [
  { key: 'not_started', label: 'Mark not started' },
  { key: 'in_progress', label: 'Mark in progress' },
  { key: 'completed',   label: 'Mark completed' },
];

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
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

export default function CourseProgressPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [courseRes, progressRes, contentsRes] = await Promise.all([
          coursesApi.getOne(courseId).then((res) => res.data?.data ?? res.data),
          getProgress(courseId).then((res) => res.data?.data ?? res.data),
          coursesApi.getContents(courseId).then((res) => (Array.isArray(res.data) ? res.data : res.data?.data ?? []) ),
        ]);

        const normalizedContents = Array.isArray(contentsRes)
          ? contentsRes.map((item) => ({
              ...item,
              is_published:
                item.is_published === undefined
                  ? true
                  : item.is_published === true || item.is_published === 'true',
            }))
          : [];

        if (!cancelled) {
          setCourse(courseRes);
          setProgress(progressRes);
          setContents(normalizedContents);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Unable to load course.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [courseId]);

  const handleUpdate = async (status) => {
    if (progress?.completion_status === status) {
      return;
    }
    setSaving(true);
    setMessage('');
    setError(null);

    try {
      await updateProgress(courseId, { completion_status: status });
      setProgress((current) => ({
        ...current,
        completion_status: status,
        updated_at: new Date().toISOString(),
      }));
      setMessage('Statut de progression mis à jour.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Impossible de mettre à jour la progression.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LearnerLayout>
        <main className="course-progress">
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>Loading course…</p>
        </main>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout>
      <main className="course-progress">
        <nav className="course-progress__breadcrumb">
          <Link to="/learner/dashboard">Dashboard</Link>
          <span>/</span>
          <Link to="/learner/courses">My Courses</Link>
          <span>/</span>
          <span>{course?.title || 'Course progress'}</span>
        </nav>

        {error && <div className="course-progress__error">{error}</div>}

        <div className="course-progress__main">
          <section className="course-progress__hero">
            <h1 className="course-progress__hero-title">{course?.title || 'Learner course'}</h1>
            <p className="course-progress__hero-copy">
              Track your progress on this course, view your enrollment status, and update your learning journey.
            </p>

            <div className="course-progress__stat-list">
              <div className="course-progress__stat">
                <span className="course-progress__stat-label">Status</span>
                <span className={`course-progress__status ${statusMap[progress?.completion_status]?.className || ''}`}>
                  {statusMap[progress?.completion_status]?.label || 'Unknown'}
                </span>
              </div>
              <div className="course-progress__stat">
                <span className="course-progress__stat-label">Enrolled on</span>
                <span className="course-progress__stat-value">{formatDate(progress?.enrolled_at)}</span>
              </div>
              <div className="course-progress__stat">
                <span className="course-progress__stat-label">Last updated</span>
                <span className="course-progress__stat-value">{formatDate(progress?.updated_at)}</span>
              </div>
            </div>

            {contents.length > 0 && (
              <div className="course-progress__lessons-section">
                <h2 className="course-progress__lessons-title">📚 Course Lessons ({contents.length})</h2>
                <div className="course-progress__lessons-list">
                  {contents.map((lesson, idx) => (
                    <LessonRow key={lesson.content_id} item={lesson} index={idx} enrolled={true} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="course-progress__panel">
            <div className="course-progress__panel-title">Progress Actions</div>
            <div className="course-progress__actions">
              {completionSteps.map((step) => (
                <button
                  key={step.key}
                  type="button"
                  disabled={saving || progress?.completion_status === step.key}
                  onClick={() => handleUpdate(step.key)}
                  className={`course-progress__button ${step.key === 'completed' ? 'course-progress__button--primary' : 'course-progress__button--secondary'}`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            {message && <p className="course-progress__message">{message}</p>}

            <button
              type="button"
              className="course-progress__button course-progress__button--secondary"
              onClick={() => navigate('/learner/courses')}
            >
              Back to courses
            </button>
          </aside>
        </div>
      </main>
    </LearnerLayout>
  );
}
