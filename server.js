import fs from 'fs';
import https from 'https';
import app from './app.js';
import dotenv from 'dotenv';
import logger from './config/logger.js';
import './cronJob.js';
import path from 'path';

// Load env file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} (production)`);
  });
} else {
  try {
    const key = fs.readFileSync('./cert/key.pem');
    const cert = fs.readFileSync('./cert/cert.pem');
    https.createServer({ key, cert }, app).listen(PORT, () => {
      logger.info(`🚀 HTTPS Server running at https://localhost:${PORT} (development)`);
    });
  } catch (err) {
    logger.error('❌ Failed to start HTTPS server in development', {
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
}
