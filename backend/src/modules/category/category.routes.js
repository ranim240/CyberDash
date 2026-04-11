import express from 'express';
import * as controller from './category.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = express.Router();

// Public routes
router.get('/',               controller.getAllCategories);
router.get('/:id',            controller.getCategoryById);
router.get('/:id/challenges', controller.getChallengesByCategory);

// Protected routes (admin)
router.post('/',      isAuthenticated, authorize(['admin']), controller.createCategory);
router.put('/:id',    isAuthenticated, authorize(['admin']), controller.updateCategory);
router.delete('/:id', isAuthenticated, authorize(['admin']), controller.deleteCategory);

export default router;