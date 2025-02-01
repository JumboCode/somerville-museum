import { query } from './db.js';

export default async function handler(req, res) {
    const { id } = req.query; // Get the ID from request parameters

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' }); // Only allow GET requests
    }

    try {
        // Query the database for the entry with the given ID
        const result = await query('SELECT * FROM dummy_data WHERE id = $1', [id]);

        // If no rows are found, return a 404 response
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        // Return the entry as JSON
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching entry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}