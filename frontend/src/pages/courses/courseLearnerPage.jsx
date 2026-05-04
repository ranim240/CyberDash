import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar       from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import coursesApi    from '../../api/courses';
import enrollmentApi from '../../api/enrollment';

const MOCK_COURSES = {
  'c-001': {
    course_id: 'c-001', title: 'Web Application Security', level: 'beginner',
    description: 'Learn to identify and exploit common web vulnerabilities including XSS, CSRF, and SQL Injection. This course walks you through the OWASP Top 10 with hands-on labs and real-world scenarios.',
    estimated_duration: 180, is_published: true, created_at: '2024-11-10T08:00:00Z',
  },
};
const MOCK_CONTENTS = {
  'c-001': [
    { content_id: 'ct-001', title: 'Introduction to OWASP Top 10',     data: 'The OWASP Top 10 is a standard awareness document for developers and web application security. It represents a broad consensus about the most critical security risks to web applications. This lesson covers each of the top 10 vulnerabilities with examples.', is_published: true  },
    { content_id: 'ct-002', title: 'SQL Injection — Theory & Practice', data: 'SQL injection occurs when an attacker inserts malicious SQL code into a query. We will practice using a vulnerable login form and then learn parameterised queries to prevent it.', is_published: true  },
    { content_id: 'ct-003', title: 'Cross-Site Scripting (XSS)',        data: 'XSS allows attackers to inject client-side scripts into web pages viewed by other users. We will explore reflected, stored, and DOM-based XSS.', is_published: true  },
    { content_id: 'ct-004', title: 'CSRF & Broken Authentication',      data: 'Cross-Site Request Forgery tricks a user into executing unwanted actions. Broken authentication includes weak session management. We will demonstrate CSRF tokens and secure session handling.', is_published: true  },
    { content_id: 'ct-005', title: 'Security Misconfiguration',         data: 'Security misconfiguration can happen at any level of an application stack. This lesson shows how to harden headers, remove default credentials, and avoid directory listing.', is_published: false },
  ],
};

const LEVEL_COLOR = {
  beginner:     { color: 'var(--accent3)', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)' },
  intermediate: { color: 'var(--amber)',   bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' },
  advanced:     { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)'  },
};

const formatDuration = (min) => {
  if (!min) return null;
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60), m = min % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
};

// ── Lesson row with inline expansion ──────────────────────────────────
function LessonRow({ item, index, enrolled, courseId }) {
  const [expanded, setExpanded] = useState(false);
  const isLocked = !enrolled;
  const canOpen = enrolled && item.is_published;

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
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          cursor: canOpen ? 'pointer' : 'default',
          transition: 'border-color .15s',
          opacity: (!item.is_published && enrolled) ? 0.5 : 1,
        }}
        onMouseEnter={e => { if (canOpen) e.currentTarget.style.borderColor = 'var(--border2)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 6, flexShrink: 0,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--mono)', fontSize: 11,
          color: enrolled ? 'var(--accent)' : 'var(--muted)',
        }}>
          {isLocked ? '🔒' : String(index + 1).padStart(2, '0')}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: isLocked ? 'var(--muted)' : 'var(--text)' }}>
            {item.title}
          </div>
          {isLocked && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1, marginTop: 3 }}>
              ENROLL TO UNLOCK
            </div>
          )}
          {!item.is_published && enrolled && (
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: 1, marginTop: 3 }}>
              COMING SOON
            </div>
          )}
        </div>

        {canOpen && (
          <span style={{ color: 'var(--muted)', fontSize: 14, transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>
            ▶
          </span>
        )}
      </div>

      {/* Expanded content */}
      {expanded && canOpen && (
        <div style={{
          marginTop: 6, marginBottom: 12, marginLeft: 46, // indent to align with title
          padding: '16px 20px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          color: 'var(--muted2)',
          fontSize: 14, lineHeight: 1.6,
        }}>
          {item.data || <span style={{ fontStyle: 'italic' }}>No detailed content yet.</span>}
        </div>
      )}
    </div>
  );
}

