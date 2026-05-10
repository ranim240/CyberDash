import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import * as authService from '../../api/auth';
import '../../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Show success message if redirected from registration
  const successMessage = location.state?.message || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);

      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/learner/dashboard');
      }
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
              PLATEFORME CTF ACTIVE
            </div>
            <div className="auth-left-title">Maîtrisez<br />la Cybersécurité</div>
            <div className="auth-left-desc">
              Apprenez par la pratique avec des challenges CTF réels, un système de progression XP et une IA qui vous guide à chaque étape.
            </div>
            <div className="auth-stats-row">
              <div className="auth-stat">
                <div className="auth-stat-num">248</div>
                <div className="auth-stat-lbl">Challenges</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-num">1.2k</div>
                <div className="auth-stat-lbl">Learners</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-num">94%</div>
                <div className="auth-stat-lbl">Satisfaction</div>
              </div>
            </div>
          </div>

          <div className="auth-terminal-line">$ ./cyberdash --mode=learning --ai=enabled</div>
        </div>

        {/* Right panel */}
        <div className="auth-right-panel">
          <div className="auth-form-title">CONNEXION</div>
          <div className="auth-form-sub">// Accès sécurisé à la plateforme</div>

          {successMessage && (
            <div className="auth-success-msg" style={{ marginBottom: '16px' }}>{successMessage}</div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div className="auth-field">
              <label className="auth-field-label">Email</label>
              <input
                id="login-email"
                className={`auth-field-input ${email ? 'active' : ''}`}
                type="email"
                placeholder="hacker@cyberdash.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-field-label">Mot de passe</label>
              <input
                id="login-password"
                className={`auth-field-input ${password ? 'active' : ''}`}
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="auth-error-msg" style={{ marginBottom: '16px' }}>{error}</div>}

            <div style={{ textAlign: 'center', marginBottom: '8px', marginTop: '16px', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--muted)' }}>
              POST /api/auth/login
            </div>
            <button id="login-submit" type="submit" className="auth-btn-primary" disabled={isLoading} style={{ marginTop: '0px' }}>
              {isLoading ? 'CONNEXION...' : 'SE CONNECTER →'}
            </button>
          </form>

          <div className="auth-form-footer" style={{ marginTop: '16px' }}>
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
            &nbsp;·&nbsp;
            <Link to="/register">Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
