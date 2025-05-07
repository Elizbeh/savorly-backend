import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the correct .env file based on the NODE_ENV
const envPath = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../.env.production')
  : path.resolve(__dirname, '../.env.local');

dotenv.config({ path: envPath });

// Load environment variables into Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Optional: Log config in dev
if (process.env.NODE_ENV !== 'production') {
  console.log('Cloudinary configuration loaded:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  });
}

export default cloudinary;
