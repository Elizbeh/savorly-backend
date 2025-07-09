import 'dotenv/config';
import mysql from 'mysql2';
import runMigrations from './migrations/runMigrations.js';
import logger from './config/logger.js';

const isProd = process.env.NODE_ENV === 'production';
const requireSSL = process.env.DB_REQUIRE_SSL === 'true';

console.log('DB_NAME:', process.env.DB_NAME);

// Create DB connection pool
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

// Truncate all relevant tables to ensure clean test state
async function cleanDatabase() {
  const tables = [
    'ratings',
    'comments',
    'recipe_categories',
    'categories',
    'recipe_ingredients',
    'saved_recipes',
    'user_profiles',
    'recipes',
    'users'
  ];
  try {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    for (const table of tables) {
      await pool.query(`TRUNCATE TABLE ${table}`);
    }
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ DB tables truncated');
  } catch (err) {
    logger.error('Error cleaning test DB', { message: err.message, stack: err.stack });
    throw err;
  }
}

// Jest lifecycle hooks
beforeAll(async () => {
  await runMigrations();
  await checkDbConnection();
  await cleanDatabase();
  console.log('✅ DB ready for tests');
});

afterAll(async () => {
  await pool.end();
  console.log('✅ DB connection pool closed');
});

export default pool;
