import express from 'express';
import courseController from './course.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const courseRouter = express.Router();

// Public routes
courseRouter.get('/', courseController.getAll);
courseRouter.get('/:id', courseController.getOne);

// Protected routes
courseRouter.use(isAuthenticated);

// Content access
courseRouter.get('/:id/contents', authorize(['instructor', 'learner']), courseController.getContents);

// Instructor routes
courseRouter.post('/', authorize(['instructor']), courseController.createCourse);
courseRouter.put('/:id', authorize(['instructor']), courseController.updateCourse);
courseRouter.delete('/:id', authorize(['instructor']), courseController.deleteCourse);

// ✅ SINGLE publish route (clean)
courseRouter.patch('/:id/publish', authorize(['instructor']), courseController.togglePublish);

// Course content
courseRouter.post('/:id/contents', authorize(['instructor']), courseController.addContent);

export default courseRouter;