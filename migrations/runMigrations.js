import fs from 'fs/promises';
import pool from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Utility to check if a column exists in a table
async function columnExists(table, column) {
  const [rows] = await pool.query(
    `SHOW COLUMNS FROM \`${table}\` LIKE ?`,
    [column]
  );
  return rows.length > 0;
}

export async function runMigrations({ closeConnection = false } = {}) {
  try {
    console.log('🚀 Starting database migrations...');

    const sqlPath = path.join(__dirname, 'createTables.sql');
    let sql = await fs.readFile(sqlPath, 'utf8');
    sql = sql.replace(/\r\n/g, '\n');

    const sqlStatements = sql
      .split(';')
      .filter((stmt) => stmt.trim() !== '');

    for (const statement of sqlStatements) {
      console.log(
        'Executing:',
        statement.trim().slice(0, 80),
        '...'
      );

      await pool.query(statement);
    }


    if (!(await columnExists('users', 'verification_token'))) {
      await pool.query(
        'ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) NULL'
      );
      console.log('✅ Added verification_token');
    }


    if (!(await columnExists('users', 'verification_token_expires_at'))) {
      await pool.query(
        'ALTER TABLE users ADD COLUMN verification_token_expires_at DATETIME NULL'
      );
      console.log('✅ Added verification_token_expires_at');
    }


    if (!(await columnExists('user_profiles', 'first_name'))) {
      await pool.query(
        'ALTER TABLE user_profiles ADD COLUMN first_name VARCHAR(255)'
      );
      console.log('✅ Added first_name');
    }


    if (!(await columnExists('user_profiles', 'last_name'))) {
      await pool.query(
        'ALTER TABLE user_profiles ADD COLUMN last_name VARCHAR(255)'
      );
      console.log('✅ Added last_name');
    }


    console.log('✅ Migrations executed successfully!');

  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exitCode = 1;

  } finally {

    if (closeConnection) {
      await pool.end();
      console.log('✅ Migration DB connection closed');
    }

  }
}


// When executed directly: npm run migrate
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 runMigrations() started');

  runMigrations({ closeConnection: true });
}


export default runMigrations;