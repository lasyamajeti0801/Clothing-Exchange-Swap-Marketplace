import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server/src/app.js';

describe('ReWear REST API Endpoints', () => {
  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('ReWear API Server');
  });

  it('GET /api/clothes should return seeded clothes with pagination', async () => {
    const res = await request(app).get('/api/clothes');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    expect(res.body.data.pagination.total).toBeGreaterThanOrEqual(50);
  });

  it('GET /api/clothes with search query should filter accurately', async () => {
    const res = await request(app).get('/api/clothes?search=Denim');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items.length).toBeGreaterThan(0);
    res.body.data.items.forEach((item) => {
      const match =
        item.title.toLowerCase().includes('denim') ||
        item.brand.toLowerCase().includes('denim') ||
        item.description.toLowerCase().includes('denim');
      expect(match).toBe(true);
    });
  });

  it('POST /api/valuation/estimate should compute suggested swap value', async () => {
    const res = await request(app)
      .post('/api/valuation/estimate')
      .send({
        category: 'Hoodies',
        brand: 'H&M',
        condition: 'EXCELLENT',
        purchaseAge: '6-12 months',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.estimatedValue).toBeGreaterThan(0);
    expect(res.body.data.suggestedRange.min).toBeLessThanOrEqual(res.body.data.estimatedValue);
  });

  it('POST /api/auth/login with wrong password should fail with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'priya@rewear.org',
        password: 'WrongPassword999',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login with valid demo credentials should succeed and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'priya@rewear.org',
        password: 'Password@123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe('priya@rewear.org');
  });

  it('GET /api/admin/dashboard without token should return 401', async () => {
    const res = await request(app).get('/api/admin/dashboard');
    expect(res.status).toBe(401);
  });
});
