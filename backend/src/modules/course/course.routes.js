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
import { authenticate } from '../../middlewares/auth.js';

import { authorize } from '../../middlewares/role.js';

const router = Router();

router.use(authenticate);

// Public routes
router.get('/', getAll);
router.get('/:id', getOne);

// Instructor protected routes
router.use(authorize('instructor'));
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.patch('/:id/publish', publishCourse);
router.patch('/:id/unpublish', unpublishCourse);
router.get('/:id/contents', getContents);
router.post('/:id/contents', addContent);

export default router;
