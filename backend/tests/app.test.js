const request = require('supertest');
const app = require('../src/app');

describe('App basic routes', () => {
  it('returns ok for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('requires auth for protected routes', async () => {
    const res = await request(app).get('/api/quizzes');
    expect(res.statusCode).toBe(401);
  });

  it('requires admin auth for admin listing', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.statusCode).toBe(401);
  });
});