export default function CourseLearnerPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const user       = JSON.parse(localStorage.getItem('user') ?? 'null');
  const isLoggedIn = !!localStorage.getItem('token');
  const role       = user?.role ?? null;

  const [course, setCourse]       = useState(null);
  const [contents, setContents]   = useState([]);
  const [enrolled, setEnrolled]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [usingMock, setUsingMock] = useState(false);

  useEffect(() => {
    const loadCourse = coursesApi.getOne(courseId)
      .then(res => res.data?.data ?? res.data)
      .catch(() => { setUsingMock(true); return MOCK_COURSES[courseId] ?? MOCK_COURSES['c-001']; });

    const loadContents = coursesApi.getContents
      ? coursesApi.getContents(courseId)
          .then(r => Array.isArray(r.data) ? r.data : r.data?.data ?? [])
          .catch(() => MOCK_CONTENTS[courseId] ?? [])
      : Promise.resolve(MOCK_CONTENTS[courseId] ?? []);

    const loadEnrollment = (isLoggedIn && role === 'learner')
      ? enrollmentApi.getMyEnrollments()
          .then(res => {
            const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
            return data.some(e => e.course_id === courseId);
          })
          .catch(() => false)
      : Promise.resolve(false);

    Promise.all([loadCourse, loadContents, loadEnrollment])
      .then(([c, ct, isEnrolled]) => {
        setCourse(c);
        const normalized = ct.map(item => ({
          ...item,
          is_published: item.is_published !== undefined ? item.is_published : true,
        }));
        setContents(normalized);
        setEnrolled(isEnrolled);
      })
      .finally(() => setLoading(false));
  }, [courseId, isLoggedIn, role]);

  const handleEnroll = async () => {
    if (!isLoggedIn) { navigate('/login', { state: { from: `/courses/${courseId}` } }); return; }
    if (role !== 'learner') return;
    setEnrolling(true);
    try {
      await enrollmentApi.enroll(courseId);
      setEnrolled(true);
    } catch (err) {
      if (err?.response?.status === 409) setEnrolled(true);
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    try { await enrollmentApi.unenroll(courseId); setEnrolled(false); } catch {;}
  };

  if (loading) return (
    <div className="layout"><Sidebar />
      <div className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>LOADING...</p>
      </div>
    </div>
  );

  const levelStyle = LEVEL_COLOR[course?.level] ?? LEVEL_COLOR.beginner;
  const publishedCount = contents.filter(c => c.is_published === true).length;

  return (
    <>
    <Navbar />
    <div className="layout">
      <Sidebar />
      <div className="main">
        

        <div className="topbar" style={{ marginBottom: 20 }}>
          <div>
            <div className="page-title" style={{ fontSize: 20, cursor: 'pointer' }} onClick={() => navigate('/courses')}>
              Courses
            </div>
          </div>
        </div>

        {usingMock && (
          <div style={{ padding: '8px 14px', marginBottom: 20, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--amber)', letterSpacing: 1 }}>
            ⚠ MOCK DATA — API unavailable
          </div>
        )}

        {!enrolled ? (
          // Not enrolled: preview mode (locked lessons, no expansion)
          <>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 28 }}>
              <div style={{ height: 4, background: levelStyle.color }} />
              <div style={{ padding: '32px 36px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 10px', borderRadius: 20, border: `1px solid ${levelStyle.border}`, background: levelStyle.bg, color: levelStyle.color }}>
                    {course?.level?.toUpperCase()}
                  </span>
                  {course?.estimated_duration && (
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--muted2)' }}>
                      ⏱ {formatDuration(course.estimated_duration)}
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--muted2)' }}>
                    📚 {publishedCount} lesson{publishedCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', lineHeight: 1.25, margin: '0 0 14px 0' }}>
                  {course?.title}
                </h1>
                <p style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.7, maxWidth: 700, margin: '0 auto' }}>
                  {course?.description || 'No description available.'}
                </p>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '36px 40px', background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8 }}>
              <div style={{ maxWidth: 500, margin: '0 auto' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: 2, marginBottom: 10 }}>🔒 CONTENT LOCKED</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  {!isLoggedIn ? 'Join to access this course' : 'Enroll to unlock all lessons'}
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.6, marginBottom: 24 }}>
                  {!isLoggedIn
                    ? 'Create a free account or log in to enroll and start learning.'
                    : role === 'learner'
                    ? 'Enroll now to unlock all lessons and track your progress.'
                    : 'Course content is available to enrolled learners only.'}
                </p>
                {!isLoggedIn ? (
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button className="btn btn-teal" onClick={() => navigate('/login', { state: { from: `/courses/${courseId}` } })}>Login to Enroll</button>
                    <button className="btn btn-outline" onClick={() => navigate('/register')}>Sign Up</button>
                  </div>
                ) : role === 'learner' ? (
                  <button className="btn btn-teal" disabled={enrolling} onClick={handleEnroll}>
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                ) : null}
              </div>
            </div>

            {/* Blurred preview */}
            <div style={{ position: 'relative', marginTop: 28 }}>
              <div className="card-title" style={{ fontSize: 15, marginBottom: 14 }}>Course Content Preview</div>
              <div style={{ filter: 'blur(2px)', pointerEvents: 'none', userSelect: 'none' }}>
                {contents.map((item, idx) => (
                  <LessonRow key={item.content_id} item={item} index={idx} enrolled={false} courseId={courseId} />
                ))}
              </div>
            </div>
          </>
        ) : (
          // Enrolled: full lesson list with inline expansion
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{course?.title}</h1>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 10px', borderRadius: 20, border: `1px solid ${levelStyle.border}`, background: levelStyle.bg, color: levelStyle.color }}>
                  {course?.level?.toUpperCase()}
                </span>
                {course?.estimated_duration && (
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--muted2)' }}>
                    ⏱ {formatDuration(course.estimated_duration)}
                  </span>
                )}
                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 10px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--muted2)' }}>
                  📚 {publishedCount} lesson{publishedCount !== 1 ? 's' : ''}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted2)', margin: 0 }}>{course?.description}</p>
            </div>

            <div>
              <div className="card-title" style={{ fontSize: 15, marginBottom: 14 }}>Course Content</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {contents.map((item, idx) => (
                  <LessonRow key={item.content_id} item={item} index={idx} enrolled={true} courseId={courseId} />
                ))}
              </div>
              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}
                  onClick={handleUnenroll}>
                  Unenroll from this course
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div></>
  );
}