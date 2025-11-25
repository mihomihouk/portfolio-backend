import { describe, it, beforeAll, vi, expect, Mock } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import logRouter from './log.route';
import { db } from '../db';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/log', logRouter);

vi.mock('../db', () => ({
  db: {
    query: vi.fn(),
  },
}));
describe('Log Route', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  function makePostRequest(payload: any) {
    return request(app).post('/api/log').send(payload);
  }

  describe('Route validation', () => {
    const invalidPayload = [
      { event: undefined, path: 'test' },
      { event: 'test', path: undefined },
      { event: undefined, path: undefined },
    ];

    it.each(invalidPayload)(
      'should return 400 if event or path is not provided',
      async (payload) => {
        const response = await makePostRequest(payload);
        expect(response.status).toBe(400);
      }
    );
  });

  it('should return 200 if log is successful', async () => {
    const response = await makePostRequest({
      event: 'test',
      path: 'test',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it('should return 500 if database throws an error', async () => {
    // Make the database throw an error
    (db.query as Mock).mockRejectedValue(new Error('Database error'));

    const response = await makePostRequest({
      event: 'test',
      path: 'test',
    });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});
