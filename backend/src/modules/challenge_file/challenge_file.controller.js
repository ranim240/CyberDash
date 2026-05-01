import * as queries from './challenge_file.queries.js';
import { v4 as uuid } from 'uuid';
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

    // ✅ Map DB fields to frontend expected fields
    const mappedFiles = files.map(f => ({
      file_id: f.file_id,
      challenge_id: f.challenge_id,
      name: f.file_name,
      file_url: f.file_path,
      url: f.file_path,
      size_bytes: f.file_size,
      size: formatBytes(f.file_size),
    }));

    return success(res, mappedFiles);

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

    // ✅ Map DB fields to frontend expected fields
    const mappedFile = {
      file_id: file.file_id,
      challenge_id: file.challenge_id,
      name: file.file_name,
      file_url: file.file_path,
      url: file.file_path,
      size_bytes: file.file_size,
    };

    return success(res, mappedFile);

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 CREATE SINGLE FILE
// ==========================
export const createChallengeFile = async (req, res, next) => {
  try {
    const file_id =uuid();
    const challenge_id = req.body.challenge_id || req.params.id;
    
    if (!req.file) {
      return error(res, ['No file uploaded'], 400);
    }

    // ✅ Map multer data to DB schema
    const fileData = {
      file_id,
      challenge_id,
      file_name: req.file.originalname,
      file_path: `/${req.file.path.replace(/\\/g, '/')}`,
      file_size: req.file.size,
    };

    const errors = validateCreateChallengeFile(fileData);
    if (errors.length > 0) {
      return error(res, errors, 400);
    }

    const created = await queries.createChallengeFile(fileData);

    // ✅ Map response back to frontend expected format
    const response = {
      file_id: created.file_id,
      challenge_id: created.challenge_id,
      name: created.file_name,
      file_url: created.file_path,
      url: created.file_path,
      size_bytes: created.file_size,
    };

    return success(res, response, 201, 'File created successfully');

  } catch (err) {
    next(err);
  }
};


// ==========================
// 📌 CREATE MULTIPLE FILES
// ==========================
export const createMultipleChallengeFiles = async (req, res, next) => {
  try {
    const challenge_id = req.body.challenge_id || req.params.id;

    if (!req.files || req.files.length === 0) {
      return error(res, ['No files uploaded'], 400);
    }

    // ✅ Map multer data to DB schema
    const filesData = req.files.map(file => ({
      file_id:uuid(),
      challenge_id,
      file_name: file.originalname,
      file_path: `/${file.path.replace(/\\/g, '/')}`,
      file_size: file.size,
    }));

    const allErrors = [];
    filesData.forEach((file, index) => {
      const errors = validateCreateChallengeFile(file);
      if (errors.length > 0) {
        allErrors.push(`File ${index + 1}: ${errors.join(', ')}`);
      }
    });

    if (allErrors.length > 0) {
      return error(res, allErrors, 400);
    }

    const created = await queries.createMultipleChallengeFiles(filesData);

    // ✅ Map response back to frontend expected format
    const mappedResponse = created.map(f => ({
      file_id: f.file_id,
      challenge_id: f.challenge_id,
      name: f.file_name,
      file_url: f.file_path,
      url: f.file_path,
      size_bytes: f.file_size,
    }));

    return success(res, mappedResponse, 201, `${created.length} files created`);

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

    return success(res, updated,201, 'File updated successfully');

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

    return success(res, deleted,201, 'File deleted successfully');

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

    return success(res, deleted, 200,`${deleted} files deleted`);

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

// ✅ Helper function
function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}