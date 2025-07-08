import express from 'express';
import { fetchCategories, createCategoryHandler,fetchCategoryById } from '../controllers/categoryController.js';
import { authenticate } from '../middleware/authenticate.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// Route to get all categories
router.get('/', fetchCategories);

// Route to create a new category
router.post('/', authenticate, isAdmin, createCategoryHandler);

router.get('/:id', fetchCategoryById);


export default router;
