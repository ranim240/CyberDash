import db from '../../config/db.js';


// ==========================
// 📌 GET FILES BY CHALLENGE
// ==========================
export const getFilesByChallenge = async (challenge_id) => {
  return db('challenge_file')
    .where({ challenge_id })
    .select(
      'file_id',
      'challenge_id',
      'file_name',
      'file_path',
      'file_size'
    )
    .orderBy('file_name', 'asc');
};


// ==========================
// 📌 GET FILE BY ID
// ==========================
export const getFileById = async (file_id) => {
  return db('challenge_file')
    .where({ file_id })
    .first();
};


// ==========================
// 📌 CREATE FILE
// ==========================
export const createChallengeFile = async (fileData) => {
  const [created] = await db('challenge_file')
    .insert(fileData)
    .returning('*');

  return created;
};


// ==========================
// 📌 BULK INSERT
// ==========================
export const createMultipleChallengeFiles = async (filesData) => {
  return db.transaction(async (trx) => {
    const created = await trx('challenge_file')
      .insert(filesData)
      .returning('*');

    return created;
  });
};


// ==========================
// 📌 UPDATE FILE
// ==========================
export const updateChallengeFile = async (file_id, fileData) => {
  const [updated] = await db('challenge_file')
    .where({ file_id })
    .update(fileData)
    .returning('*');

  return updated;
};


// ==========================
// 📌 DELETE FILE (SAFE)
// ==========================
export const deleteChallengeFile = async (file_id) => {
  const deleted = await db('challenge_file')
    .where({ file_id })
    .del();

  return deleted; // number (0 or 1)
};


// ==========================
// 📌 DELETE BY CHALLENGE
// ==========================
export const deleteFilesByChallenge = async (challenge_id) => {
  const deleted = await db('challenge_file')
    .where({ challenge_id })
    .del();

  return deleted; // number of deleted rows
};


// ==========================
// 📌 CHALLENGE FILE STATS
// ==========================
export const getChallengeFileStats = async (challenge_id) => {
  const stats = await db('challenge_file')
    .where({ challenge_id })
    .count('file_id as count')
    .sum('file_size as total_size')
    .first();

  return {
    total_files: Number(stats?.count || 0),
    total_size: Number(stats?.total_size || 0)
  };
};


// ==========================
// 📌 TOTAL STORAGE USED
// ==========================
export const getTotalStorageUsed = async () => {
  const stats = await db('challenge_file')
    .sum('file_size as total_size')
    .count('file_id as count')
    .first();

  return {
    total_files: Number(stats?.count || 0),
    total_size: Number(stats?.total_size || 0)
  };
};