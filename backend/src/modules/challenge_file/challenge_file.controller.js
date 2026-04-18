import * as queries from './challenge_file.queries.js';
import {
  validateCreateChallengeFile,
  validateUpdateChallengeFile
} from './challenge_file.validation.js';

// ============ CHALLENGE FILE CRUD OPERATIONS ============

export const getFilesByChallenge = async (req, res, next) => {
  try {
    const { challenge_id } = req.params;

    const files = await queries.getFilesByChallenge(challenge_id);

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    next(error);
  }
};

export const getFileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const file = await queries.getFileById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    next(error);
  }
};

export const createChallengeFile = async (req, res, next) => {
  try {
    // Validate input
    const errors = validateCreateChallengeFile(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const created = await queries.createChallengeFile(req.body);

    res.status(201).json({
      success: true,
      message: 'Challenge file created successfully',
      data: created
    });
  } catch (error) {
    next(error);
  }
};

export const createMultipleChallengeFiles = async (req, res, next) => {
  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        errors: ['files must be a non-empty array']
      });
    }

    // Validate each file
    const allErrors = [];
    files.forEach((file, index) => {
      const errors = validateCreateChallengeFile(file);
      if (errors.length > 0) {
        allErrors.push(`File ${index}: ${errors.join(', ')}`);
      }
    });

    if (allErrors.length > 0) {
      return res.status(400).json({ success: false, errors: allErrors });
    }

    const created = await queries.createMultipleChallengeFiles(files);

    res.status(201).json({
      success: true,
      message: `${created.length} files created successfully`,
      data: created
    });
  } catch (error) {
    next(error);
  }
};

export const updateChallengeFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate input
    const errors = validateUpdateChallengeFile(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const updated = await queries.updateChallengeFile(id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      message: 'File updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChallengeFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await queries.deleteChallengeFile(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFilesByChallenge = async (req, res, next) => {
  try {
    const { challenge_id } = req.params;

    const deleted = await queries.deleteFilesByChallenge(challenge_id);

    res.json({
      success: true,
      message: `${deleted.length} file(s) deleted successfully`,
      data: deleted
    });
  } catch (error) {
    next(error);
  }
};

// ============ CHALLENGE FILE STATISTICS ============

export const getChallengeFileStats = async (req, res, next) => {
  try {
    const { challenge_id } = req.params;

    const stats = await queries.getChallengeFileStats(challenge_id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getTotalStorageUsed = async (req, res, next) => {
  try {
    const stats = await queries.getTotalStorageUsed();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};