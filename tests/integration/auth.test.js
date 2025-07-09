import 'dotenv/config';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../app.js';
import pool from '../../config/db.js';

console.log('AUTH TEST ENV DB_USER:', process.env.DB_USER);
console.log('AUTH TEST ENV DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : 'NOT SET');

beforeAll(async () => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Clean database: delete from child tables first
    await connection.query('DELETE FROM recipe_ingredients');
    await connection.query('DELETE FROM saved_recipes');
    await connection.query('DELETE FROM ratings');
    await connection.query('DELETE FROM comments');
    await connection.query('DELETE FROM recipes');
    await connection.query('DELETE FROM users');

    // Optionally reset auto-increment (for consistent test IDs)
    await connection.query('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.query('ALTER TABLE recipes AUTO_INCREMENT = 1');

    // Insert test user
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    await connection.query(
      `INSERT INTO users (
        email, password_hash, first_name, last_name, role,
        verification_token, verification_token_expires_at,
        is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'test@example.com',
        hashedPassword,
        'John',
        'Doe',
        'user',
        null,
        null,
        1
      ]
    );

    // Insert test recipe for user ID 1
    await connection.query(
      'INSERT INTO recipes (title, description, user_id) VALUES (?, ?, ?)',
      ['Test Recipe', 'Description', 1]
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
});

describe('User Authentication Tests', () => {
  it('should register a new user successfully', async () => {
    const userData = {
      email: 'newuser@example.com',
      password: 'Password123!',
      first_name: 'Jane',
      last_name: 'Doe'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('email', userData.email);
    expect(response.body.user).toHaveProperty('first_name', userData.first_name);
  });

  it('should log in an existing user', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.headers['set-cookie']).toBeDefined();

    const cookies = response.headers['set-cookie'].join(';');
    expect(cookies).toMatch(/authToken=/);
    expect(cookies).toMatch(/refreshToken=/);
  });

  it('should return 401 for invalid login credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });
});
