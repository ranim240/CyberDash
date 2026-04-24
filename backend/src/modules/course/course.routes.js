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

// INSTRUCTOR ONLY ROUTES : Management of courses and their contents
router.post('/',               authorize(['instructor']), courseController.createCourse);
router.put('/:id',             authorize(['instructor']), courseController.updateCourse);
router.delete('/:id',          authorize(['instructor']), courseController.deleteCourse);
router.patch('/:id/publish',   authorize(['instructor']), courseController.publishCourse);
router.patch('/:id/unpublish', authorize(['instructor']), courseController.unpublishCourse);
router.post('/:id/contents',   authorize(['instructor']), courseController.addContent);
router.put('/:id/contents/:contentId',        authorize(['instructor']), courseController.updateContent);    // ← new
router.delete('/:id/contents/:contentId',     authorize(['instructor']), courseController.removeContent);

// ✅ SINGLE publish route (clean)
courseRouter.patch('/:id/publish', authorize(['instructor']), courseController.togglePublish);

// Course content
courseRouter.post('/:id/contents', authorize(['instructor']), courseController.addContent);

export default courseRouter;