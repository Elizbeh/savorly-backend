// jest.config.cjs
module.exports = {
  testTimeout: 60000,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleDirectories: ['node_modules', 'src', 'config'],
  moduleFileExtensions: ['js', 'json', 'node'],
  moduleNameMapper: {
    '^bcrypt$': 'bcryptjs',
  },
};
