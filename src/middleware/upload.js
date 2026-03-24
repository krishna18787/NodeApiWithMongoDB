const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.join(__dirname, '..', 'uploads', 'profiles');

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, PNG, and WEBP images are allowed'));
  }

  cb(null, true);
}

const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadProfileImage;
