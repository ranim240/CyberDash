import { v4 as uuid } from 'uuid';
import { success, error } from '../../utils/response.js';
import challengeModel from './challenge.queries.js';
import { validateCreateChallenge, validateUpdateChallengeStatus } from './challenge.validation.js';
console.log("CONTROLLER FILE LOADED");

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

    const data = await challengeModel.getChallenges(filters);

    res.json({
      success: true,
      page: filters.page,
      limit: filters.limit,
      data
    });

  } catch (err) {
    next(err);
  }
};


// Create a challenge req.body { "title",description","difficulty","points","flag","category_id" } status is set to pending until approved by admin------------------------------

export const createChallenge = async (req, res, next) => {
    try {
        const { title, description, difficulty, points, flag, category_id } = req.body;
        const [c] = await challengeModel.create({
            challenge_id: uuid(),
            title, description, difficulty, points, flag, category_id,
            instructor_id: req.user.userId,
            status: 'pending'
        });
        return success(res, c, 201);
    } catch (err) {
        next(err);
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

export const uploadFile = async (req, res, next) => {
    try {
        const [file] = await challengeModel.addFile({
            file_id: uuid(),
            challenge_id: req.params.id,
            file_name: req.file.originalname,
            file_path: req.file.path,
            file_size: req.file.size
        });
        return success(res, file, 201);
    } catch (err) {
        next(err);
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

// I don't understand the purpose of this but gonna keep it for now --------------------------------------------
 
export const getBadges = async (req, res, next) => {
    try {
        const challengeId = req.params.id;
        const challenge = await challengeModel.getById(challengeId);
        if (!challenge) return error(res, 'Challenge introuvable', 404);
        return success(res, { message: 'Badges data' });
    } catch (err) {
        next(err);
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
    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
  next(err);
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
    const updated = await challengeModel.updateChallengeStatus(id, status);

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
  } catch (err) {
    next(err);
  }
};