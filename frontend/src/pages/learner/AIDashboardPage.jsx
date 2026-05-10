import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import LearnerLayout from '../../components/learner/LearnerLayout.jsx';
import './AIDashboardPage.css';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useLearnerStats } from '../../hooks/useLearnerStats.js';
import { getSkills } from '../../api/learner.js';
import { getRecommendations } from '../../api/ai.js';
import { getSessions } from '../../api/chat.js';

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);
const IconMessages = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconFlag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);
const IconBookOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

// ─── HELPER ────────────────────────────────────────────────────────────────
const getSkillLevel = (score) => {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'mid';
  return 'low';
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AIDashboardPage() {
  const { user } = useContext(AuthContext);
  const { stats, loading: statsLoading } = useLearnerStats();
  
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const [skillsRes, recsRes, chatRes] = await Promise.all([
          getSkills(),
          getRecommendations(user.userId).catch(() => ({ data: { recommendations: [] } })),
          getSessions().catch(() => ({ data: { data: [] } }))
        ]);

        if (!cancelled) {
          setSkills(skillsRes.data?.data || []);
          setRecommendations(recsRes.data?.recommendations || []);
          setChatSessions(chatRes.data?.data || []);
        }
      } catch (err) {
        console.error('Failed to load AI Dashboard data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [user]);

  if (statsLoading || loading) {
    return (
      <LearnerLayout>
        <div style={{ padding: '2rem', color: '#fff' }}>Loading AI Dashboard...</div>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout stats={stats}>
      <div className="ai-dash">

        {/* ── TOPBAR ── */}
        <div className="ai-dash__topbar">
          <div className="ai-dash__topbar-left">
            <h1>AI Learning Hub</h1>
            <p>Your personalized adaptive learning experience — challenges and guidance tailored to your skill level.</p>
          </div>
          <div className="ai-dash__status-badges">
            <div className="ai-dash__status-badge ai-dash__status-badge--chat">
              <span className="ai-dash__status-dot ai-dash__status-dot--cyan" />
              AI Tutor Online
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="ai-dash__stats">
          <div className="ai-dash__stat">
            <div className="ai-dash__stat-icon"><IconTarget /></div>
            <div className="ai-dash__stat-value">{recommendations.length}</div>
            <div className="ai-dash__stat-label">Recommended for you</div>
            <div className="ai-dash__stat-sub">Matched to your level</div>
          </div>
          <div className="ai-dash__stat">
            <div className="ai-dash__stat-icon"><IconMessages /></div>
            <div className="ai-dash__stat-value">{chatSessions.length}</div>
            <div className="ai-dash__stat-label">Tutor conversations</div>
            <div className="ai-dash__stat-sub">Active sessions</div>
          </div>
          <div className="ai-dash__stat">
            <div className="ai-dash__stat-icon"><IconTrendUp /></div>
            <div className="ai-dash__stat-value">{stats?.success_rate || 0}%</div>
            <div className="ai-dash__stat-label">Success rate</div>
            <div className="ai-dash__stat-sub">Overall accuracy</div>
          </div>
          <div className="ai-dash__stat">
            <div className="ai-dash__stat-icon"><IconZap /></div>
            <div className="ai-dash__stat-value">{stats?.streak || 0}</div>
            <div className="ai-dash__stat-label">Day streak</div>
            <div className="ai-dash__stat-sub">Keep it going!</div>
          </div>
        </div>

        {/* ── TWO COLUMNS ── */}
        <div className="ai-dash__cols">

          {/* Recommended Challenges */}
          <div className="ai-dash__card ai-dash__card--rec">
            <div className="ai-dash__card-header">
              <h3><IconShield /> Challenges For You</h3>
              <Link to="/learner/ai-recommendations" className="ai-dash__card-link">View all →</Link>
            </div>
            <div className="ai-dash__rec-list">
              {recommendations.length > 0 ? recommendations.slice(0, 4).map((rec) => (
                <div key={rec.challenge_id} className="ai-dash__rec-item">
                  <span className="ai-dash__rec-prob">{Math.round(rec.predicted_success * 100)}%</span>
                  <div className="ai-dash__rec-info">
                    <div className="ai-dash__rec-name">{rec.title}</div>
                    <div className="ai-dash__rec-meta">{rec.difficulty}</div>
                  </div>
                  <span className="ai-dash__rec-pts">+{rec.points} pts</span>
                </div>
              )) : (
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '1rem' }}>No new recommendations available right now.</div>
              )}
            </div>
          </div>

          {/* AI Tutor Sessions */}
          <div className="ai-dash__card ai-dash__card--chat">
            <div className="ai-dash__card-header">
              <h3><IconMessages /> AI Tutor Sessions</h3>
              <Link to="/learner/ai-chat" className="ai-dash__card-link">Open tutor →</Link>
            </div>
            <div className="ai-dash__chat-list">
              {chatSessions.length > 0 ? chatSessions.slice(0, 3).map((session) => (
                <div key={session.session_id} className="ai-dash__chat-item">
                  <div className={`ai-dash__chat-icon ai-dash__chat-icon--${session.context_type}`}>
                    {session.context_type === 'challenge' ? <IconFlag /> : <IconBookOpen />}
                  </div>
                  <div className="ai-dash__chat-info">
                    <div className="ai-dash__chat-name">
                      {session.context_type === 'challenge' ? 'Challenge Help' : 'General Learning'}
                    </div>
                    <div className="ai-dash__chat-meta">
                      {new Date(session.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '1rem' }}>No recent chat sessions.</div>
              )}
            </div>
          </div>
        </div>

        {/* ── SKILL PROFILE ── */}
        <div className="ai-dash__skills-summary">
          <div className="ai-dash__skills-card">
            <div className="ai-dash__skills-header">
              <h3><IconBarChart /> Your Skill Profile</h3>
              <Link to="/learner/ai-recommendations" className="ai-dash__card-link">Details →</Link>
            </div>
            <div className="ai-dash__skills-grid">
              {skills.length > 0 ? skills.slice(0, 6).map((skill) => {
                const lvl = getSkillLevel(skill.score);
                const pct = Math.round(skill.score * 100);
                return (
                  <div key={skill.name} className="ai-dash__skill-item">
                    <div className={`ai-dash__skill-score ai-dash__skill-score--${lvl}`}>
                      {pct}
                    </div>
                    <div className="ai-dash__skill-name">{skill.name}</div>
                    <div className="ai-dash__skill-bar">
                      <div
                        className={`ai-dash__skill-fill ai-dash__skill-fill--${lvl}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              }) : (
                <div style={{ color: '#94a3b8', fontSize: '0.9rem', padding: '1rem', gridColumn: '1 / -1' }}>Not enough data to build your skill profile yet. Keep solving challenges!</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </LearnerLayout>
  );
}
