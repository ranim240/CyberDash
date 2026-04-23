import * as queries from './admin.queries.js';
import {
  validateGetUsers,
  validateUpdateUserStatus
} from './admin.validation.js';

// Note: Challenge management moved to challenge.controller.js
// Note: Incident report management moved to incident_report.controller.js

// ============ STATS & ANALYTICS ============

export const getGlobalStats = async (req, res, next) => {
  try {
    const stats = await queries.getGlobalStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const [stats, activeUsers] = await Promise.all([
      queries.getGlobalStats(),
      queries.getActiveUsers()
    ]);

    const totalUsers = stats.users;
    const engagementRate = totalUsers === 0 
      ? 0 
      : Number(((activeUsers / totalUsers) * 100).toFixed(2));

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalChallenges: stats.challenges,
        totalSubmissions: stats.submissions,
        engagementRate
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============ USER MANAGEMENT ============

export const getAllUsers = async (req, res, next) => {
  try {
    const { role, is_active, page = 1, limit = 20 } = req.query;

    // Validate query parameters
    const errors = validateGetUsers(req.query);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await queries.getAllUsers({
      role,
      is_active,
      page: Number(page),
      limit: Number(limit)
    });

    res.json({
      success: true,
      data: result.data,
      pagination: {
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

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Validate input
    const errors = validateUpdateUserStatus(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const updated = await queries.updateUserStatus(id, is_active);

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: `User ${is_active === '1' || is_active === 1 ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: updated.user_id,
        username: updated.username,
        is_active: updated.is_active
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await queries.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: deleted.user_id,
        username: deleted.username
      }
    });
  } catch (error) {
    next(error);
  }
};