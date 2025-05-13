import mysql from 'mysql2';
import 'dotenv/config';
import logger from '../config/logger.js'; // Adjust the path if needed

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
   ssl: {
    rejectUnauthorized: true
  },
  charset: 'utf8mb4',
  waitForConnections: true,
  connectTimeout: 30000,
}).promise();

// Optional: use this for testing DB connection during development only
if (process.env.NODE_ENV !== 'production') {
  const testConnection = async () => {
    try {
      const connection = await pool.getConnection();
      logger.info('Database connected successfully');
      connection.release();
    } catch (err) {
      logger.error('Database connection error', { message: err.message, stack: err.stack });
    }
  };

  testConnection();
}

export default pool;
