const {create, getRecipes, findById, update, remove, getCategoriesForRecipe, addIngredientsToRecipe,} = require('../../models/recipes');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));
const pool = require('../../config/db');


describe('Recipes Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert a new recipe', async () => {
      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
      const result = await create({ title: 'New Recipe', description: 'Desc', userId: 1 });

      expect(pool.query).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, title: 'New Recipe', description: 'Desc', userId: 1 });
    });
  });

  describe('getRecipes', () => {
    it('should fetch all recipes without filters', async () => {
      const mockRecipes = [
        { id: 1, title: 'New Recipe' },
        { id: 2, title: 'Other' },
      ];
      pool.query.mockResolvedValueOnce([mockRecipes]);

      const result = await getRecipes();

      expect(result).toEqual(mockRecipes);
    });

    it('should fetch recipes filtered by categoryId', async () => {
      const categoryId = 5;
      const mockRecipes = [{ id: 5, title: 'Category Recipe' }];

      pool.query.mockResolvedValueOnce([mockRecipes]);

      const result = await getRecipes({ categoryId });

      expect(result).toEqual(mockRecipes);
      // You can add SQL string checks here if you want, but without normalizeSQL
    });
  });

  describe('findById', () => {
    it('should find a recipe by id', async () => {
      const mockRecipe = { id: 1 };
      pool.query.mockResolvedValueOnce([[mockRecipe]]);

      const result = await findById(1);

      expect(result).toEqual(mockRecipe);
    });

    it('should return null if recipe not found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const result = await findById(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a recipe', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await update({ id: 1, title: 'Test', description: 'Test' });

      expect(result).toBe(true);

      // Optionally check the SQL query text here without normalizeSQL
    });

    it('should return false if no rows affected', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await update({ id: 123, title: 'Test', description: 'Test' });

      expect(result).toBe(false);
    });
  });

  describe('remove', () => {
    it('should delete a recipe', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await remove(1);

      expect(result).toBe(true);
    });

    it('should return false if no rows deleted', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await remove(999);

      expect(result).toBe(false);
    });
  });

  describe('getCategoriesForRecipe', () => {
    it('should fetch categories for a recipe', async () => {
      const mockCategories = [{ id: 1 }];

      pool.query.mockResolvedValueOnce([mockCategories]);

      const result = await getCategoriesForRecipe(1);

      expect(result).toEqual(mockCategories);
    });
  });

});
