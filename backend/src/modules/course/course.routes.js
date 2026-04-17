import { Router } from 'express';
import courseController from './course.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = Router();

// Anyone can browse courses and see details
router.get('/',    courseController.getAll);
router.get('/:id', courseController.getOne);

// PROTECTED ROUTES : Authentication required for all routes below
router.use(isAuthenticated);

// Content access: Learners must be enrolled, Instructors must be owners
router.get('/:id/contents', authorize(['instructor', 'learner']), courseController.getContents);

// INSTRUCTOR ONLY ROUTES : Management of courses and their contents
router.post('/',               authorize(['instructor']), courseController.createCourse);
router.put('/:id',             authorize(['instructor']), courseController.updateCourse);
router.delete('/:id',          authorize(['instructor']), courseController.deleteCourse);
router.patch('/:id/publish',   authorize(['instructor']), courseController.publishCourse);
router.patch('/:id/unpublish', authorize(['instructor']), courseController.unpublishCourse);
router.post('/:id/contents',   authorize(['instructor']), courseController.addContent);

export default router;