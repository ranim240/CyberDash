import db from '../../config/db.js';
import crypto from 'node:crypto';

export const createIncidentReport = async (reportData) => {
  const reported_id = crypto.randomUUID();

  const [report] = await db('incident_report')
    .insert({
      reported_id,
      title: reportData.title,
      description: reportData.description,
      type: reportData.type,
      learner_id: reportData.learner_id,
      status: 'pending'
    })
    .returning('*');

  return report;
};

export const findReportById = async (reported_id) => {
  return await db('incident_report')
    .where({ reported_id })
    .first();
};

export const getAllReports = async ({ status, type, page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  let query = db('incident_report')
    .leftJoin('learner', 'incident_report.learner_id', 'learner.user_id')
    .leftJoin('user as learner_user', 'learner.user_id', 'learner_user.user_id')
    .leftJoin('user as admin_user', 'incident_report.admin_id', 'admin_user.user_id')
    .select(
      'incident_report.*',
      'learner_user.username as learner_username',
      'admin_user.username as admin_username'
    );

  if (status) {
    query = query.where({ 'incident_report.status': status });
  }

  if (type) {
    query = query.where({ 'incident_report.type': type });
  }

  const data = await query
    .orderBy('incident_report.reported_at', 'desc')
    .limit(limit)
    .offset(offset);

  // Get total count
  let totalQuery = db('incident_report').count('reported_id as count').first();

  if (status) {
    totalQuery = totalQuery.where({ status });
  }

  if (type) {
    totalQuery = totalQuery.where({ type });
  }

  const total = await totalQuery;

  return {
    data,
    total: Number(total.count),
  };
};

export const updateReportStatus = async (reported_id, status, admin_id) => {
  const updateData = {
    status,
    admin_id
  };

  // If resolving, set resolved_at timestamp
  if (status === 'resolved') {
    updateData.resolved_at = db.fn.now();
  }

  const [updated] = await db('incident_report')
    .where({ reported_id })
    .update(updateData)
    .returning('*');

  return updated;
};

export const getReportsByUser = async (user_id) => {
  return await db('incident_report')
    .where({ learner_id: user_id })
    .orderBy('reported_at', 'desc');
};

export const deleteReport = async (reported_id) => {
  const [deleted] = await db('incident_report')
    .where({ reported_id })
    .del()
    .returning('*');

  return deleted;
};