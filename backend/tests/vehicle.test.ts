import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';

jest.mock('../src/config/db', () => ({
  query: jest.fn(),
}));

import { query } from '../src/config/db';
const mockQuery = query as jest.Mock;

describe('Vehicle Endpoints (Read Operations)', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
  let validToken: string;

  beforeAll(() => {
    validToken = jwt.sign({ id: 'user123', role: 'USER' }, JWT_SECRET);
  });

  beforeEach(() => {
    mockQuery.mockReset();
  });

  describe('GET /api/vehicles', () => {
    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/api/vehicles');
      expect(res.statusCode).toEqual(401);
    });

    it('should return a list of vehicles for authenticated users', async () => {
      const mockVehicles = [
        {
          id: 'v1',
          make: 'Toyota',
          model: 'Camry',
          category: 'Sedan',
          price: '25000',
          quantity: 5,
        },
        { id: 'v2', make: 'Honda', model: 'Civic', category: 'Sedan', price: '22000', quantity: 3 },
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockVehicles });

      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].make).toEqual('Toyota');
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('should return 404 if vehicle is not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get('/api/vehicles/invalid-id')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
    });

    it('should return a single vehicle if found', async () => {
      const mockVehicle = {
        id: 'v1',
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: '25000',
        quantity: 5,
      };
      mockQuery.mockResolvedValueOnce({ rows: [mockVehicle] });

      const res = await request(app)
        .get('/api/vehicles/v1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.make).toEqual('Toyota');
    });
  });
});
