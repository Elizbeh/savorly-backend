// jest.config.js
module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleDirectories: ['node_modules', 'src', 'config'],
  moduleNameMapper: {
    '^bcrypt$': 'bcryptjs',
  },
};
