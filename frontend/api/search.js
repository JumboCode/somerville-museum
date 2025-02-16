/**
 * @fileoverview API endpoint for making a search request given a query.
 * 
 * @file search.js
 * @date February 16th, 2025
 * @authors Peter Morganelli & Shayne Sidman 
 *  
 */

import { query } from "./db.js";

export default async function handler(req, res) {
    const searchQuery = req.body.searchQuery;
    let databaseQuery = isNaN(parseInt(searchQuery)) ? 
        `SELECT dummy_data.* FROM dummy_data FULL OUTER JOIN borrowers ON dummy_data.current_borrower = borrowers.id WHERE dummy_data.name ILIKE '%'||$1||'%' OR dummy_data.notes ILIKE '%'||$1||'%' OR borrowers.name ILIKE '%'||$1||'%'` : 
        `SELECT * FROM dummy_data WHERE name ILIKE '%'||$1||'%' OR notes ILIKE '%'||$1||'%' OR id = ${parseInt(searchQuery)}`;
    
    try {
        // Select all entries where searchQuery is a substring of name, notes, id, or borrower name
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
