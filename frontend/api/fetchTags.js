import { query } from './db.js';

export default async function handler(req, res) {
  try {
    const result = await query('SELECT DISTINCT tag FROM dummy_data WHERE tag IS NOT NULL;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}