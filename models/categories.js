import pool from '../config/db.js';
import logger from '../config/logger.js';

// Fetch all categories 
export const getAllCategories = async () => {
  try {
    logger.info('Attempting to fetch all categories');
    const [categories] = await pool.query('SELECT * FROM categories');
    logger.info('Fetched all categories successfully');
    return categories; // Return the categories to the controller
  } catch (err) {
    logger.error('Error fetching categories: ' + err.message);
    throw new Error('Error fetching categories: ' + err.message);
  }
};

// Create a new category
export const createCategory = async (name) => {
  try {
    logger.info(`Attempting to create category with name: ${name}`);
    const [result] = await pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
    logger.info('Category created successfully with ID: ' + result.insertId);
    return { id: result.insertId, name };  // Return the created category
  } catch (err) {
    logger.error('Error creating category: ' + err.message);
    throw new Error('Error creating category: ' + err.message);
  }
};

// Fetch a category by ID
export const getCategoryById = async (id) => {
  try {
    logger.info(`Attempting to fetch category with ID: ${id}`);
    const [category] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      logger.warn(`No category found with ID: ${id}`);
    }
    logger.info('Fetched category successfully');
    return category[0] || null;
  } catch (err) {
    logger.error('Error fetching category by ID: ' + err.message);
    throw new Error('Error fetching category by ID: ' + err.message);
  }
};
