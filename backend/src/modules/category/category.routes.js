import express from 'express';
import categoryController from './category.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const categoryRouter = express.Router();

// ================= PUBLIC ROUTES =================

// ⚠️ specific route FIRST
categoryRouter.get('/:id/challenges', categoryController.getChallengesByCategory);

categoryRouter.get('/', categoryController.getAllCategories);
categoryRouter.get('/:id', categoryController.getCategoryById);


// ================= ADMIN ROUTES =================

categoryRouter.use(isAuthenticated, authorize(['admin']));

categoryRouter.post('/', categoryController.createCategory);
categoryRouter.put('/:id', categoryController.updateCategory);
categoryRouter.delete('/:id', categoryController.deleteCategory);

export default categoryRouter;