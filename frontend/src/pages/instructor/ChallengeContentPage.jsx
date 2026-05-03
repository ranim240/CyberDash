import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Topbar  from '../../components/common/Navbar';
import challengesApi from '../../api/challenges';

// ── Mock fallback ──────────────────────────────────────────────────────
const MOCK_CHALLENGES = {
  'ch-001': {
    challenge_id: 'ch-001', title: 'Cookie Monster',
    description: 'A web challenge where you must steal a session cookie from a vulnerable endpoint. Inspect the HTTP headers, find the flag hidden in the cookie jar.',
    difficulty: 'easy', points: 100, status: 'active', flag: 'CTF{c00k13_m0nst3r}',
    category_id: 'web', created_at: '2025-01-10T08:00:00Z', instructor_id: 'inst-001',
  },
  'ch-002': {
    challenge_id: 'ch-002', title: 'Buffer Overflow 101',
    description: 'Classic stack-based buffer overflow on a 32-bit binary. Overwrite the return address and redirect execution to win().',
    difficulty: 'medium', points: 250, status: 'active', flag: 'CTF{buff3r_0v3rfl0w}',
    category_id: 'pwn', created_at: '2025-02-01T10:00:00Z', instructor_id: 'inst-001',
  },
  'ch-003': {
    challenge_id: 'ch-003', title: 'RSA Broken Keys',
    description: 'The server uses RSA encryption but with dangerously small primes. Factor n and recover the private key to decrypt the flag.',
    difficulty: 'hard', points: 500, status: 'draft', flag: 'CTF{rsa_f4ct0r3d}',
    category_id: 'crypto', created_at: '2025-03-12T14:00:00Z', instructor_id: 'inst-001',
  },
};

const MOCK_FILES = {
  'ch-001': [{ file_id: 'f-001', name: 'challenge.zip', url: '#', size: '12 KB' }],
  'ch-002': [{ file_id: 'f-002', name: 'vuln32', url: '#', size: '8 KB' }, { file_id: 'f-003', name: 'Makefile', url: '#', size: '1 KB' }],
  'ch-003': [{ file_id: 'f-004', name: 'output.txt', url: '#', size: '2 KB' }],
};

// ── Shared styles ──────────────────────────────────────────────────────
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

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const DIFF_COLOR = {
  easy:   { color: 'var(--accent3)', bg: 'rgba(16,185,129,0.15)',  border: 'rgba(16,185,129,0.4)'  },
  medium: { color: 'var(--amber)',   bg: 'rgba(245,158,11,0.15)',  border: 'rgba(245,158,11,0.4)'  },
  hard:   { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)'   },
};

const STATUS_OPTIONS = ['active', 'draft', 'pending', 'closed'];
const STATUS_MAP = {
  active:  { label: 'ACTIVE',  cls: 'status-pub'  },
  draft:   { label: 'DRAFT',   cls: 'status-draft' },
  pending: { label: 'PENDING', cls: 'status-draft' },
  closed:  { label: 'CLOSED',  cls: 'status-draft' },
};

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

const formatBytes = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

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

// ── Flag field with show/hide ──────────────────────────────────────────
function FlagField({ value, onChange, readOnly }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        style={{
          ...inputStyle,
          fontFamily: 'var(--mono)', fontSize: 13,
          paddingRight: 44,
          color: show ? 'var(--accent3)' : 'var(--text)',
        }}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder="CTF{...}"
      />
      <button
        onClick={() => setShow(s => !s)}
        style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted)', fontSize: 15, padding: 0,
        }}
      >
        {show ? '🙈' : '👁'}
      </button>
    </div>
  );
}

