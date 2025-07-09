import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../models/users.js';
import { setRefreshTokenCookie } from '../utils/tokenUtils.js'; // ensure this uses secure/sameSite flags too
import logger from '../config/logger.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);


  try {
    const user = await getUserByEmail(email);
    console.log('User fetched:', user);


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

    const origin = req.get('origin');
const isGitHubPages = origin && origin.includes('github.io');
const isSecure = isGitHubPages || process.env.NODE_ENV === 'production';

    res.cookie('authToken', accessToken, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? 'None' : 'Lax',
      maxAge: 60 * 60 * 1000, // 1 hour
      path: '/',
    });

    setRefreshTokenCookie(res, refreshToken, isSecure);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      message: 'Login successful',
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
    console.error('Login error:', error);
    logger.error(`Login error for ${email}: ${error.message}`, { stack: error.stack });
    res.status(500).json({ message: 'Server error' });
  }
};
