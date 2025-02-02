import { query } from './db.js';

export default async function handler(req, res) {
    try {
        // Query the database for all tags
        const result = await query('SELECT DISTINCT UNNEST(tags) AS tag FROM dummy_data;');
// PRETTY SURE THIS IS DEPRECATED SINCE TAGS ARE NO LONGER REPRESENTED AS ARRAYS
// export default async function handler(req, res) {
//     try {
//         // Query the database for all tags
//         const result = await query('SELECT DISTINCT UNNEST(tags) AS tag FROM dummy_data;');

        // Send the result back to the frontend
        res.status(200).json(result.rows); 
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
//         // Send the result back to the frontend
//         res.status(200).json(result.rows); 
//     } catch (error) {
//         console.error("Database query error:", error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }