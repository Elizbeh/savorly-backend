import mysql from 'mysql2';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../.env.production')
  : path.resolve(__dirname, '../.env.local');

dotenv.config({ path: envPath });

logger.info(`Loaded DB config for ${process.env.NODE_ENV}`, {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT || '3306',
});

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectTimeout: 30000,
  ssl: {
    rejectUnauthorized: true
  }
};

if (process.env.NODE_ENV === 'production') {
  try {
    const caPath = path.resolve(__dirname, '../config/isrgrootx1.pem');
    poolConfig.ssl = {
      ...poolConfig.ssl,
      ca: fs.readFileSync(caPath),
    };
    logger.info('✅ SSL certificate loaded for production DB connection');
  } catch (err) {
    logger.error('❌ Failed to load SSL certificate', {
      message: err.message,
      stack: err.stack,
    });
  }
}

const pool = mysql.createPool(poolConfig).promise();

const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    logger.info(`✅ Database connected successfully (${process.env.NODE_ENV})`);
    conn.release();
  } catch (err) {
    logger.error(`❌ Database connection failed (${process.env.NODE_ENV})`, {
      message: err.message,
      stack: err.stack,
    });
  }
};

testConnection();

export default pool;
