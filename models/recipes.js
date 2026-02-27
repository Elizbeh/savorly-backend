import pool from '../config/db.js';
import logger from '../config/logger.js';

// Handle database errors
const handleDatabaseError = (error, message = 'Database error') => {
  logger.error(`${message}: ${error.message}`, { stack: error.stack });
  throw new Error(message);
};

// Create a new recipe
export const create = async ({ title, description, userId, imageUrl, prepTime, cookTime, calories }) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO recipes (title, description, user_id, image_url, prep_time, cook_time, calories) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, userId, imageUrl, prepTime, cookTime, calories]
    );
    logger.info(`Recipe created with ID ${result.insertId}`);
    return { id: result.insertId, title, description, userId, imageUrl, prepTime, cookTime, calories };
  } catch (error) {
    handleDatabaseError(error, 'Error creating recipe');
  }
};

// Get all recipes with filters
export const getRecipes = async (filters = {}) => {
  const { categoryId, userId } = filters;
  try {
    let recipes;
    if (categoryId) {
      const [filtered] = await pool.query(
        `SELECT r.* 
         FROM recipes r
         INNER JOIN recipe_categories rc ON r.id = rc.recipe_id
         WHERE rc.category_id = ?`,
        [categoryId]
      );
      recipes = filtered;
    } else if (userId) {
      const [userRecipes] = await pool.query(
        'SELECT * FROM recipes WHERE user_id = ?', [userId]
      );
      recipes = userRecipes;
    } else {
      const [all] = await pool.query('SELECT * FROM recipes');
      recipes = all;
    }
    logger.info(`Fetched ${recipes.length} recipes`);
    return recipes;
  } catch (error) {
    handleDatabaseError(error, 'Error fetching recipes');
  }
};

// Find a recipe by ID
export const findById = async (id) => {
  logger.debug(`Looking for recipe with id: ${id}`);
  try {
    const [recipe] = await pool.query('SELECT * FROM recipes WHERE id = ?', [id]);
    return recipe[0] || null;
  } catch (error) {
    handleDatabaseError(error, 'Error fetching recipe');
  }
};

// Update a recipe's details
export const update = async ({ id, title, description, imageUrl, prepTime, cookTime, calories }) => {
  try {
    const [result] = await pool.query(
      `UPDATE recipes SET title = ?, description = ?, image_url = ?, prep_time = ?, cook_time = ?, calories = ?
       WHERE id = ?`,
      [title, description, imageUrl, prepTime, cookTime, calories, id]
    );
    logger.info(`Updated recipe ID ${id}, affected rows: ${result.affectedRows}`);
    return result.affectedRows > 0;
  } catch (error) {
    handleDatabaseError(error, 'Error updating recipe');
  }
};

// Delete a recipe by ID
export const remove = async (id) => {
  try {
    const [result] = await pool.query('DELETE FROM recipes WHERE id = ?', [id]);
    logger.info(`Deleted recipe ID ${id}, affected rows: ${result.affectedRows}`);
    return result.affectedRows > 0;
  } catch (error) {
    handleDatabaseError(error, 'Error deleting recipe');
  }
};

// Fetch categories for a recipe
export const getCategoriesForRecipe = async (recipeId) => {
  try {
    const [categories] = await pool.query(
      `SELECT categories.* 
       FROM categories 
       INNER JOIN recipe_categories 
       ON categories.id = recipe_categories.category_id 
       WHERE recipe_categories.recipe_id = ?`,
      [recipeId]
    );
    logger.info(`Fetched ${categories.length} categories for recipe ID ${recipeId}`);
    return categories;
  } catch (error) {
    handleDatabaseError(error, 'Error fetching categories for recipe');
  }
};
