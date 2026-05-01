import multer from 'multer';
import path   from 'path';
import fs     from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // ✅ UPDATE: Get challenge_id from multiple sources
    const challengeId = req.params.id || 
                       req.params.challengeId || 
                       req.params.challenge_id || 
                       req.body.challenge_id || 
                       'misc';
    
    // ✅ UPDATE: Better folder structure
    const dir = `uploads/challenges/${challengeId}`;

    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },

  filename: (req, file, cb) => {
    // ✅ UPDATE: Add timestamp to avoid filename conflicts
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const safeName = `${basename.replace(/[^a-zA-Z0-9._-]/g, '_')}_${timestamp}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB max
});

export default upload;