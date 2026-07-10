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
  let adminToken: string;

  beforeAll(() => {
    validToken = jwt.sign({ id: 'user123', role: 'USER' }, JWT_SECRET);
    adminToken = jwt.sign({ id: 'admin123', role: 'ADMIN' }, JWT_SECRET);
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

  describe('POST /api/vehicles', () => {
    it('should return 403 if user is not an ADMIN', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ make: 'Ford', model: 'Focus', category: 'Hatchback', price: 15000, quantity: 2 });

      expect(res.statusCode).toEqual(403);
    });

    it('should create a vehicle if user is ADMIN', async () => {
      const newVehicle = {
        id: 'v3',
        make: 'Ford',
        model: 'Focus',
        category: 'Hatchback',
        price: '15000',
        quantity: 2,
      };
      mockQuery.mockResolvedValueOnce({ rows: [newVehicle] });

      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ make: 'Ford', model: 'Focus', category: 'Hatchback', price: 15000, quantity: 2 });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.make).toEqual('Ford');
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should return 403 if user is not an ADMIN', async () => {
      const res = await request(app)
        .put('/api/vehicles/v1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ price: 20000 });

      expect(res.statusCode).toEqual(403);
    });

    it('should update a vehicle if user is ADMIN', async () => {
      const updatedVehicle = {
        id: 'v1',
        make: 'Toyota',
        model: 'Camry',
        category: 'Sedan',
        price: '20000',
        quantity: 5,
      };
      mockQuery.mockResolvedValueOnce({ rows: [updatedVehicle] });

      const res = await request(app)
        .put('/api/vehicles/v1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 20000 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toEqual('20000');
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should return 403 if user is not an ADMIN', async () => {
      const res = await request(app)
        .delete('/api/vehicles/v1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toEqual(403);
    });

    it('should delete a vehicle if user is ADMIN', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app)
        .delete('/api/vehicles/v1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toEqual('Vehicle deleted successfully');
    });
  });

  describe('GET /api/vehicles/search', () => {
    it('should filter vehicles by make', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ make: 'Ford', model: 'Focus' }] });
      const res = await request(app)
        .get('/api/vehicles/search?make=Ford')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data[0].make).toEqual('Ford');
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should fail if vehicle is out of stock', async () => {
      // Mock finding the vehicle with 0 quantity
      mockQuery.mockResolvedValueOnce({ rows: [{ quantity: 0 }] });

      const res = await request(app)
        .post('/api/vehicles/v1/purchase')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toEqual('Vehicle is out of stock');
    });

    it('should decrement stock on successful purchase', async () => {
      // Mock finding the vehicle
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 'v1', quantity: 5 }] });
      // Mock updating the vehicle
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 'v1', quantity: 4 }] });

      const res = await request(app)
        .post('/api/vehicles/v1/purchase')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toEqual(4);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should return 403 if user is not an ADMIN', async () => {
      const res = await request(app)
        .post('/api/vehicles/v1/restock')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ amount: 5 });

      expect(res.statusCode).toEqual(403);
    });

    it('should increment stock if user is ADMIN', async () => {
      // Mock finding the vehicle
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 'v1', quantity: 5 }] });
      // Mock updating the vehicle
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 'v1', quantity: 10 }] });

      const res = await request(app)
        .post('/api/vehicles/v1/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 5 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toEqual(10);
    });
  });
});
