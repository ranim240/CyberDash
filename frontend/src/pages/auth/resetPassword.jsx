import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import * as authService from '../../api/auth';
import '../../styles/auth.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { userId, token } = useParams();

  // Read from URL path params (from the email link)

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.resetPassword(userId, token, newPassword, confirmPassword);
      setSuccess(data.message || 'Password has been successfully reset.');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful! Please login with your new password.' } });
      }, 2000);
    } catch (err) {
      const res = err.response?.data;
      if (res?.errors && res.errors.length > 0) {
        setError(res.errors[0]);
      } else {
        setError(res?.message || 'An error occurred. The link may be invalid or expired.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If no token data in URL, show an error
  if (!userId || !token) {
    return (
      <div className="auth-layout">
        <div className="orb orb1"></div>
        <div className="orb orb2"></div>

        <div className="auth-container">
          <div className="auth-left-panel">
            <div className="auth-corner auth-corner-tl"></div>
            <div className="auth-corner auth-corner-bl"></div>

            <div className="auth-logo">
              <div className="auth-logo-icon"></div>
              <span className="auth-logo-text">CYBERDASH</span>
            </div>

            <div className="auth-left-content">
              <div className="auth-badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                <div className="auth-badge-dot" style={{ background: 'var(--danger)' }}></div>
                INVALID LINK
              </div>
              <div className="auth-left-title">Access<br />Denied</div>
              <div className="auth-left-desc">
                This reset link is invalid or incomplete. Please request a new password reset from the login page.
              </div>
            </div>

            <div className="auth-terminal-line">$ error: missing token parameters</div>
          </div>

          <div className="auth-right-panel">
            <div className="auth-form-title">INVALID LINK</div>
            <div className="auth-form-sub">// Missing required parameters</div>
            <div className="auth-error-msg" style={{ marginBottom: '24px' }}>
              This password reset link is invalid or has been tampered with.
            </div>
            <div className="auth-form-footer">
              <Link to="/forgot-password">Request a new reset link</Link>
              &nbsp;·&nbsp;
              <Link to="/login">← Back to login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              RESET IN PROGRESS
            </div>
            <div className="auth-left-title">New<br />Password</div>
            <div className="auth-left-desc">
              Choose a strong password. We recommend at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols.
            </div>
            <div className="auth-stats-row">
              <div className="auth-stat">
                <div className="auth-stat-num">8+</div>
                <div className="auth-stat-lbl">Characters</div>
              </div>
              <div className="auth-stat">
                <div className="auth-stat-num">AES</div>
                <div className="auth-stat-lbl">Standard</div>
              </div>
            </div>
          </div>

          <div className="auth-terminal-line">$ passwd --secure --user=current</div>
        </div>

        {/* Right panel */}
        <div className="auth-right-panel">
          <div className="auth-form-title">NEW PASSWORD</div>
          <div className="auth-form-sub">// Set your new credentials</div>

          <form onSubmit={handleResetPassword}>
            <div className="auth-field">
              <label className="auth-field-label">New Password</label>
              <input
                id="reset-new-password"
                className={`auth-field-input ${newPassword ? 'active' : ''}`}
                type="password"
                placeholder="••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div className="auth-field">
              <label className="auth-field-label">Confirm Password</label>
              <input
                id="reset-confirm-password"
                className={`auth-field-input ${confirmPassword ? 'active' : ''}`}
                type="password"
                placeholder="••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && <div className="auth-error-msg" style={{ marginBottom: '16px' }}>{error}</div>}
            {success && <div className="auth-success-msg" style={{ marginBottom: '16px' }}>{success}</div>}

            <button id="reset-submit" type="submit" className="auth-btn-primary" disabled={isLoading || !!success} style={{ marginTop: '16px' }}>
              {isLoading ? 'RESETTING...' : 'RESET PASSWORD →'}
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

export default ResetPassword;
