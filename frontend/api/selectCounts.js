import { query } from './db.js';

export default async function handler(req, res) {
    const { name } = req.body;
    try {
      console.log("In the selectCounts API");
      const result = await query('SELECT COUNT(*) FROM dummy_data WHERE status = $1', [name]);
      const count = result.rows[0].count;  // Extract the count from the result
      res.status(200).json({ count });  // Send it as part of an object
    } catch (error) {
      console.error("Database query error:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  

