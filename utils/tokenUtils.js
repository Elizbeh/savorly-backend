import logger from "../config/logger.js";

export const setRefreshTokenCookie = (res, refreshToken) => {
    if (!process.env.NODE_ENV) {
      logger.warn('NODE_ENV is not set! Please ensure it is properly configured.');
    }
  
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,  // Helps prevent client-side access to the cookie
      secure: process.env.NODE_ENV === 'production', // Ensure cookie is sent over HTTPS in production
      sameSite: 'Strict', // Helps prevent CSRF attacks (Adjust based on your use case)
      maxAge: 7 * 24 * 60 * 60 * 1000, // Refresh token expiry (7 days)
    });
  
    // Log when cookie is set (optional, use a logger in production instead of console.log)
    if (process.env.NODE_ENV === 'production') {
        logger.info('Refresh token cookie set successfully in production.');
    } else {
        logger.info('Refresh token cookie set successfully in development.');
    }
  };
  