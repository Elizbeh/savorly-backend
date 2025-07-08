import pool from '../config/db.js';

// Save a recipe
export const saveRecipe = async (userId, recipeId) => {
  try {
    await pool.query(
      'INSERT IGNORE INTO saved_recipes (user_id, recipe_id) VALUES (?, ?)',
      [userId, recipeId]
    );
  } catch (err) {
    throw new Error('Could not save recipe');
  }
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
  'INSERT INTO saved_recipes (user_id, recipe_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id=user_id',
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

