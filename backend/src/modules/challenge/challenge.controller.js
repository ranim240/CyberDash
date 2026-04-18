import { v4 as uuid } from 'uuid';
import { success, error } from '../../utils/response.js';
import * as q from './challenge.queries.js';
import { validateUpdateChallengeStatus } from './challenge.validation.js';
console.log("CONTROLLER FILE LOADED");

// ------------------------------ CRUD --------------------------------------------

// Get Challenges with different status (used by admin )  ------------

export const getAll = async (req, res) => {
    try {
        return success(res, await q.getAll());
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// Get one Challenge details  ------------


export const getOne = async (req, res) => {
    try {
        const challenge = await q.getById(req.params.id);
        if (!challenge) return error(res, 'Challenge introuvable', 404);
        return success(res, challenge);
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// Only Active Challenges can be seen by learners  ------------

export const getActiveChallenges = async (req,res) => {
    try{
        return success(res,await q.getActiveChallenges());
    }catch(err){
        return error(res,err.message,500);
    }
}

// Challenges by instructor used for the instructor to see his own challenges doesn't filter status !!! (for learner filtering status must be added) ------------

export const getInstructorChallenges = async (req,res) => {
    try{
        return success(res,await q.getByInstructor(req.user.userId));
    }catch(err){
        return error(res,err.message,500);
    }
}

// Challenges by difficulty not really needed after filter added but gonna keep it for now ------------

export const fetchByDifficulty = async (req,res) => {
    try{
        return success(res,await q.getByDifficulty(req.params.difficulty));
    }catch(err){
        return error(res,err.message,500);
    }
}
// same as getchallenges but with different filters needs can be better (search to enhance later) ------------

export const SearchChallenges = async (req, res, next) => {
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

    const data = await q.getChallenges(filters);

    res.json({
      success: true,
      page: filters.page,
      limit: filters.limit,
      data
    });

  } catch (error) {
    next(error);
  }
};


// Create a challenge req.body { "title",description","difficulty","points","status","flag","category_id" } ------------------------------

export const createChallenge = async (req, res) => {
    try {
        const [c] = await q.create({
            challenge_id: uuid(),
            ...req.body,
            instructor_id: req.user.userId
        });
        return success(res, c, 201);
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// Modify a Challenge --------------------------------------------


export const modifyChallenge = async (req, res) => {
    try {
        const [updated] = await q.update(req.params.id, req.body);
        if (!updated) return error(res, 'Challenge introuvable', 404);
        return success(res, updated);
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// Delete A challenge --------------------------------------------


export const deleteChallenge = async (req, res) => {
    try {
        const deleted = await q.remove(req.params.id);
        if (!deleted) return error(res, 'Challenge introuvable', 404);
        return success(res, { message: 'Challenge supprime avec succes' });
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// Upload files to a specific challenge (Not Tested) --------------------------------------------

export const uploadFile = async (req, res) => {
    try {
        const [file] = await q.addFile({
            file_id: uuid(),
            challenge_id: req.params.id,
            file_name: req.file.originalname,
            file_path: req.file.path,
            file_size: req.file.size
        });
        return success(res, file, 201);
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// get files of a specific challenge (Not Tested) --------------------------------------------

export const getFiles = async (req, res) => {
    try {
        const files = await q.getFiles(req.params.id);
        return success(res, files);
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// I don't understand the purpose of this but gonna keep it for now --------------------------------------------
 
export const getBadges = async (req, res) => {
    try {
        const challengeId = req.params.id;
        const challenge = await q.getById(challengeId);
        if (!challenge) return error(res, 'Challenge introuvable', 404);
        return success(res, { message: 'Badges data' });
    } catch (err) {
        return error(res, err.message, 500);
    }
};

// get Pending Challenges (Needs fixing) --------------------------------------------

export const fetchPendingChallenges = async (req, res, next) => { 
  try {
    console.log("We're trying");
    const challenges = await q.getPendingChallenges();
    console.log(challenges)
    const formatted = challenges.map(c => ({
      id: c.challenge_id,
      title: c.title,
      description: c.description,
      difficulty: c.difficulty,
      status: c.status,
      createdAt: c.created_at
    }));
    res.json({
      success: true,
      data: formatted
    });
  } catch (error) {
  next(error);
  }
};


// Update Challenge status ADMIN --------------------------------------------
export const updateChallengeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate input
    const errors = validateUpdateChallengeStatus(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Update challenge status
    const updated = await q.updateChallengeStatus(id, status);

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Challenge not found' 
      });
    }

    res.json({
      success: true,
      message: `Challenge ${status} successfully`,
      data: {
        id: updated.challenge_id,
        title: updated.title,
        status: updated.status
      }
    });
  } catch (error) {
    next(error);
  }
};