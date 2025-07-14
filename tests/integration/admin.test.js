import request from 'supertest';
import app from '../../app.js';

describe('Admin route security tests', () => {
  afterAll(async () => {
  });

  it('should return 401 for unauthenticated access to /admin/users', async () => {
  const res = await request(app).get('/api/admin/users');

  expect(res.status).toBe(401);
  expect(res.body).toHaveProperty('message');
});

});
