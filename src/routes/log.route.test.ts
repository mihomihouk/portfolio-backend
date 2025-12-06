import { describe, it, beforeAll, vi, expect, Mock } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import logRouter from './log.route';
import { db } from '../db';
import * as botDetection from '../utils/bot-detection';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/log', logRouter);

vi.mock('../db', () => ({
  db: {
    query: vi.fn(),
  },
}));

function setupDatabaseError() {
  // Make the database throw an error
  (db.query as Mock).mockRejectedValue(new Error('Database error'));
  // Suppress console.error output not to pollute the test output
  vi.spyOn(console, 'error').mockImplementation(() => {});
}

describe('Log Route', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe('Log visitor', () => {
    function makePostRequest(payload: any) {
      return request(app).post('/api/log').send(payload);
    }

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

    it('should return 403 if bot user is detected', async () => {
      // Mock the bot detection function to return true
      vi.spyOn(botDetection, 'isBotUser').mockResolvedValue(true);
      const response = await makePostRequest({
        event: 'test',
        path: 'test',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ip: '127.0.0.1',
      });
      expect(response.status).toBe(403);
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
      setupDatabaseError()
      const response = await makePostRequest({
        event: 'test',
        path: 'test',
      });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  });

  describe('Access tracking analytics', ()=>{
    function getVisitorAnalyticsRequest(daysAgo: number){
      return request(app).get('/api/log/visitor-analytics').query({daysAgo});
    } 

    it('should return daily vistor counts and page popularity data', async () => {

      const mockVisitorCount = [{ date: '2024-12-05', visits: 42 }]
      const mockPagePopularity = [{ page: '/', visits: 100 }]

      ;(db.query as Mock)
      .mockResolvedValueOnce([mockVisitorCount])
      .mockResolvedValueOnce([mockPagePopularity])

      const response = await getVisitorAnalyticsRequest(5);
      expect(response.status).toBe(200);
       
      expect(response.body).toEqual({
        visitorCount: [mockVisitorCount],
        pagePopularity: [mockPagePopularity]
      })
    });

    it('should return 500 if database throws an error', async () => {
      setupDatabaseError()
      const response = await getVisitorAnalyticsRequest(25);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal server error' });
    });
  })
});
