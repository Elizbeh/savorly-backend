import 'dotenv/config';
import mysql from 'mysql2';
import logger from './logger.js';

const isProd = process.env.NODE_ENV === 'production';
const requireSSL = process.env.DB_REQUIRE_SSL === 'true';

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);


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


/**
 * Function to check database connection.
 * Call this explicitly in app start or tests before running queries.
 */
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

pool.query("SELECT 1")
  .then(() => console.log("✅ Node.js connected to MySQL"))
  .catch(err => console.error("❌ Node.js MySQL connection FAILED:", err));


export default pool;
