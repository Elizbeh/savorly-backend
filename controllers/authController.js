import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';
import logger from '../config/logger.js';

import {
  createUser,
  getUserByEmail,
  updateUserVerificationToken,
} from '../models/users.js';
import { sendEmail } from '../services/emailService.js';

// Helper to generate secure cookies correctly
const isSecureEnv = () =>
  process.env.NODE_ENV === 'production' || process.env.LOCAL_HTTPS === 'true';

const generateVerificationToken = () => uuidv4();

export const registerUser = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  const role = 'user';

  if (req.body.role && req.body.role !== 'user') {
    logger.warn(
      `Overridden attempted role "${req.body.role}" during registration for ${email}`
    );
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      logger.warn(`Registration failed: Email already in use - ${email}`);
      return res.status(409).json({ message: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const verification_token = uuidv4();

    const newUser = await createUser({
      email,
      password_hash,
      first_name,
      last_name,
      role,
      verification_token,
      verification_token_expires_at: new Date(Date.now() + 3600000), // 1 hour
    });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(
      verification_token
    )}`;

    console.log('Verification URL:', verificationUrl);
    await sendEmail(email, first_name, verificationUrl);

    logger.info(`New user registered: ${email}`);
    res.status(201).json({
      message: 'User created successfully. Please check your email to verify your account.',
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name,
        last_name,
        role: 'user',
      },
    });
  } catch (error) {
    logger.error(`Registration error for email ${email}: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: 'Server error' });
  }
};

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      logger.warn(`Resend failed: User not found - ${email}`);
      return res.status(400).json({ message: 'User not found' });
    }

    if (user?.is_verified) {
      logger.info(`Resend skipped: Email already verified - ${email}`);
      return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationToken = generateVerificationToken();
    const tokenExpiration = new Date(Date.now() + 3600000);

    await updateUserVerificationToken(user.id, verificationToken, tokenExpiration);

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(
      verificationToken
    )}`;

    console.log(process.env.CLIENT_URLy)
    await sendEmail(email, user.first_name, verificationUrl);

    logger.info(`Verification email resent to: ${email}`);
    res.status(200).json({ message: 'A new verification email has been sent. Please check your inbox.' });
  } catch (error) {
    logger.error(`Resend verification error for email ${email}: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: 'Server error' });
  }
};

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    logger.warn('Refresh token missing');
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const newRefreshToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    const secure = isSecureEnv();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure,
      sameSite: secure ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    logger.info(`Refreshed token for ${decoded.email}`);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`, { stack: error.stack });
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const getUserData = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      logger.warn('Missing user ID in getUserData');
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }

    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);

    if (rows.length === 0) {
      logger.warn(`User not found: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    logger.info(`Fetched user data: ${userId}`);
    res.status(200).json(rows[0]);
  } catch (error) {
    logger.error(`getUserData error: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('authToken', { httpOnly: true, secure: true, sameSite: 'None' });
  res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'None' });
  res.status(200).json({ message: 'Logged out' });
};
