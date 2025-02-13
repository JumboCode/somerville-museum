import { query } from "./db.js";

export default async function handler(req, res) {
    const searchQuery = req.body.searchQuery;
    const databaseQuery = isNaN(parseInt(searchQuery)) ? 
        `SELECT * FROM dummy_data WHERE name ILIKE '%'||$1||'%' OR notes ILIKE '%'||$1||'%'` : 
        `SELECT * FROM dummy_data WHERE name ILIKE '%'||$1||'%' OR notes ILIKE '%'||$1||'%' OR id = ${parseInt(searchQuery)}`;

    try {
        // Select all entries where searchQuery is a substring of name, notes, or id
        const result = await query(
            databaseQuery, 
            [searchQuery]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching entry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
