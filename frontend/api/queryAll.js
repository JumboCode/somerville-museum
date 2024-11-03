import { query } from './db.js';

export default async function handler(req, res) {
        try {
          const result = await query('SELECT * FROM dummy_data');
      //     console.log(result.rows[0]);
          res.status(200).json(result.rows); // Send the result back to the frontend
        } catch (error) {
          console.error("Database query error:", error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }