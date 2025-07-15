import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
       globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
         
      },
    },
    
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn',
    },
  },

  prettier,
   {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
{
  files: ['jest.setup.js'],
  languageOptions: {
    globals: {
      beforeAll: 'readonly',
      afterAll: 'readonly',
    },
  },
  rules: {
    'no-undef': 'off',
  },
},


];
