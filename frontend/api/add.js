import { query } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
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
            borrow_history = {} // JSONB default value
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
            (id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            RETURNING *`,
            [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes]
        );

        res.status(201).json({ success: true, data: result.rows[0] });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
}