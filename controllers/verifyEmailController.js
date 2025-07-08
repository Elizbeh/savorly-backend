import pool from '../config/db.js';

// Function to mark the user as verified
const markUserAsVerified = async (userId) => {
  const query = 'UPDATE users SET is_verified = 1, verification_token_expires_at = NULL WHERE id = ?';
  const [result] = await pool.execute(query, [userId]);
  if (result.affectedRows === 0) {
    throw new Error('User verification failed. User may already be verified.');
  }
  return result;
};


export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log("Received token in backend:", token);
  
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is missing.' });
  }
  
  try {
    const query = 'SELECT * FROM users WHERE verification_token = ? AND (verification_token_expires_at IS NULL OR verification_token_expires_at > NOW())';
    const [users] = await pool.execute(query, [token]);
  
    if (!users || users.length === 0) {
      return res.status(400).json({ success: false, message: 'Token is invalid or expired.' });
    }
  
    await markUserAsVerified(users[0].id);
    res.status(200).json({ success: true, message: 'Email verified successfully.', redirectUrl: '/login' });
  
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(400).json({ success: false, message: 'Invalid or expired token.' });
  }  
};
