import { Router } from 'express';

import { db } from '../db';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { event, path, referrer, userAgent, ip } = req.body;
    if (!event || !path) {
      return res.status(400).json({ error: 'Event and path are required' });
    }
    const result = await db.query(
      'INSERT INTO logs (event, path, referrer, user_agent, ip) VALUES ($1, $2, $3, $4, $5)',
      [event, path, referrer, userAgent, ip]
    );
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error logging event:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
