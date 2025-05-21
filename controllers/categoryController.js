import { getAllCategories, createCategory, getCategoryById } from '../models/categories.js';
import logger from '../config/logger.js';
export const fetchCategories = async (req, res) => {
  try {
    logger.info('Fetching all categories');  // Log the start of fetching categories
    const categories = await getAllCategories();
    logger.info('Categories fetched successfully');  // Log success
    res.status(200).json(categories);
  } catch (err) {
    logger.error('Error fetching categories: ', err.message);  // Log error
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Create new category
export const createCategoryHandler = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    logger.warn('Name is required to create a category');
    return res.status(400).json({ message: 'Name is required' });
  }

  try {
    logger.info(`Creating category with name: ${name}`);
    const category = await createCategory(name);
    logger.info('Category created successfully');
    res.status(201).json(category);
  } catch (err) {
    logger.error('Error creating category: ', err.message);
    res.status(400).json({ message: err.message });
  }
};

export const fetchCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    logger.info(`Fetching category with ID: ${id}`);
    const category = await getCategoryById(id);
    if (!category) {
      logger.warn(`Category with ID: ${id} not found`);
      return res.status(404).json({ message: 'Category not found' });
    }
    logger.info('Category fetched successfully');
    res.status(200).json(category);
  } catch (err) {
    logger.error('Error fetching category: ', err.message);
    res.status(500).json({ message: 'Error fetching category' });
  }
};
