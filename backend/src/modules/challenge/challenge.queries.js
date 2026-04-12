import db from '../../config/db.js';

export const getActiveChallenges = () => db('challenge').where({ status: 'active' });

export const getAll = () => db('challenge');

export const getById = (challenge_id) => db('challenge').where({ challenge_id }).first();

export const getFiles = (challenge_id) => db('challenge_files').where({ challenge_id });

export const create = (data) => db('challenge').insert(data).returning('*');

export const update = (challenge_id, data) => db('challenge').where({ challenge_id }).update(data).returning('*');

export const remove = (challenge_id) => db('challenge').where({ challenge_id }).delete();

export const setStatus = (challenge_id, status) => db('challenge').where({ challenge_id }).update({ status });

export const addFile = (data) => db('challenge_files').insert(data).returning('*');

export const removeFile = (file_id) => db('challenge_files').where({ file_id }).delete();

export const getByInstructor = (instructor_id) => db('challenge').where({ instructor_id });

export const getByCategory = (category_id) => db('challenge').where({ category_id });

export const getByDifficulty = (difficulty) => db('challenge').where({ difficulty  });


export const getPendingChallenges = async () => {
  const pending =  await db('challenge')
    .where({ status: 'pending' })
    .orderBy('created_at', 'desc');
    return pending;
};

export const updateChallengeStatus = async (challenge_id, status) => {
  const updated = await db('challenge')
    .where({ challenge_id })
    .update({status})
    .returning('*');

  return updated[0];
};

export const getChallenges = async (filters) => {
  const {
    difficulty,
    category_id,
    status,
    minPoints,
    maxPoints,
    sortBy = "created_at",
    order = "desc",
    page = 1,
    limit = 10
  } = filters;

  // base query
  const baseQuery = db("challenge");

  // 🔎 Filters
  if (difficulty) baseQuery.where("difficulty", difficulty);
  if (category_id) baseQuery.where("category_id", category_id);
  if (status) baseQuery.where("status", status);

  if (minPoints !== null && minPoints !== undefined) {
    baseQuery.where("points", ">=", minPoints);
  }

  if (maxPoints !== null && maxPoints !== undefined) {
    baseQuery.where("points", "<=", maxPoints);
  }

  // 🧮 Clone query for count
  const countQuery = baseQuery.clone().count("* as total").first();

  // 🔃 Sorting (safe)
  const allowedSort = ["points", "created_at", "difficulty"];
  const sortField = allowedSort.includes(sortBy) ? sortBy : "created_at";

  baseQuery.orderBy(sortField, order === "asc" ? "asc" : "desc");

  // 📄 Pagination
  const offset = (page - 1) * limit;
  baseQuery.limit(limit).offset(offset);

  // 🚀 Execute
  const [data, countResult] = await Promise.all([
    baseQuery,
    countQuery
  ]);

  const total = Number(countResult.total);
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit
    }
  };
};