export default {
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleDirectories: ['node_modules', 'src', 'config'],
  moduleFileExtensions: ['js', 'json', 'node'],
  moduleNameMapper: {
    '^bcrypt$': 'bcryptjs',
  },
};
