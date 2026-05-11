// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar    from '../../components/common/Sidebar';
// import Navbar from '../../components/common/Navbar';
// import coursesApi from '../../api/courses';

// const MOCK_COURSES = [
//   { course_id: 'c-001', title: 'Web Application Security',         level: 'beginner',     description: 'Learn to identify and exploit common web vulnerabilities including XSS, CSRF, and SQL Injection.', estimated_duration: 180, is_published: true, created_at: '2024-11-10T08:00:00Z' },
//   { course_id: 'c-002', title: 'Network Penetration Testing',      level: 'intermediate', description: 'Master the art of network recon, scanning, and exploitation using industry-standard tools.',        estimated_duration: 240, is_published: true, created_at: '2024-12-01T10:30:00Z' },
//   { course_id: 'c-003', title: 'Reverse Engineering Fundamentals', level: 'advanced',     description: 'Dive into binary analysis, disassembly, and understanding compiled code.',                          estimated_duration: 320, is_published: true, created_at: '2025-01-15T14:00:00Z' },
//   { course_id: 'c-004', title: 'Cryptography & Secure Protocols',  level: 'intermediate', description: 'Understand encryption algorithms, PKI, TLS, and how to break weak implementations.',               estimated_duration: 150, is_published: true, created_at: '2025-02-20T09:00:00Z' },
//   { course_id: 'c-005', title: 'Linux Privilege Escalation',       level: 'advanced',     description: 'Techniques and tools to escalate privileges on Linux systems during penetration tests.',            estimated_duration: 200, is_published: true, created_at: '2025-03-05T11:00:00Z' },
//   { course_id: 'c-006', title: 'OSINT & Reconnaissance',           level: 'beginner',     description: 'Open-source intelligence gathering techniques used in real-world penetration testing engagements.', estimated_duration: 120, is_published: true, created_at: '2025-03-20T11:00:00Z' },
// ];

// const LEVEL_COLOR = {
//   beginner:     { color: 'var(--accent3)', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)' },
//   intermediate: { color: 'var(--amber)',   bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' },
//   advanced:     { color: 'var(--danger)',  bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)'  },
// };

// const formatDuration = (min) => {
//   if (!min) return null;
//   if (min < 60) return `${min}m`;
//   const h = Math.floor(min / 60), m = min % 60;
//   return m ? `${h}h ${m}m` : `${h}h`;
// };

// const formatDate = (iso) =>
//   iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

// function CourseCard({ course }) {
//   const navigate   = useNavigate();
//   const levelStyle = LEVEL_COLOR[course.level] ?? LEVEL_COLOR.beginner;

//   return (
//     <div
//       className="card"
//       style={{ cursor: 'pointer', transition: 'border-color .2s', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      
//     >
//       {/* Level colour strip */}
//       <div style={{ height: 3, background: levelStyle.color, opacity: 0.6 }} />

//       <div style={{ padding: '20px 20px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
//         {/* Title + badge */}
//         <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
//           <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, margin: 0 }}>
//             {course.title}
//           </h3>
//           <span style={{
//             fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 8px', flexShrink: 0,
//             borderRadius: 20, border: `1px solid ${levelStyle.border}`,
//             background: levelStyle.bg, color: levelStyle.color,
//           }}>
//             {course.level?.toUpperCase() ?? '—'}
//           </span>
//         </div>

//         {/* Description */}
//         <p style={{
//           fontSize: 13, color: 'var(--muted2)', lineHeight: 1.55, margin: 0,
//           display: '-webkit-box', WebkitLineClamp: 3,
//           WebkitBoxOrient: 'vertical', overflow: 'hidden',
//         }}>
//           {course.description || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No description.</span>}
//         </p>

//         {/* Meta */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 'auto' }}>
//           {course.estimated_duration && (
//             <span style={{
//               fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 8px',
//               borderRadius: 20, border: '1px solid var(--border)',
//               background: 'var(--bg3)', color: 'var(--muted2)',
//             }}>
//               ⏱ {formatDuration(course.estimated_duration)}
//             </span>
//           )}
//           <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>
//             {formatDate(course.created_at)}
//           </span>
//         </div>

