import { query } from './db.js';

export default async function handler(req, res) {
  const { id, name, note } = req.body;
  try {
    const result = await query('INSERT INTO dummy_data (id, name, note) VALUES ($1, $2, $3)', [id, name, note]);
    res.status(200).json(result); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
