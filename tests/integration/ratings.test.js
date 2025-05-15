describe('Ratings Model', () => {
  let connection;

  beforeAll(async () => {
    connection = await pool.getConnection();
  });

  afterAll(() => {
    connection.release();
  });

  test('should create a new rating', async () => {
    const result = await connection.query(
      'INSERT INTO ratings (recipe_id, user_id, rating) VALUES (?, ?, ?)', [1, 1, 5]
    );
    expect(result.affectedRows).toBe(1);
  });

  test('should get ratings for a recipe', async () => {
    const [rows] = await connection.query('SELECT * FROM ratings WHERE recipe_id = ?', [1]);
    expect(rows).toBeInstanceOf(Array);
    expect(rows.length).toBeGreaterThan(0);
  });
});
