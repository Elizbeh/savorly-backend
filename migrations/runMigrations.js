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

const runMigrations = async () => {
  try {
    // Step 1: Create tables from SQL file (if they don't exist)
    const sqlPath = path.join(__dirname, 'createTables.sql');
    let sql = await fs.readFile(sqlPath, 'utf8');
    sql = sql.replace(/\r\n/g, '\n'); // Normalize line endings

    const sqlStatements = sql.split(';').filter((stmt) => stmt.trim() !== '');

    for (const statement of sqlStatements) {
      console.log('Executing:', statement.trim().slice(0, 80), '...');
      await pool.query(statement);
    }

    // Step 2: Add missing columns to users table
    if (!(await columnExists('users', 'verification_token'))) {
      await pool.query(
        'ALTER TABLE users ADD COLUMN verification_token VARCHAR(255) NULL'
      );
      console.log('Added column verification_token');
    }

    if (!(await columnExists('users', 'verification_token_expires_at'))) {
      await pool.query(
        'ALTER TABLE users ADD COLUMN verification_token_expires_at DATETIME NULL'
      );
      console.log('Added column verification_token_expires_at');
    }
    if (!(await columnExists('user_profiles', 'first_name'))) {
      await pool.query('ALTER TABLE user_profiles ADD COLUMN first_name VARCHAR(255)');
      console.log('Added column first_name to user_profiles');
    }

    if (!(await columnExists('user_profiles', 'last_name'))) {
      await pool.query('ALTER TABLE user_profiles ADD COLUMN last_name VARCHAR(255)');
      console.log('Added column last_name to user_profiles');
    }


    console.log('Migrations executed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  } 
};

export default runMigrations;
