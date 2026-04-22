import { Router } from 'express';
import courseController from './course.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = Router();

// Public routes
router.get('/', courseController.getAll);
router.get('/:id', courseController.getOne);

// Protected routes
router.use(isAuthenticated);

// Content access
router.get('/:id/contents', authorize(['instructor', 'learner']), courseController.getContents);

// Instructor routes
router.post('/', authorize(['instructor']), courseController.createCourse);
router.put('/:id', authorize(['instructor']), courseController.updateCourse);
router.delete('/:id', authorize(['instructor']), courseController.deleteCourse);

// ✅ SINGLE publish route (clean)
router.patch('/:id/publish', authorize(['instructor']), courseController.togglePublish);

// Course content
router.post('/:id/contents', authorize(['instructor']), courseController.addContent);

export default router;