import 'dotenv/config';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../app.js';
import pool from '../../config/db';

console.log('AUTH TEST ENV DB_USER:', process.env.DB_USER);
console.log('AUTH TEST ENV DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : 'NOT SET');

let testUserId;

beforeAll(async () => {
  // Disable foreign key checks
  await pool.query('SET foreign_key_checks = 0');

  // Clean all tables
  await pool.query('DELETE FROM recipe_ingredients');
  await pool.query('DELETE FROM saved_recipes');
  await pool.query('DELETE FROM ratings');
  await pool.query('DELETE FROM comments');
  await pool.query('DELETE FROM recipes');
  await pool.query('DELETE FROM users');

  // Hash the password
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Insert a verified test user and get the inserted ID
  const [userResult] = await pool.query(
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

  testUserId = userResult.insertId;

  // Insert a test recipe for the inserted user
  await pool.query(
    'INSERT INTO recipes (title, description, user_id) VALUES (?, ?, ?)',
    ['Test Recipe', 'Description', testUserId]
  );

  // Re-enable foreign key checks
  await pool.query('SET foreign_key_checks = 1');
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
