import pool from '../config/db.js';
import logger from '../config/logger.js'; // Assuming logger is in utils/logger.js

// Fetch all categories - just return data, don't send response here
export const getAllCategories = async () => {
  try {
    logger.info('Attempting to fetch all categories');  // Log when the operation starts
    const [categories] = await pool.query('SELECT * FROM categories');
    logger.info('Fetched all categories successfully');  // Log success
    return categories; // Return the categories to the controller
  } catch (err) {
    logger.error('Error fetching categories: ' + err.message);  // Log the error if the operation fails
    throw new Error('Error fetching categories: ' + err.message);
  }
};

// Create a new category
export const createCategory = async (name) => {
  try {
    logger.info(`Attempting to create category with name: ${name}`);  // Log the category creation attempt
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    logger.info('Category created successfully with ID: ' + result.insertId);  // Log success
    return { id: result.insertId, name };  // Return the created category
  } catch (err) {
    logger.error('Error creating category: ' + err.message);  // Log error if creation fails
    throw new Error('Error creating category: ' + err.message);
  }
};

// Fetch a category by ID
export const getCategoryById = async (id) => {
  try {
    logger.info(`Attempting to fetch category with ID: ${id}`);  // Log the fetch attempt
    const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      logger.warn(`No category found with ID: ${id}`);  // Log a warning if no category is found
    }
    logger.info('Fetched category successfully');  // Log success
    return category[0] || null;  // Return the category or null if not found
  } catch (err) {
    logger.error('Error fetching category by ID: ' + err.message);  // Log error if fetching fails
    throw new Error('Error fetching category by ID: ' + err.message);
  }
};
