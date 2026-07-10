import request from 'supertest';
import app from '../src/app';
import bcrypt from 'bcrypt';

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

import { query } from '../src/config/db';

const mockQuery = query as jest.Mock;

describe('Auth Endpoints', () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Mock the DB response to simulate no existing user, then a successful insert
      mockQuery.mockResolvedValueOnce({ rows: [] }); // Check duplicate email
      mockQuery.mockResolvedValueOnce({ rows: [{ id: '123', email: 'test@test.com' }] }); // Insert

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@test.com', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toEqual('test@test.com');
      expect(typeof res.body.data.token).toBe('string');
    });

    it('should fail if email already exists', async () => {
      // Mock the DB response to simulate existing user
      mockQuery.mockResolvedValueOnce({ rows: [{ id: '123', email: 'test@test.com' }] });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@test.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully', async () => {
      const hashedPw = await bcrypt.hash('password123', 10);
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: '123',
            email: 'test@test.com',
            password: hashedPw,
          },
        ],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(typeof res.body.data.token).toBe('string');
      expect(res.body.data.user.email).toEqual('test@test.com');
    });

    it('should fail with wrong email', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@test.com', password: 'password123' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });

    it('should fail with wrong password', async () => {
      const hashedPw = await bcrypt.hash('password123', 10);
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: '123',
            email: 'test@test.com',
            password: hashedPw,
          },
        ],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });
});
