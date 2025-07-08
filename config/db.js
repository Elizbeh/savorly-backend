import 'dotenv/config'
import mysql from 'mysql2';
import logger from '../config/logger.js';

const isProd = process.env.NODE_ENV === 'production';


const pool = mysql
  .createPool({
    host: isProd ? process.env.DB_HOST : process.env.DB_HOST,
  user: isProd ? process.env.DB_USER : process.env.DB_USER,
  password: isProd ? process.env.DB_PASSWORD : process.env.DB_PASSWORD,
  database: isProd ? process.env.DB_NAME : process.env.DB_NAME,
    // SSL only for prod
    ...(isProd && {
      ssl: {
        rejectUnauthorized: true,
      },
    }),
    charset: 'utf8mb4',
    waitForConnections: true,
    connectTimeout: 30_000,
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
