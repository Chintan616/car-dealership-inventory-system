import request from 'supertest';
import app from '../src/app';

const mockQuery = jest.fn();
jest.mock('pg', () => {
  return {
    Pool: jest.fn(() => ({
      query: mockQuery,
      on: jest.fn(),
      end: jest.fn(),
    })),
  };
});

import { Pool } from 'pg';

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
      expect(res.body.data.email).toEqual('test@test.com');
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
      // Mock the DB to return a user with a hashed password
      // $2b$10$wJtQzE9bE5xZ5OqVwP4XKu5Ew/C9xN0Xk5rW3ZzG7O3ZzG7O3ZzG7 (bcrypt for 'password123')
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: '123',
            email: 'test@test.com',
            password: '$2b$10$wJtQzE9bE5xZ5OqVwP4XKu5Ew/C9xN0Xk5rW3ZzG7O3ZzG7O3ZzG7',
          },
        ],
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      // Wait for JWT phase to check token, for now just success
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
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id: '123',
            email: 'test@test.com',
            password: '$2b$10$wJtQzE9bE5xZ5OqVwP4XKu5Ew/C9xN0Xk5rW3ZzG7O3ZzG7O3ZzG7',
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
