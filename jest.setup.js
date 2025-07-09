import 'dotenv/config';
import pool, { checkDbConnection } from './config/db.js';

jest.setTimeout(60000); // 60s timeout for all tests

beforeAll(async () => {
  try {
    await checkDbConnection();
    console.log('✅ DB connection check passed before tests');
  } catch (err) {
    console.error('❌ DB connection check failed:', err);
    throw err; // fail fast if DB not ready
  }
});

afterAll(async () => {
  try {
    await pool.end();
    console.log('✅ Database connection pool closed after tests');
  } catch (error) {
    console.error('❌ Error closing database pool:', error);
  }
});
