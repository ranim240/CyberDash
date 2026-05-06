import express from 'express';
import courseController from './course.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';
const courseRouter = express.Router();

// Public routes
courseRouter.get('/', courseController.getAll);
courseRouter.get('/my-courses',isAuthenticated, authorize(['instructor']), courseController.getMyCourses);
courseRouter.get('/:id', courseController.getOne);

// Protected routes
courseRouter.use(isAuthenticated);

// Content access
courseRouter.get('/:id/contents', authorize(['instructor', 'learner']), courseController.getContents);

// INSTRUCTOR ONLY ROUTES : Management of courses and their contents
courseRouter.post('/',               authorize(['instructor']), courseController.createCourse);
courseRouter.put('/:id',             authorize(['instructor']), courseController.updateCourse);
courseRouter.delete('/:id',          authorize(['instructor']), courseController.deleteCourse);
courseRouter.patch('/:id/publish',   authorize(['instructor']), courseController.togglePublish);
courseRouter.post('/:id/contents',   authorize(['instructor']), courseController.addContent);
courseRouter.put('/:id/contents/:contentId',        authorize(['instructor']), courseController.updateContent);    // ← new
courseRouter.delete('/:id/contents/:contentId',     authorize(['instructor']), courseController.removeContent);


export default courseRouter;