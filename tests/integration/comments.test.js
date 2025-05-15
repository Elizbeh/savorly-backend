

describe('Comments Model', () => {
  let connection;

  beforeAll(async () => {
    connection = await pool.getConnection();
  });

  afterAll(() => {
    connection.release();
  });

  test('should create a new comment', async () => {
    const result = await connection.query(
      'INSERT INTO comments (recipe_id, user_id, comment) VALUES (?, ?, ?)', [1, 1, 'Great recipe!']
    );
    expect(result.affectedRows).toBe(1);
  });

  test('should get all comments for a recipe', async () => {
    const [rows] = await connection.query('SELECT * FROM comments WHERE recipe_id = ?', [1]);
    expect(rows).toBeInstanceOf(Array);
    expect(rows.length).toBeGreaterThan(0);
  });
});
