/**
 * @fileoverview All API routes for the CRUD operations on items
 * 
 * @file api/itemManagement.js
 * @date 16 February, 2025
 * @authors JumboCode Team
 *  
 */

import { query } from './db.js';

// Handler for adding a new item
export async function addHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Destructure the request body
        const {
            id,
            name,
            location,
            cost,
            notes,
            garment_type,
            time_period = [],
            age_group = [],
            gender,
            size,
            season = [],
            condition = [],
            color = [],
            status,
            date_added,
            current_borrower,
            image_keys = []
        } = req.body;

        // Check if an item with the given id already exists
        const existingItem = await query(`SELECT id FROM dummy_data WHERE id = $1`, [id]);

        if (existingItem.rows.length > 0) {
            // Create an unused error code to indicate duplicate item ID
            return res.status(427).json({ error: 'Item with this ID already exists' });
        }

        // Insert into the database
        const result = await query(
            `INSERT INTO dummy_data 
            (id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, location, date_added, current_borrower, notes, image_keys)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *`,
            [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, location, date_added, current_borrower, notes, image_keys]
        );

        res.status(201).json({ success: true, data: result.rows[0] });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
}

// Handler for retrieving item details
export async function retrieveItemHandler(req, res) {
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

        // Get borrow history for the item from borrows table
        const borrowHistory = await query(`
            SELECT b.*, br.name as borrower_name 
            FROM borrows b
            JOIN borrowers br ON b.borrower_id = br.id
            WHERE b.item_id = $1
            ORDER BY b.id DESC
        `, [id]);

        // Combine item details with borrow history
        const itemWithHistory = {
            ...result.rows[0],
            borrow_history: borrowHistory.rows
        };

        // Return the entry as JSON
        res.status(200).json(itemWithHistory);
    } catch (error) {
        console.error('Error fetching entry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

/* query all items based off search input */
export async function searchHandler(req, res) {

    const searchQuery = req.body.searchQuery;

    const isNumeric = !isNaN(searchQuery) && searchQuery.trim() !== '';
    const parsedNumber = parseInt(searchQuery);

    if (!searchQuery || searchQuery.trim() === "") {
        return res.status(200).json([]);
      }
      
    const queryText = `
        SELECT dummy_data.* 
        FROM dummy_data 
        FULL OUTER JOIN borrowers ON dummy_data.current_borrower = borrowers.id 
        WHERE 
            dummy_data.name ILIKE '%' || $1 || '%' OR 
            dummy_data.notes ILIKE '%' || $1 || '%' OR 
            borrowers.name ILIKE '%' || $1 || '%' ${isNumeric ? `OR dummy_data.id = $2` : ''} 
        ORDER BY dummy_data.id
    `;

    const queryParams = isNumeric ? [searchQuery, parsedNumber] : [searchQuery];

    try {
        const result = await query(queryText, queryParams);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching entry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function updateItemHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Destructure the request body
        const {
            id,
            name,
            cost,
            notes,
            garment_type,
            time_period = [],
            age_group = [],
            gender,
            size,
            season = [],
            condition = [],
            color = [],
            status,
            location,
            date_added,
            current_borrower,
            borrow_history = [],
            image_keys = []
        } = req.body;

        if (!id) {
            return res.status(428).json({ error: "Precondition Required: ID is missing" });
        }

        // Check if the ID exists in the database
        const idExistsResult = await query(
            'SELECT EXISTS(SELECT 1 FROM dummy_data WHERE id = $1) AS exists', 
            [id]
        );
        const idExists = idExistsResult.rows[0].exists;

        // Define the result variable
        let result;

        // If the ID exists, update the existing entry
        if (idExists) {
            result = await query(
                `UPDATE dummy_data 
                SET name = $2,
                    status = $3,
                    age_group = $4,
                    gender = $5,
                    color = $6,
                    season = $7,
                    garment_type = $8,
                    size = $9,
                    time_period = $10,
                    condition = $11,
                    cost = $12,
                    location = $13,
                    date_added = $14,
                    current_borrower = $15,
                    notes = $16,
                    image_keys = $17
                WHERE id = $1
                RETURNING *`,
                [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, location, date_added, current_borrower, notes, image_keys]
            );
            return res.status(200).json({ message: "Item successfully updated", item: result.rows[0] });
        } else {
            // If the ID does not exist, insert a new entry
            result = await query(
                `INSERT INTO dummy_data 
                (id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, location, date_added, current_borrower, notes, image_keys)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *`,
                [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, location, date_added, current_borrower, notes]
            );
            return res.status(201).json({ message: "Item successfully added", item: result.rows[0] });
        }

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
}

// Main handler function that routes to the appropriate handler based on the request
export default async function handler(req, res) {
    const { action } = req.query;
    
    switch(action) {
        case 'add':
            return addHandler(req, res);
        case 'retrieve':
            return retrieveItemHandler(req, res);
        case 'search':
            return searchHandler(req, res);
        case 'updateItem':
            return updateItemHandler(req, res);
        default:
            return res.status(400).json({ error: 'Invalid action' });
    }
}