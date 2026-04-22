import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../../services/auth.service';
import '../../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const data = await authService.forgotPassword(email);
      setSuccess(data.message || 'If this email exists, a reset link has been sent.');
      setEmail('');
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
              RECOVERY PROTOCOL
            </div>
            <div className="auth-left-title">Lost<br />Access?</div>
            <div className="auth-left-desc">
              Don't panic. Enter your email address and our system will send you a secure reset protocol to recover your access.
            </div>
            <div className="auth-stats-row">
              <div className="auth-stat">
                <div className="auth-stat-num">RSA</div>
                <div className="auth-stat-lbl">Encryption</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-num">15m</div>
                <div className="auth-stat-lbl">Validity</div>
              </div>
            </div>
          </div>

          <div className="auth-terminal-line">$ ./cyberdash --reset-protocol --target=user</div>
        </div>

        {/* Right panel */}
        <div className="auth-right-panel">
          <div className="auth-form-title">RESET PASSWORD</div>
          <div className="auth-form-sub">// Password recovery request</div>

          <form onSubmit={handleForgotPassword} noValidate>
            <div className="auth-field">
              <label className="auth-field-label">Email</label>
              <input
                id="forgot-email"
                className={`auth-field-input ${email ? 'active' : ''}`}
                type="email"
                placeholder="hacker@cyberdash.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <div className="auth-error-msg" style={{ marginBottom: '16px' }}>{error}</div>}
            {success && <div className="auth-success-msg" style={{ marginBottom: '16px' }}>{success}</div>}

            <button id="forgot-submit" type="submit" className="auth-btn-primary" disabled={isLoading} style={{ marginTop: '16px' }}>
              {isLoading ? 'SENDING...' : 'SEND RESET LINK →'}
            </button>
          </form>

          <div className="auth-form-footer">
            <Link to="/login">← Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
