import express from 'express';
import categoryController from './category.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = express.Router();

// ================= PUBLIC ROUTES =================

// ⚠️ specific route FIRST
router.get('/:id/challenges', categoryController.getChallengesByCategory);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);


// ================= ADMIN ROUTES =================

router.use(isAuthenticated, authorize(['admin']));

router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;