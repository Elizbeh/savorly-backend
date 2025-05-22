import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../models/users.js';
import { setRefreshTokenCookie } from '../utils/tokenUtils.js';
import logger from '../config/logger.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      logger.warn(`Login attempt failed: User not found - ${email}`);
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      logger.warn(`Invalid password attempt for email: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.is_verified) {
      logger.info(`Unverified email login attempt: ${email}`);
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      path: '/',
      maxAge: 60 * 60 * 1000,
    });

    setRefreshTokenCookie(res, refreshToken);

    logger.info(`User logged in: ${email}`);
    res.status(200).json({
      message: 'Login successful',
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    logger.error(`Login error for ${email}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Server error' });
  }
};
