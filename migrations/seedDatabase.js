import pool from "../config/db.js";

const seedDatabase = async () => {
    try {
        // Seed Categories
        const categories = ['Vegetarian', 'Vegan', 'Dessert', 'Main Course', 'Appetizer'];

        for (const category of categories) {
            await pool.query('INSERT IGNORE INTO categories (name) VALUES (?)', [category]);
        }

        // Fetch category IDs after seeding categories
        const [categoryRows] = await pool.query('SELECT id, name FROM categories');
        const categoryIds = {
            Vegetarian: categoryRows.find(c => c.name === 'Vegetarian').id,
            Vegan: categoryRows.find(c => c.name === 'Vegan').id,
            Dessert: categoryRows.find(c => c.name === 'Dessert').id,
            MainCourse: categoryRows.find(c => c.name === 'Main Course').id,
            Appetizer: categoryRows.find(c => c.name === 'Appetizer').id,
        };

        // Seed Users
        const users = [
            {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456'
            },
            {
                id: 2,
                first_name: 'Jane',
                last_name: 'Smith',
                email: 'jane@example.com',
                password_hash: '$2b$10$abcdefghijklmnopqrstuvwxyz123456'
            }
        ];

        for (const user of users) {
            await pool.query(
                'INSERT IGNORE INTO users (id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
                [user.id, user.first_name, user.last_name, user.email, user.password_hash]
            );
        }

        // Optionally Seed Recipes (if required for your tests)
        const recipes = [
            {
                title: 'Sample Recipe',
                description: 'This is a sample recipe description.',
                user_id: 1, // Associate with an existing user
                categories: [categoryIds.Vegetarian, categoryIds.MainCourse], // Use category IDs
                ingredients: ['Flour', 'Sugar', 'Eggs'],// Ingredients for the recipe
                image_url: 'https://example.com/sample-recipe.jpg'
            }
        ];

        // Seed Recipes with user_id validation and categories
        for (const recipe of recipes) {
            const [userExists] = await pool.query('SELECT id FROM users WHERE id = ?', [recipe.user_id]);
            if (userExists.length > 0) {
                const [recipeResult] = await pool.query(
                    'INSERT IGNORE INTO recipes (title, description, user_id, image_url) VALUES (?, ?, ?, ?)',
                    [recipe.title, recipe.description, recipe.user_id, recipe.image_url]
                );

                // Now, link the categories to the created recipe
                for (const categoryId of recipe.categories) {
                    await pool.query(
                        'INSERT IGNORE INTO recipe_categories (recipe_id, category_id) VALUES (?, ?)',
                        [recipeResult.insertId, categoryId]
                    );
                }

                // Seed Ingredients for the recipe
                for (const ingredient of recipe.ingredients) {
                    await pool.query(
                        'INSERT IGNORE INTO recipe_ingredients (recipe_id, ingredient_name) VALUES (?, ?)',
                        [recipeResult.insertId, ingredient]
                    );
                }

                console.log(`Recipe with ID ${recipeResult.insertId} created, linked to categories, and ingredients added!`);
            } else {
                console.warn(`Skipping recipe: User ID ${recipe.user_id} does not exist`);
            }
        }

        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        // Close the database connection pool after seeding
        pool.end();
    }
};

seedDatabase();
