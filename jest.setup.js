// jest.setup.js
import runMigrations from './migrations/runMigrations.js';
import pool, { checkDbConnection } from './config/db.js';

beforeAll(async () => {
  await runMigrations();
  await checkDbConnection();
  console.log('✅ DB ready for tests');
});

afterAll(async () => {
  await pool.end();
  console.log('✅ DB connection pool closed');
});
