import 'dotenv/config';
import mysql from 'mysql2';
import logger from './logger.js';

const isProd = process.env.NODE_ENV === 'production';
const requireSSL = process.env.DB_REQUIRE_SSL === 'true';

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

// Only create the pool, do NOT test the connection here
const pool = mysql
  .createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    charset: 'utf8mb4',
    waitForConnections: true,
    connectTimeout: 30000,
    socketPath: undefined,
    ...(isProd || requireSSL
      ? {
          ssl: {
            rejectUnauthorized: true,
          },
        }
      : {}),
  })
  .promise();

// Explicit function to check DB connection
export async function checkDbConnection() {
  try {
    const conn = await pool.getConnection();
    logger.info('Database connected successfully');
    conn.release();
  } catch (err) {
    logger.error('Database connection error', { message: err.message, stack: err.stack });
    throw err;
  }
}

// Export pool only, don't auto-run queries
export default pool;