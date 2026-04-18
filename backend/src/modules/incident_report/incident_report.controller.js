import * as queries from './incident_report.queries.js';
import {
  validateCreateReport,
  validateUpdateReportStatus,
  validateGetReports
} from './incident_report.validation.js';

// Create a new incident report
export const createReport = async (req, res, next) => {
  try {
    const { title, description, type } = req.body;
    const learner_id = req.user.user_id; // From auth middleware

    // Validate input
    const errors = validateCreateReport(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Create report
    const report = await queries.createIncidentReport({
      title,
      description,
      type,
      learner_id
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: {
        id: report.reported_id,
        title: report.title,
        status: report.status,
        reported_at: report.reported_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all reports (with filters) - ADMIN & LEARNER & INSTRUCTOR  can use this
export const getReports = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const user = req.user;

    // Validate query parameters
    const errors = validateGetReports(req.query);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    let result;

    // If learner or instructor, only show their own reports
    if (user.role === 'learner' || user.role === 'instructor') {
      const reports = await queries.getReportsByUser(user.user_id);
      result = {
        data: reports,
        total: reports.length
      };
    } else {
      // Admin can see all reports with pagination
      result = await queries.getAllReports({
        status,
        type,
        page: Number(page),
        limit: Number(limit)
      });
    }

    res.json({
      success: true,
      data: result.data,
      pagination: user.role === 'learner' || user.role === 'instructor' ? undefined : {
        total: result.total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(result.total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific report by ID
export const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const report = await queries.findReportById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Learners and instructors can only view their own reports
    if ((user.role === 'learner' || user.role === 'instructor') && report.learner_id !== user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this report'
      });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// Update report status - ADMIN ONLY
export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const admin_id = req.user.user_id; // Admin who is updating

    // Validate input
    const errors = validateUpdateReportStatus(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Check if report exists
    const report = await queries.findReportById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update status
    const updated = await queries.updateReportStatus(id, status, admin_id);

    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: {
        id: updated.reported_id,
        status: updated.status,
        resolved_at: updated.resolved_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a report - ADMIN ONLY
export const deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await queries.findReportById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    await queries.deleteReport(id);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};