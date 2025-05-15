import mysql from 'mysql2/promise';
import 'dotenv/config';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      
    });
    console.log('Database connection successful!');
    await connection.end();
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
  }
}

testConnection();
