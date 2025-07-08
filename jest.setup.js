import pool from './config/db';

beforeAll(async () => {
  // Test connection before tests start
  try {
    const conn = await pool.getConnection();
    conn.release();
    console.log('✅ Database connection established before tests');
  } catch (error) {
    console.error('❌ Failed to connect to database before tests:', error);
    throw error;
  }
});

afterAll(async () => {
  // Close DB pool after tests finish
  try {
    await pool.end();
    console.log('✅ Database connection pool closed after tests');
  } catch (error) {
    console.error('❌ Error closing database pool:', error);
  }
});
