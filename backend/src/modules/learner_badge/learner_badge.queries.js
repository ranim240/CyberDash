import db from '../../config/db.js';

// ============ LEARNER BADGE OPERATIONS ============

export const getLearnerBadges = async (learner_id) => {
  const badges = await db('learner_badge')
    .join('badge', 'learner_badge.badge_id', 'badge.badge_id')
    .where({ learner_id })
    .select(
      'learner_badge.learner_id',
      'learner_badge.badge_id',
      'learner_badge.awarded_at',
      'badge.name',
      'badge.description',
      'badge.icon_url',
      'badge.xp_bonus'
    )
    .orderBy('learner_badge.awarded_at', 'desc');

  return badges;
};

export const getBadgeLearners = async (badge_id, { page = 1, limit = 20 }) => {
  const offset = (page - 1) * limit;

  const data = await db('learner_badge')
    .join('learner', 'learner_badge.learner_id', 'learner.user_id')
    .join('user', 'learner.user_id', 'user.user_id')
    .where({ 'learner_badge.badge_id': badge_id })
    .select(
      'learner_badge.learner_id',
      'learner_badge.badge_id',
      'learner_badge.awarded_at',
      'user.username',
      'user.email'
    )
    .orderBy('learner_badge.awarded_at', 'desc')
    .limit(limit)
    .offset(offset);

  // Get total count
  const [total] = await db('learner_badge')
    .where({ badge_id })
    .count('learner_id as count');

  return {
    data,
    total: Number(total.count),
  };
};

export const checkLearnerHasBadge = async (learner_id, badge_id) => {
  const badge = await db('learner_badge')
    .where({ learner_id, badge_id })
    .first();

  return !!badge;
};

export const awardBadge = async (learner_id, badge_id) => {
  const [awarded] = await db('learner_badge')
    .insert({ learner_id, badge_id })
    .returning(['learner_id', 'badge_id', 'awarded_at']);

  return awarded;
};

export const revokeBadge = async (learner_id, badge_id) => {
  const [revoked] = await db('learner_badge')
    .where({ learner_id, badge_id })
    .del()
    .returning(['learner_id', 'badge_id']);

  return revoked;
};

export const revokeAllBadgesFromLearner = async (learner_id) => {
  const revoked = await db('learner_badge')
    .where({ learner_id })
    .del()
    .returning(['learner_id', 'badge_id']);

  return revoked;
};

export const revokeAllLearnersFromBadge = async (badge_id) => {
  const revoked = await db('learner_badge')
    .where({ badge_id })
    .del()
    .returning(['learner_id', 'badge_id']);

  return revoked;
};

// ============ LEARNER BADGE STATISTICS ============

export const getLearnerBadgeCount = async (learner_id) => {
  const [result] = await db('learner_badge')
    .where({ learner_id })
    .count('badge_id as count');

  return Number(result.count);
};

export const getTotalXPFromBadges = async (learner_id) => {
  const [result] = await db('learner_badge')
    .join('badge', 'learner_badge.badge_id', 'badge.badge_id')
    .where({ learner_id })
    .sum('badge.xp_bonus as total_xp');

  return Number(result.total_xp || 0);
};

export const getRecentlyAwardedBadges = async ({ limit = 10 }) => {
  const badges = await db('learner_badge')
    .join('badge', 'learner_badge.badge_id', 'badge.badge_id')
    .join('learner', 'learner_badge.learner_id', 'learner.user_id')
    .join('user', 'learner.user_id', 'user.user_id')
    .select(
      'learner_badge.learner_id',
      'learner_badge.badge_id',
      'learner_badge.awarded_at',
      'badge.name as badge_name',
      'badge.icon_url',
      'user.username'
    )
    .orderBy('learner_badge.awarded_at', 'desc')
    .limit(limit);

  return badges;
};