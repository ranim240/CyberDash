import * as adminQueries from './admin.queries.js';
// const challengeService = require('../challenge/challenge.service'); // for later



async function getGlobalStats() {
  return await adminQueries.getGlobalStats();
}

async function getAnalytics() {
  const [stats, active] = await Promise.all([
    adminQueries.getGlobalStats(),
    adminQueries.getActiveUsers()
  ]);

  const totalUsers = stats.users;
  const activeUsers = active.activeUsers;
  const submissions = stats.submissions;

  const engagementRate =
    totalUsers === 0 ? 0 : Number(((activeUsers / totalUsers) * 100).toFixed(2));

  return {
    totalUsers,
    activeUsers,
    submissions,
    engagementRate
  };
}

async function getPendingChallenges() {
  const challenges = await adminQueries.getPendingChallenges();

  return challenges.map(c => ({
    id: c.challenge_id,
    title: c.title,
    status: c.status,
    createdAt: c.created_at
  }));
}

async function getIncidentReports(params) {
  const result = await adminQueries.getIncidentReports(params);

  return {
    data: result.data,
    pagination: {
      total: result.pagination.total,
      page: result.pagination.page,
      limit: result.pagination.limit,
      totalPages: Math.ceil(
        result.pagination.total / result.pagination.limit
      )
    }
  };
}

async function updateReportStatus(id, status) {
  const updated = await adminQueries.updateReportStatus(id, status);

  if (!updated) {
    throw new Error('Report not found');
  }

  return { message: 'Report status updated successfully' };
}

/* we need the challenge services for this one
async function validateChallenge(id) {
  await challengeService.setStatus(id, 'approved');
  return { message: 'Challenge approved' };
}

async function rejectChallenge(id) {
  await challengeService.setStatus(id, 'rejected');
  return { message: 'Challenge rejected' };
}
  */

export {
  getGlobalStats,
  getAnalytics,
  getPendingChallenges,
  getIncidentReports,
  updateReportStatus,
  //validateChallenge,
  //rejectChallenge
};