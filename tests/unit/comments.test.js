import pool from '../../config/db.js';
import { addCommentToRecipe, getCommentsForRecipe } from '../../models/comments';

jest.mock('../../config/db.js');

describe('Comment Model Tests', () => {
  it('should add a comment successfully', async () => {
    const mockRecipeId = 1;
    const mockUserId = 1;
    const mockComment = 'Delicious recipe!';

    pool.query.mockResolvedValue([{ insertId: 1 }]);

    const result = await addCommentToRecipe(mockRecipeId, mockUserId, mockComment);

    expect(result).toEqual({
      id: 1,
      recipeId: mockRecipeId,
      userId: mockUserId,
      comment: mockComment,
    });
  });

  it('should fetch comments for a recipe', async () => {
    const mockRecipeId = 1;
    const mockComments = [
      { recipe_id: 1, user_id: 1, comment: 'Amazing recipe!' },
      { recipe_id: 1, user_id: 2, comment: 'Tastes great!' },
    ];

    pool.query.mockResolvedValue([mockComments]);

    const result = await getCommentsForRecipe(mockRecipeId);

    expect(result).toEqual(mockComments);
  });
  
});
