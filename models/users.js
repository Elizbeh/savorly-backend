import pool from '../config/db.js';
import { createUserProfile } from './profile.js';
import logger from '../config/logger.js'


export const createUser = async (userData) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Insert user
    const { email, password_hash, first_name, last_name, role = 'user', verification_token } = userData;
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);

    const [result] = await connection.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, verification_token, verification_token_expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [email, password_hash, first_name, last_name, role, verification_token, tokenExpiration]
    );

    const userId = result.insertId;

    // Pass the connection to createUserProfile
    await createUserProfile(connection, {
      user_id: userId,
      first_name,
      last_name,
      bio: null,
      avatar_url: null,
    });

    await connection.commit();

    return { id: userId, email, first_name, last_name, role };
  } catch (error) {
    await connection.rollback();
    logger.error('Error creating user:', error);
    throw error;
  } finally {
    connection.release();
  }
};


export const getUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await pool.query(query, [email]);
        return rows[0] || null;
    } catch (err) {
        logger.error("Error fetching user by email:", err);
        throw new Error('Database query failed');
    }
};

export const getUserById = async (id) => {
    try {
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await pool.query(query, [id]);
        return rows[0] || null;
    } catch (err) {
        logger.error("Error fetching user by ID:", err);
        throw new Error('Database query failed');
    }
};

export const getUserByToken = async (token) => {
    try {
        const query = 'SELECT * FROM users WHERE verification_token = ? AND verification_token_expires_at > NOW()';
        const [users] = await pool.query(query, [token]);
        return users.length > 0 ? users[0] : null; 
    } catch (err) {
        logger.error('Error fetching user by token:', err);
        throw err;
    }
};

export const updateUserVerificationToken = async (userId, token, expiration) => {
    try {
        const query = 'UPDATE users SET verification_token = ?, verification_token_expires_at = ? WHERE id = ?';
        await pool.execute(query, [token, expiration, userId]);
        logger.log("Verification token updated successfully.");
    } catch (err) {
        logger.error('Error updating verification token:', err);
        throw new Error('Database update failed');
    }
};
