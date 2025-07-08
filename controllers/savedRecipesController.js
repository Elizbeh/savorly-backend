import {
  saveRecipe,
  toggleSave,
  getSavedRecipesByUser,
  unsaveRecipe as unsaveRecipeModel
} from '../models/savedRecipes.js';

export const saveRecipeForUser = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).json({ message: 'Recipe ID is required' });
  }

  try {
    await saveRecipe(userId, recipeId);
    res.status(201).json({ message: 'Recipe saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save recipe', error: error.message });
  }
};

export const toggleSaveRecipe = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).json({ message: 'Recipe ID is required' });
  }

  try {
    const result = await toggleSave(userId, recipeId);
    res.status(200).json({
      message: result.saved ? 'Recipe saved' : 'Recipe unsaved',
      saved: result.saved
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving/unsaving recipe', error: error.message });
  }
};

export const getSavedRecipes = async (req, res) => {
  const userId = req.user.id;

  try {
    const recipes = await getSavedRecipesByUser(userId);
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch saved recipes', error: error.message });
  }
};


export const unsaveRecipe = async (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).json({ message: 'Missing recipeId' });
  }

  try {
    await unsaveRecipeModel(userId, recipeId);
    res.status(200).json({ message: 'Recipe unsaved successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unsave recipe.', error: error.message });
  }
};
