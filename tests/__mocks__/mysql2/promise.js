// __mocks__/mysql2/promise.js
const mockQuery = jest.fn((sql, params) => {
  console.log('Mocked query called:', sql, params);

  // Return fake results depending on query
  if (sql.startsWith('SELECT 1 + 1')) {
    return [[{ result: 2 }], undefined];
  }

  if (sql.startsWith('SHOW TABLES LIKE')) {
    return [[[{ 'Tables_in_test (users)': 'users' }]], undefined];
  }

  if (sql.startsWith('SELECT * FROM users WHERE email = ?')) {
    if (params[0] === 'test@example.com') {
      return [[{ id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User' }], undefined];
    }
    return [[] , undefined];
  }

  if (sql.startsWith('INSERT INTO users')) {
    return [{ insertId: 42 }, undefined];
  }

  // Default empty result
  return [[], undefined];
});

const mockGetConnection = jest.fn(async () => ({
  release: jest.fn(),
}));

const mockCreatePool = jest.fn(() => ({
  query: mockQuery,
  getConnection: mockGetConnection,
}));

export default { createPool: mockCreatePool };