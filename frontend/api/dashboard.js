/*
 * Authors: Will and Angie
 * Sprint: Dashboard #44
 * This file is the backend API for the dashboard page. It queries the database
 * for the total number of items, the number of items that are missing, overdue,
 * and borrowed.
*/

import { query } from './db.js';

export default async function handler(req, res) {
    try {
        // Get all counts in a single query!
        const result = await query(`
            SELECT 
                COUNT(*) as total_items,
                COUNT(CASE WHEN status = 'Missing' THEN 1 END) as missing_items,
                COUNT(CASE WHEN status = 'Overdue' THEN 1 END) as overdue_items,
                COUNT(CASE WHEN status = 'Borrowed' THEN 1 END) as borrowed_items
            FROM dummy_data;
        `);

        const stats = result.rows[0];

        // Send the statistics back to the frontend
        res.status(200).json({
            totalItems: parseInt(stats.total_items),
            missingItems: parseInt(stats.missing_items),
            overdueItems: parseInt(stats.overdue_items),
            borrowedItems: parseInt(stats.borrowed_items)
        });

    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}