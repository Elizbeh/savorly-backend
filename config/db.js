import 'dotenv/config'
import mysql from 'mysql2';
import logger from '../config/logger.js';

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: true,  // always use SSL, required by TiDB Cloud
    },
    charset: 'utf8mb4',
    waitForConnections: true,
    connectTimeout: 30_000,
  })
  .promise();

// quick connection check in dev/test
(async () => {
  try {
    const conn = await pool.getConnection();
    logger.info('Database connected successfully');
    conn.release();
  } catch (err) {
    logger.error('Database connection error', { message: err.message, stack: err.stack });
  }
})();

export default pool;
