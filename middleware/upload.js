import multer from 'multer';
import path from 'path';

// Allowed image types
const allowedTypes = /jpeg|jpg|png|gif/;
const maxFileSize = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isImage = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMime = allowedTypes.test(file.mimetype);

  if (isImage && isMime) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, GIF allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: maxFileSize },
  fileFilter,
});

export default upload;