// ── File row ──────────────────────────────────────────────────────────
function FileRow({ file, onDelete }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  // For mock files (no real delete endpoint for individual files in the API)
  const handleDelete = async () => {
    setDeleting(true);
    setTimeout(() => {
      onDelete(file.file_id);
      setDeleting(false);
      setConfirmDel(false);
    }, 400);
  };

  const ext = file.name?.split('.').pop()?.toUpperCase() ?? 'FILE';

  return (
    <>
      {confirmDel && (
        <ConfirmModal
          title="Remove File"
          message={`Remove "${file.name}" from this challenge?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDel(false)}
          loading={deleting}
        />
      )}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px',
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        borderRadius: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Extension badge */}
          <div style={{
            width: 38, height: 38, borderRadius: 4,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--accent)',
            letterSpacing: 1, fontWeight: 700, flexShrink: 0,
          }}>
            {ext}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>
              {file.name}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>
              {file.size ?? formatBytes(file.size_bytes)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a
            href={file.url ?? file.file_url ?? '#'}
            download
            onClick={(e) => e.stopPropagation()}
            style={{ textDecoration: 'none' }}
          >
            <button className="act-btn act-edit" style={{ fontSize: 11 }}>↓ Download</button>
          </a>
          <button className="act-btn act-del" style={{ fontSize: 11 }}
            onClick={() => setConfirmDel(true)}>
            ✕
          </button>
        </div>
      </div>
    </>
  );
}

// ── File upload zone ───────────────────────────────────────────────────
function UploadZone({ challengeId, onUploaded }) {
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const inputRef = useRef();

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    setUploadErr('');
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await challengesApi.uploadFile(challengeId, fd);
        const uploaded = res.data?.data ?? res.data;
        onUploaded({
          file_id:  uploaded?.file_id  ?? crypto.randomUUID(),
          name:     uploaded?.name     ?? file.name,
          url:      uploaded?.url      ?? URL.createObjectURL(file),
          size:     formatBytes(file.size),
        });
      }
    } catch {
      // Optimistic fallback for mock
      Array.from(files).forEach(file => {
        onUploaded({
          file_id: crypto.randomUUID(),
          name:    file.name,
          url:     URL.createObjectURL(file),
          size:    formatBytes(file.size),
        });
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 6, padding: '28px 20px', textAlign: 'center',
          background: dragging ? 'rgba(99,102,241,0.05)' : 'var(--bg3)',
          cursor: 'pointer', transition: 'all .2s',
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
          {uploading ? 'UPLOADING...' : 'DROP FILES HERE OR CLICK TO BROWSE'}
        </div>
      </div>
      {uploadErr && (
        <div style={{ marginTop: 8, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--danger)', letterSpacing: 1 }}>
          ⚠ {uploadErr}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function ChallengeContentPage() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [challenge, setChallenge] = useState(null);
  const [files, setFiles]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [usingMock, setUsingMock] = useState(false);

  const [editingInfo, setEditingInfo]   = useState(false);
  const [infoForm, setInfoForm]         = useState({});
  const [savingInfo, setSavingInfo]     = useState(false);
  const [infoSaved, setInfoSaved]       = useState(false);
  const [infoErrors, setInfoErrors]     = useState({});

  const [togglingStatus, setTogglingStatus] = useState(false);
  const [showFlag, setShowFlag]             = useState(false);
  const [confirmDelete, setConfirmDelete]   = useState(false);
  const [deleting, setDeleting]             = useState(false);

  // ── Load ───────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      challengesApi.getOne(id),
      challengesApi.getFiles(id),
    ])
      .then(([chRes, filesRes]) => {
        const c = chRes.data?.data ?? chRes.data;
        const f = Array.isArray(filesRes.data) ? filesRes.data : filesRes.data?.data ?? [];
        setChallenge(c);
        setInfoForm({
          title:       c.title,
          description: c.description ?? '',
          difficulty:  c.difficulty  ?? 'easy',
          points:      c.points      ?? 0,
          flag:        c.flag        ?? '',
          category_id: c.category_id ?? '',
        });
        setFiles(f);
      })
      .catch(() => {
        const mock  = MOCK_CHALLENGES[id] ?? MOCK_CHALLENGES['ch-001'];
        const mockF = MOCK_FILES[id]      ?? [];
        setChallenge(mock);
        setInfoForm({
          title:       mock.title,
          description: mock.description ?? '',
          difficulty:  mock.difficulty  ?? 'easy',
          points:      mock.points      ?? 0,
          flag:        mock.flag        ?? '',
          category_id: mock.category_id ?? '',
        });
        setFiles(mockF);
        setUsingMock(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ── Save info ──────────────────────────────────────────────────────
  const handleSaveInfo = async () => {
    const errs = {};
    if (!infoForm.title?.trim()) errs.title = 'Title is required';
    if (infoForm.points < 0)     errs.points = 'Points must be ≥ 0';
    setInfoErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingInfo(true);
    try {
      await challengesApi.update(id, {
        title:       infoForm.title.trim(),
        description: infoForm.description,
        difficulty:  infoForm.difficulty,
        points:      Number(infoForm.points),
        flag:        infoForm.flag,
        category_id: infoForm.category_id || null,
      });
      setChallenge(p => ({ ...p, ...infoForm }));
      setEditingInfo(false);
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 2000);
    } catch {
      setChallenge(p => ({ ...p, ...infoForm }));
      setEditingInfo(false);
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 2000);
    } finally {
      setSavingInfo(false);
    }
  };

  // ── Toggle status ──────────────────────────────────────────────────
  const handleToggleStatus = async () => {
    const next = challenge.status === 'active' ? 'draft' : 'active';
    setTogglingStatus(true);
    try {
      await challengesApi.updateStatus(id, next);
      setChallenge(p => ({ ...p, status: next }));
    } catch {
      setChallenge(p => ({ ...p, status: next }));
    } finally {
      setTogglingStatus(false);
    }
  };

  // ── Delete challenge ───────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await challengesApi.remove(id);
      navigate('/instructor/challenges');
    } catch {
      navigate('/instructor/challenges');
    } finally {
      setDeleting(false);
    }
  };

  // ── File handlers ──────────────────────────────────────────────────
  const handleFileUploaded = (file) => setFiles(p => [...p, file]);
  const handleFileDelete   = (fileId) => setFiles(p => p.filter(f => f.file_id !== fileId));

  // ── Derived ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="layout">
      <Sidebar />
      <div className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>LOADING...</p>
      </div>
    </div>
  );

  const diffStyle  = DIFF_COLOR[challenge?.difficulty?.toLowerCase()] ?? DIFF_COLOR.easy;
  const statusInfo = STATUS_MAP[challenge?.status] ?? STATUS_MAP.draft;
  const isActive   = challenge?.status === 'active';

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />

        {/* ── Confirm delete modal ─────────────────────────────────── */}
        {confirmDelete && (
          <ConfirmModal
            title="Delete Challenge"
            message={`Are you sure you want to permanently delete "${challenge?.title}"? This cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setConfirmDelete(false)}
            loading={deleting}
          />
        )}

        {/* ── Page header ──────────────────────────────────────────── */}
        <div className="topbar" style={{ marginBottom: 28 }}>
          <div>
            <div className="page-title" style={{ fontSize: 20 }}>{challenge?.title}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginTop: 4 }}>
              INSTRUCTOR / CHALLENGES / EDIT
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" onClick={() => navigate('/instructor/challenges')}>
              ← Back
            </button>
            <button
              className={`btn ${isActive ? 'btn-danger' : 'btn-teal'}`}
              onClick={handleToggleStatus}
              disabled={togglingStatus}
            >
              {togglingStatus ? '...' : isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
              ✕ Delete
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

        {/* ── Two-column layout (identical to CourseContentPage) ────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 28, alignItems: 'start' }}>

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Challenge Details card */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="card-title">Challenge Details</div>
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
                      onClick={() => {
                        setEditingInfo(false);
                        setInfoErrors({});
                        setInfoForm({
                          title: challenge.title, description: challenge.description ?? '',
                          difficulty: challenge.difficulty ?? 'easy', points: challenge.points ?? 0,
                          flag: challenge.flag ?? '', category_id: challenge.category_id ?? '',
                        });
                      }}>
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {infoSaved && (
                <div style={{
                  margin: '12px 24px 0 24px', padding: '6px 12px',
                  background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 10,
                  color: 'var(--accent3)', letterSpacing: 1,
                }}>
                  ✓ SAVED
                </div>
              )}

              <div style={{ padding: '20px 24px 24px 24px' }}>
                {editingInfo ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Title */}
                    <div>
                      <label style={labelStyle}>Title *</label>
                      <input style={{ ...inputStyle, borderColor: infoErrors.title ? 'var(--danger)' : undefined }}
                        value={infoForm.title}
                        onChange={(e) => setInfoForm(p => ({ ...p, title: e.target.value }))} />
                      {infoErrors.title && <div style={{ marginTop: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--danger)', letterSpacing: 1 }}>⚠ {infoErrors.title}</div>}
                    </div>

                    {/* Description */}
                    <div>
                      <label style={labelStyle}>Description</label>
                      <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }}
                        value={infoForm.description}
                        placeholder="CTF-style description..."
                        onChange={(e) => setInfoForm(p => ({ ...p, description: e.target.value }))} />
                    </div>

                    {/* Difficulty + Points */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Difficulty</label>
                        <select style={{ ...inputStyle, cursor: 'pointer' }}
                          value={infoForm.difficulty}
                          onChange={(e) => setInfoForm(p => ({ ...p, difficulty: e.target.value }))}>
                          {DIFFICULTIES.map(d => (
                            <option key={d} value={d} style={{ background: 'var(--bg2)' }}>
                              {d.charAt(0).toUpperCase() + d.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>Points</label>
                        <input style={{ ...inputStyle, borderColor: infoErrors.points ? 'var(--danger)' : undefined }}
                          type="number" min="0"
                          value={infoForm.points}
                          onChange={(e) => setInfoForm(p => ({ ...p, points: e.target.value }))} />
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label style={labelStyle}>Category</label>
                      <input style={inputStyle} placeholder="e.g. web, pwn, crypto, misc"
                        value={infoForm.category_id}
                        onChange={(e) => setInfoForm(p => ({ ...p, category_id: e.target.value }))} />
                    </div>

                    {/* Flag */}
                    <div>
                      <label style={labelStyle}>Flag</label>
                      <FlagField
                        value={infoForm.flag}
                        onChange={(e) => setInfoForm(p => ({ ...p, flag: e.target.value }))}
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label style={labelStyle}>Status</label>
                      <select style={{ ...inputStyle, cursor: 'pointer' }}
                        value={infoForm.status ?? challenge.status}
                        onChange={(e) => setInfoForm(p => ({ ...p, status: e.target.value }))}>
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s} style={{ background: 'var(--bg2)' }}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>
                ) : (
                  /* ── Read-only view (mirrors CourseContentPage) ── */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div>
                      <div style={labelStyle}>Title</div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{challenge?.title}</div>
                    </div>

                    <div>
                      <div style={labelStyle}>Description</div>
                      <div style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.6 }}>
                        {challenge?.description || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No description</span>}
                      </div>
                    </div>

                    {/* Difficulty + Points badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 10px',
                        borderRadius: 20, border: `1px solid ${diffStyle.border}`,
                        background: diffStyle.bg, color: diffStyle.color,
                      }}>
                        {challenge?.difficulty?.toUpperCase() ?? '—'}
                      </span>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 10px',
                        borderRadius: 20, border: '1px solid var(--border)',
                        background: 'var(--bg3)', color: 'var(--accent)',
                      }}>
                        ⚑ {challenge?.points ?? 0} pts
                      </span>
                      {challenge?.category_id && (
                        <span style={{
                          fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 10px',
                          borderRadius: 20, border: '1px solid var(--border)',
                          background: 'var(--bg3)', color: 'var(--muted2)',
                        }}>
                          {challenge.category_id}
                        </span>
                      )}
                    </div>

                    {/* Status + Created */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center' }}>
                      <div>
                        <div style={labelStyle}>Status</div>
                        <span className={`status-badge ${statusInfo.cls}`}>{statusInfo.label}</span>
                      </div>
                      <div>
                        <div style={labelStyle}>Created</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted2)' }}>
                          {formatDate(challenge?.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Flag (hidden) */}
                    <div>
                      <div style={labelStyle}>Flag</div>
                      <FlagField value={challenge?.flag ?? ''} readOnly />
                    </div>

                  </div>
                )}
              </div>
            </div>

            {/* Stats card */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 20 }}>Stats</div>
              {[
                { label: 'Points',      value: challenge?.points ?? 0,    color: 'var(--accent)'  },
                { label: 'Files',       value: files.length,              color: 'var(--accent3)' },
                { label: 'Difficulty',  value: challenge?.difficulty?.toUpperCase() ?? '—', color: diffStyle.color, isText: true },
              ].map((s) => (
                <div key={s.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
                    {s.label.toUpperCase()}
                  </span>
                  <span style={{
                    fontFamily: s.isText ? 'var(--mono)' : 'var(--heading)',
                    fontSize: s.isText ? 13 : 22,
                    fontWeight: 700, color: s.color,
                  }}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* CTF Description card */}
            <div className="card">
              <div className="card-header" style={{ marginBottom: 20 }}>
                <div className="card-title">Challenge Brief</div>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
                  letterSpacing: 1, padding: '3px 8px',
                  border: '1px solid var(--border)', borderRadius: 4,
                }}>
                  CTF STYLE
                </span>
              </div>

              <div style={{
                padding: '20px',
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontFamily: 'var(--mono)', fontSize: 13,
                color: 'var(--text)', lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                minHeight: 120,
              }}>
                {challenge?.description
                  ? challenge.description
                  : <span style={{ color: 'var(--muted)', fontStyle: 'italic', fontFamily: 'var(--body)' }}>
                      No description yet. Click Edit on the left to add a CTF-style challenge brief.
                    </span>
                }
              </div>

              {/* Flag submit preview */}
              <div style={{ marginTop: 16 }}>
                <label style={labelStyle}>Flag Format Preview</label>
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(16,185,129,0.05)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 4,
                  fontFamily: 'var(--mono)', fontSize: 13,
                  color: 'var(--accent3)', letterSpacing: 1,
                }}>
                  {challenge?.flag
                    ? challenge.flag.replace(/\{.*\}/, '{...}')
                    : 'CTF{...}'
                  }
                </div>
              </div>
            </div>

            {/* Files card */}
            <div className="card">
              <div className="card-header" style={{ marginBottom: 20 }}>
                <div className="card-title">Challenge Files</div>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 11,
                  color: 'var(--muted)', letterSpacing: 1,
                }}>
                  {files.length} FILE{files.length !== 1 ? 'S' : ''}
                </span>
              </div>

              {/* Upload zone */}
              <div style={{ marginBottom: files.length > 0 ? 16 : 0 }}>
                <UploadZone challengeId={id} onUploaded={handleFileUploaded} />
              </div>

              {/* File list */}
              {files.length === 0 ? (
                <div style={{
                  padding: '24px 0', textAlign: 'center',
                  fontFamily: 'var(--mono)', fontSize: 11,
                  color: 'var(--muted)', letterSpacing: 1, marginTop: 12,
                }}>
                  NO FILES ATTACHED YET
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {files.map(f => (
                    <FileRow key={f.file_id} file={f} onDelete={handleFileDelete} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}