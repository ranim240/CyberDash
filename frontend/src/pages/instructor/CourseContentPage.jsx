import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Sidebar from '../../components/common/Sidebar';
import Topbar  from '../../components/common/Navbar';
import coursesApi from '../../api/courses';

// ── Mock fallback ─────────────────────────────────────────────────────
const MOCK_COURSES = {
  'c-001': { course_id: 'c-001', title: 'Web Application Security',       level: 'beginner',     description: 'Learn to identify and exploit common web vulnerabilities including XSS, CSRF, and SQL Injection.', estimated_duration: 180, is_published: true,  created_at: '2024-11-10T08:00:00Z' },
  'c-002': { course_id: 'c-002', title: 'Network Penetration Testing',    level: 'intermediate', description: 'Master the art of network recon, scanning, and exploitation using industry-standard tools.',        estimated_duration: 240, is_published: true,  created_at: '2024-12-01T10:30:00Z' },
  'c-003': { course_id: 'c-003', title: 'Reverse Engineering Fundamentals',level: 'advanced',    description: 'Dive into binary analysis, disassembly, and understanding compiled code.',                          estimated_duration: 320, is_published: false, created_at: '2025-01-15T14:00:00Z' },
};

const MOCK_CONTENTS = {
  'c-001': [
    { content_id: 'ct-001', title: 'Introduction to OWASP Top 10',     data: 'Overview of the most critical web application security risks as defined by OWASP. We cover each category with real-world examples and mitigation strategies.', is_published: true  },
    { content_id: 'ct-002', title: 'SQL Injection — Theory & Practice', data: 'Deep dive into SQL injection vulnerabilities. Covers error-based, blind, and time-based techniques. Includes hands-on lab with a vulnerable login form.',       is_published: true  },
    { content_id: 'ct-003', title: 'Cross-Site Scripting (XSS)',        data: 'Understanding reflected, stored, and DOM-based XSS. How to find, exploit, and remediate XSS vulnerabilities in modern web applications.',                       is_published: false },
  ],
  'c-002': [
    { content_id: 'ct-004', title: 'Recon & OSINT Techniques',          data: 'Passive and active reconnaissance. Tools: Maltego, Shodan, theHarvester. Building a target profile before active exploitation.',                                is_published: true  },
    { content_id: 'ct-005', title: 'Port Scanning with Nmap',           data: 'Comprehensive guide to Nmap scanning techniques. TCP SYN, UDP, version detection, OS fingerprinting and NSE scripts.',                                           is_published: true  },
  ],
  'c-003': [
    { content_id: 'ct-006', title: 'x86 Assembly Basics',              data: 'Introduction to x86 assembly language. Registers, memory addressing, stack operations, and common instruction patterns.',                                         is_published: true  },
    { content_id: 'ct-007', title: 'Using Ghidra for Static Analysis', data: 'Getting started with Ghidra. Navigating the UI, identifying functions, renaming variables, and exporting decompiled code.',                                      is_published: false },
  ],
};

// ── Styles ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: 4, color: 'var(--text)',
  fontFamily: 'var(--body)', fontSize: 14,
  outline: 'none', transition: 'border-color .2s',
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

// ── Helpers ────────────────────────────────────────────────────────────
const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

