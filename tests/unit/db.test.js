import pool from '../../config/db'


// Database test function
const dbTest = async () => {
  try {
    console.log('Testing database connection and queries...');

    // 1. Test connection
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('Connection successful. Test query result:', rows[0].result);

    // 2. Check if a table exists
    const [usersTable] = await pool.query('SHOW TABLES LIKE "users"');
    if (usersTable.length > 0) {
      console.log('Users table exists.');
    } else {
      console.error('Users table does not exist.');
    }

    // 3. Check if the test email already exists
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    if (existingUser.length === 0) {
      // If the user doesn't exist, insert a test record
      const [insertResult] = await pool.query(`
        INSERT INTO users (email, password_hash, first_name, last_name)
        VALUES ('test@example.com', 'testhash', 'Test', 'User');
      `);
      console.log('Test user inserted with ID:', insertResult.insertId);
    } else {
      console.log('Test user already exists. Skipping insert.');
    }

    // 4. Query the test record
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    console.log('Retrieved test user:', users);

    console.log('Database test completed successfully!');
  } catch (err) {
    console.error('Database test failed:', err.message);
  }
};

// Jest test
it('should return 2 from test query', async () => {
  const [rows] = await pool.query('SELECT 1 + 1 AS result');
  expect(rows[0].result).toBe(2);
});

