import request from 'supertest';
import app from '../../app';
import pool from '../../config/db';

// Clean up the database before and after tests
beforeAll(async () => {
  // Clear users and recipes tables before each test
  await pool.query('TRUNCATE TABLE users');
  await pool.query('TRUNCATE TABLE recipes');
});

afterAll(async () => {
  await pool.end();
});

describe('Recipe CRUD Tests', () => {
  // Test creating a new recipe
  it('should create a new recipe successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };

    // Register and log in to get a token for creating recipes
    await request(app).post('/api/auth/register').send(userData);
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send(userData);

    const token = loginResponse.body.token;

    const recipeData = {
      title: 'Spaghetti Bolognese',
      description: 'Delicious Italian pasta with bolognese sauce'
    };

    const response = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(recipeData);

    expect(response.status).toBe(201); 
    expect(response.body).toHaveProperty('title', recipeData.title);
    expect(response.body).toHaveProperty('description', recipeData.description);
  });

  // Test fetching all recipes
  it('should fetch all recipes', async () => {
    const response = await request(app).get('/api/recipes');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test fetching a recipe by ID
  it('should fetch a recipe by ID', async () => {
    const recipeData = {
      title: 'Spaghetti Bolognese',
      description: 'Delicious Italian pasta with bolognese sauce'
    };

    const createResponse = await request(app)
      .post('/api/recipes')
      .send(recipeData);

    const recipeId = createResponse.body.id;

    const response = await request(app).get(`/api/recipes/${recipeId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', recipeId);
    expect(response.body).toHaveProperty('title', recipeData.title);
  });

  // Test updating a recipe title
  it('should update the recipe title', async () => {
    const recipeData = {
      title: 'Spaghetti Bolognese',
      description: 'Delicious Italian pasta with bolognese sauce'
    };

    const createResponse = await request(app)
      .post('/api/recipes')
      .send(recipeData);

    const recipeId = createResponse.body.id;

    const updatedData = { title: 'Updated Spaghetti Bolognese' };

    const response = await request(app)
      .put(`/api/recipes/${recipeId}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', updatedData.title);
  });

  // Test deleting a recipe
  it('should delete the recipe', async () => {
    const recipeData = {
      title: 'Spaghetti Bolognese',
      description: 'Delicious Italian pasta with bolognese sauce'
    };

    const createResponse = await request(app)
      .post('/api/recipes')
      .send(recipeData);

    const recipeId = createResponse.body.id;

    const response = await request(app).delete(`/api/recipes/${recipeId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Recipe deleted successfully');
  });
});
