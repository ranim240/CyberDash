// api/incidentReportService.js
import api from "./axios";

/**
 * Create a new incident report
 * @param {Object} reportData - { title, description, type }
 * @returns {Promise}
 */
export const createIncidentReport = (reportData) =>
  api.post("/incidents", reportData);

/**
 * Get all reports for the authenticated user (learners see only theirs)
 * @param {Object} filters - { status, type, page, limit }
 * @returns {Promise}
 */
export const getIncidentReports = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.type) params.append("type", filters.type);
  if (filters.page) params.append("page", filters.page);
  if (filters.limit) params.append("limit", filters.limit);
 
  return api.get(`/incidents?${params.toString()}`);
};

/**
 * Get a specific report by ID
 * @param {string} reportId
 * @returns {Promise}
 */
export const getIncidentReportById = (reportId) =>
  api.get(`/incidents/${reportId}`);
