import * as queries from './learner_badge.queries.js';
import {
  validateAwardBadge,
  validateGetBadgeLearners
} from './learner_badge.validation.js';

// ============ LEARNER BADGE OPERATIONS ============

export const getLearnerBadges = async (req, res, next) => {
  try {
    const { learner_id } = req.params;

    if (!learner_id) {
      return res.status(400).json({
        success: false,
        message: 'learner_id is required'
      });
    }

    const badges = await queries.getLearnerBadges(learner_id);

    return res.json({
      success: true,
      data: badges
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBadges = async (req, res, next) => {
  try {
    const learner_id = req.user.userId; // ✅ FIXED

    const badges = await queries.getLearnerBadges(learner_id);

    return res.json({
      success: true,
      data: badges
    });
  } catch (error) {
    next(error);
  }
};

export const getBadgeLearners = async (req, res, next) => {
  try {
    const { badge_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const errors = validateGetBadgeLearners(req.query);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const result = await queries.getBadgeLearners(badge_id, {
      page: Number(page),
      limit: Number(limit)
    });

    return res.json({
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

export const checkLearnerHasBadge = async (req, res, next) => {
  try {
    const { learner_id, badge_id } = req.params;

    const hasBadge = await queries.checkLearnerHasBadge(learner_id, badge_id);

    return res.json({
      success: true,
      data: { hasBadge }
    });
  } catch (error) {
    next(error);
  }
};

export const awardBadge = async (req, res, next) => {
  try {
    const { learner_id, badge_id } = req.body;

    const errors = validateAwardBadge(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const alreadyHas = await queries.checkLearnerHasBadge(learner_id, badge_id);
    if (alreadyHas) {
      return res.status(400).json({
        success: false,
        message: 'Learner already has this badge'
      });
    }

    const awarded = await queries.awardBadge(learner_id, badge_id);

    return res.status(201).json({
      success: true,
      message: 'Badge awarded successfully',
      data: awarded
    });
  } catch (error) {
    next(error);
  }
};

export const revokeBadge = async (req, res, next) => {
  try {
    const { learner_id, badge_id } = req.params;

    const revoked = await queries.revokeBadge(learner_id, badge_id);

    if (!revoked) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found for this learner'
      });
    }

    return res.json({
      success: true,
      message: 'Badge revoked successfully',
      data: revoked
    });
  } catch (error) {
    next(error);
  }
};

export const revokeAllBadgesFromLearner = async (req, res, next) => {
  try {
    const { learner_id } = req.params;

    const revoked = await queries.revokeAllBadgesFromLearner(learner_id);

    return res.json({
      success: true,
      message: `${revoked.length} badge(s) revoked successfully`,
      data: revoked
    });
  } catch (error) {
    next(error);
  }
};

export const revokeAllLearnersFromBadge = async (req, res, next) => {
  try {
    const { badge_id } = req.params;

    const revoked = await queries.revokeAllLearnersFromBadge(badge_id);

    return res.json({
      success: true,
      message: `Badge revoked from ${revoked.length} learner(s)`,
      data: revoked
    });
  } catch (error) {
    next(error);
  }
};

// ============ LEARNER BADGE STATISTICS ============

export const getLearnerBadgeStats = async (req, res, next) => {
  try {
    const { learner_id } = req.params;

    const [badgeCount, totalXP] = await Promise.all([
      queries.getLearnerBadgeCount(learner_id),
      queries.getTotalXPFromBadges(learner_id)
    ]);

    return res.json({
      success: true,
      data: {
        badge_count: badgeCount,
        total_xp_from_badges: totalXP
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBadgeStats = async (req, res, next) => {
  try {
    const learner_id = req.user.userId; // ✅ FIXED

    const [badgeCount, totalXP] = await Promise.all([
      queries.getLearnerBadgeCount(learner_id),
      queries.getTotalXPFromBadges(learner_id)
    ]);

    return res.json({
      success: true,
      data: {
        badge_count: badgeCount,
        total_xp_from_badges: totalXP
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentlyAwardedBadges = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const badges = await queries.getRecentlyAwardedBadges({
      limit: Number(limit)
    });

    return res.json({
      success: true,
      data: badges
    });
  } catch (error) {
    next(error);
  }
};