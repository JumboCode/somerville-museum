import { query } from './db.js';

export default async function handler(req, res) {
    // Fetch status array and tags array from request
    const { status, tags } = req.body;

    // Build query string starting with a blanket WHERE statement
    let queryStr = 'SELECT * FROM dummy_data WHERE 1=1';

    // Bool to track if the first filter
    let hasStatus = false;

    // For every additional filter, append it to the query string
    for (const key in status) {
        // If this is the first filter, add an AND
        if (!hasStatus) {
            queryStr += ' AND ( ';
            hasStatus = true;
        }

        // Add current filter to the query string
        queryStr += ` status = '${status[key]}' OR`;
    }

    // Close parenthesis if there were status filters
    if (hasStatus) {
        queryStr += ' 1=0 )';
    }

    // Bool to track if there are tags in the input selection
    let hasTags = false;

    // Loop through each of the selected tags, apending to query string
    for (const key in tags) {
        // If this is the first filter, add an AND
        if (!hasTags) {
            queryStr += ' AND ( ';
            hasTags = true;
        }

        // Add current filter to the query string
        queryStr += ` '${tags[key]}' = ANY(tags) OR`;
    }

    // Close parenthesis if there were tag filters
    if (hasTags) {
        queryStr += ' 1=0 )';
    }

    // Execute the query string
    try {
        const result = await query(queryStr);
        
        // Send the result back to the frontend
        res.status(200).json(result.rows); 
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
