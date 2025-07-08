import multer from 'multer';
import path from 'path';

// Define the file types and file size limits
const fileTypes = /jpeg|jpg|png|gif/;
const fileSizeLimit = 20 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log('Uploading file:', file.mimetype);
  // Check the file type and extension
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  } else {
    console.log('Invalid file type:', file.originalname);
    return cb(new Error('Invalid file type'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: fileSizeLimit },
  fileFilter: fileFilter
});

export default upload;
