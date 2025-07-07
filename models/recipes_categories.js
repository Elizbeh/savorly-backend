import pool from '../config/db.js';

// Add categories to a recipe
export const addCategoriesToRecipe = async (recipeId, categoryIds) => {
  if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
    throw new Error('Invalid categories');
  }

  try {
    // Map category IDs and recipe ID into an array of tuples for insertion
    const values = categoryIds.map((categoryId) => [recipeId, categoryId]);
    
    // Insert the values into recipe_categories table
    await pool.query('INSERT INTO recipe_categories (recipe_id, category_id) VALUES ?', [values]);
    return true;
  } catch (err) {
    console.error('Error adding categories to recipe:', err);
    throw new Error('Error adding categories to recipe');
  }
};

// Get categories for a specific recipe
export const getCategoriesForRecipe = async (recipeId) => {
  try {
    // Query to get categories for a recipe
    const [categories] = await pool.query(
      `SELECT c.* 
       FROM categories c 
       JOIN recipe_categories rc ON c.id = rc.category_id 
       WHERE rc.recipe_id = ?`,
      [recipeId]
    );
    return categories;
  } catch (error) {
    console.error('Error fetching categories for recipe:', error);
    throw new Error('Error fetching categories for recipe');
  }
};

// Fetch all categories
export const getAllCategories = async () => {
  try {
    // Fetch all categories from the categories table
    const [categories] = await pool.query('SELECT * FROM categories');
    return categories;
  } catch (err) {
    throw new Error('Error fetching categories: ' + err.message);
  }
};

// Create a new category
export const createCategory = async (name) => {
  try {
    // Insert a new category into the categories table
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    return { id: result.insertId, name };
  } catch (err) {
    throw new Error('Error creating category: ' + err.message);
  }
};
