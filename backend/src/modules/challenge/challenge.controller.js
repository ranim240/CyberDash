export const getAll = async (req, res) => {
try { return success(res, await q.getAll()); }
catch (err) { return error(res, err.message, 500); }
};
export const getOne = async (req, res) => {
try {
const challenge = await q.getById(req.params.id);
if (!challenge) return error(res, 'Challenge introuvable', 404);
return success(res, challenge);
} catch (err) { return error(res, err.message, 500); }
};
export const createChallenge = async (req, res) => {
try {
const [c] = await q.create({
challenge_id: uuid(), ...req.body, instructor_id: req.user.userId
});
return success(res, c, 201);
} catch (err) { return error(res, err.message, 500); }
};
export const uploadFile = async (req, res) => {
try {
const [file] = await q.addFile({
file_id: uuid(), challenge_id: req.params.id,
file_name: req.file.originalname, file_path: req.file.path,
file_size: req.file.size
});
return success(res, file, 201);
} catch (err) { return error(res, err.message, 500); }
};