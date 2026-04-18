import * as queries from './badge.queries.js';
import {
  validateCreateBadge,
  validateUpdateBadge,
  validateGetBadges
} from './badge.validation.js';

// ============ BADGE CRUD OPERATIONS ============

export const getAllBadges = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, condition_type } = req.query;

    // Validate query parameters
    const errors = validateGetBadges(req.query);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await queries.getAllBadges({
      page: Number(page),
      limit: Number(limit),
      condition_type
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

export const getBadgeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const badge = await queries.getBadgeById(id);

    if (!badge) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    res.json({
      success: true,
      data: badge
    });
  } catch (error) {
    next(error);
  }
};

export const createBadge = async (req, res, next) => {
  try {
    const badgeData = {
      ...req.body,
      administrator_id: req.user.user_id // Assuming user is attached via auth middleware
    };

    // Validate input
    const errors = validateCreateBadge(badgeData);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const created = await queries.createBadge(badgeData);

    res.status(201).json({
      success: true,
      message: 'Badge created successfully',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

export const updateBadge = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate input
    const errors = validateUpdateBadge(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const updated = await queries.updateBadge(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    res.json({
      success: true,
      message: 'Badge updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBadge = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await queries.deleteBadge(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found'
      });
    }

    res.json({
      success: true,
      message: 'Badge deleted successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

// ============ BADGE STATISTICS ============

export const getBadgeStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const stats = await queries.getBadgeStats(id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBadges = async (req, res, next) => {
  try {
    const administrator_id = req.user.user_id;

    const badges = await queries.getBadgesCreatedByAdmin(administrator_id);

    res.json({
      success: true,
      data: badges
    });
  } catch (error) {
    next(error);
  }
};