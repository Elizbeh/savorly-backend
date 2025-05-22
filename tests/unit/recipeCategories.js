import pool from '../../config/db.js';
import { addCategoriesToRecipe, getCategoriesForRecipe } from '../../models/recipeCategories.js';

jest.mock('../../config/db.js');

describe('Recipe Categories Model Tests', () => {

  it('should add categories to a recipe successfully', async () => {
    const mockRecipeId = 1;
    const mockCategoryIds = [1, 2];

    pool.query.mockResolvedValue([{}]);

    const result = await addCategoriesToRecipe(mockRecipeId, mockCategoryIds);

    expect(result).toBe(true);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO recipe_categories (recipe_id, category_id) VALUES ?',
      [[ [mockRecipeId, 1], [mockRecipeId, 2] ]]
    );
  });

  it('should fetch categories for a recipe', async () => {
    const mockCategories = [{ id: 1, name: 'Dessert' }];
    
    pool.query.mockResolvedValue([mockCategories]);

    const result = await getCategoriesForRecipe(1);

    expect(result).toEqual(mockCategories);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM recipe_categories WHERE recipe_id = ?',
      [1]
    );
  });

   afterAll(async () => {
    if (typeof pool.end === 'function') {
      await pool.end();
    }
  });
});
