import 'dotenv/config';
import fs from 'fs';
import https from 'https';
import app from './app.js';
import './cronJob.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  // Local dev or test
  if (process.env.LOCAL_HTTPS === 'true') {
    const key = fs.readFileSync('./cert/key.pem');
    const cert = fs.readFileSync('./cert/cert.pem');
    https.createServer({ key, cert }, app).listen(PORT, () => {
      logger.info(`🚀 HTTPS Server at https://localhost:${PORT}`);
    });
  } else {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  }
} else {
  // Production
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
}