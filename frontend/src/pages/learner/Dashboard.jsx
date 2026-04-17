// src/pages/learner/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import learnerService from '../../services/learner.service.js';
// import aiService      from '../../services/ai.service.js';

// ─── petit composant StatCard ─────────────────────────────────────
const StatCard = ({ label, value, delta, deltaUp, accentColor }) => (
  <div style={{ '--c': accentColor }} className="stat-card">
    <div className="stat-lbl">{label}</div>
    <div className="stat-val" style={{ color: accentColor }}>{value}</div>
    {delta && (
      <div className={`stat-delta ${deltaUp ? 'up' : ''}`}>{delta}</div>
    )}
  </div>
);

// ─── XPBar ───────────────────────────────────────────────────────
const XPBar = ({ current, required, level }) => {
  const pct = Math.round((current / required) * 100);
  return (
    <div className="xp-card">
      <div className="xp-head">
        <span className="xp-title">PROGRESSION NIVEAU {level} → {level + 1}</span>
      </div>
      <div className="xp-bar-bg">
        <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="xp-meta">
        <span>{current.toLocaleString()} XP</span>
        <span className="xp-pct">{pct}% — encore {(required - current).toLocaleString()} XP</span>
        <span>{required.toLocaleString()} XP</span>
      </div>
    </div>
  );
};

// ─── StreakRow ────────────────────────────────────────────────────
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const StreakWeek = ({ doneCount }) => (
  <div className="card" style={{ marginBottom: 16 }}>
    <div className="c-head">
      <span className="c-title">STREAK HEBDOMADAIRE</span>
    </div>
    <div className="streak-row">
      {DAYS.map((d, i) => (
        <div
          key={d + i}
          className={`streak-day ${i < doneCount - 1 ? 's-done' : i === doneCount - 1 ? 's-today' : 's-miss'}`}
        >
          {d}
        </div>
      ))}
      <div className="streak-info">🔥 {doneCount}/7 jours cette semaine</div>
    </div>
  </div>
);

// ─── ChallengeList ────────────────────────────────────────────────
const DIFF_CLASS = { easy: 'd-e', medium: 'd-m', hard: 'd-h' };
const DIFF_LABEL = { easy: 'EASY', medium: 'MED', hard: 'HARD' };
const CAT_ICO = {
  web:      { cls: 'ico-web',     ico: '🌐' },
  crypto:   { cls: 'ico-crypto',  ico: '🔐' },
  forensic: { cls: 'ico-forensic',ico: '🔬' },
  pwn:      { cls: 'ico-pwn',     ico: '💻' },
  misc:     { cls: 'ico-web',     ico: '⚡' },
};

