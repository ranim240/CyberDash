import * as queries from './badge.queries.js';
import {
  validateCreateBadge,
  validateUpdateBadge,
  validateGetBadges
} from './badge.validation.js';

import { success, error } from '../../utils/response.js';


// ==========================
// 📌 GET ALL BADGES
// ==========================
export const getAllBadges = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, condition_type } = req.query;

    const errors = validateGetBadges(req.query);
    if (errors.length > 0) {
      return error(res, errors, 400);
    }

    const result = await queries.getAllBadges({
      page: Number(page),
      limit: Number(limit),
      condition_type
    });

    return success(res, result.data, null, {
      total: result.total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(result.total / Number(limit))
    });

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 GET BADGE BY ID
// ==========================
export const getBadgeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const badge = await queries.getBadgeById(id);

    if (!badge) {
      return error(res, 'Badge not found', 404);
    }

    return success(res, badge);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 CREATE BADGE (ADMIN ONLY)
// ==========================
export const createBadge = async (req, res, next) => {
  try {
    const badgeData = {
      ...req.body,
      administrator_id: req.user.userId // FIXED consistency
    };

    const errors = validateCreateBadge(badgeData);
    if (errors.length > 0) {
      return error(res, errors, 400);
    }

    const created = await queries.createBadge(badgeData);

    return success(res, created, 'Badge created successfully', null, 201);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 UPDATE BADGE
// ==========================
export const updateBadge = async (req, res, next) => {
  try {
    const { id } = req.params;

    const errors = validateUpdateBadge(req.body);
    if (errors.length > 0) {
      return error(res, errors, 400);
    }

    const updated = await queries.updateBadge(id, req.body);

    if (!updated) {
      return error(res, 'Badge not found', 404);
    }

    return success(res, updated, 'Badge updated successfully');

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 DELETE BADGE
// ==========================
export const deleteBadge = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await queries.deleteBadge(id);

    if (!deleted) {
      return error(res, 'Badge not found', 404);
    }

    return success(res, deleted, 'Badge deleted successfully');

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 BADGE STATS
// ==========================
export const getBadgeStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const stats = await queries.getBadgeStats(id);

    return success(res, stats);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 MY BADGES (CREATED BY ADMIN)
// ==========================
export const getMyBadges = async (req, res, next) => {
  try {
    const administrator_id = req.user.userId;

    const badges = await queries.getBadgesCreatedByAdmin(administrator_id);

    return success(res, badges);

  } catch (err) {
    next(err);
  }
};