//         {/* View button */}
//         <button
//           className="btn btn-outline"
//           style={{ width: '100%', justifyContent: 'center', fontSize: 12, marginTop: 4 }}
//           onClick={(e) => { e.stopPropagation(); navigate(`/learner/courses/${course.course_id}`); }}
//         >
//           View Course →
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function CoursesListingPage() {
//   const navigate = useNavigate();

//   const [courses, setCourses]     = useState([]);
//   const [loading, setLoading]     = useState(true);
//   const [usingMock, setUsingMock] = useState(false);
//   const [search, setSearch]       = useState('');
//   const [filterLevel, setFilterLevel] = useState('all');
//   const [sortBy, setSortBy]       = useState('newest');

//   useEffect(() => {
//     coursesApi.getAll()
//       .then((res) => {
//         const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
//         setCourses(data.length ? data : MOCK_COURSES);
//         if (!data.length) setUsingMock(true);
//       })
//       .catch(() => { setCourses(MOCK_COURSES); setUsingMock(true); })
//       .finally(() => setLoading(false));
//   }, []);

//   const filtered = courses
//     .filter(c => {
//       const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
//                           c.description?.toLowerCase().includes(search.toLowerCase());
//       const matchLevel  = filterLevel === 'all' || c.level === filterLevel;
//       return matchSearch && matchLevel;
//     })
//     .sort((a, b) => {
//       if (sortBy === 'newest')   return new Date(b.created_at) - new Date(a.created_at);
//       if (sortBy === 'oldest')   return new Date(a.created_at) - new Date(b.created_at);
//       if (sortBy === 'title')    return a.title.localeCompare(b.title);
//       if (sortBy === 'duration') return (a.estimated_duration ?? 0) - (b.estimated_duration ?? 0);
//       return 0;
//     });

//   const selectStyle = {
//     padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--border)',
//     borderRadius: 4, color: 'var(--text)', fontFamily: 'var(--mono)',
//     fontSize: 11, outline: 'none', cursor: 'pointer', letterSpacing: 1,
//   };

//   if (loading) return (
//     <div className="layout"><Sidebar />
//       <div className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>LOADING...</p>
//       </div>
//     </div>
//   );

//   return (
//     <>
//     <Navbar />
//     <div className="layout">
//       <Sidebar />
//       <div className="main">
        

//         {/* Header */}
//         <div className="topbar" style={{ marginBottom: 28 }}>
//           <div>
//             <div className="page-title" style={{ fontSize: 20 }} >Courses</div>
            
//           </div>
//         </div>

//         {usingMock && (
//           <div style={{ padding: '8px 14px', marginBottom: 20, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--amber)', letterSpacing: 1 }}>
//             ⚠ MOCK DATA — API unavailable or returned no results
//           </div>
//         )}

//         {/* Search + filters */}
//         <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 24 }}>
//           <div style={{ position: 'relative', flex: 2, minWidth: 200 }}>
//             <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 14 }}>⌕</span>
//             <input
//               style={{ width: '100%', padding: '9px 12px 9px 34px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', fontFamily: 'var(--body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
//               placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <select style={selectStyle} value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
//             <option value="all">All Levels</option>
//             <option value="beginner">Beginner</option>
//             <option value="intermediate">Intermediate</option>
//             <option value="advanced">Advanced</option>
//           </select>
//           <select style={selectStyle} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="newest">Newest</option>
//             <option value="oldest">Oldest</option>
//             <option value="title">A–Z</option>
//             <option value="duration">Shortest</option>
//           </select>
//           {(search || filterLevel !== 'all' || sortBy !== 'newest') && (
//             <button className="act-btn" style={{ fontSize: 11, borderColor: 'var(--muted)', color: 'var(--muted)' }}
//               onClick={() => { setSearch(''); setFilterLevel('all'); setSortBy('newest'); }}>
//               ✕ Clear
//             </button>
//           )}
//         </div>

//         {/* Grid */}
//         {filtered.length === 0 ? (
//           <div style={{ padding: '56px 0', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 6 }}>
//             <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: 1, marginBottom: 12 }}>NO COURSES FOUND</p>
//             <button className="btn btn-outline" style={{ fontSize: 11 }} onClick={() => { setSearch(''); setFilterLevel('all'); setSortBy('newest'); }}>Clear Filters</button>
//           </div>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
//             {filtered.map(course => <CourseCard key={course.course_id} course={course} />)}
//           </div>
//         )}
//       </div>
//     </div></>
//   );
// }


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar    from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import coursesApi from '../../api/courses';

const MOCK_COURSES = [
  { course_id: 'c-001', title: 'Web Application Security',         level: 'beginner',     description: 'Learn to identify and exploit common web vulnerabilities including XSS, CSRF, and SQL Injection.', estimated_duration: 180, is_published: true, created_at: '2024-11-10T08:00:00Z' },
  { course_id: 'c-002', title: 'Network Penetration Testing',      level: 'intermediate', description: 'Master the art of network recon, scanning, and exploitation using industry-standard tools.',        estimated_duration: 240, is_published: true, created_at: '2024-12-01T10:30:00Z' },
  { course_id: 'c-003', title: 'Reverse Engineering Fundamentals', level: 'advanced',     description: 'Dive into binary analysis, disassembly, and understanding compiled code.',                          estimated_duration: 320, is_published: true, created_at: '2025-01-15T14:00:00Z' },
  { course_id: 'c-004', title: 'Cryptography & Secure Protocols',  level: 'intermediate', description: 'Understand encryption algorithms, PKI, TLS, and how to break weak implementations.',               estimated_duration: 150, is_published: true, created_at: '2025-02-20T09:00:00Z' },
  { course_id: 'c-005', title: 'Linux Privilege Escalation',       level: 'advanced',     description: 'Techniques and tools to escalate privileges on Linux systems during penetration tests.',            estimated_duration: 200, is_published: true, created_at: '2025-03-05T11:00:00Z' },
  { course_id: 'c-006', title: 'OSINT & Reconnaissance',           level: 'beginner',     description: 'Open-source intelligence gathering techniques used in real-world penetration testing engagements.', estimated_duration: 120, is_published: true, created_at: '2025-03-20T11:00:00Z' },
];

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

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

function CourseCard({ course }) {
  const navigate   = useNavigate();
  const levelStyle = LEVEL_COLOR[course.level] ?? LEVEL_COLOR.beginner;

  return (
    <div
      className="card"
      style={{ cursor: 'pointer', transition: 'border-color .2s', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      
    >
      {/* Level colour strip */}
      <div style={{ height: 3, background: levelStyle.color, opacity: 0.6 }} />

      <div style={{ padding: '20px 20px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Title + badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, margin: 0 }}>
            {course.title}
          </h3>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 8px', flexShrink: 0,
            borderRadius: 20, border: `1px solid ${levelStyle.border}`,
            background: levelStyle.bg, color: levelStyle.color,
          }}>
            {course.level?.toUpperCase() ?? '—'}
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: 13, color: 'var(--muted2)', lineHeight: 1.55, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {course.description || <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>No description.</span>}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginTop: 'auto' }}>
          {course.estimated_duration && (
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 8px',
              borderRadius: 20, border: '1px solid var(--border)',
              background: 'var(--bg3)', color: 'var(--muted2)',
            }}>
              ⏱ {formatDuration(course.estimated_duration)}
            </span>
          )}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>
            {formatDate(course.created_at)}
          </span>
        </div>

        {/* View button */}
        <button
          className="btn btn-outline"
          style={{ width: '100%', justifyContent: 'center', fontSize: 12, marginTop: 4 }}
          onClick={(e) => { e.stopPropagation(); navigate(`/learner/courses/${course.course_id}`); }}
        >
          View Course →
        </button>
      </div>
    </div>
  );
}

