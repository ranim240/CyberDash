import db from '../../config/db.js';
import crypto from 'crypto';


// ==========================
// 📌 GET ALL BADGES
// ==========================
export const getAllBadges = async ({ page = 1, limit = 20, condition_type }) => {
  const offset = (page - 1) * limit;

  let query = db('badge')
    .select(
      'badge_id',
      'name',
      'description',
      'icon_url',
      'condition_type',
      'condition_value',
      'xp_bonus',
      'administrator_id'
    );

  if (condition_type) {
    query = query.where({ condition_type });
  }

  const data = await query
    .orderBy('name', 'asc')
    .limit(limit)
    .offset(offset);

  // ==========================
  // 📌 SAFE COUNT
  // ==========================
  let countQuery = db('badge').count('* as count').first();

  if (condition_type) {
    countQuery = countQuery.where({ condition_type });
  }

  const totalResult = await countQuery;
  const total = Number(totalResult?.count || 0);

  return {
    data,
    total
  };
};


// ==========================
// 📌 GET BADGE BY ID
// ==========================
export const getBadgeById = async (badge_id) => {
  return db('badge')
    .where({ badge_id })
    .first();
};


// ==========================
// 📌 CREATE BADGE
// ==========================
export const createBadge = async (badgeData) => {
  const badge_id = crypto.randomUUID();

  const [created] = await db('badge')
    .insert({
      badge_id,
      name: badgeData.name,
      description: badgeData.description,
      icon_url: badgeData.icon_url,
      condition_type: badgeData.condition_type,
      condition_value: badgeData.condition_value,
      xp_bonus: badgeData.xp_bonus,
      administrator_id: badgeData.administrator_id
    })
    .returning('*');

  return created;
};


// ==========================
// 📌 UPDATE BADGE
// ==========================
export const updateBadge = async (badge_id, badgeData) => {
  const [updated] = await db('badge')
    .where({ badge_id })
    .update({
      ...badgeData,
      updated_at: new Date()
    })
    .returning('*');

  return updated;
};


// ==========================
// 📌 DELETE BADGE
// ==========================
export const deleteBadge = async (badge_id) => {
  const deleted = await db('badge')
    .where({ badge_id })
    .del();

  return deleted; // returns 1 or 0 (safer than returning row)
};


// ==========================
// 📌 BADGE STATISTICS
// ==========================
export const getBadgeStats = async (badge_id) => {
  const stats = await db('learner_badge')
    .where({ badge_id })
    .count('learner_id as count')
    .first();

  return {
    total_awarded: Number(stats?.count || 0),
    last_awarded: stats?.last_awarded || null
  };
};


// ==========================
// 📌 BADGES BY ADMIN
// ==========================
export const getBadgesCreatedByAdmin = async (administrator_id) => {
  return db('badge')
    .where({ administrator_id })
    .select(
      'badge_id',
      'name',
      'description',
      'condition_type',
      'xp_bonus'
    );
};