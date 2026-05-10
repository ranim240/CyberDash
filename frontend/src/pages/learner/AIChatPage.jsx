import React, { useState, useRef, useEffect, useContext } from 'react';
import LearnerLayout from '../../components/learner/LearnerLayout.jsx';
import './AIChatPage.css';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useLearnerStats } from '../../hooks/useLearnerStats.js';
import { getSkills } from '../../api/learner.js';
import { getSessions, getHistory, sendMessage, startSession } from '../../api/chat.js';

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconMessageCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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
const IconCpu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/>
    <line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AIChatPage() {
  const { user } = useContext(AuthContext);
  const { stats } = useLearnerStats();

  const [skills, setSkills] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initial load
  useEffect(() => {
    if (!user) return;
    async function init() {
      try {
        const [skillsRes, sessRes] = await Promise.all([
          getSkills(),
          getSessions().catch(() => ({ data: { data: [] } }))
        ]);
        setSkills(skillsRes.data?.data || []);
        const loadedSessions = sessRes.data?.data || [];
        setSessions(loadedSessions);

        if (loadedSessions.length > 0) {
          handleSessionSelect(loadedSessions[0]);
        }
      } catch (err) {
        console.error("Failed to load chat data", err);
      }
    }
    init();
  }, [user]);

  const handleSessionSelect = async (session) => {
    setActiveSession(session);
    setMessages([]);
    try {
      const histRes = await getHistory(session.session_id);
      setMessages(histRes.data?.data || []);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleNewSession = async () => {
    try {
      const res = await startSession({ context_type: 'general', context_id: null });
      const newSess = res.data?.data;
      if (newSess) {
        setSessions([newSess, ...sessions]);
        setActiveSession(newSess);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to start session", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeSession) return;
    
    const userMsg = {
      role: 'user',
      sender: 'user',
      content: input.trim(),
      created_at: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await sendMessage({
        session_id: activeSession.session_id,
        content: userMsg.content
      });
      const assistantMsg = {
        role: 'assistant',
        sender: 'assistant',
        content: res.data?.data?.message || 'Error parsing response.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages((prev) => [...prev, {
        role: 'assistant', sender: 'assistant', content: 'Connection to AI Tutor failed. Please try again.', created_at: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const strongSkills = skills.filter(s => s.score >= 0.7).map(s => `${s.name} (${Math.round(s.score*100)})`);
  const weakSkills = skills.filter(s => s.score <= 0.4).map(s => `${s.name} (${Math.round(s.score*100)})`);

  return (
    <LearnerLayout stats={stats}>
      <div className="ai-chat">

        {/* ── SESSIONS SIDEBAR ── */}
        <div className="ai-chat__sidebar">
          <div className="ai-chat__sidebar-header">
            <div className="ai-chat__sidebar-title"><IconMessageCircle /> Sessions</div>
            <button className="ai-chat__new-btn" onClick={handleNewSession}><IconPlus /> New Session</button>
          </div>

          <div className="ai-chat__sessions-list">
            {sessions.map((session) => (
              <div
                key={session.session_id}
                className={`ai-chat__session-item ${activeSession?.session_id === session.session_id ? 'ai-chat__session-item--active' : ''}`}
                onClick={() => handleSessionSelect(session)}
              >
                <div className={`ai-chat__session-type ai-chat__session-type--${session.context_type}`}>
                  {session.context_type === 'challenge' ? <><IconFlag /> Challenge</> : <><IconBookOpen /> General</>}
                </div>
                <div className="ai-chat__session-name">{session.context_type === 'challenge' ? 'Challenge Help' : 'General Learning'}</div>
                <div className="ai-chat__session-date">{new Date(session.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>

          <div className="ai-chat__sidebar-footer">
            <div className="ai-chat__model-info">
              <span className="ai-chat__model-dot" />
              AI Tutor Online
            </div>
            <div className="ai-chat__model-info">
              <span className="ai-chat__model-dot" />
              Personalized Mode
            </div>
          </div>
        </div>

        {/* ── MAIN CHAT ── */}
        <div className="ai-chat__main">

          {/* Header */}
          <div className="ai-chat__header">
            <div className="ai-chat__header-left">
              <div className="ai-chat__header-icon"><IconCpu /></div>
              <div className="ai-chat__header-info">
                <h2>AI Tutor</h2>
                <span>{activeSession?.context_type === 'challenge' ? 'Challenge Context Active' : 'General Learning'}</span>
              </div>
            </div>
            <div className="ai-chat__header-right">
              <span className="ai-chat__header-badge ai-chat__header-badge--online">Online</span>
              {activeSession?.context_type === 'challenge' && (
                <span className="ai-chat__header-badge ai-chat__header-badge--context">
                  Challenge Context
                </span>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="ai-chat__messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-chat__msg ai-chat__msg--${msg.sender === 'user' ? 'user' : 'assistant'}`}>
                <div className="ai-chat__msg-avatar">
                  {msg.sender === 'user' ? user?.username?.charAt(0)?.toUpperCase() : <IconCpu />}
                </div>
                <div className="ai-chat__msg-content">
                  <span className="ai-chat__msg-sender">
                    {msg.sender === 'user' ? 'You' : 'AI Tutor'}
                  </span>
                  <div className="ai-chat__msg-bubble">
                    {msg.content}
                  </div>
                  <span className="ai-chat__msg-time">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-chat__msg ai-chat__msg--assistant">
                <div className="ai-chat__msg-avatar"><IconCpu /></div>
                <div className="ai-chat__msg-content">
                  <span className="ai-chat__msg-sender">AI Tutor</span>
                  <div className="ai-chat__msg-bubble">
                    <div className="ai-chat__typing">
                      <div className="ai-chat__typing-dots">
                        <span className="ai-chat__typing-dot" />
                        <span className="ai-chat__typing-dot" />
                        <span className="ai-chat__typing-dot" />
                      </div>
                      <span className="ai-chat__typing-label">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="ai-chat__input-area">
            <div className="ai-chat__input-wrap">
              <textarea
                className="ai-chat__input"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 500))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about cybersecurity..."
                rows={1}
                disabled={isTyping || !activeSession}
              />
              <span className="ai-chat__char-count">{input.length}/500</span>
            </div>
            <button
              className="ai-chat__send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isTyping || !activeSession}
            >
              <IconSend /> Send
            </button>
          </div>
        </div>

        {/* ── CONTEXT PANEL ── */}
        <div className="ai-chat__context-panel">
          <div className="ai-chat__context-section">
            <h4><IconUser /> Your Profile</h4>
            <div className="ai-chat__context-item">
              <span className="ai-chat__context-item-label">Username</span>
              <span className="ai-chat__context-item-value">{user?.username}</span>
            </div>
            <div className="ai-chat__context-item">
              <span className="ai-chat__context-item-label">Level</span>
              <span className="ai-chat__context-item-value" style={{ color: '#10b981' }}>Lv.{stats?.current_level || 1}</span>
            </div>
          </div>

          <div className="ai-chat__context-section">
            <h4><IconShield /> Strong Skills</h4>
            <div>
              {strongSkills.length > 0 ? strongSkills.map((s) => (
                <span key={s} className="ai-chat__skill-tag ai-chat__skill-tag--strong">{s}</span>
              )) : <span className="ai-chat__skill-tag" style={{opacity: 0.5}}>None yet</span>}
            </div>
          </div>

          <div className="ai-chat__context-section">
            <h4><IconTrendUp /> Areas to Improve</h4>
            <div>
              {weakSkills.length > 0 ? weakSkills.map((s) => (
                <span key={s} className="ai-chat__skill-tag ai-chat__skill-tag--weak">{s}</span>
              )) : <span className="ai-chat__skill-tag" style={{opacity: 0.5}}>Keep practicing</span>}
            </div>
          </div>

          <div className="ai-chat__context-section">
            <h4><IconTarget /> Active Objective</h4>
            <div className="ai-chat__context-item">
              <span className="ai-chat__context-item-label">Target</span>
              <span className="ai-chat__context-item-value" style={{ color: '#00d4ff' }}>Authentication Flow</span>
            </div>
            <div className="ai-chat__context-item">
              <span className="ai-chat__context-item-label">Mission</span>
              <span className="ai-chat__context-item-value">Admin Access</span>
            </div>
            <div className="ai-chat__context-item">
              <span className="ai-chat__context-item-label">Reward</span>
              <span className="ai-chat__context-item-value" style={{ color: '#f59e0b' }}>+150 XP</span>
            </div>
          </div>
        </div>

      </div>
    </LearnerLayout>
  );
}
