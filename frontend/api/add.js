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
        borrow_history = {}  // JSONB default value
      } = req.body;
  
      // Insert into the database

      const id_exists = await query(
        'SELECT EXISTS(SELECT 1 FROM dummy_data WHERE id = $1)', [id]);

      console.log(id_exists);


      if (id_exists == "t") {
        const result = await query(
          `INSERT INTO dummy_data 
          (id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          RETURNING *`,
          [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes]
        );
      } else {
        const result = await query(
          `INSERT INTO dummy_data 
          (id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (id) 
          DO UPDATE SET 
            name = EXCLUDED.name,
            status = EXCLUDED.status,
            age_group = EXCLUDED.age_group,
            gender = EXCLUDED.gender,
            color = EXCLUDED.color,
            season = EXCLUDED.season,
            garment_type = EXCLUDED.garment_type,
            size = EXCLUDED.size,
            time_period = EXCLUDED.time_period,
            condition = EXCLUDED.condition,
            cost = EXCLUDED.cost,
            authenticity_level = EXCLUDED.authenticity_level,
            location = EXCLUDED.location,
            date_added = EXCLUDED.date_added,
            current_borrower = EXCLUDED.current_borrower,
            borrow_history = EXCLUDED.borrow_history,
            notes = EXCLUDED.notes
          RETURNING *`,
          [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes]
        );
      }
  
    } catch (error) {
      console.error('Database Error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  }