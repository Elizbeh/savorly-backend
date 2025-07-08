import 'dotenv/config';
import fs from 'fs';
import https from 'https';
import app from './app.js';
import './cronJob.js';
import logger from './config/logger.js';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
  });
} else {
  const key = fs.readFileSync('./cert/key.pem');
  const cert = fs.readFileSync('./cert/cert.pem');
  https.createServer({ key, cert }, app).listen(PORT, () => {
    logger.info(`🚀 HTTPS Server running at https://localhost:${PORT}`);
  });
}
