import db from '../../config/db.js';

// ============ LEARNER BADGE OPERATIONS ============

export const getLearnerBadges = async (learner_id) => {
  return db('learner_badge')
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
};

// ==========================
// 📌 BADGE LEARNERS (PAGINATED)
// ==========================
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

  const totalResult = await db('learner_badge')
    .where({ badge_id })
    .count('learner_id as count')
    .first();

  const total = Number(totalResult?.count || 0);

  return {
    data,
    total,
  };
};

// ==========================
// 📌 CHECK BADGE
// ==========================
export const checkLearnerHasBadge = async (learner_id, badge_id) => {
  const badge = await db('learner_badge')
    .where({ learner_id, badge_id })
    .first();

  return !!badge;
};

// ==========================
// 📌 AWARD BADGE
// ==========================
export const awardBadge = async (learner_id, badge_id) => {
  const [awarded] = await db('learner_badge')
    .insert({ learner_id, badge_id })
    .returning(['learner_id', 'badge_id', 'awarded_at']);

  return awarded;
};

// ==========================
// 📌 REVOKE BADGE
// ==========================
export const revokeBadge = async (learner_id, badge_id) => {
  const [revoked] = await db('learner_badge')
    .where({ learner_id, badge_id })
    .del()
    .returning(['learner_id', 'badge_id']);

  return revoked;
};

// ==========================
// 📌 REVOKE ALL (LEARNER)
// ==========================
export const revokeAllBadgesFromLearner = async (learner_id) => {
  return db('learner_badge')
    .where({ learner_id })
    .del()
    .returning(['learner_id', 'badge_id']);
};

// ==========================
// 📌 REVOKE ALL (BADGE)
// ==========================
export const revokeAllLearnersFromBadge = async (badge_id) => {
  return db('learner_badge')
    .where({ badge_id })
    .del()
    .returning(['learner_id', 'badge_id']);
};

// ==========================
// 📊 STATS
// ==========================
export const getLearnerBadgeCount = async (learner_id) => {
  const result = await db('learner_badge')
    .where({ learner_id })
    .count('badge_id as count')
    .first();

  return Number(result?.count || 0);
};

export const getTotalXPFromBadges = async (learner_id) => {
  const result = await db('learner_badge')
    .join('badge', 'learner_badge.badge_id', 'badge.badge_id')
    .where({ learner_id })
    .sum('badge.xp_bonus as total_xp')
    .first();

  return Number(result?.total_xp || 0);
};

// ==========================
// 📌 RECENT BADGES
// ==========================
export const getRecentlyAwardedBadges = async ({ limit = 10 }) => {
  return db('learner_badge')
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
};