import { query } from './db.js';

export default async function handler(req, res) {
  const { id } = req.body;
  try {
    const result = await query('DELETE FROM dummy_data WHERE id = $1', [id]);
    // console.log(result.rows);
    res.status(200).json(result); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}