import pool from '../config/db.js';


export const addIngredientsToRecipe = async (recipeId, ingredients) => {
  try {
    // Prepare the values as an array of arrays (for bulk insert)
    const values = ingredients.map(ingredient => [recipeId, ingredient]);

    // Insert into the recipes_ingredients table
    await pool.query('INSERT INTO recipe_ingredients (recipe_id, ingredient_name) VALUES ?', [values]);

    // Return true to indicate the operation was successful
    return true;
  } catch (err) {
    // Log the error and throw a custom error message
    throw new Error('Error adding ingredients: ' + err.message);
  }
};


// Get ingredients for a recipe
export const getIngredientsForRecipe = async (recipeId) => {
  try {
    const [ingredients] = await pool.query(
      'SELECT * FROM recipe_ingredients WHERE recipe_id = ?',
      [recipeId]
    );
    return ingredients;
  } catch (error) {
    // Adding a more descriptive error message
    throw new Error('Error fetching ingredients: ' + error.message);
  }
};
