import express from 'express'; 
import { authenticate } from '../middleware/authenticate.js';

import {
  saveRecipeForUser,
  toggleSaveRecipe,
  getSavedRecipes,
  unsaveRecipe
} from '../controllers/savedRecipesController.js';

const router = express.Router();

// Since base route is '/api/saved-recipes', only use relative paths here
router.post('/', authenticate, saveRecipeForUser); // Optional: could be removed if unused
router.post('/toggle-save', authenticate, toggleSaveRecipe);
router.get('/', authenticate, getSavedRecipes); // Matches frontend GET /api/saved-recipes

router.delete('/unsave', authenticate, unsaveRecipe);
export { router };
