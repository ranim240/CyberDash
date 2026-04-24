import { v4 as uuid } from 'uuid';
import { success, error } from '../../utils/response.js';
import * as q from './challenge.queries.js';
import { validateUpdateChallengeStatus } from './challenge.validation.js';
import { CHALLENGE_STATUS } from "../constants/challengeStatus.js";

// console.log("CONTROLLER FILE LOADED");

// ------------------------------ CRUD --------------------------------------------

// Get Challenges with different status (used by admin )  ------------

export const getAll = async (req, res, next) => {
    try {
        if (req.user.role != "admin") return error(res,"Unauthorized Access",)
        return success(res, await challengeModel.getAll());
    } catch (err) {
        next(err);
    }
};

// Get one Challenge details  ------------


export const getOne = async (req, res, next) => {
    try {
        const challenge = await challengeModel.getById(req.params.id);
        if (!challenge) return error(res, 'Challenge introuvable', 404);
        return success(res, challenge);
    } catch (err) {
        next(err);
    }
};

// Only Active Challenges can be seen by learners  ------------

export const getActiveChallenges = async (req, res, next) => {
    try{
        return success(res,await challengeModel.getActiveChallenges());
    }catch(err){
        next(err);
    }
}

// Challenges by instructor used for the instructor to see his own challenges and other's to see a specfic instructor's challenge the access is controlled 

export const getInstructorChallenges = async (req, res, next) => {
    try{
        return success(res,await challengeModel.getByInstructor(req.user.userId));
    }catch(err){
        next(err);
    }
}

// Challenges by difficulty not really needed after filter added but gonna keep it for now ------------

export const fetchByDifficulty = async (req, res, next) => {
    try{
        return success(res,await challengeModel.getByDifficulty(req.params.difficulty));
    }catch(err){
        next(err);
    }
}
// same as getchallenges but with different filters needs can be better (search to enhance later) ------------

export const searchChallenges = async (req, res, next) => {
  try {
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
    } = req.query;

    const filters = {
      difficulty,
      category_id,
      status,
      minPoints: minPoints ? Number(minPoints) : null,
      maxPoints: maxPoints ? Number(maxPoints) : null,
      sortBy,
      order,
      page: Number(page),
      limit: Number(limit)
    };

    const data = await challengeModel.getChallenges(filters);

  return success(
  res,
  data,
  null,
  {
    page: filters.page,
    limit: filters.limit
  }
);

  } catch (err) {
    next(err);
  }
};


// Create a challenge req.body { "title",description","difficulty","points","flag","category_id" } status is set to pending until approved by admin------------------------------

export const createChallenge = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      points,
      status,
      flag,
      category_id
    } = req.body;

    // -------- VALIDATION --------
    if (!title || !difficulty || !points || !flag || !category_id) {
      return error(res, "Missing required fields", 400);
    }

    const allowedDifficulties = ["easy", "medium", "hard"];
    if (!allowedDifficulties.includes(difficulty)) {
      return error(res, "Invalid difficulty", 400);
    }

    const allowedStatus = [ CHALLENGE_STATUS.DRAFT,
  CHALLENGE_STATUS.PENDING,
  CHALLENGE_STATUS.APPROVED];
    const finalStatus = allowedStatus.includes(status) ? status : "draft";

    // -------- CREATE --------
    const [challenge] = await q.create({
      challenge_id: uuid(),
      title,
      description,
      difficulty,
      points: Number(points),
      status: finalStatus,
      flag,
      category_id,
      instructor_id: req.user.userId
    });

    return success(res, challenge, "Challenge created successfully", null, 201);

  } catch (err) {
    return error(res, err.message, 500);
  }
};
// Modify a Challenge --------------------------------------------


export const modifyChallenge = async (req, res, next) => {
    try {
        const [updated] = await challengeModel.update(req.params.id, req.body);
        if (!updated) return error(res, 'Challenge introuvable', 404);
        return success(res, updated);
    } catch (err) {
        next(err);
    }
};

// Delete A challenge --------------------------------------------


export const deleteChallenge = async (req, res, next) => {
    try {
        const deleted = await challengeModel.remove(req.params.id);
        if (!deleted) return error(res, 'Challenge introuvable', 404);
        return success(res, { message: 'Challenge supprime avec succes' });
    } catch (err) {
        next(err);
    }
};

// Upload files to a specific challenge (Not Tested) --------------------------------------------

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return error(res, "No file uploaded", 400);
    }

    const challenge = await q.getById(req.params.id);
    if (!challenge) {
      return error(res, "Challenge not found", 404);
    }

    const [file] = await q.addFile({
      file_id: uuid(),
      challenge_id: req.params.id,
      file_name: req.file.originalname,
      file_path: req.file.path,
      file_size: req.file.size
    });

    return success(res, file, "File uploaded successfully", null, 201);

  } catch (err) {
    return error(res, err.message, 500);
  }
};

// get files of a specific challenge (Not Tested) --------------------------------------------

export const getFiles = async (req, res, next) => {
    try {
        const files = await challengeModel.getFiles(req.params.id);
        return success(res, files);
    } catch (err) {
        next(err);
    }
};

// getting badges of a challenge and assign them to user if not already assigned (Not Tested) --------------------------------------------
 
export const getBadges = async (req, res) => {
  try {
    const userId = req.user.userId;
    const challengeId = req.params.id;

    const challenge = await q.getById(challengeId);
    if (!challenge) {
      return error(res, "Challenge not found", 404);
    }

    // Check if user solved challenge
    const solved = await q.hasUserSolvedChallenge(userId, challengeId);
    if (!solved) {
      return error(res, "Challenge not solved yet", 400);
    }

    // Get badges linked to this challenge
    const badges = await q.getBadgesByChallenge(challengeId);

    // Assign badges to user (if not already assigned)
    const awardedBadges = [];

    for (const badge of badges) {
      const alreadyHas = await q.userHasBadge(userId, badge.badge_id);

      if (!alreadyHas) {
        await q.assignBadgeToUser({
          id: uuid(),
          user_id: userId,
          badge_id: badge.badge_id
        });

        awardedBadges.push(badge);
      }
    }

    return success(res, awardedBadges, "Badges retrieved successfully");

  } catch (err) {
    return error(res, err.message, 500);
  }
};

// get Pending Challenges (Needs fixing) --------------------------------------------

export const fetchPendingChallenges = async (req, res, next) => { 
  try {
    console.log("We're trying");
    const challenges = await challengeModel.getPendingChallenges();
    console.log(challenges)
    const formatted = challenges.map(c => ({
      id: c.challenge_id,
      title: c.title,
      description: c.description,
      difficulty: c.difficulty,
      status: c.status,
      createdAt: c.created_at
    }));
    return success(res, formatted);
  } catch (error) {
  next(error);
  }
};


// Update Challenge status ADMIN --------------------------------------------
export const updateChallengeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // -------- VALIDATION --------
    const allowedStatus = [CHALLENGE_STATUS.PENDING,
  CHALLENGE_STATUS.APPROVED,
  CHALLENGE_STATUS.REJECTED];

    if (!allowedStatus.includes(status)) {
      return error(res, "Invalid status", 400);
    }

    const challenge = await q.getById(id);
    if (!challenge) {
      return error(res, "Challenge not found", 404);
    }

    // -------- UPDATE --------
    const updated = await q.updateChallengeStatus(id, status);

    return success(
      res,
      {
        id: updated.challenge_id,
        title: updated.title,
        status: updated.status
      },
      `Challenge ${status} successfully`
    );

  } catch (error) {
    next(error);
  }
};