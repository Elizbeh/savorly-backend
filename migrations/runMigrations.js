import fs from 'fs/promises';
import pool from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';  // Add this line

// Using import.meta.url to get the directory name
const runMigrations = async () => {
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));  // Now fileURLToPath is correctly imported
      const sqlPath = path.join(__dirname, 'createTables.sql');
      let sql = await fs.readFile(sqlPath, 'utf8');
      sql = sql.replace(/\r\n/g, '\n'); // Normalize line endings
  
      const sqlStatements = sql.split(';').filter((stmt) => stmt.trim() !== '');
  
      for (const statement of sqlStatements) {
        console.log('Executing:', statement);
        await pool.query(statement);
      }
  
      console.log('Migrations executed successfully!');
    } catch (error) {
      console.error('Error running migrations:', error);
    } finally {
      pool.end();
    }
  };
      
runMigrations();
