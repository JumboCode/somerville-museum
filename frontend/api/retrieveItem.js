/**************************************************************
 *
 *                     retrieveItem.js
 *
 *        Authors: Dan Glorioso & Massimo Bottari
 *           Date: 02/01/2025
 *
 *     Summary: An API route to fetch the details of an item
 *              from the database using the ID in the request.
 * 
 **************************************************************/

import { query } from './db.js';

export default async function handler(req, res) {
    const { id } = req.query; // Get the ID from request parameters

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Query the database for the entry with the given ID
        const result = await query('SELECT * FROM dummy_data WHERE id = $1', [id]);

        // If no entry is found, return a 428 error
        if (result.rows.length === 0) {
            return res.status(428).json({ message: 'Item ID does not exist' });
        }

        // Return the entry as JSON
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching entry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}