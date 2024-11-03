import { query } from './db.js';

export default async function handler(req, res) {
  const { id, tags } = req.body;

  if (!Array.isArray(tags)) {
        return res.status(400).send('Tags must be an array');
  }
  const tagsString = `{${tags.join(',')}}`;
  try {
    const result = await query("UPDATE dummy_data SET tags = $1 WHERE id = $2 RETURNING *", [tagsString, id]);
    if (result.rowCount === 0) {
        res.status(404).send("Item not found");
    }
    res.status(200).json(result.rows[0]); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
