import pool from '../config/db.js';

export const addCommentToRecipe = async (recipeId, userId, comment) => {
  console.log("Adding comment to recipe:", { recipeId, userId, comment });
  
  // Validate the comment parameter
  if (!comment || typeof comment !== 'string') {
    throw new Error('Comment is required and must be a string');
  }

  // Validate the recipeId (should be a number)
  if (!recipeId || isNaN(recipeId)) {
    throw new Error('Invalid recipe ID');
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO comments (recipe_id, user_id, comment) VALUES (?, ?, ?)',
      [recipeId, userId, comment]
    );

    return { id: result.insertId, recipeId, userId, comment };
  } catch (err) {
    throw new Error('Error adding comment: ' + err.message);
  }
};


// Get all comments for a recipe
export const getCommentsForRecipe = async (recipeId) => {
  try {
    const [comments] = await pool.query('SELECT * FROM comments WHERE recipe_id = ?', [recipeId]);
    return comments;
  } catch (err) {
    throw new Error('Error fetching comments: ' + err.message);
  }
};
