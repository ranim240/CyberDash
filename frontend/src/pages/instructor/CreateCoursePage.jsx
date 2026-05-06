import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Topbar from './instructorTopBar';
import Navbar from '../../components/common/Navbar';
import coursesApi from '../../api/courses';

// ── Shared styles (exactly as in CourseContentPage) ─────────────────
const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: 4, color: 'var(--text)',
  fontFamily: 'var(--body)', fontSize: 14,
  outline: 'none', transition: 'border-color .2s',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--mono)', fontSize: 10,
  color: 'var(--muted)', letterSpacing: 2,
  textTransform: 'uppercase', marginBottom: 6,
};

const LEVELS = ['beginner', 'intermediate', 'advanced'];

const LEVEL_COLOR = {
  beginner:     { color: 'var(--accent3)', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)'  },
  intermediate: { color: 'var(--amber)',   bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)'  },
  advanced:     { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)'   },
};

// ── Toggle (same as CourseContentPage) ─────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 36, height: 20, borderRadius: 10,
        background: value ? 'var(--accent3)' : 'var(--border)',
        position: 'relative', transition: 'background .2s',
        cursor: 'pointer', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute', top: 3,
        left: value ? 18 : 3,
        width: 14, height: 14, borderRadius: '50%',
        background: 'white', transition: 'left .2s',
      }} />
    </div>
  );
}

// ── Field wrapper with error handling ─────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && (
        <div style={{
          marginTop: 5, fontFamily: 'var(--mono)',
          fontSize: 10, color: 'var(--danger)', letterSpacing: 1,
        }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}

// ── Main Page (identical layout to CourseContentPage) ─────────────
export default function CreateCoursePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    estimated_duration: '',
    level: 'beginner',
    is_published: false,
  });

  const [errors, setErrors]   = useState({});
  const [saving, setSaving]   = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim())               errs.title = 'Title is required';
    if (form.title.trim().length > 120)   errs.title = 'Title must be under 120 characters';
    if (form.estimated_duration && (isNaN(Number(form.estimated_duration)) || Number(form.estimated_duration) < 1))
      errs.estimated_duration = 'Must be a positive number';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    setApiError('');

    const payload = {
      title:              form.title.trim(),
      description:        form.description.trim() || null,
      estimated_duration: form.estimated_duration ? Number(form.estimated_duration) : null,
      level:              form.level,
    };

    try {
      const res  = await coursesApi.create(payload);
      const course = res.data?.data ?? res.data;

      if (form.is_published && course?.course_id) {
        await coursesApi.togglePublish(course.course_id);
      }

      navigate(`/instructor/courses/${course.course_id}`);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Failed to create course. Please try again.';
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  const levelStyle = LEVEL_COLOR[form.level];
  const charCount  = form.title.length;
  const charWarn   = charCount > 100;

  return (
    <>
    <Navbar />
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />

        {/* ── Header (exactly like CourseContentPage) ── */}
        <div className="topbar" style={{ marginBottom: 28 }}>
          <div>
            <div className="page-title" style={{ fontSize: 20 }}>Create New Course</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" onClick={() => navigate('/instructor/courses')}>
              ← Back
            </button>
            <button
              className="btn btn-teal"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Creating...' : '✓ Create Course'}
            </button>
          </div>
        </div>

        {/* API error banner */}
        {apiError && (
          <div style={{
            padding: '8px 14px', marginBottom: 20,
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 4, fontFamily: 'var(--mono)',
            fontSize: 11, color: 'var(--danger)', letterSpacing: 1,
          }}>
            ✕ {apiError}
          </div>
        )}

        {/* ── Two‑column layout (identical dimensions) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 28, alignItems: 'start' }}>

          {/* LEFT COLUMN – Course information + Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Course Details card (editable, mirrors the read‑only card in content page) */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 0 24px' }}>
                <div className="card-title">Course Details</div>
              </div>
              <div style={{ padding: '20px 24px 24px 24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Title */}
                  <Field label="Title" required error={errors.title}>
                    <input
                      style={{
                        ...inputStyle,
                        borderColor: errors.title ? 'var(--danger)' : undefined,
                        fontSize: 16,
                      }}
                      placeholder="e.g. Web Application Security"
                      value={form.title}
                      onChange={set('title')}
                      maxLength={120}
                      autoFocus
                    />
                    <div style={{
                      marginTop: 5, textAlign: 'right',
                      fontFamily: 'var(--mono)', fontSize: 10,
                      color: charWarn ? 'var(--amber)' : 'var(--muted)',
                    }}>
                      {charCount} / 120
                    </div>
                  </Field>

                  {/* Description */}
                  <Field label="Description">
                    <textarea
                      style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }}
                      placeholder="What will learners gain from this course?"
                      value={form.description}
                      onChange={set('description')}
                    />
                  </Field>

                  {/* Level + Duration (two‑column grid like content page's status/created) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Field label="Level">
                      <select
                        style={{ ...inputStyle, cursor: 'pointer' }}
                        value={form.level}
                        onChange={set('level')}
                      >
                        {LEVELS.map((l) => (
                          <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                        ))}
                      </select>
                      <div style={{ marginTop: 8 }}>
                        <span style={{
                          fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 10px',
                          borderRadius: 20, border: `1px solid ${levelStyle.border}`,
                          background: levelStyle.bg, color: levelStyle.color,
                        }}>
                          {form.level.toUpperCase()}
                        </span>
                      </div>
                    </Field>

                    <Field label="Duration (min)" error={errors.estimated_duration}>
                      <input
                        style={{
                          ...inputStyle,
                          borderColor: errors.estimated_duration ? 'var(--danger)' : undefined,
                        }}
                        type="number"
                        min="1"
                        placeholder="e.g. 120"
                        value={form.estimated_duration}
                        onChange={set('estimated_duration')}
                      />
                    </Field>
                  </div>

                  {/* Visibility (similar to status in content page) */}
                  <div>
                    <label style={labelStyle}>Visibility</label>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>
                          {form.is_published ? 'Published' : 'Draft'}
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>
                          {form.is_published ? 'VISIBLE TO LEARNERS' : 'ONLY YOU CAN SEE THIS'}
                        </div>
                      </div>
                      <Toggle
                        value={form.is_published}
                        onChange={(v) => setForm((p) => ({ ...p, is_published: v }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips card (replaces Stats card from content page) */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 14, color: 'var(--accent)' }}>
                💡 Tips
              </div>
              {[
                'Add lessons after creating the course.',
                'Keep the title clear and searchable.',
                'Save as draft until content is ready.',
              ].map((tip) => (
                <div key={tip} style={{
                  display: 'flex', gap: 8, marginBottom: 10,
                  fontSize: 12, color: 'var(--muted2)', lineHeight: 1.5,
                }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN – Course Content (empty state, mimics the Lessons card) */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 0 24px' }}>
              <div className="card-title">Course Content</div>
            </div>
            <div style={{ padding: '20px 24px 24px 24px' }}>
              <div style={{
                padding: '48px 20px', textAlign: 'center',
                border: '1px dashed var(--border)', borderRadius: 6,
              }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: 1, marginBottom: 16 }}>
                  No lessons yet
                </p>
                <p style={{ fontSize: 12, color: 'var(--muted2)' }}>
                  Lessons can be added after the course is created.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
}