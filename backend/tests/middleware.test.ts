import request from 'supertest';
import express, { Request, Response } from 'express';
import { authenticate, authorizeRole } from '../src/middleware/authMiddleware';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Dummy protected routes
app.get('/api/protected', authenticate, (req: Request, res: Response) => {
  res.status(200).json({ success: true, user: (req as any).user });
});

app.get('/api/admin', authenticate, authorizeRole(['ADMIN']), (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Admin access granted' });
});

describe('Auth Middleware Endpoints', () => {
  const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

  it('should reject requests without a token', async () => {
    const res = await request(app).get('/api/protected');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject requests with an invalid token', async () => {
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
  });

  it('should accept valid tokens', async () => {
    const validToken = jwt.sign({ id: '123', role: 'USER' }, JWT_SECRET);

    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${validToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.id).toEqual('123');
  });

  it('should reject USER from ADMIN route', async () => {
    const userToken = jwt.sign({ id: '123', role: 'USER' }, JWT_SECRET);

    const res = await request(app).get('/api/admin').set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.success).toBe(false);
  });

  it('should allow ADMIN to access ADMIN route', async () => {
    const adminToken = jwt.sign({ id: '123', role: 'ADMIN' }, JWT_SECRET);

    const res = await request(app).get('/api/admin').set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
