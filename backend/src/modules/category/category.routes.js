import express from 'express';
import categoryController from './category.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = express.Router();

// Public routes
router.get('/',               categoryController.getAllCategories);
router.get('/:id',            categoryController.getCategoryById);
router.get('/:id/challenges', categoryController.getChallengesByCategory);

// Protected routes (admin)
router.post('/',      isAuthenticated, authorize(['admin']), categoryController.createCategory);
router.put('/:id',    isAuthenticated, authorize(['admin']), categoryController.updateCategory);
router.delete('/:id', isAuthenticated, authorize(['admin']), categoryController.deleteCategory);

export default router;