import * as queries from './challenge_file.queries.js';
import {
  validateCreateChallengeFile,
  validateUpdateChallengeFile
} from './challenge_file.validation.js';

import { success, error } from '../../utils/response.js';


// ==========================
// 📌 GET FILES BY CHALLENGE
// ==========================
export const getFilesByChallenge = async (req, res, next) => {
  try {
    const { challenge_id } = req.params;

    const files = await queries.getFilesByChallenge(challenge_id);

    return success(res, files);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 GET FILE BY ID
// ==========================
export const getFileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await queries.getFileById(id);

    if (!file) {
      return error(res, 'File not found', 404);
    }

    return success(res, file);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 CREATE SINGLE FILE
// ==========================
export const createChallengeFile = async (req, res, next) => {
  try {
    const errors = validateCreateChallengeFile(req.body);
    if (errors.length > 0) {
      return error(res, errors, 400);
    }

    const created = await queries.createChallengeFile(req.body);

    return success(res, created, 'File created successfully', null, 201);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 CREATE MULTIPLE FILES
// ==========================
export const createMultipleChallengeFiles = async (req, res, next) => {
  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return error(res, ['files must be a non-empty array'], 400);
    }

    const allErrors = [];

    files.forEach((file, index) => {
      const errors = validateCreateChallengeFile(file);
      if (errors.length > 0) {
        allErrors.push(`File ${index + 1}: ${errors.join(', ')}`);
      }
    });

    if (allErrors.length > 0) {
      return error(res, allErrors, 400);
    }

    const created = await queries.createMultipleChallengeFiles(files);

    return success(res, created, `${created.length} files created`, null, 201);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 UPDATE FILE
// ==========================
export const updateChallengeFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const errors = validateUpdateChallengeFile(req.body);
    if (errors.length > 0) {
      return error(res, errors, 400);
    }

    const updated = await queries.updateChallengeFile(id, req.body);

    if (!updated) {
      return error(res, 'File not found', 404);
    }

    return success(res, updated, 'File updated successfully');

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 DELETE FILE
// ==========================
export const deleteChallengeFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await queries.deleteChallengeFile(id);

    if (!deleted) {
      return error(res, 'File not found', 404);
    }

    return success(res, deleted, 'File deleted successfully');

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 DELETE ALL FILES BY CHALLENGE
// ==========================
export const deleteFilesByChallenge = async (req, res, next) => {
  try {
    const { challenge_id } = req.params;

    const deleted = await queries.deleteFilesByChallenge(challenge_id);

    return success(res, deleted, `${deleted.length} files deleted`);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 FILE STATS
// ==========================
export const getChallengeFileStats = async (req, res, next) => {
  try {
    const { challenge_id } = req.params;

    const stats = await queries.getChallengeFileStats(challenge_id);

    return success(res, stats);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 STORAGE STATS
// ==========================
export const getTotalStorageUsed = async (req, res, next) => {
  try {
    const stats = await queries.getTotalStorageUsed();

    return success(res, stats);

  } catch (err) {
    next(err);
  }
};