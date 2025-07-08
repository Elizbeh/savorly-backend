import 'dotenv/config';
import mysql from 'mysql2';
import logger from '../config/logger.js';


const isProd = process.env.NODE_ENV === 'production';
const requireSSL = process.env.DB_REQUIRE_SSL === 'true';

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectTimeout: 30000,
    ...(isProd || requireSSL
      ? {
          ssl: {
            rejectUnauthorized: true,
          },
        }
      : {}),
  })
  .promise();

// quick connection check in dev
if (!isProd) {
  (async () => {
    try {
      const conn = await pool.getConnection();
      logger.info('Database connected successfully');
      conn.release();
    } catch (err) {
      logger.error('Database connection error', { message: err.message, stack: err.stack });
    }
  })();
}

export default pool;
