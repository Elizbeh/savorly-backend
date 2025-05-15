import pool from '../../config/db';  // Make sure to import the pool instance for database access
import { describe, beforeAll, afterAll, test, expect } from '@jest/globals';  // Import Jest functions


describe('Recipe-Categories Model', () => {
    let connection;
  
    beforeAll(async () => {
      connection = await pool.getConnection();
    });
  
    afterAll(() => {
      connection.release();
    });
  
    test('should create a new recipe-category association', async () => {
      const result = await connection.query(
        'INSERT INTO recipe_categories (recipe_id, category_id) VALUES (?, ?)', [1, 1]
      );
      expect(result.affectedRows).toBe(1);
    });
  });
  