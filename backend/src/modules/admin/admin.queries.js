import knex from "../../../src/config/db.js";

async function getGlobalStats() {
  const [users, challenges, submissions] = await Promise.all([
    knex('user').count('user_id as count').first(),
    knex('challenge').count('challenge_id as count').first(),
    knex('submission').count('submission_id as count').first(),
  ]);

  return {
    users: Number(users.count),
    challenges: Number(challenges.count),
    submissions: Number(submissions.count),
  };
}

async function getPendingChallenges() {
  return await knex('challenge')
    .where({ status: 'pending' })
    .orderBy('created_at', 'desc');
}

async function getActiveUsers() {
  const activeUsers = await knex('user')
    .where({ is_active: '1' })
    .count('user_id as count')
    .first();

  return {
    activeUsers: Number(activeUsers.count)
  };
}

async function getIncidentReports({ status, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;

  let query = knex('incident_report');

  if (status) {
    query = query.where({ status });
  }

  const data = await query
    .orderBy('reported_at', 'desc')
    .limit(limit)
    .offset(offset);

  // total count for pagination
  let totalQuery = knex('incident_report').count('reported_id as count').first();

  if (status) {
    totalQuery = totalQuery.where({ status });
  }

  const total = await totalQuery;

  return {
    data,
    pagination: {
      total: Number(total.count),
      page,
      limit,
    },
  };
}

async function updateReportStatus(id, status) {
  const updated = await knex('incident_report')
    .where({ reported_id: id })
    .update({ status })
    .returning('*');

  return updated[0];
}

export {
  getGlobalStats,
  getActiveUsers,
  getPendingChallenges,
  getIncidentReports,
  updateReportStatus
};