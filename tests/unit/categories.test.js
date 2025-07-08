import pool from '../../config/db.js';
import { createCategory, getAllCategories } from '../../models/categories.js';

jest.mock('../../config/db.js');

describe('Category Model Tests', () => {

  beforeAll(() => {
    // Mock initial queries
    pool.query.mockResolvedValue([]);
    pool.end = jest.fn();
  });

  


  it('should create a category successfully', async () => {
    const mockCategory = { name: 'Dessert' };
    const mockResult = { insertId: 1 };

    pool.query.mockResolvedValue([mockResult]);

    const result = await createCategory(mockCategory.name);

    expect(result).toEqual({ id: 1, name: mockCategory.name });
  });

  it('should fetch all categories', async () => {
    const mockCategories = [{ id: 1, name: 'Dessert' }];

    pool.query.mockResolvedValue([mockCategories]);

    const result = await getAllCategories();

    expect(result).toEqual(mockCategories);
  });

});
