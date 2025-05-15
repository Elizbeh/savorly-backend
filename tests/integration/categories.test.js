describe('Categories Model', () => {
  let connection;

  beforeAll(async () => {
    connection = await pool.getConnection();
  });

  afterAll(() => {
    connection.release();
  });

  test('should create a new category', async () => {
    const result = await connection.query(
      'INSERT INTO categories (name) VALUES (?)', ['Desserts']
    );
    expect(result.affectedRows).toBe(1);
  });

  test('should get all categories', async () => {
    const [rows] = await connection.query('SELECT * FROM categories');
    expect(rows).toBeInstanceOf(Array);
    expect(rows.length).toBeGreaterThan(0);
  });
});
