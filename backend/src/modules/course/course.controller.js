import { v4 as uuid } from 'uuid';
import { success, error } from '../../utils/response.js';
import * as q from './course.queries.js';
export const getAll = async (req, res) => {
try { return success(res, await q.getAllPublished()); }
catch (err) { return error(res, err.message, 500); }
};
export const getOne = async (req, res) => {
try {
const course = await q.getById(req.params.id);
if (!course) return error(res, 'Cours introuvable', 404);
return success(res, course);
} catch (err) { return error(res, err.message, 500); }
};
export const createCourse = async (req, res) => {
try {
const [course] = await q.create({
course_id: uuid(), ...req.body, instructor_id: req.user.userId
});
return success(res, course, 201);
} catch (err) { return error(res, err.message, 500); }
};
export const updateCourse = async (req, res) => {
try {
const [course] = await q.update(req.params.id, req.body);
return success(res, course);
} catch (err) { return error(res, err.message, 500); }
};
export const deleteCourse = async (req, res) => {
try { await q.remove(req.params.id); return success(res, { message: 'Supprime' }); }
catch (err) { return error(res, err.message, 500); }
};
export const publishCourse = async (req, res) => {
try { await q.setPublished(req.params.id, true); return success(res, { message: 'Publie' }); }
catch (err) { return error(res, err.message, 500); }
};
export const unpublishCourse = async (req, res) => {
try { await q.setPublished(req.params.id, false); return success(res, { message: 'Depublie' }); }
catch (err) { return error(res, err.message, 500); }
};
export const getContents = async (req, res) => {
try { return success(res, await q.getContents(req.params.id)); }
catch (err) { return error(res, err.message, 500); }
};
export const addContent = async (req, res) => {
try {
const [content] = await q.addContent({ content_id: uuid(),
course_id: req.params.id, ...req.body });
return success(res, content, 201);
} catch (err) { return error(res, err.message, 500); }
};