// ── Toggle switch ──────────────────────────────────────────────────────
function Toggle({ value, onChange, disabled }) {
  return (
    <div
      onClick={() => !disabled && onChange(!value)}
      style={{
        width: 36, height: 20, borderRadius: 10,
        background: value ? 'var(--accent3)' : 'var(--border)',
        position: 'relative', transition: 'background .2s',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1, flexShrink: 0,
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

// ── Confirm modal ──────────────────────────────────────────────────────
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
          <button className="btn btn-danger"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : '✕ Delete'}
          </button>
          <button className="btn btn-outline"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Content card ───────────────────────────────────────────────────────
function ContentCard({ item, index, courseId, onUpdate, onDelete }) {
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [draft, setDraft]         = useState({ title: item.title, data: item.data, is_published: item.is_published });
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const handleSave = async () => {
    if (!draft.title.trim()) return;
    setSaving(true);
    try {
      await coursesApi.updateContent(courseId, item.content_id, draft);
      onUpdate(item.content_id, draft);
      setEditing(false);
    } catch {
      onUpdate(item.content_id, draft);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft({ title: item.title, data: item.data, is_published: item.is_published });
    setEditing(false);
  };

  const handleTogglePublish = async () => {
    const updated = { ...draft, is_published: !draft.is_published };
    setDraft(updated);
    try {
      await coursesApi.updateContent(courseId, item.content_id, updated);
      onUpdate(item.content_id, updated);
    } catch {
      onUpdate(item.content_id, updated);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await coursesApi.removeContent(courseId, item.content_id);
      onDelete(item.content_id);
    } catch {
      onDelete(item.content_id);
    } finally {
      setDeleting(false);
      setConfirmDel(false);
    }
  };

  return (
    <>
      {confirmDel && (
        <ConfirmModal
          title="Delete Lesson"
          message={`Are you sure you want to delete "${item.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDel(false)}
          loading={deleting}
        />
      )}

      <div style={{
        background: 'var(--bg3)',
        border: `1px solid ${editing ? 'var(--border2)' : 'var(--border)'}`,
        borderRadius: 6, padding: 20,
        transition: 'border-color .2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: editing ? 16 : 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 4,
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)',
              flexShrink: 0,
            }}>
              {String(index + 1).padStart(2, '0')}
            </div>

            {editing ? (
              <input
                style={{ ...inputStyle, width: 280, padding: '6px 12px' }}
                value={draft.title}
                onChange={(e) => setDraft(p => ({ ...p, title: e.target.value }))}
                autoFocus
              />
            ) : (
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>
                {item.title}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>
                {draft.is_published ? 'LIVE' : 'DRAFT'}
              </span>
              <Toggle value={draft.is_published} onChange={handleTogglePublish} disabled={editing} />
            </div>

            {editing ? (
              <>
                <button className="act-btn act-pub" onClick={handleSave} disabled={saving}
                  style={{ fontSize: 11 }}>
                  {saving ? '...' : '✓ Save'}
                </button>
                <button className="act-btn act-edit" onClick={handleCancel}
                  style={{ fontSize: 11, borderColor: 'var(--muted)', color: 'var(--muted)' }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className="act-btn act-edit" onClick={() => setEditing(true)}
                  style={{ fontSize: 11 }}>
                  Edit
                </button>
                <button className="act-btn act-del" onClick={() => setConfirmDel(true)}
                  style={{ fontSize: 11 }}>
                  ✕
                </button>
              </>
            )}
          </div>
        </div>

        {editing ? (
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: 'vertical', marginTop: 4 }}
            value={draft.data}
            placeholder="Lesson content..."
            onChange={(e) => setDraft(p => ({ ...p, data: e.target.value }))}
          />
        ) : (
          <p style={{
            fontSize: 13, color: 'var(--muted2)', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {item.data || <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No content yet.</span>}
          </p>
        )}
      </div>
    </>
  );
}

// ── Add content form ───────────────────────────────────────────────────
function AddContentForm({ courseId, onAdd, onCancel }) {
  const [form, setForm]       = useState({ title: '', data: '', is_published: false });
  const [saving, setSaving]   = useState(false);

  const handleAdd = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const res = await coursesApi.addContent(courseId, form);
      const newItem = res.data?.data ?? res.data;
      onAdd(newItem);
    } catch (err) {
      console.error('Failed to add content', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg3)',
      border: '1px dashed var(--border2)',
      borderRadius: 6, padding: 20,
    }}>
      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Title *</label>
        <input style={inputStyle} placeholder="Lesson title..."
          value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Content</label>
        <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
          placeholder="Lesson content..."
          value={form.data} onChange={(e) => setForm(p => ({ ...p, data: e.target.value }))} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <Toggle value={form.is_published} onChange={(v) => setForm(p => ({ ...p, is_published: v }))} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>
            {form.is_published ? 'PUBLISH IMMEDIATELY' : 'SAVE AS DRAFT'}
          </span>
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="act-btn" onClick={onCancel}
            style={{ borderColor: 'var(--muted)', color: 'var(--muted)', fontSize: 11 }}>
            Cancel
          </button>
          <button className="act-btn act-pub" onClick={handleAdd} disabled={saving || !form.title.trim()}
            style={{ fontSize: 11 }}>
            {saving ? 'Adding...' : '+ Add Lesson'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page (left card fine‑tuned) ─────────────────────────────────
export default function CourseContentPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [course, setCourse]       = useState(null);
  const [contents, setContents]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm]       = useState({});
  const [savingInfo, setSavingInfo]   = useState(false);
  const [infoSaved, setInfoSaved]     = useState(false);

  const [addingContent, setAddingContent] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);

  useEffect(() => {
    Promise.all([coursesApi.getOne(id), coursesApi.getContents(id)])
      .then(([courseRes, contentsRes]) => {
        const c = courseRes.data?.data ?? courseRes.data;
        const ct = Array.isArray(contentsRes.data) ? contentsRes.data : contentsRes.data?.data ?? [];
        setCourse(c);
        setInfoForm({ title: c.title, description: c.description ?? '', estimated_duration: c.estimated_duration ?? '', level: c.level ?? 'beginner' });
        setContents(ct);
      })
      .catch(() => {
        const mockCourse   = MOCK_COURSES[id] ?? MOCK_COURSES['c-001'];
        const mockContents = MOCK_CONTENTS[id] ?? MOCK_CONTENTS['c-001'];
        setCourse(mockCourse);
        setInfoForm({ title: mockCourse.title, description: mockCourse.description ?? '', estimated_duration: mockCourse.estimated_duration ?? '', level: mockCourse.level ?? 'beginner' });
        setContents(mockContents);
        setUsingMock(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveInfo = async () => {
    setSavingInfo(true);
    try {
      await coursesApi.update(id, {
        title:              infoForm.title,
        description:        infoForm.description,
        estimated_duration: infoForm.estimated_duration ? Number(infoForm.estimated_duration) : null,
        level:              infoForm.level,
      });
      setCourse(p => ({ ...p, ...infoForm }));
      setEditingInfo(false);
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 2000);
    } catch {
      setCourse(p => ({ ...p, ...infoForm }));
      setEditingInfo(false);
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 2000);
    } finally {
      setSavingInfo(false);
    }
  };

  const handleTogglePublish = async () => {
    setTogglingPublish(true);
    try {
      await coursesApi.togglePublish(id);
      setCourse(p => ({ ...p, is_published: !p.is_published }));
    } catch {
      setCourse(p => ({ ...p, is_published: !p.is_published }));
    } finally {
      setTogglingPublish(false);
    }
  };

  const handleContentUpdate = (contentId, updated) =>
    setContents(p => p.map(c => c.content_id === contentId ? { ...c, ...updated } : c));

  const handleContentDelete = (contentId) =>
    setContents(p => p.filter(c => c.content_id !== contentId));

  const handleContentAdd = (newItem) => {
    setContents(p => [...p, newItem]);
    setAddingContent(false);
  };

  if (loading) return (
    <div className="layout">
      <Sidebar />
      <div className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>LOADING...</p>
      </div>
    </div>
  );

  const levelStyle = LEVEL_COLOR[course?.level] ?? LEVEL_COLOR.beginner;
  const published  = contents.filter(c => c.is_published).length;
  const drafts     = contents.length - published;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />

        {/* Header */}
        <div className="topbar" style={{ marginBottom: 28 }}>
          <div>
            <div className="page-title" style={{ fontSize: 20 }}>{course?.title}</div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" onClick={() => navigate('/instructor/courses')}>← Back</button>
            <button
              className={`btn ${course?.is_published ? 'btn-danger' : 'btn-teal'}`}
              onClick={handleTogglePublish}
              disabled={togglingPublish}
            >
              {togglingPublish ? '...' : course?.is_published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        {usingMock && (
          <div style={{
            padding: '8px 14px', marginBottom: 20,
            background: 'rgba(245,158,11,0.07)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 4, fontFamily: 'var(--mono)',
            fontSize: 11, color: 'var(--amber)', letterSpacing: 1,
          }}>
            ⚠ MOCK DATA — API unavailable or returned no results
          </div>
        )}

        {/* Two‑column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 28, alignItems: 'start' }}>

          {/* LEFT COLUMN – redesigned course info card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{
                padding: '20px 24px 0 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div className="card-title">Course Details</div>
                {!editingInfo ? (
                  <button className="act-btn act-edit" style={{ fontSize: 11, padding: '4px 10px' }}
                    onClick={() => setEditingInfo(true)}>
                    Edit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="act-btn act-pub" style={{ fontSize: 11, padding: '4px 10px' }}
                      onClick={handleSaveInfo} disabled={savingInfo}>
                      {savingInfo ? '...' : '✓'}
                    </button>
                    <button className="act-btn" style={{ fontSize: 11, borderColor: 'var(--muted)', color: 'var(--muted)', padding: '4px 10px' }}
                      onClick={() => { setEditingInfo(false); setInfoForm({ title: course.title, description: course.description ?? '', estimated_duration: course.estimated_duration ?? '', level: course.level ?? 'beginner' }); }}>
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Saved message */}
              {infoSaved && (
                <div style={{
                  margin: '12px 24px 0 24px',
                  padding: '6px 12px',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 4, fontFamily: 'var(--mono)',
                  fontSize: 10, color: 'var(--accent3)', letterSpacing: 1,
                }}>
                  ✓ SAVED
                </div>
              )}

              {/* Content – either editing form or read‑only */}
              <div style={{ padding: '20px 24px 24px 24px' }}>
                {editingInfo ? (
                  /* Edit mode – unchanged */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Title *</label>
                      <input style={inputStyle} value={infoForm.title}
                        onChange={(e) => setInfoForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Description</label>
                      <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
                        value={infoForm.description}
                        onChange={(e) => setInfoForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Duration (min)</label>
                        <input style={inputStyle} type="number" min="0"
                          value={infoForm.estimated_duration}
                          onChange={(e) => setInfoForm(p => ({ ...p, estimated_duration: e.target.value }))} />
                      </div>
                      <div>
                        <label style={labelStyle}>Level</label>
                        <select style={{ ...inputStyle, cursor: 'pointer' }}
                          value={infoForm.level}
                          onChange={(e) => setInfoForm(p => ({ ...p, level: e.target.value }))}>
                          {LEVELS.map(l => (
                            <option key={l} value={l} style={{ background: 'var(--bg2)' }}>
                              {l.charAt(0).toUpperCase() + l.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Read‑only display – with requested alignment */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Title */}
                    <div>
                      <div style={labelStyle}>Title</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{course?.title}</div>
                    </div>

                    {/* Description */}
                    <div>
                      <div style={labelStyle}>Description</div>
                      <div style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.5 }}>
                        {course?.description || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No description</span>}
                      </div>
                    </div>

                    {/* Level & Duration – middle aligned with label */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={labelStyle}>Level & Duration</div>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <span style={{
                          fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 10px',
                          borderRadius: 20, border: `1px solid ${levelStyle.border}`,
                          background: levelStyle.bg, color: levelStyle.color,
                        }}>
                          {course?.level?.toUpperCase() ?? '—'}
                        </span>
                        {course?.estimated_duration && (
                          <span style={{
                            fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 10px',
                            borderRadius: 20, border: '1px solid var(--border)',
                            background: 'var(--bg3)', color: 'var(--muted2)',
                          }}>
                            ⏱ {course.estimated_duration} min
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status and Created – same baseline */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
                      <div>
                        <div style={labelStyle}>Status</div>
                        <span className={`status-badge ${course?.is_published ? 'status-pub' : 'status-draft'}`}>
                          {course?.is_published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </div>
                      <div>
                        <div style={labelStyle}>Created</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted2)' }}>
                          {formatDate(course?.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats card */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 20 }}>Content Stats</div>
              {[
                { label: 'Total Lessons', value: contents.length, color: 'var(--accent)'  },
                { label: 'Published',     value: published,        color: 'var(--accent3)' },
                { label: 'Drafts',        value: drafts,           color: 'var(--amber)'  },
              ].map((s) => (
                <div key={s.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
                    {s.label.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--heading)', fontSize: 22, fontWeight: 700, color: s.color }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN – Lessons management (unchanged) */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 20 }}>
              <div className="card-title">Lessons</div>
              {!addingContent && (
                <button className="btn btn-teal" style={{ padding: '8px 18px', fontSize: 11 }}
                  onClick={() => setAddingContent(true)}>
                  + Add Lesson
                </button>
              )}
            </div>

            {addingContent && (
              <AddContentForm
                courseId={id}
                onAdd={handleContentAdd}
                onCancel={() => setAddingContent(false)}
              />
            )}

            {contents.length === 0 && !addingContent && (
              <div style={{
                padding: '48px 0', textAlign: 'center',
                border: '1px dashed var(--border)', borderRadius: 6,
              }}>
                <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: 1, marginBottom: 16 }}>
                  NO LESSONS YET
                </p>
                <button className="btn btn-outline" style={{ fontSize: 11 }}
                  onClick={() => setAddingContent(true)}>
                  + Add First Lesson
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contents.map((item, index) => (
                <ContentCard
                  key={item.content_id}
                  item={item}
                  index={index}
                  courseId={id}
                  onUpdate={handleContentUpdate}
                  onDelete={handleContentDelete}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}