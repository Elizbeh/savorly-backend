import pool from '../config/db.js';

// Create a user profile

export const createUserProfile = async (connection, profileData) => {
  try {
    const query = `
      INSERT INTO user_profiles 
      (user_id, first_name, last_name, bio, avatar_url) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await connection.query(query, [
      profileData.user_id,
      profileData.first_name,
      profileData.last_name,
      profileData.bio,
      profileData.avatar_url,
    ]);
    return result;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
};


// Get profile by user ID
export const getProfileByUserId = async (userId) => {
    const query = 'SELECT * FROM user_profiles WHERE user_id = ?';
    const [rows] = await pool.query(query, [userId]);
    return rows[0];
};

// Update profile (bio and avatar)
export const updateProfile = async (userId, profileData) => {
    const { first_name, last_name, bio, avatar_url } = profileData;
  
    const [existingProfile] = await pool.query('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
  
    if (!existingProfile.length) {
      try {
        await pool.query(
          'INSERT INTO user_profiles (user_id, first_name, last_name, bio, avatar_url) VALUES (?, ?, ?, ?, ?)',
          [userId, first_name, last_name, bio, avatar_url]
        );
      } catch (error) {
        console.error('Error creating profile:', error);
        throw new Error('Failed to create profile');
      }
    } else {
      try {
        const [result] = await pool.query(
          'UPDATE user_profiles SET first_name = ?, last_name = ?, bio = ?, avatar_url = ? WHERE user_id = ?',
          [first_name, last_name, bio, avatar_url, userId]
        );
  
        if (result.affectedRows === 0) {
          throw new Error(`Profile update failed for user ID: ${userId}`);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
      }
    }
  };
  
