const request = require('supertest');
const app = require('../src/app');

describe('Auth Routes', () => {
  // Testing missing name
  describe('POST /api/auth/register', () => {
    it('should return 400 if the field name is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(res.statusCode).toBe(400);
    });
    // Testing incorrect email
    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'notanemail', password: 'password123' });
      expect(res.statusCode).toBe(400);
    });
    // Testing password invalid (too short)
    it('should return 400 if password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@example.com', password: '123' });
      expect(res.statusCode).toBe(400);
    });
  });
  // Testing email missing on login
  describe('POST /api/auth/login', () => {
    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });
      expect(res.statusCode).toBe(400);
    });
  });

});