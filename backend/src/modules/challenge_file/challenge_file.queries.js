import db from '../../config/db.js';

// ============ CHALLENGE FILE CRUD OPERATIONS ============

export const getFilesByChallenge = async (challenge_id) => {
  const files = await db('challenge_file')
    .where({ challenge_id })
    .select('file_id', 'challenge_id', 'file_name', 'file_path', 'file_size')
    .orderBy('file_name', 'asc');

  return files;
};

export const getFileById = async (file_id) => {
  const file = await db('challenge_file')
    .where({ file_id })
    .first();

  return file;
};

export const createChallengeFile = async (fileData) => {
  const [created] = await db('challenge_file')
    .insert(fileData)
    .returning(['file_id', 'challenge_id', 'file_name', 'file_path', 'file_size']);

  return created;
};

export const createMultipleChallengeFiles = async (filesData) => {
  const created = await db('challenge_file')
    .insert(filesData)
    .returning(['file_id', 'challenge_id', 'file_name', 'file_path', 'file_size']);

  return created;
};

export const updateChallengeFile = async (file_id, fileData) => {
  const [updated] = await db('challenge_file')
    .where({ file_id })
    .update(fileData)
    .returning(['file_id', 'challenge_id', 'file_name', 'file_path', 'file_size']);

  return updated;
};

export const deleteChallengeFile = async (file_id) => {
  const [deleted] = await db('challenge_file')
    .where({ file_id })
    .del()
    .returning(['file_id', 'file_name', 'file_path']);

  return deleted;
};

export const deleteFilesByChallenge = async (challenge_id) => {
  const deleted = await db('challenge_file')
    .where({ challenge_id })
    .del()
    .returning(['file_id', 'file_name']);

  return deleted;
};

// ============ CHALLENGE FILE STATISTICS ============

export const getChallengeFileStats = async (challenge_id) => {
  const [stats] = await db('challenge_file')
    .where({ challenge_id })
    .count('file_id as count')
    .sum('file_size as total_size');

  return {
    total_files: Number(stats.count),
    total_size: Number(stats.total_size || 0),
  };
};

export const getTotalStorageUsed = async () => {
  const [stats] = await db('challenge_file')
    .sum('file_size as total_size')
    .count('file_id as count');

  return {
    total_files: Number(stats.count),
    total_size: Number(stats.total_size || 0),
  };
};