export default function CoursesListingPage() {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [search, setSearch]       = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortBy, setSortBy]       = useState('newest');

  useEffect(() => {
    coursesApi.getAll()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setCourses(data.length ? data : MOCK_COURSES);
        if (!data.length) setUsingMock(true);
      })
      .catch(() => { setCourses(MOCK_COURSES); setUsingMock(true); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses
    .filter(c => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.description?.toLowerCase().includes(search.toLowerCase());
      const matchLevel  = filterLevel === 'all' || c.level === filterLevel;
      return matchSearch && matchLevel;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')   return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest')   return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'title')    return a.title.localeCompare(b.title);
      if (sortBy === 'duration') return (a.estimated_duration ?? 0) - (b.estimated_duration ?? 0);
      return 0;
    });

  const selectStyle = {
    padding: '9px 12px', background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 4, color: 'var(--text)', fontFamily: 'var(--mono)',
    fontSize: 11, outline: 'none', cursor: 'pointer', letterSpacing: 1,
  };

  if (loading) return (
    <div className="layout"><Sidebar />
      <div className="main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)', letterSpacing: 2 }}>LOADING...</p>
      </div>
    </div>
  );

  return (
    <>
    <Navbar />
    <div className="layout">
      <Sidebar />
      <div className="main">
        

        {/* Header */}
        <div className="topbar" style={{ marginBottom: 28 }}>
          <div>
            <div className="page-title" style={{ fontSize: 20 }} >Courses</div>
            
          </div>
        </div>

        {usingMock && (
          <div style={{ padding: '8px 14px', marginBottom: 20, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--amber)', letterSpacing: 1 }}>
            ⚠ MOCK DATA — API unavailable or returned no results
          </div>
        )}

        {/* Search + filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ position: 'relative', flex: 2, minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 14 }}>⌕</span>
            <input
              style={{ width: '100%', padding: '9px 12px 9px 34px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--text)', fontFamily: 'var(--body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select style={selectStyle} value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select style={selectStyle} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">A–Z</option>
            <option value="duration">Shortest</option>
          </select>
          {(search || filterLevel !== 'all' || sortBy !== 'newest') && (
            <button className="act-btn" style={{ fontSize: 11, borderColor: 'var(--muted)', color: 'var(--muted)' }}
              onClick={() => { setSearch(''); setFilterLevel('all'); setSortBy('newest'); }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ padding: '56px 0', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 6 }}>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', letterSpacing: 1, marginBottom: 12 }}>NO COURSES FOUND</p>
            <button className="btn btn-outline" style={{ fontSize: 11 }} onClick={() => { setSearch(''); setFilterLevel('all'); setSortBy('newest'); }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filtered.map(course => <CourseCard key={course.course_id} course={course} />)}
          </div>
        )}
      </div>
    </div></>
  );
}