import { query } from './db.js';

export default async function handler(req, res) {
  const { name } = req.body;
  try {
    const result = await query('SELECT * FROM dummy_data WHERE name = $1', [name]);
    // console.log(result.rows);
    res.status(200).json(result.rows); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

