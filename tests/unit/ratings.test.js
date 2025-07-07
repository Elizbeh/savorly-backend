import pool from '../../config/db.js';
import { addRatingToRecipe } from '../../models/ratings.js';

jest.mock('../../config/db.js');

describe('Rating Model Tests', () => {

  it('should add a rating to a recipe successfully', async () => {
    const mockRecipeId = 1;
    const mockUserId = 1;
    const mockRating = 5;

    const mockResult = { insertId: 1 };

    pool.query.mockResolvedValue([mockResult]);

    const result = await addRatingToRecipe(mockRecipeId, mockUserId, mockRating);

    expect(result).toEqual({ id: 1, recipeId: mockRecipeId, userId: mockUserId, rating: mockRating });
  });

   afterAll(async () => {
    if (typeof pool.end === 'function') {
      await pool.end();
    }
  });
});
