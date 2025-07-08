import express from 'express';
import { getUserProfile, updateUserProfile, uploadAvatar } from '../controllers/profileController.js'; // Importing the necessary functions from profileController
import upload from '../middleware/upload.js';

const router = express.Router();

// Get user profile
router.get('/', getUserProfile);

// Update user profile (bio and avatar_url)
router.put('/', updateUserProfile);

// Upload avatar image to Cloudinary
router.post('/avatar', upload.single('avatar'), uploadAvatar);

export default router;
