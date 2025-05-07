describe('Ingredients Model', () => {
    let connection;
  
    beforeAll(async () => {
      connection = await pool.getConnection();
    });
  
    afterAll(() => {
      connection.release();
    });
  
    test('should create a new ingredient', async () => {
      const result = await connection.query(
        'INSERT INTO ingredients (name) VALUES (?)', ['Sugar']
      );
      expect(result.affectedRows).toBe(1);
    });
  
    test('should get all ingredients', async () => {
      const [rows] = await connection.query('SELECT * FROM ingredients');
      expect(rows).toBeInstanceOf(Array);
      expect(rows.length).toBeGreaterThan(0);
    });
  });
  