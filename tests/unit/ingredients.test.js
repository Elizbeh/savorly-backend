import { addIngredientsToRecipe, getIngredientsForRecipe } from '../../models/ingredients.js';
import pool from '../../config/db.js';

// Mock database connection
jest.mock('../../config/db.js', () => ({
  query: jest.fn()
}));

describe('Ingredient Model', () => {
  // Mock data for testing
  const recipeId = 1;
  const ingredients = ['Salt', 'Pepper', 'Olive Oil'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addIngredientsToRecipe', () => {
    it('should add ingredients to the recipe', async () => {
      // Mocking successful insertion
      pool.query.mockResolvedValue([{}]);

      const result = await addIngredientsToRecipe(recipeId, ingredients);

      expect(result).toBe(true);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO recipe_ingredients (recipe_id, ingredient_name) VALUES ?',
        [[
          [recipeId, 'Salt'],
          [recipeId, 'Pepper'],
          [recipeId, 'Olive Oil']
        ]]
      );
    });

    it('should throw an error if the query fails', async () => {
      // Mocking an error during insertion
      pool.query.mockRejectedValue(new Error('Database error'));

      await expect(addIngredientsToRecipe(recipeId, ingredients)).rejects.toThrow(
        'Error adding ingredients: Database error'
      );
    });
  });

  describe('getIngredientsForRecipe', () => {
    it('should return a list of ingredients for a recipe', async () => {
      // Mocking a successful fetch of ingredients
      const mockIngredients = [
        { id: 1, recipe_id: recipeId, ingredient_name: 'Salt' },
        { id: 2, recipe_id: recipeId, ingredient_name: 'Pepper' },
        { id: 3, recipe_id: recipeId, ingredient_name: 'Olive Oil' }
      ];
      pool.query.mockResolvedValue([mockIngredients]);

      const result = await getIngredientsForRecipe(recipeId);

      expect(result).toEqual(mockIngredients);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM recipe_ingredients WHERE recipe_id = ?',
        [recipeId]
      );
    });

    it('should throw an error if fetching ingredients fails', async () => {
      // Mocking an error during fetching
      pool.query.mockRejectedValue(new Error('Database error'));

      await expect(getIngredientsForRecipe(recipeId)).rejects.toThrow(
        'Error fetching ingredients: Database error'
      );
    });
  });
   afterAll(async () => {
    if (typeof pool.end === 'function') {
      await pool.end();
    }
  });
});
