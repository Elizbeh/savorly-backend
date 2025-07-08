import 'dotenv/config'; 
import pool from './config/db';
import { checkDbConnection } from './config/db.js';

beforeAll(async () => {
  await checkDbConnection();
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
