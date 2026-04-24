import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../../api/auth';
import '../../styles/auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('learner');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.register(username, email, password, role);

      // Redirect to login page with a success message
      navigate('/login', { state: { message: 'Account created successfully! Please login.' } });
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors && res.errors.length > 0) {
        setError(res.errors[0]);
      } else {
        setError(res?.message || 'An error occurred while connecting to the server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>

      <div className="auth-container">
        {/* Left panel */}
        <div className="auth-left-panel">
          <div className="auth-corner auth-corner-tl"></div>
          <div className="auth-corner auth-corner-bl"></div>

          <div className="auth-logo">
            <div className="auth-logo-icon"></div>
            <span className="auth-logo-text">CYBERDASH</span>
          </div>

          <div className="auth-left-content">
            <div className="auth-badge">
              <div className="auth-badge-dot"></div>
              RECRUITING NOW
            </div>
            <div className="auth-left-title">Join<br />The Elite</div>
            <div className="auth-left-desc">
              Create your profile, choose your path (Learner or Instructor) and dive into our intensive training environment.
            </div>
            <div className="auth-stats-row">
              <div className="auth-stat">
                <div className="auth-stat-num">50+</div>
                <div className="auth-stat-lbl">Tools</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-num">24/7</div>
                <div className="auth-stat-lbl">Uptime</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-num">100%</div>
                <div className="auth-stat-lbl">Hands-on</div>
              </div>
            </div>
          </div>

          <div className="auth-terminal-line">$ useradd -m new_hacker</div>
        </div>

        {/* Right panel */}
        <div className="auth-right-panel">
          <div className="auth-form-title">REGISTER</div>
          <div className="auth-form-sub">// Create your digital identity</div>

          <form onSubmit={handleRegister} noValidate>
            <div className="auth-role-select">
              <button
                type="button"
                id="role-learner"
                className={`auth-role-btn ${role === 'learner' ? 'active' : ''}`}
                onClick={() => setRole('learner')}
              >
                LEARNER
              </button>
              <button
                type="button"
                id="role-instructor"
                className={`auth-role-btn ${role === 'instructor' ? 'active' : ''}`}
                onClick={() => setRole('instructor')}
              >
                INSTRUCTOR
              </button>
            </div>

            <div className="auth-field" style={{ marginBottom: '16px' }}>
              <label className="auth-field-label">Username</label>
              <input
                id="register-username"
                className={`auth-field-input ${username ? 'active' : ''}`}
                type="text"
                placeholder="Neo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="auth-field" style={{ marginBottom: '16px' }}>
              <label className="auth-field-label">Email</label>
              <input
                id="register-email"
                className={`auth-field-input ${email ? 'active' : ''}`}
                type="email"
                placeholder="neo@matrix.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field" style={{ marginBottom: '16px' }}>
              <label className="auth-field-label">Password</label>
              <input
                id="register-password"
                className={`auth-field-input ${password ? 'active' : ''}`}
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="auth-error-msg" style={{ marginBottom: '16px' }}>{error}</div>}

            <button id="register-submit" type="submit" className="auth-btn-primary" disabled={isLoading} style={{ margin: '16px 0 12px 0' }}>
              {isLoading ? 'PROCESSING...' : 'REGISTER →'}
            </button>
          </form>

          <div className="auth-form-footer">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
