import express from 'express'; 
import { authenticate } from '../middleware/authenticate.js';

import {
  saveRecipeForUser,
  toggleSaveRecipe,
  getSavedRecipes,
  unsaveRecipe
} from '../controllers/savedRecipesController.js';

const router = express.Router();


router.post('/', authenticate, saveRecipeForUser);
router.post('/toggle-save', authenticate, toggleSaveRecipe);
router.get('/', authenticate, getSavedRecipes);

router.delete('/unsave', authenticate, unsaveRecipe);
export { router };
