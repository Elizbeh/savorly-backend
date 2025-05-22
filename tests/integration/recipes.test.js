import * as recipeModel from '../../models/recipes.js'; // adjust path if needed
import pool from '../../config/db.js';
import logger from '../../config/logger.js';

// Mock the database pool and logger
jest.mock('../../config/db.js');
jest.mock('../../config/logger.js');

describe('Recipe Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new recipe and return the recipe object with id', async () => {
      const fakeInsertId = 123;
      pool.query.mockResolvedValueOnce([{ insertId: fakeInsertId }]);
      
      const recipeData = {
        title: 'Test Recipe',
        description: 'Delicious test recipe',
        userId: 1,
        imageUrl: 'http://image.url',
        prepTime: 10,
        cookTime: 20,
        calories: 300,
      };

      const result = await recipeModel.create(recipeData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO recipes'),
        [
          recipeData.title,
          recipeData.description,
          recipeData.userId,
          recipeData.imageUrl,
          recipeData.prepTime,
          recipeData.cookTime,
          recipeData.calories,
        ]
      );
      expect(logger.info).toHaveBeenCalledWith(`Recipe created with ID ${fakeInsertId}`);
      expect(result).toEqual({ id: fakeInsertId, ...recipeData });
    });

    it('should throw error on DB failure', async () => {
      const error = new Error('DB failure');
      pool.query.mockRejectedValueOnce(error);

      await expect(recipeModel.create({})).rejects.toThrow('Error creating recipe');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error creating recipe'),
        expect.objectContaining({ stack: expect.any(String) })
      );
    });
  });

  describe('getRecipes', () => {
    it('should return all recipes when no category filter', async () => {
      const fakeRecipes = [{ id: 1, title: 'Test' }];
      pool.query.mockResolvedValueOnce([fakeRecipes]);

      const recipes = await recipeModel.getRecipes();

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM recipes');
      expect(logger.info).toHaveBeenCalledWith(`Fetched ${fakeRecipes.length} recipes`);
      expect(recipes).toEqual(fakeRecipes);
    });

    it('should return filtered recipes when categoryId is provided', async () => {
      const categoryId = 2;
      const filteredRecipes = [{ id: 2, title: 'Filtered Recipe' }];
      pool.query.mockResolvedValueOnce([filteredRecipes]);

      const recipes = await recipeModel.getRecipes({ categoryId });

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INNER JOIN recipe_categories'),
        [categoryId]
      );
      expect(logger.info).toHaveBeenCalledWith(`Fetched ${filteredRecipes.length} recipes`);
      expect(recipes).toEqual(filteredRecipes);
    });

    it('should throw error on DB failure', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB failure'));

      await expect(recipeModel.getRecipes()).rejects.toThrow('Error fetching recipes');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching recipes'),
        expect.objectContaining({ stack: expect.any(String) })
      );
    });
  });

  describe('findById', () => {
    it('should return recipe when found', async () => {
      const fakeRecipe = [{ id: 5, title: 'Found Recipe' }];
      pool.query.mockResolvedValueOnce([fakeRecipe]);

      const recipe = await recipeModel.findById(5);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM recipes WHERE id = ?', [5]);
      expect(recipe).toEqual(fakeRecipe[0]);
    });

    it('should return null if no recipe found', async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const recipe = await recipeModel.findById(999);

      expect(recipe).toBeNull();
    });

    it('should throw error on DB failure', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB failure'));

      await expect(recipeModel.findById(1)).rejects.toThrow('Error fetching recipe');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching recipe'),
        expect.objectContaining({ stack: expect.any(String) })
      );
    });
  });

  describe('update', () => {
    it('should update a recipe and return true if affectedRows > 0', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      const updateData = {
        id: 1,
        title: 'Updated Title',
        description: 'Updated desc',
        imageUrl: 'http://updated.image',
        prepTime: 15,
        cookTime: 25,
        calories: 400,
      };

      const result = await recipeModel.update(updateData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE recipes SET'),
        [
          updateData.title,
          updateData.description,
          updateData.imageUrl,
          updateData.prepTime,
          updateData.cookTime,
          updateData.calories,
          updateData.id,
        ]
      );
      expect(logger.info).toHaveBeenCalledWith(`Updated recipe ID ${updateData.id}, affected rows: 1`);
      expect(result).toBe(true);
    });

    it('should return false if no rows affected', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await recipeModel.update({ id: 1 });

      expect(result).toBe(false);
    });

    it('should throw error on DB failure', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB failure'));

      await expect(recipeModel.update({ id: 1 })).rejects.toThrow('Error updating recipe');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error updating recipe'),
        expect.objectContaining({ stack: expect.any(String) })
      );
    });
  });

  describe('remove', () => {
    it('should delete a recipe and return true if affectedRows > 0', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      const result = await recipeModel.remove(1);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM recipes WHERE id = ?', [1]);
      expect(logger.info).toHaveBeenCalledWith(`Deleted recipe ID 1, affected rows: 1`);
      expect(result).toBe(true);
    });

    it('should return false if no rows affected', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

      const result = await recipeModel.remove(1);

      expect(result).toBe(false);
    });

    it('should throw error on DB failure', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB failure'));

      await expect(recipeModel.remove(1)).rejects.toThrow('Error deleting recipe');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error deleting recipe'),
        expect.objectContaining({ stack: expect.any(String) })
      );
    });
  });

  describe('getCategoriesForRecipe', () => {
    it('should return categories for a given recipe', async () => {
      const categories = [{ id: 1, name: 'Dessert' }];
      pool.query.mockResolvedValueOnce([categories]);

      const result = await recipeModel.getCategoriesForRecipe(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INNER JOIN recipe_categories'),
        [1]
      );
      expect(logger.info).toHaveBeenCalledWith(`Fetched ${categories.length} categories for recipe ID 1`);
      expect(result).toEqual(categories);
    });

    it('should throw error on DB failure', async () => {
      pool.query.mockRejectedValueOnce(new Error('DB failure'));

      await expect(recipeModel.getCategoriesForRecipe(1)).rejects.toThrow('Error fetching categories for recipe');
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching categories for recipe'),
        expect.objectContaining({ stack: expect.any(String) })
      );
    });
  });
});
