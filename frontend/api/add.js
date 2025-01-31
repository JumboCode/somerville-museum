import { query } from './db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    try {
      const {
        name,
        status = 'Available',
        age_group,
        color = [],
        season = [],
        garment_type,
        size,
        time_period = [],
        condition = [],
        cost,
        authenticity_level,
        location,
        date_added,
        current_borrower,
        borrow_history = {},  // JSONB default
        notes
      } = req.body;
  
      // Validate required fields
      if (!name || !garment_type || !size || !cost || !authenticity_level || !location) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Insert into the database
      const result = await query(
        `INSERT INTO dummy_data 
        (name, status, age_group, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *`,
        [name, status, age_group, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes]
      );
  
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Database Error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  }