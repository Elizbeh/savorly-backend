import {
  create,
  getRecipes,
  findById,
  update,
  remove
} from '../models/recipes.js';
import {
  addCategoriesToRecipe,
  getCategoriesForRecipe
} from '../models/recipes_categories.js';
import {
  addIngredientsToRecipe,
  getIngredientsForRecipe
} from '../models/ingredients.js';
import {
  addCommentToRecipe,
  getCommentsForRecipe
} from '../models/comments.js';
import { addRatingToRecipe } from '../models/ratings.js';
import pool from '../config/db.js';
import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from 'streamifier';
import logger from '../config/logger.js';

// Create a new recipe
export const createRecipe = async (req, res) => {
  const { title, description, ingredients, categories, prepTime, cookTime, calories } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    logger.warn('Title or description missing');
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const handleCreation = async (imageUrl) => {
      logger.info('Creating recipe with title: ' + title);
      const recipe = await create({ title, description, userId, imageUrl, prepTime, cookTime, calories });

      if (ingredients?.length) {
        await addIngredientsToRecipe(recipe.id, ingredients);
        logger.info('Ingredients added to recipe ID: ' + recipe.id);
      }
      if (categories?.length) {
        await addCategoriesToRecipe(recipe.id, categories);
        logger.info('Categories added to recipe ID: ' + recipe.id);
      }

      const fullRecipe = {
        ...recipe,
        ingredients: await getIngredientsForRecipe(recipe.id),
        categories: await getCategoriesForRecipe(recipe.id),
        comments: await getCommentsForRecipe(recipe.id),
      };

      logger.info('Recipe created successfully with ID: ' + recipe.id);
      res.status(201).json(fullRecipe);
    };

    if (req.file) {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: 'recipe_images', resource_type: 'image' },
        async (error, result) => {
          if (error) {
            logger.error('Image upload failed: ' + error.message);
            return res.status(500).json({ message: 'Image upload failed', error });
          }
          await handleCreation(result.secure_url);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      await handleCreation(null);
    }
  } catch (error) {
    logger.error('Error creating recipe: ' + error.message); 
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

// Update an existing recipe
export const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description, prepTime, cookTime, calories } = req.body;

  if (!id || !title || !description) {
    logger.warn('ID, title, or description missing for update');
    return res.status(400).json({ message: 'ID, title, and description are required' });
  }

  try {
    const performUpdate = async (imageUrl) => {
      logger.info('Updating recipe with ID: ' + id);
      const success = await update({ id, title, description, imageUrl, prepTime, cookTime, calories });

      if (success) {
        logger.info('Recipe updated successfully with ID: ' + id);
        return res.status(200).json({ message: 'Recipe updated' });
      } else {
        logger.error('Recipe update failed with ID: ' + id);
        return res.status(400).json({ message: 'Update failed' });
      }
    };

    if (req.file) {
      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: 'recipe_images', resource_type: 'image' },
        async (error, result) => {
          if (error) {
            logger.error('Image upload failed: ' + error.message);
            return res.status(500).json({ message: 'Upload failed', error });
          }
          await performUpdate(result.secure_url);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {
      await performUpdate(null);
    }
  } catch (error) {
    logger.error('Error updating recipe: ' + error.message);
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

// Get a recipe by ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await findById(req.params.id);
    if (!recipe) {
      logger.warn('Recipe not found with ID: ' + req.params.id);
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const [categories, ingredients, comments] = await Promise.all([
      getCategoriesForRecipe(recipe.id),
      getIngredientsForRecipe(recipe.id),
      getCommentsForRecipe(recipe.id)
    ]);

    logger.info('Fetched recipe with ID: ' + req.params.id);
    res.status(200).json({ ...recipe, categories, ingredients, comments });
  } catch (err) {
    logger.error('Error fetching recipe with ID: ' + req.params.id + ' - ' + err.message);
    res.status(500).json({ message: 'Error fetching recipe', error: err.message });
  }
};

// Delete a recipe
export const deleteRecipe = async (req, res) => {
  const recipeId = req.params.id;
  const userId = req.user.id;

  try {
    const [rows] = await pool.query('SELECT * FROM recipes WHERE id = ?', [recipeId]);
    const recipe = rows[0];

    if (!recipe) {
      logger.warn('Recipe not found with ID: ' + recipeId);
      return res.status(404).json({ message: 'Recipe not found' });
    }
    if (recipe.user_id !== userId) {
      logger.warn('Unauthorized attempt to delete recipe with ID: ' + recipeId);
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (recipe.image_url) {
      const publicId = extractPublicIdFromUrl(recipe.image_url);
      if (publicId) {
        cloudinary.v2.uploader.destroy(publicId, (err) => {
          if (err) {
            logger.error('Failed to delete image from cloudinary: ' + err.message);
          }
        });
      }
    }

    const success = await remove(recipeId);
    if (success) {
      logger.info('Successfully deleted recipe with ID: ' + recipeId);
      res.status(200).json({ message: 'Deleted successfully' });
    } else {
      logger.error('Failed to delete recipe with ID: ' + recipeId);
      res.status(500).json({ message: 'Delete failed' });
    }
  } catch (error) {
    logger.error('Error deleting recipe with ID: ' + recipeId + ' - ' + error.message);
    res.status(500).json({ message: 'Delete error', error: error.message });
  }
};

// Utility function to extract public ID from image URL
const extractPublicIdFromUrl = (url) => {
  const match = url.match(/\/([^/]+)\.[a-z]+$/i);
  return match ? match[1] : null;
};

// Add comment to recipe
export const addCommentToRecipeHandler = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const userId = req.user.id;

  if (!comment) {
    logger.warn('Comment missing');
    return res.status(400).json({ message: 'Comment is required' });
  }

  try {
    await addCommentToRecipe(id, userId, comment);
    logger.info('Comment added to recipe ID: ' + id);
    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    logger.error('Failed to add comment to recipe ID: ' + id + ' - ' + err.message);
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

// Add rating to recipe
export const addRatingToRecipeHandler = async (req, res) => {
  const { id } = req.params;
  const { ratings } = req.body;
  const userId = req.user.id;

  if (!ratings || isNaN(ratings) || ratings < 1 || ratings > 5) {
    logger.warn('Invalid rating value for recipe ID: ' + id);
    return res.status(400).json({ message: 'Rating must be 1-5' });
  }

  try {
    await addRatingToRecipe(id, userId, ratings);
    logger.info('Rating added to recipe ID: ' + id);
    res.status(201).json({ message: 'Rating added' });
  } catch (err) {
    logger.error('Failed to add rating to recipe ID: ' + id + ' - ' + err.message);
    res.status(500).json({ message: 'Failed to add rating', error: err.message });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    // Example: ?categoryId=2
    const filters = {};
    if (req.query.categoryId) {
      filters.categoryId = req.query.categoryId;
    }

    const recipes = await getRecipes(filters);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};
