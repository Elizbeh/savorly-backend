import request from 'supertest';
import app from '../../app';  // Assuming 'app' is your Express app instance
import pool from '../../config/db';  // Database connection

// Clean up the database before and after tests
beforeAll(async () => {
  // Disable foreign key checks temporarily
  await pool.query('SET foreign_key_checks = 0');
  
  // Clear the users and recipes tables
  await pool.query('TRUNCATE TABLE users');
  await pool.query('TRUNCATE TABLE recipes');
  
  // Enable foreign key checks again
  await pool.query('SET foreign_key_checks = 1');
});


afterAll(async () => {
  await pool.end();  // Close the database connection after all tests
});

describe('User Authentication Tests', () => {
  // Test user registration
  it('should register a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    expect(response.status).toBe(201);  // HTTP status 201 Created
    expect(response.body).toHaveProperty('email', userData.email);
    expect(response.body).toHaveProperty('first_name', userData.first_name);
  });

  // Test user login
  it('should log in an existing user', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.status).toBe(200);  // HTTP status 200 OK
    expect(response.body).toHaveProperty('token');  // Expect a token on login
  });

  // Test login with wrong credentials
  it('should return 401 for invalid login credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    expect(response.status).toBe(401);  // Unauthorized
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });
});
