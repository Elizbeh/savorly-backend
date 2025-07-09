import logger from "../config/logger.js";

export const setRefreshTokenCookie = (res, refreshToken, isSecure) => {
  if (!process.env.NODE_ENV) {
    logger.warn('NODE_ENV is not set! Please ensure it is properly configured.');
  }

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  if (isSecure) {
    logger.info('Refresh token cookie set successfully in production.');
  } else {
    logger.info('Refresh token cookie set successfully in development.');
  }
};
