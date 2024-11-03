import { query } from './db.js';

export default async function handler(req, res) {
  const { id, note } = req.body;
  try {
    const result = await query('UPDATE dummy_data SET note = $1 WHERE id = $2', [note, id]);
    if (result.rowCount === 0) {
        res.status(404).send("Item not found");
    }
    res.status(200).json(result); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
