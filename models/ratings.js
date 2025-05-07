import pool from '../config/db.js';

// Add a rating to a recipe
export const addRatingToRecipe = async (recipeId, userId, rating) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO ratings (recipe_id, user_id, rating) VALUES (?, ?, ?)',
      [recipeId, userId, rating]
    );
    return { id: result.insertId, recipeId, userId, rating };
  } catch (err) {
    throw new Error('Error adding rating: ' + err.message);
  }
};
