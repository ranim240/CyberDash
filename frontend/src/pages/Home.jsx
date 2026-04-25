import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="page">
      <div className="scanbar"></div>

      {/* NAV */}
      <nav>
        <div className="logo">
          <div className="logo-hex">◈</div>
          <span className="logo-txt">CyberDash</span>
        </div>
        <div className="nav-links">
          <Link to="/challenges">Challenges</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="nav-right">
          <Link to="/login" className="btn-ghost">Login</Link>
          <Link to="/register" className="btn-pri">Get Started →</Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <div className="badge-live">
            <div className="badge-dot"></div> Mission: Initiative Platform
          </div>
          <h1>CYBER<span>DASH</span></h1>
          <p className="hero-sub">
            Every system has a weakness. Every flag has a secret. Join hackers mastering
            the art of the exploit in our state-of-the-art CTF environment.
          </p>
          <div className="hero-btns">
            <Link to="/register" className="btn-primary-lg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Start Hacking
            </Link>
            <Link to="/leaderboard" className="btn-outline">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Leaderboard
            </Link>
          </div>
          <div className="mini-stats">
            <div className="mini-stat"><div className="mini-dot d-green"></div> 1.2k Active Learners</div>
            <div className="mini-stat"><div className="mini-dot d-purple"></div> Free Tier Available</div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="terminal-header">
            <div className="t-dots">
              <div className="t-dot t-red"></div>
              <div className="t-dot t-yellow"></div>
              <div className="t-dot t-green-dot"></div>
            </div>
            <div className="t-title">cyberdash — terminal</div>
          </div>
          <div className="terminal-body">
            <div>&gt; <span className="b">nmap</span> -sV target.ctf.local</div>
            <div><span className="g">PORT</span>&nbsp;&nbsp;&nbsp; STATE SERVICE VERSION</div>
            <div><span className="g">22/tcp</span>  open  ssh&nbsp;&nbsp;&nbsp; OpenSSH 8.2</div>
            <div><span className="g">80/tcp</span>  open  http&nbsp;&nbsp; nginx 1.18.0</div>
            <div><span className="g">443/tcp</span> open  https</div>
            <div>&gt; <span className="b">gobuster</span> dir -u http://target...</div>
            <div><span className="p">/admin</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (Status: <span className="g">200</span>)</div>
            <div><span className="p">/backup</span>&nbsp;&nbsp;&nbsp;&nbsp; (Status: <span className="g">301</span>)</div>
            <div>&gt; <span className="cursor"></span></div>
          </div>
        </div>
      </div>

      {/* STATS BAND */}
      <div className="stats-band">
        <div className="stat-cell">
          <div className="stat-icon">◈ TOTAL LEARNERS</div>
          <div className="stat-num"><span>1.2k</span></div>
        </div>
        <div className="stat-cell">
          <div className="stat-icon">◈ CHALLENGES</div>
          <div className="stat-num"><span>248</span></div>
        </div>
        <div className="stat-cell">
          <div className="stat-icon">◈ SATISFACTION</div>
          <div className="stat-num"><span>94%</span></div>
        </div>
        <div className="stat-cell">
          <div className="stat-icon">◈ AI SUPPORT</div>
          <div className="stat-num"><span>24/7</span></div>
        </div>
      </div>

      {/* STEPS */}
      <section>
        <div className="sec-head center">
          <h2>FROM ZERO TO HERO IN 3 STEPS</h2>
          <div className="line-c"></div>
          <p>Our structured learning path ensures you build fundamental skills before tackling elite-level security vulnerabilities.</p>
        </div>
        <div className="steps-wrap">
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-circle">01</div>
            <h3>Create Account</h3>
            <p>Join for free and set up your hacker profile. Choose your specialization path.</p>
          </div>
          <div className="step">
            <div className="step-circle">02</div>
            <h3>Pick a Challenge</h3>
            <p>Filter by category or difficulty. Start your containerized target environment instantly.</p>
          </div>
          <div className="step">
            <div className="step-circle">03</div>
            <h3>PWN & Earn XP</h3>
            <p>Find the flag, submit it to the system, earn XP, and climb the global leaderboard.</p>
          </div>
        </div>
      </section>

      {/* CHALLENGES */}
      <section>
        <div className="sec-flex">
          <div className="sec-head">
            <h2>EXPLORE CHALLENGES</h2>
            <div className="line"></div>
            <p>Hand-picked missions to get you started on your cybersecurity journey.</p>
          </div>
          <Link to="/challenges" className="btn-outline sm">View All Missions →</Link>
        </div>
        <div className="chal-grid">
          <div className="chal">
            <div className="chal-img img-web">
              <div className="chal-img-icon">🌐</div>
              <div className="chal-img-line"></div>
              <div className="chal-tags"><span className="tag t-web">WEB EXPLOITATION</span></div>
              <div className="chal-diff"><span className="d-easy">EASY</span></div>
            </div>
            <div className="chal-body">
              <h3>SQL-Inj Level 1</h3>
              <p>Objective: Exploit the buffer overflow to leak the hidden kernel secret.</p>
            </div>
            <div className="chal-foot">
              <span className="pts">◈ 100 XP</span>
              <Link to="/challenges/1" className="deploy">Start Challenge →</Link>
            </div>
          </div>

          <div className="chal">
            <div className="chal-img img-pwn">
              <div className="chal-img-icon">💀</div>
              <div className="chal-img-line"></div>
              <div className="chal-tags"><span className="tag t-pwn">PWN</span></div>
              <div className="chal-diff"><span className="d-hard">HARD</span></div>
            </div>
            <div className="chal-body">
              <h3>Binary Overflow</h3>
              <p>Objective: Exploit the buffer overflow to leak the hidden kernel secret.</p>
            </div>
            <div className="chal-foot">
              <span className="pts">◈ 450 XP</span>
              <Link to="/challenges/2" className="deploy">Start Challenge →</Link>
            </div>
          </div>

          <div className="chal">
            <div className="chal-img img-cry">
              <div className="chal-img-icon">🔐</div>
              <div className="chal-img-line"></div>
              <div className="chal-tags"><span className="tag t-cry">CRYPTOGRAPHY</span></div>
              <div className="chal-diff"><span className="d-med">MEDIUM</span></div>
            </div>
            <div className="chal-body">
              <h3>Cipher Hunt</h3>
              <p>Objective: Exploit the buffer overflow to leak the hidden kernel secret.</p>
            </div>
            <div className="chal-foot">
              <span className="pts">◈ 250 XP</span>
              <Link to="/challenges/3" className="deploy">Start Challenge →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section>
        <div className="sec-head center">
          <h2>EVERYTHING YOU NEED TO MASTER CTF</h2>
          <div className="line-c"></div>
          <p>From beginner to elite hacker, our platform provides the tools, environment, and community to accelerate your cybersecurity journey.</p>
        </div>
        <div className="feat-grid">
          <div className="feat">
            <div className="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </div>
            <div className="feat-content">
              <h3>Diverse Challenges</h3>
              <p>Master every domain: Web Exploitation, Cryptography, Forensics, Reverse Engineering, Pwn, and OSINT. Updated weekly with new targets.</p>
            </div>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
                <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
              </svg>
            </div>
            <div className="feat-content">
              <h3>AI Assistant</h3>
              <p>Stuck on a challenge? Our AI analyzes your approach and provides intelligent hints without giving away the flag.</p>
            </div>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="feat-content">
              <h3>Gamification</h3>
              <p>Earn XP, unlock achievement badges, maintain daily streaks, and level up your profile from Script Kiddie to Elite Hacker.</p>
            </div>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="feat-content">
              <h3>Skill Analytics</h3>
              <p>Visualize your progress with detailed skill trees. Identify your weak spots and get recommended challenges to improve your tactical proficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-banner">
        <h2>READY TO START YOUR JOURNEY?</h2>
        <p>Join a community of students and professionals mastering cybersecurity through hands-on practice.</p>
        <Link to="/register" className="btn-cta">Create Free Account →</Link>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="foot-inner">
          <div className="foot-brand">
            <div className="logo" style={{ marginBottom: '12px' }}>
              <div className="logo-hex">◈</div>
              <span className="logo-txt">CyberDash</span>
            </div>
            <p>The next-generation CTF platform designed for students, researchers, and security professionals to test and improve their skills in a safe environment.</p>
            <div className="foot-socials">
              <a href="#" className="social-btn" aria-label="Twitter">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className="social-btn" aria-label="Discord">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                </svg>
              </a>
              <a href="#" className="social-btn" aria-label="GitHub">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
              </a>
            </div>
          </div>
          <div className="foot-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/challenges">Challenges</Link></li>
              <li><Link to="/ctf">Capture the Flag</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/academy">Academy</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/docs">Documentation</Link></li>
              <li><Link to="/api">API Reference</Link></li>
              <li><Link to="/blog">Community Blog</Link></li>
              <li><Link to="/status">System Status</Link></li>
            </ul>
          </div>
          <div className="foot-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/conduct">Code of Conduct</Link></li>
              <li><Link to="/security">Security Disclosure</Link></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span className="foot-copy">COPYRIGHT © 2026 CYBERDASH. ALL RIGHTS RESERVED.</span>
          <div className="foot-badges">
            <span className="foot-badge">ENCRYPTED CONNECTION</span>
            <span className="foot-badge">GLOBAL NODE V4.2</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;