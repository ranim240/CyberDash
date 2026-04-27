// pages/learner/ReportIncidentPage.jsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import useIncidentReports from '../../hooks/useIncidentReports.js';
import '../../styles/reportIncident.css';

// ─── Helper Components ───────────────────────────────────────────────────────

function Loader() {
  return (
    <div className="reports-loader">
      <div className="loader-ring" />
      <span>Loading reports…</span>
    </div>
  );
}

function ErrorBanner({ message }) {
  return <div className="error-banner">{message}</div>;
}

function SuccessMessage({ message, onDismiss }) {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="success-message">
      <p>{message}</p>
    </div>
  );
}

function ReportStatusBadge({ status }) {
  const statusClass = `status-${status || 'pending'}`;
  return <span className={`report-status ${statusClass}`}>{status || 'Pending'}</span>;
}

function ReportItem({ report }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="report-item">
      <div className="report-header-row">
        <h3 className="report-title">{report.title}</h3>
        <ReportStatusBadge status={report.status} />
      </div>

      <div className="report-meta">
        <span>📅 {formatDate(report.reported_at)}</span>
        <span className="report-type">{report.type}</span>
      </div>

      <p className="report-description">{report.description}</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ReportIncidentPage() {
  const { user } = useContext(AuthContext);
  const { reports, loading, error, submitReport } = useIncidentReports();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'content'
  });

  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Validation function
  const validateForm = () => {
    const errors = [];

    if (!formData.title || formData.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (!formData.description || formData.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (!formData.type) {
      errors.push('Report type is required');
    }

    const validTypes = ['content', 'behavior', 'technical', 'other'];
    if (!validTypes.includes(formData.type)) {
      errors.push('Invalid report type selected');
    }

    return errors;
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submit
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setFormErrors([]);

    try {
      const result = await submitReport(formData);

      if (result.success) {
        setSuccessMessage(result.message || 'Report submitted successfully!');
        setFormData({
          title: '',
          description: '',
          type: 'content'
        });
      }
    } catch (err) {
      setFormErrors([err.message || 'Failed to submit report']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      type: 'content'
    });
    setFormErrors([]);
  };

  return (
    <div className="report-incident-page">
      {/* Page Header */}
      <div className="report-header">
        <h1>Report an <span>Incident</span></h1>
        <p>Help us maintain a safe learning environment by reporting any issues or concerns you encounter.</p>
      </div>

      {/* Main Container */}
      <div className="report-container">
        {/* Form Section */}
        <div className="report-form-section">
          <div className="form-card">
            <h2>Submit Report</h2>
            <div className="form-subtitle">Share your incident details below</div>

            {/* Success Message */}
            {successMessage && (
              <SuccessMessage
                message={successMessage}
                onDismiss={() => setSuccessMessage('')}
              />
            )}

            {/* Form Errors */}
            {formErrors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                {formErrors.map((error, idx) => (
                  <div key={idx} className="form-error">• {error}</div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <div className="form-group">
                <label htmlFor="title">Incident Title *</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief title of the incident"
                  disabled={isSubmitting}
                />
              </div>

              {/* Type Field */}
              <div className="form-group">
                <label htmlFor="type">Report Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="content">Content Issue</option>
                  <option value="behavior">User Behavior</option>
                  <option value="technical">Technical Problem</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description Field */}
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide detailed information about the incident. What happened? When? Any steps to reproduce?"
                  disabled={isSubmitting}
                />
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting…' : 'Submit Report'}
                </button>
                <button
                  type="button"
                  className="btn-reset"
                  onClick={handleReset}
                  disabled={isSubmitting}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Reports History Section */}
        <div className="reports-section">
          <h2>Your Reports</h2>
          <div className="section-subtitle">Report History</div>

          {/* Error Banner */}
          {error && <ErrorBanner message={error} />}

          {/* Loading State */}
          {loading && <Loader />}

          {/* Empty State */}
          {!loading && !error && reports.length === 0 && (
            <div className="reports-empty">
              <div className="empty-icon">📋</div>
              <p>No incident reports yet</p>
              <p style={{ fontSize: '12px', opacity: 0.7 }}>
                Your submitted reports will appear here
              </p>
            </div>
          )}

          {/* Reports List */}
          {!loading && !error && reports.length > 0 && (
            <div className="reports-list">
              {reports.map((report) => (
                <ReportItem key={report.reported_id} report={report} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
