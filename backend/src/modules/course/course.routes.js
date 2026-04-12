import { Router } from 'express';
import {
  getAll,
  getOne,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  unpublishCourse,
  getContents,
  addContent
} from './course.controller.js';
import { isAuthenticated } from '../../middlewares/auth.js';
import { authorize } from '../../middlewares/role.js';

const router = Router();

// Anyone can browse courses and see details
router.get('/', getAll);
router.get('/:id', getOne);

// PROTECTED ROUTES : Authentication required for all routes below
router.use(isAuthenticated);

// Content access: Learners must be enrolled, Instructors must be owners
router.get('/:id/contents', authorize(['instructor', 'learner']), getContents);

// INSTRUCTOR ONLY ROUTES : Management of courses and their contents
router.post('/',               authorize(['instructor']), createCourse);
router.put('/:id',             authorize(['instructor']), updateCourse);
router.delete('/:id',          authorize(['instructor']), deleteCourse);
router.patch('/:id/publish',   authorize(['instructor']), publishCourse);
router.patch('/:id/unpublish', authorize(['instructor']), unpublishCourse);
router.post('/:id/contents',   authorize(['instructor']), addContent);

export default router;