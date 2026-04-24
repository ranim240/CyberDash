import db from '../../config/db.js';
const PUBLIC_FIELDS = [
  "challenge_id",
  "title",
  "description",
  "difficulty",
  "points",
  "category_id",
  "created_at"
];
class ChallengeModel {

  // READ 

  static getActiveChallenges() {
    return db('challenge').select(PUBLIC_FIELDS).where({ status: 'active' });
  }

  static getAll() {
    return db('challenge').select(PUBLIC_FIELDS);
  }

  static getById(challenge_id) {
    return db('challenge').select(PUBLIC_FIELDS).where({ challenge_id }).first();
  }

  static getFiles(challenge_id) {
    return db('challenge_files').where({ challenge_id });
  }

  // CREATE : RETURNS EVERYTHING INCLUDING THE FLAG

  static create(data) {
    return db('challenge').insert(data).returning('*');
  }

  // UPDATE : RETURNS EVERYTHING INCLUDING THE FLAG

  static update(challenge_id, data) {
    return db('challenge')
      .where({ challenge_id })
      .update(data)
      .returning('*');
  }
 
  // DELETE

  static remove(challenge_id) {
    return db('challenge').where({ challenge_id }).delete();
  }

  static setStatus(challenge_id, status) {
    return db('challenge').select(PUBLIC_FIELDS)
      .where({ challenge_id })
      .update({ status });
  }

  static addFile(data) {
    return db('challenge_files').insert(data).returning('*');
  }

  static removeFile(file_id) {
    return db('challenge_files').where({ file_id }).delete();
  }
  
  static getByInstructor(instructor_id) {
    /*if ( requesting_user.userId != instructor_id )
     return db('challenge').select(PUBLIC_FIELDS).where({ instructor_id });
    else {
      if (requesting_user.role == 'instructor'){ 
        return db('challenge').where({ instructor_id });
      }
    }*/
   return db('challenge').select(PUBLIC_FIELDS).where({ instructor_id });
  }

  static getByCategory(category_id) {
    return db('challenge').select(PUBLIC_FIELDS).where({ category_id });
  }

  static getByDifficulty(difficulty) {
    return db('challenge').select(PUBLIC_FIELDS).where({ difficulty });
  }

  static async getPendingChallenges() {
    return await db('challenge').select(PUBLIC_FIELDS)
      .where({ status: 'pending' })
      .orderBy('created_at', 'desc');
  }

  static async updateChallengeStatus(challenge_id, status) {
    const updated = await db('challenge').select(PUBLIC_FIELDS)
      .where({ challenge_id })
      .update({ status })
      .returning('*');

    return updated[0];
  }

  static async getChallenges(filters) {
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

    const baseQuery = db("challenge").select(PUBLIC_FIELDS);

    // Filters
    if (difficulty) baseQuery.where("difficulty", difficulty);
    if (category_id) baseQuery.where("category_id", category_id);
    if (status) baseQuery.where("status", status);

    if (minPoints !== null && minPoints !== undefined) {
      baseQuery.where("points", ">=", minPoints);
    }

    if (maxPoints !== null && maxPoints !== undefined) {
      baseQuery.where("points", "<=", maxPoints);
    }

    // Count query
    const countQuery = baseQuery.clone().count("* as total").first();

    // Sorting
    const allowedSort = ["points", "created_at", "difficulty"];
    const sortField = allowedSort.includes(sortBy) ? sortBy : "created_at";

    baseQuery.orderBy(sortField, order === "asc" ? "asc" : "desc");

    // Pagination
    const offset = (page - 1) * limit;
    baseQuery.limit(limit).offset(offset);

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
  }
}

export default ChallengeModel;