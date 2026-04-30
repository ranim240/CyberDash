import multer from 'multer';
import path   from 'path';
import fs     from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // dossier uploads/challenge_id/ pour organiser par challenge
    const challengeId = req.params.id ?? req.params.challengeId ?? 'misc';
    const dir = `uploads/${challengeId}`;

    // créer le dossier s'il n'existe pas
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    // garder le nom original — file_path sera /uploads/challengeId/nom.ext
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
});

export default upload;