import pool from '../../config/db.js';
import {
  create,
  getRecipes,
  findById,
  update,
  remove,
  getIngredientsForRecipe,
  addIngredientsToRecipe,
  getCategoriesForRecipe,
} from '../../models/recipes.js';

// Mock the database pool
jest.mock('../../config/db.js', () => ({
  query: jest.fn(),
}));

describe('Recipes Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new recipe', async () => {
    const newRecipe = { title: 'Test Recipe', description: 'This is a test.', userId: 1 };
    const mockResult = { insertId: 1 };

    pool.query.mockResolvedValue([mockResult]);

    const result = await create(newRecipe);

    expect(result).toEqual({ id: 1, ...newRecipe });
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO recipes (title, description, user_id) VALUES (?, ?, ?)',
      [newRecipe.title, newRecipe.description, newRecipe.userId]
    );
  });

  it('should fetch all recipes', async () => {
    const mockRecipes = [
      { id: 1, title: 'Recipe 1', description: 'Description 1', user_id: 1, first_name: 'John', last_name: 'Doe' },
      { id: 2, title: 'Recipe 2', description: 'Description 2', user_id: 2, first_name: 'Jane', last_name: 'Doe' },
    ];
  
    // Mock pool.query implementation
    pool.query.mockResolvedValueOnce([mockRecipes]);
  
    const result = await getRecipes({});
    expect(result).toEqual(mockRecipes);
  
    // Normalize whitespace for both expected and actual SQL
    const normalizeSQL = (sql) => sql.replace(/\s+/g, ' ').trim();
  
    expect(normalizeSQL(pool.query.mock.calls[0][0])).toEqual(
      normalizeSQL(`
        SELECT recipes.*, users.first_name, users.last_name
        FROM recipes
        INNER JOIN users ON recipes.user_id = users.id
      `)
    );
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), []);
  });
  

  it('should fetch a recipe by ID', async () => {
    const mockRecipe = { id: 1, title: 'Recipe 1', description: 'Description 1', user_id: 1 };

    pool.query.mockResolvedValue([[mockRecipe]]);

    const result = await findById(1);

    expect(result).toEqual(mockRecipe);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM recipes WHERE id = ?', [1]);
  });

  it('should update a recipe', async () => {
    const updatedRecipe = { id: 1, title: 'Updated Recipe', description: 'Updated description' };
    const mockResult = { affectedRows: 1 };

    pool.query.mockResolvedValue([mockResult]);

    const result = await update(updatedRecipe);

    expect(result).toBeTruthy();
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE recipes SET title = ?, description = ? WHERE id = ?',
      [updatedRecipe.title, updatedRecipe.description, updatedRecipe.id]
    );
  });

  it('should delete a recipe', async () => {
    const mockResult = { affectedRows: 1 };

    pool.query.mockResolvedValue([mockResult]);

    const result = await remove(1);

    expect(result).toBeTruthy();
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM recipes WHERE id = ?', [1]);
  });

  it('should return a list of ingredients for a recipe', async () => {
    // Mocking a successful fetch of ingredients
    const mockIngredients = [
      { id: 1, recipe_id: 1, ingredient_name: 'Salt' },
      { id: 2, recipe_id: 1, ingredient_name: 'Pepper' },
      { id: 3, recipe_id: 1, ingredient_name: 'Olive Oil' }
    ];
    pool.query.mockResolvedValue([mockIngredients]);

    const result = await getIngredientsForRecipe(1);

    expect(result).toEqual(mockIngredients);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM recipe_ingredients WHERE recipe_id = ?',
      [1]  // This should match the actual query in the function
    );
  });

  it('should add ingredients to a recipe', async () => {
  const ingredients = ['Flour', 'Sugar'];
  const mockResult = { affectedRows: 2 };

  pool.query.mockResolvedValue([mockResult]);

  await addIngredientsToRecipe(1, ingredients);

  const expectedValues = [
    [1, 'Flour'],
    [1, 'Sugar'],
  ];

  expect(pool.query).toHaveBeenCalledWith(
    'INSERT INTO ingredients (recipe_id, ingredient) VALUES ?',
    [expectedValues]
  );
});


  it('should fetch categories for a recipe', async () => {
    const mockCategories = [
      { id: 1, name: 'Dessert' },
      { id: 2, name: 'Breakfast' },
    ];

    pool.query.mockResolvedValue([mockCategories]);

    const result = await getCategoriesForRecipe(1);

    expect(result).toEqual(mockCategories);
    expect(pool.query).toHaveBeenCalledWith(
      `SELECT categories.* FROM categories INNER JOIN recipe_categories ON categories.id = recipe_categories.category_id WHERE recipe_categories.recipe_id = ?`,
      [1]
    );
  });
});
