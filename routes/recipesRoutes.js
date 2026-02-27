import express from 'express';
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  addCommentToRecipeHandler,
  addRatingToRecipeHandler,
  getUserRecipes
} from '../controllers/recipeController.js';
import { authenticate } from '../middleware/authenticate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/create', authenticate, upload.single('image'), createRecipe);
router.get('/user', authenticate, getUserRecipes);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', authenticate, upload.single('image'), updateRecipe);
router.delete('/:id', authenticate, deleteRecipe);
router.post('/:id/comments', authenticate, addCommentToRecipeHandler);
router.post('/:id/ratings', authenticate, addRatingToRecipeHandler);

export default router;