const ChallengeList = ({ challenges, onStart }) => (
  <div className="card">
    <div className="c-head">
      <span className="c-title">CHALLENGES EN COURS</span>
      <span className="c-action" onClick={() => onStart('challenges')}>Voir tout →</span>
    </div>
 
    {challenges.map((ch) => {
      const cat = CAT_ICO[ch.category?.toLowerCase()] || CAT_ICO.misc;
      return (
        <div className="ch-item" key={ch.challenge_id} onClick={() => onStart(`challenges/${ch.challenge_id}`)}>
          <div className={`ch-ico ${cat.cls}`}>{cat.ico}</div>
          <div>
            <div className="ch-name">{ch.title}</div>
            <div className="ch-cat">{ch.category} · {ch.sessionStatus || 'Non démarré'}</div>
          </div>
          <div className="ch-r">
            <div className="ch-pts">{ch.points} pts</div>
            <div className={`diff ${DIFF_CLASS[ch.difficulty] || 'd-m'}`}>
              {DIFF_LABEL[ch.difficulty] || ch.difficulty?.toUpperCase()}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

// ─── CourseList ───────────────────────────────────────────────────
const CourseList = ({ enrollments, onNav }) => (
  <div className="card">
    <div className="c-head">
      <span className="c-title">MES COURS</span>
      <span className="c-action" onClick={() => onNav('courses')}>Voir tout →</span>
    </div>
    {enrollments.map((e) => (
      <div className="course-item" key={e.course_id} onClick={() => onNav(`courses/${e.course_id}`)}>
        <div className="course-ico ico-web">📚</div>
        <div className="prog-wrap">
          <div className="course-name">{e.title}</div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${e.progress || 0}%` }} />
          </div>
        </div>
        <div className="prog-pct">{e.progress || 0}%</div>
      </div>
    ))}
  </div>
);

// ─── AIPanel ─────────────────────────────────────────────────────
const AIPanel = ({ recommendations, loading }) => (
  <div className="ai-card">
    <div className="ai-head">
      {/* <div className="ai-dot" /> */}
    </div>
    <div className="ai-msg">
      Basé sur ton niveau et ton historique, voici les challenges les mieux adaptés :
    </div>
    {loading ? (
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', padding: '8px 0' }}>
        Chargement...
      </div>
    ) : recommendations.map((r) => (
      <div className="ai-sugg" key={r.challenge_id}>
        <span className="ai-s-ico">🚩</span>
        <span className="ai-s-txt">{r.title}</span>
        <span className="ai-s-xp">+{r.points} XP</span>
      </div>
    ))}
  </div>
);

// ─── BadgeGrid ────────────────────────────────────────────────────
const BadgeGrid = ({ allBadges, earnedIds, onNav }) => (
  <div className="card">
    <div className="c-head">
      <span className="c-title">BADGES RÉCENTS</span>
      <span className="c-action" onClick={() => onNav('badges')}>Voir tous →</span>
    </div>
    <div className="badges-grid">
      {allBadges.slice(0, 8).map((b) => (
        <div key={b.badge_id} className={`badge-box ${earnedIds.includes(b.badge_id) ? 'earned' : ''}`}>
          <div className="b-emoji">{b.icon || '🏅'}</div>
          <div className="b-name">{b.name}</div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Leaderboard mini ─────────────────────────────────────────────
const RANK_CLS = ['r1', 'r2', 'r3'];
const LeaderboardMini = ({ entries, currentUserId, onNav }) => (
  <div className="card">
    <div className="c-head">
      <span className="c-title">CLASSEMENT</span>
      <span className="c-action" onClick={() => onNav('leaderboard')}>Voir tout →</span>
    </div>
    {entries.map((e, i) => {
      const isMe = e.user_id === currentUserId;
      return (
        <div key={e.user_id} className="lb-item" style={isMe ? { background: 'rgba(0,212,255,0.04)', borderRadius: 4, padding: '7px 6px', marginTop: 4 } : {}}>
          <span className={`lb-rank ${RANK_CLS[i] || (isMe ? 'rme' : '')}`}>{i + 1}</span>
          <div className="lb-av" style={{ background: 'linear-gradient(135deg,var(--accent2),var(--accent))' }}>
            {e.username?.slice(0, 2).toUpperCase()}
          </div>
          <span className="lb-name">
            {e.username}
            {isMe && <span className="lb-me">MOI</span>}
          </span>
          <span className="lb-xp" style={isMe ? { color: 'var(--accent)' } : {}}>
            {e.xp_points?.toLocaleString()}
          </span>
        </div>
      );
    })}
  </div>
);

// ─── MOCK DATA (remplace par les vrais appels API) ─────────────────
const MOCK = {
  profile:     { xp_points: 4820, current_level: 7, streak: '12', user_id: 'user_ax' },
  recentBadges:[
    { badge_id:'b1',icon:'🏅',name:'First Blood' },
    { badge_id:'b2',icon:'🔥',name:'Streak 7j' },
    { badge_id:'b3',icon:'🌐',name:'Web Master' },
    { badge_id:'b4',icon:'💀',name:'Root Access' },
    { badge_id:'b5',icon:'🎯',name:'Précision' },
    { badge_id:'b6',icon:'🔮',name:'Cryptolord' },
    { badge_id:'b7',icon:'👁',name:'OSINT Pro' },
    { badge_id:'b8',icon:'⚡',name:'Speed Run' },
  ],
  earnedIds:   ['b1','b2','b3','b5'],
  challenges:  [
    { challenge_id:'c1',title:'SQLi Avancée',  category:'Web',     difficulty:'hard',  points:500, sessionStatus:'En cours' },
    { challenge_id:'c2',title:'RSA Broken',    category:'Crypto',  difficulty:'hard',  points:400 },
    { challenge_id:'c3',title:'PCAP Analysis', category:'Forensic',difficulty:'easy',  points:200 },
    { challenge_id:'c4',title:'XSS Stored v2', category:'Web',     difficulty:'medium',points:275 },
  ],
  enrollments: [
    { course_id:'e1',title:'Web Hacking 101',       progress:72 },
    { course_id:'e2',title:'Cryptographie Moderne', progress:23 },
    { course_id:'e3',title:'Binary Exploitation',   progress:5  },
    { course_id:'e4',title:'OSINT & Recon',         progress:48 },
  ],
  recommendations:[
    { challenge_id:'r1',title:'XSS Stored v2',  points:275 },
    { challenge_id:'r2',title:'JWT Bypass',      points:320 },
    { challenge_id:'r3',title:'SSRF Basic',      points:200 },
    { challenge_id:'r4',title:'Path Traversal',  points:180 },
  ],
  leaderboard:[
    { user_id:'u1',username:'Z3r0_Day',  xp_points:12400 },
    { user_id:'u2',username:'N3trunner', xp_points:9820  },
    { user_id:'u3',username:'Ph4ntom',   xp_points:8100  },
    { user_id:'u4',username:'Cyph3r',    xp_points:7340  },
    { user_id:'u5',username:'Rk3t',      xp_points:6900  },
    { user_id:'u6',username:'Mx0r',      xp_points:5210  },
    { user_id:'user_ax',username:'Alex_Hacker',xp_points:4820 },
  ],
};

// ─── PAGE PRINCIPALE ──────────────────────────────────────────────
export default function LearnerDashboard() {
  const navigate = useNavigate();

  const [profile,      setProfile]      = useState(null);
  const [badges,       setBadges]       = useState([]);
  const [earnedIds,    setEarnedIds]    = useState([]);
  const [challenges,   setChallenges]   = useState([]);
  const [enrollments,  setEnrollments]  = useState([]);
  const [reco,         setReco]         = useState([]);
  const [leaderboard,  setLeaderboard]  = useState([]);
  const [aiLoading,    setAiLoading]    = useState(false);
  const [loading,      setLoading]      = useState(true);

  // ── Chargement au montage ──────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        // Remplace par les vrais appels :
        // const { data: dash }   = await learnerService.getDashboard();
        // const { data: chs }    = await challengeService.getAll();
        // const { data: enrs }   = await learnerService.getEnrollments();
        // const { data: lb }     = await leaderboardService.getGlobal();

        // Mock en attendant :
        setProfile(MOCK.profile);
        setBadges(MOCK.recentBadges);
        setEarnedIds(MOCK.earnedIds);
        setChallenges(MOCK.challenges);
        setEnrollments(MOCK.enrollments);
        setLeaderboard(MOCK.leaderboard);

        // IA (appel séparé pour ne pas bloquer)
        setAiLoading(true);
        // const { data: r } = await aiService.recommend();
        // setReco(r);
        setReco(MOCK.recommendations);
        setAiLoading(false);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onNav = (path) => navigate(`/learner/${path}`);

  if (loading) {
    return (
      <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'var(--mono)',color:'var(--accent)',fontSize:13 }}>
        Chargement du dashboard...
      </div>
    );
  }

  const XP_TO_NEXT = 7200;

  return (
    <div id="root">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-wrap">
          <div className="logo-hex">◈</div>
          <span className="logo-txt">CYBER</span>
        </div>

        <nav className="nav-sect">
          <div className="nav-item active"><span className="nav-ico">⬡</span> Dashboard</div>
          <div className="nav-item" onClick={() => onNav('courses')}><span className="nav-ico">📚</span> Cours</div>
          <div className="nav-item" onClick={() => onNav('challenges')}><span className="nav-ico">🚩</span> Challenges </div>
          <div className="nav-item" onClick={() => onNav('leaderboard')}><span className="nav-ico">🏆</span> Leaderboard</div>
          <div className="nav-item" onClick={() => onNav('badges')}><span className="nav-ico">🎖</span> Badges</div>
        </nav>

        <nav className="nav-sect" style={{ marginTop: 12 }}>
          <div className="nav-item" onClick={() => onNav('ai')}><span className="nav-ico">🤖</span> Assistant IA</div>
        </nav>

        <nav className="nav-sect" style={{ marginTop: 12 }}>
          <div className="nav-item" onClick={() => onNav('profile')}><span className="nav-ico">👤</span> Profil</div>
          <div className="nav-item" onClick={() => navigate('/settings')}><span className="nav-ico">⚙</span> Paramètres</div>
          <div className="nav-item" style={{ color:'var(--danger)' }} onClick={() => navigate('/logout')}>
            <span className="nav-ico">↩</span> Déconnexion
          </div>
        </nav>

        <div className="sb-footer">
          <div className="user-wrap">
            <div className="av">AX</div>
            <div>
              <div className="u-name">Alex_Hacker</div>
              <div className="u-role">● LEARNER · NVL {profile?.current_level}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="pg-title">TABLEAU DE BORD</div>
          </div>
          <div className="top-actions">
            <div className="notif-wrap">
              <div className="icon-btn">🔔</div>
              <div className="notif-dot" />
            </div>
            <div className="icon-btn" onClick={() => onNav('ai')}>🤖</div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <StatCard label="XP Total"   value={profile?.xp_points?.toLocaleString()} delta="▲ +340 cette semaine" deltaUp accentColor="var(--accent)" />
          <StatCard label="Niveau"     value={profile?.current_level}                delta="Intermédiaire+"                  accentColor="var(--accent3)" />
          <StatCard label="Streak"     value={`${profile?.streak}j`}                delta="🔥 Record: 21 jours"             accentColor="var(--accent2)" />
          <StatCard label="Challenges" value={challenges.length}                     delta="/ 248 disponibles"               accentColor="var(--amber)" />
        </div>

        {/* XP Bar */}
        <XPBar
          current={profile?.xp_points || 0}
          required={XP_TO_NEXT}
          level={profile?.current_level || 1}
        />

        {/* Streak semaine */}
        <StreakWeek doneCount={6} />

        {/* Challenges + Cours */}
        <div className="grid-2">
          <ChallengeList challenges={challenges} onStart={onNav} />
          <CourseList    enrollments={enrollments} onNav={onNav} />
        </div>

        {/* AI + Leaderboard */}
        <div className="grid-32">
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <AIPanel recommendations={reco} loading={aiLoading} />
            <BadgeGrid allBadges={badges} earnedIds={earnedIds} onNav={onNav} />
          </div>
          <LeaderboardMini
            entries={leaderboard}
            currentUserId={profile?.user_id}
            onNav={onNav}
          />
        </div>
      </main>
    </div>
  );
}