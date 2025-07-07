import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from 'streamifier';
import { getProfileByUserId, updateProfile } from '../models/profile.js';

export const getUserProfile = async (req, res) => {
  const userId = req.user?.id;

  try {
    const userProfile = await getProfileByUserId(userId);
    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.user?.id;
  const { first_name, last_name, bio, avatar_url } = req.body;


  if (!userId) return res.status(400).json({ message: 'User ID is missing from request' });
  if (bio && typeof bio !== 'string') return res.status(400).json({ message: 'Bio must be a string' });
  if (avatar_url && typeof avatar_url !== 'string') return res.status(400).json({ message: 'Avatar URL must be a string' });

  try {
    const updatedProfileData = {
      first_name: first_name || '',
      last_name: last_name || '',
      bio: bio || '',
      avatar_url: avatar_url || 'http://localhost:5001/uploads/default_avatar.png',    
    };

    await updateProfile(userId, updatedProfileData);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

export const uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ message: 'Invalid file type' });
  }

  try {
    const stream = cloudinary.v2.uploader.upload_stream(
      { folder: 'user_avatars', resource_type: 'image' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Upload failed', error });
        }
        return res.json({ avatar_url: result.secure_url });
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading image', error });
  }
};
