import { query } from './db.js';

export default async function handler(req, res) {
    try {
        const result = await query('SELECT DISTINCT UNNEST(tags) AS tag FROM dummy_data;');
        res.status(200).json(result.rows); // Send the result back to the frontend
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
