import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar       from '../../components/common/Sidebar';
import Topbar from './instructorTopBar';
import Navbar from '../../components/common/Navbar';
import challengesApi from '../../api/challenges';

// ── Shared styles (identical to ChallengeContentPage) ─────────────────
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
  easy:   { color: 'var(--accent3)', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)' },
  medium: { color: 'var(--amber)',   bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' },
  hard:   { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)'  },
};

const CATEGORIES = [
  { id: 'category_001_4e71cb38', name: 'Web Security' },
  { id: 'category_002_d07228d0', name: 'Cryptography' },
  { id: 'category_003_6eb8edcf', name: 'Network Security' },
  { id: 'category_004_780cf6bc', name: 'System Administration' },
  { id: 'category_005_b70e6d49', name: 'Reverse Engineering' },
];

const formatBytes = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ── Flag field with show/hide (identical to ChallengeContentPage) ──────
function FlagField({ value, onChange }) {
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
        placeholder="CTF{...}"
        autoComplete="new-password"
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

// ── Draft file row (local only, pre-upload) ────────────────────────────
function DraftFileRow({ file, onRemove }) {
  const ext = file.name?.split('.').pop()?.toUpperCase() ?? 'FILE';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 14px', background: 'var(--bg3)',
      border: '1px solid var(--border)', borderRadius: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 4,
          background: 'var(--bg2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--accent)',
          letterSpacing: 1, fontWeight: 700, flexShrink: 0,
        }}>
          {ext}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{file.name}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>
            {formatBytes(file.size)} · PENDING UPLOAD
          </div>
        </div>
      </div>
      <button className="act-btn act-del" style={{ fontSize: 11 }} onClick={() => onRemove(file._localId)}>✕</button>
    </div>
  );
}

// ── File drop zone (identical to ChallengeContentPage) ────────────────
function DropZone({ onFiles }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handle = (files) => {
    Array.from(files).forEach(f => onFiles({ _localId: crypto.randomUUID(), name: f.name, size: f.size, raw: f }));
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
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
        DROP FILES HERE OR CLICK TO BROWSE
      </div>
      <input ref={inputRef} type="file" multiple style={{ display: 'none' }} onChange={(e) => handle(e.target.files)} />
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function CreateChallengePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title:       '',
    description: '',
    difficulty:  'easy',
    points:      100,
    flag:        '',
    category_id: '',
    status:      'draft',
  });

  const [draftFiles, setDraftFiles] = useState([]); // local files before API call
  const [errors, setErrors]         = useState({});
  const [saving, setSaving]         = useState(false);
  const [apiError, setApiError]     = useState('');

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const diffStyle = DIFF_COLOR[form.difficulty] ?? DIFF_COLOR.easy;

  // ── Validation ────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim())  errs.title  = 'Title is required';
    if (form.points < 0)     errs.points = 'Points must be ≥ 0';
    if (!form.flag.trim())   errs.flag   = 'Flag is required';
    return errs;
  };

  // ── Submit: create challenge then upload files ─────────────────────
  const handleCreate = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    setApiError('');

    try {
      // 1. Create challenge
      const res       = await challengesApi.create({
        title:       form.title.trim(),
        description: form.description.trim() || null,
        difficulty:  form.difficulty,
        points:      Number(form.points),
        flag:        form.flag.trim(),
        category_id: form.category_id.trim() || null,
        status:      form.status,
      });
      const challenge = res.data?.data ?? res.data;
      const newId     = challenge.challenge_id;

      // 2. Upload each pending file
      for (const f of draftFiles) {
        const fd = new FormData();
        fd.append('file', f.raw);
        await challengesApi.uploadFile(newId, fd).catch(() => {}); // silent — file upload failure shouldn't block
      }

      navigate(`/instructor/challenges/${newId}`);
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Failed to create challenge. Please try again.';
      setApiError(msg);
    } finally {
      setSaving(false);
    }
  };

  const addFile    = (f)  => setDraftFiles(p => [...p, f]);
  const removeFile = (id) => setDraftFiles(p => p.filter(f => f._localId !== id));

  return (
    <>
    <Navbar />
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Topbar />

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="topbar" style={{ marginBottom: 28 }}>
          <div>
            <div className="page-title" style={{ fontSize: 20 }}>New Challenge</div>
            
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" onClick={() => navigate('/instructor/challenges')} disabled={saving}>
              ← Cancel
            </button>
            <button className="btn btn-teal" onClick={handleCreate} disabled={saving || !form.title.trim()}>
              {saving ? 'Creating...' : '✓ Create Challenge'}
            </button>
          </div>
        </div>

        {/* API error */}
        {apiError && (
          <div style={{ padding: '10px 16px', marginBottom: 20, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--danger)', letterSpacing: 1 }}>
            ✕ {apiError}
          </div>
        )}

        {/* Two‑column layout: left = details, right = files */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 28, alignItems: 'start' }}>

          {/* LEFT COLUMN – Challenge Details */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 0 24px' }}>
              <div className="card-title">Challenge Details</div>
            </div>

            <div style={{ padding: '20px 24px 24px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Title */}
                <div>
                  <label style={labelStyle}>Title <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    style={{ ...inputStyle, borderColor: errors.title ? 'var(--danger)' : undefined }}
                    placeholder="Challenge title..."
                    value={form.title}
                    onChange={set('title')}
                    autoFocus
                  />
                  {errors.title && <div style={{ marginTop: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--danger)', letterSpacing: 1 }}>⚠ {errors.title}</div>}
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }}
                    placeholder="CTF-style description..."
                    value={form.description}
                    onChange={set('description')}
                  />
                </div>

                {/* Difficulty + Points */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Difficulty</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.difficulty} onChange={set('difficulty')}>
                      {DIFFICULTIES.map(d => (
                        <option key={d} value={d} style={{ background: 'var(--bg2)' }}>
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Points</label>
                    <input
                      style={{ ...inputStyle, borderColor: errors.points ? 'var(--danger)' : undefined }}
                      type="number" min="0"
                      value={form.points}
                      onChange={set('points')}
                    />
                    {errors.points && <div style={{ marginTop: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--danger)', letterSpacing: 1 }}>⚠ {errors.points}</div>}
                  </div>
                </div>

                {/* Difficulty badge preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 10px', borderRadius: 20, border: `1px solid ${diffStyle.border}`, background: diffStyle.bg, color: diffStyle.color }}>
                    {form.difficulty.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--bg3)', color: 'var(--accent)' }}>
                    ⚑ {form.points} pts
                  </span>
                </div>

                {/* Category dropdown */}
                <div>
                  <label style={labelStyle}>Category</label>
                  <select
                    style={inputStyle}
                    value={form.category_id}
                    onChange={set('category_id')}
                    autoComplete="off"
                  >
                    <option value="">— Select a category —</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Flag */}
                <div>
                  <label style={labelStyle}>Flag <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <FlagField value={form.flag} onChange={(e) => setForm(p => ({ ...p, flag: e.target.value }))} />
                  {errors.flag && <div style={{ marginTop: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--danger)', letterSpacing: 1 }}>⚠ {errors.flag}</div>}
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid var(--border)' }} />

                {/* Status */}
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={set('status')}>
                    <option value="draft"   style={{ background: 'var(--bg2)' }}>Draft</option>
                    <option value="pending"  style={{ background: 'var(--bg2)' }}>Pending</option>
                  </select>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Files */}
          <div className="card">
            <div className="card-header" style={{ marginBottom: 20 }}>
              <div className="card-title">Challenge Files</div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
                {draftFiles.length} FILE{draftFiles.length !== 1 ? 'S' : ''} · PENDING
              </span>
            </div>

            <div style={{ marginBottom: draftFiles.length > 0 ? 16 : 0 }}>
              <DropZone onFiles={addFile} />
            </div>

            {draftFiles.length === 0 ? (
              <div style={{
                padding: '24px 0', textAlign: 'center',
                fontFamily: 'var(--mono)', fontSize: 11,
                color: 'var(--muted)', letterSpacing: 1, marginTop: 12,
              }}>
                NO FILES ADDED YET
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {draftFiles.map(f => (
                  <DraftFileRow key={f._localId} file={f} onRemove={removeFile} />
                ))}
              </div>
            )}

            {draftFiles.length > 0 && (
              <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>
                ✦ Files will be uploaded after the challenge is created
              </div>
            )}
          </div>

        </div>
      </div>
    </div></>
  );
}