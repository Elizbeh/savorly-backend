import pool from '../config/db.js';

// Save a recipe
export const saveRecipe = async (userId, recipeId) => {
  return pool.query(
    'INSERT INTO saved_recipes (user_id, recipe_id) VALUES (?, ?)',
    [userId, recipeId]
  );
};

// Toggle save/unsave
export const toggleSave = async (userId, recipeId) => {
  const [rows] = await pool.query(
    'SELECT * FROM saved_recipes WHERE user_id = ? AND recipe_id = ?',
    [userId, recipeId]
  );

  if (rows.length > 0) {
    await pool.query(
      'DELETE FROM saved_recipes WHERE user_id = ? AND recipe_id = ?',
      [userId, recipeId]
    );
    return { saved: false };
  } else {
    await pool.query(
      'INSERT INTO saved_recipes (user_id, recipe_id) VALUES (?, ?)',
      [userId, recipeId]
    );
    return { saved: true };
  }
};

// Get all saved recipes
export const getSavedRecipesByUser = async (userId) => {
  const [results] = await pool.query(
    `SELECT r.* FROM recipes r
     JOIN saved_recipes sr ON r.id = sr.recipe_id
     WHERE sr.user_id = ?`,
    [userId]
  );
  return results;
};

// Unsave a recipe
export const unsaveRecipe = async (userId, recipeId) => {
  return pool.query(
    'DELETE FROM saved_recipes WHERE user_id = ? AND recipe_id = ?',
    [userId, recipeId]
  );
};

