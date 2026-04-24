import db from '../../config/db.js';


// ==========================
// 📌 CHALLENGE BASIC CRUD
// ==========================

export const getAll = () => db('challenge');

export const getById = (challenge_id) =>
  db('challenge').where({ challenge_id }).first();

export const create = (data) =>
  db('challenge').insert(data).returning('*');

export const update = (challenge_id, data) =>
  db('challenge').where({ challenge_id }).update(data).returning('*');

export const remove = (challenge_id) =>
  db('challenge').where({ challenge_id }).delete();


// ==========================
// 📌 STATUS MANAGEMENT
// ==========================

export const setStatus = (challenge_id, status) =>
  db('challenge')
    .where({ challenge_id })
    .update({ status })
    .returning('*');

export const getPendingChallenges = () =>
  db('challenge')
    .where({ status: 'pending' })
    .orderBy('created_at', 'desc');

export const getActiveChallenges = () =>
  db('challenge')
    .where({ status: 'approved' });


// ==========================
// 📌 FILTERING
// ==========================

export const getByInstructor = (instructor_id) =>
  db('challenge').where({ instructor_id });

export const getByCategory = (category_id) =>
  db('challenge').where({ category_id });

export const getByDifficulty = (difficulty) =>
  db('challenge').where({ difficulty });


// ==========================
// 📌 FILES
// ==========================

export const getFiles = (challenge_id) =>
  db('challenge_files').where({ challenge_id });

export const addFile = (data) =>
  db('challenge_files').insert(data).returning('*');

export const removeFile = (file_id) =>
  db('challenge_files').where({ file_id }).delete();


// ==========================
// 📌 SEARCH + PAGINATION
// ==========================

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

  const query = db("challenge");

  // 🔎 Filters
  if (difficulty) query.where("difficulty", difficulty);
  if (category_id) query.where("category_id", category_id);
  if (status) query.where("status", status);

  if (minPoints != null) {
    query.where("points", ">=", minPoints);
  }

  if (maxPoints != null) {
    query.where("points", "<=", maxPoints);
  }

  // 🔃 Safe sorting
  const allowedSort = ["points", "created_at", "difficulty"];
  const sortField = allowedSort.includes(sortBy)
    ? sortBy
    : "created_at";

  query.orderBy(sortField, order === "asc" ? "asc" : "desc");

  // 📄 Pagination
  const offset = (page - 1) * limit;
  query.limit(limit).offset(offset);

  // 📊 Count query
  const countQuery = db("challenge")
    .count("* as total")
    .first();

  const [data, countResult] = await Promise.all([
    query,
    countQuery
  ]);

  return {
    data,
    total: Number(countResult.total),
    page,
    limit
  };
};


// ==========================
// 📌 BADGE SYSTEM (CTF LOGIC)
// ==========================

// check if user solved challenge
export const hasUserSolvedChallenge = (user_id, challenge_id) =>
  db('user_solutions')
    .where({ user_id, challenge_id })
    .first();

// get badges linked to a challenge
export const getBadgesByChallenge = (challenge_id) =>
  db('badges')
    .join(
      'challenge_badges',
      'badges.badge_id',
      'challenge_badges.badge_id'
    )
    .where('challenge_badges.challenge_id', challenge_id);

// check if user already has badge
export const userHasBadge = (user_id, badge_id) =>
  db('user_badges')
    .where({ user_id, badge_id })
    .first();

// assign badge to user
export const assignBadgeToUser = (data) =>
  db('user_badges')
    .insert(data)
    .returning('*');