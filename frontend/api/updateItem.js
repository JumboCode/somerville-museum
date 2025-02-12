/**************************************************************
 *
 *                     updateItem.js
 *
 *        Authors: Dan Glorioso & Massimo Bottari
 *           Date: 02/01/2025
 *
 *     Summary: An API route to edit an existing item to the database using the
 *              change input from the fields in EditPage component.
 * 
 **************************************************************/

import { query } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Desctructure the request body
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
            authenticity_level,
            location,
            date_added,
            current_borrower,
            borrow_history = {}
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
                    authenticity_level = $13,
                    location = $14,
                    date_added = $15,
                    current_borrower = $16,
                    borrow_history = $17,
                    notes = $18
                WHERE id = $1
                RETURNING *`,
                [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes]
            );
            return res.status(200).json({ message: "Item successfully updated", item: result.rows[0] });
        } else {
            // If the ID does not exist, insert a new entry
            result = await query(
                `INSERT INTO dummy_data 
                (id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
                RETURNING *`,
                [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes]
            );
            return res.status(201).json({ message: "Item successfully added", item: result.rows[0] });
        }

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Database error' });
    }
}