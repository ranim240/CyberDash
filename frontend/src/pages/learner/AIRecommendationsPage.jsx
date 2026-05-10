import React, { useState, useEffect, useContext } from 'react';
import LearnerLayout from '../../components/learner/LearnerLayout.jsx';
import './AIRecommendationsPage.css';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useLearnerStats } from '../../hooks/useLearnerStats.js';
import { getSkills } from '../../api/learner.js';
import { getRecommendations } from '../../api/ai.js';
import { Link } from 'react-router-dom';

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconBarChart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconActivity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconCompass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function ProbabilityRing({ probability }) {
  const pct = Math.round(probability * 100);
  const r = 27;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (probability * circumference);

  return (
    <div className="ai-rec__prob-ring">
      <svg viewBox="0 0 58 58">
        <circle className="ai-rec__prob-bg" cx="29" cy="29" r={r} />
        <circle
          className="ai-rec__prob-fill"
          cx="29" cy="29" r={r}
          style={{ strokeDashoffset: offset }}
        />
      </svg>
      <span className="ai-rec__prob-value">{pct}%</span>
    </div>
  );
}

function SkillBar({ name, score }) {
  const pct = Math.round(score * 100);
  const level = pct >= 70 ? 'high' : pct >= 45 ? 'mid' : 'low';
  return (
    <div className="ai-rec__skill">
      <div className="ai-rec__skill-header">
        <span className="ai-rec__skill-name">{name}</span>
        <span className="ai-rec__skill-score">{pct}/100</span>
      </div>
      <div className="ai-rec__skill-bar">
        <div
          className={`ai-rec__skill-fill ai-rec__skill-fill--${level}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AIRecommendationsPage() {
  const { user } = useContext(AuthContext);
  const { stats, dashboard, loading: statsLoading } = useLearnerStats();

  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const [skillsRes, recsRes] = await Promise.all([
          getSkills(),
          getRecommendations(user.userId).catch(() => ({ data: { recommendations: [] } }))
        ]);
        if (!cancelled) {
          setSkills(skillsRes.data?.data || []);
          setRecommendations(recsRes.data?.recommendations || []);
        }
      } catch (err) {
        console.error('Failed to load recommendations data:', err);
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
        <div style={{ padding: '2rem', color: '#fff' }}>Loading Recommendations...</div>
      </LearnerLayout>
    );
  }

  return (
    <LearnerLayout stats={stats}>
      <div className="ai-rec">

        {/* ── TOPBAR ── */}
        <div className="ai-rec__topbar">
          <div className="ai-rec__topbar-left">
            <h1>Smart Recommendations</h1>
            <p>Challenges selected for <strong>{user?.username}</strong> — perfectly balanced for your current skill level</p>
          </div>
          <div className="ai-rec__model-badge">
            <span className="ai-rec__model-dot" />
            Adaptive Engine Active
          </div>
        </div>

        {/* ── SKILL PROFILE + LEARNING INSIGHTS ── */}
        <div className="ai-rec__cols">
          {/* Skill Profile */}
          <div className="ai-rec__card">
            <div className="ai-rec__card-header">
              <h3><IconBarChart /> Your Strengths & Weaknesses</h3>
              <span className="ai-rec__card-badge">{skills.length} skills tracked</span>
            </div>
            <div className="ai-rec__skills">
              {skills.length > 0 ? skills.slice(0, 6).map((skill) => (
                <SkillBar key={skill.name} name={skill.name} score={skill.score} />
              )) : (
                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No skills tracked yet.</div>
              )}
            </div>
          </div>

          {/* Learning Insights */}
          <div className="ai-rec__card">
            <div className="ai-rec__card-header">
              <h3><IconActivity /> Learning Insights</h3>
              <span className="ai-rec__card-badge">Updated in real-time</span>
            </div>
            <div className="ai-rec__skills" style={{ gap: '1rem' }}>
              {[
                { label: 'Overall Success Rate',     value: `${stats?.success_rate || 0}%`,   desc: 'Based on all your attempts' },
                { label: 'Course Completion',        value: `${dashboard?.enrollments?.filter(e => e.completion_status === 'completed').length || 0} courses`,   desc: 'Courses you\'ve read through' },
                { label: 'Total Submissions',        value: `${stats?.total_submissions || 0}`,   desc: 'Total challenge attempts' },
                { label: 'Solved Challenges',        value: `${stats?.solved_challenges || 0}`,   desc: 'Challenges successfully completed' },
                { label: 'Active Streak',            value: `${stats?.streak || 0} days`, desc: 'Consecutive days of practice' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0', borderBottom: '1px solid rgba(30,58,95,.4)' }}>
                  <div>
                    <div style={{ fontSize: '.82rem', fontWeight: 600, color: '#e2e8f0' }}>{item.label}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '.6rem', color: '#64748b', letterSpacing: '.5px' }}>{item.desc}</div>
                  </div>
                  <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '.9rem', fontWeight: 700, color: '#00d4ff' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ── RECOMMENDED CHALLENGES ── */}
        <div className="ai-rec__recs">
          <h2 className="ai-rec__section-title"><IconCompass /> Recommended For You</h2>
          <div className="ai-rec__recs-grid">
            {recommendations.length > 0 ? recommendations.map((rec) => (
              <div key={rec.challenge_id} className="ai-rec__rec-item">
                <ProbabilityRing probability={rec.predicted_success} />
                <div className="ai-rec__rec-info">
                  <div className="ai-rec__rec-title">{rec.title}</div>
                  <div className="ai-rec__rec-cat">{rec.difficulty}</div>
                </div>
                <div className="ai-rec__rec-right">
                  <span className="ai-rec__rec-pts">+{rec.points} pts</span>
                  <Link to={`/learner/challenges/${rec.challenge_id}`} className="ai-rec__rec-action" style={{textDecoration: 'none'}}>Start →</Link>
                </div>
              </div>
            )) : (
              <div style={{ color: '#94a3b8', fontSize: '1rem', padding: '2rem' }}>
                No recommendations right now. Keep learning and come back later!
              </div>
            )}
          </div>
        </div>

      </div>
    </LearnerLayout>
  );
}
