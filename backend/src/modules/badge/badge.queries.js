import db from '../../config/db.js';

// ============ BADGE CRUD OPERATIONS ============

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

  // Get total count
  let totalQuery = db('badge').count('badge_id as count').first();

  if (condition_type) {
    totalQuery = totalQuery.where({ condition_type });
  }

  const total = await totalQuery;

  return {
    data,
    total: Number(total.count),
  };
};

export const getBadgeById = async (badge_id) => {
  const badge = await db('badge')
    .where({ badge_id })
    .first();

  return badge;
};

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

export const updateBadge = async (badge_id, badgeData) => {
  const [updated] = await db('badge')
    .where({ badge_id })
    .update(badgeData)
    .returning([
      'badge_id',
      'name',
      'description',
      'icon_url',
      'condition_type',
      'condition_value',
      'xp_bonus',
      'administrator_id'
    ]);

  return updated;
};

export const deleteBadge = async (badge_id) => {
  const [deleted] = await db('badge')
    .where({ badge_id })
    .del()
    .returning(['badge_id', 'name']);

  return deleted;
};

// ============ BADGE STATISTICS ============

export const getBadgeStats = async (badge_id) => {
  const [stats] = await db('learner_badge')
    .where({ badge_id })
    .count('learner_id as count')
    .select(db.raw('MAX(awarded_at) as last_awarded'));

  return {
    total_awarded: Number(stats.count),
    last_awarded: stats.last_awarded,
  };
};

export const getBadgesCreatedByAdmin = async (administrator_id) => {
  const badges = await db('badge')
    .where({ administrator_id })
    .select('badge_id', 'name', 'description', 'condition_type', 'xp_bonus');

  return badges;
};