import { query } from './db.js';

// Handler for adding a new item (previously add.js)
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
            // authenticity_level,
            date_added,
            current_borrower,
            borrow_history = {}
        } = req.body;

        // Check if an item with the given id already exists
        const existingItem = await query(`SELECT id FROM dummy_data WHERE id = $1`, [id]);

        if (existingItem.rows.length > 0) {
            // Create an unused error code to indicate duplicate item ID
            return res.status(427).json({ error: 'Item with this ID already exists' });
        }

        // Insert into the database
        const result = await query(
            // `INSERT INTO dummy_data 
            // (id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes)
            // VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
            // RETURNING *`,
            // [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, authenticity_level, location, date_added, current_borrower, borrow_history, notes]
            `INSERT INTO dummy_data 
            (id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, location, date_added, current_borrower, borrow_history, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *`,
            [id, name, status, age_group, gender, color, season, garment_type, size, time_period, condition, cost, location, date_added, current_borrower, borrow_history, notes]
        );


        res.status(201).json({ success: true, data: result.rows[0] });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
}

// Handler for retrieving item details (previously retrieveItem.js)
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

        // Return the entry as JSON
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching entry:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Handler for updating item IDs (previously updateID.js)
export async function updateIDHandler(req, res) {
    const { id, newId, data } = req.body;

    if (!id || !newId || !data) {
        return res.status(400).json({ message: 'ID, new ID, and data are required' });
    }

    try {
        const existingRecord = await query("SELECT * FROM dummy_data WHERE id = $1", [newId]);

      if (existingRecord.rowCount > 0) {
        if (newId != id) {
            // Case 1: New ID already exists, and it's not the same as the current ID
            return res.status(404).json({ message: 'Error: Trying to overwrite an existing ID. Update aborted.' });
        }
        else{
            // Case 2: New ID already exists, and it's the same as the current ID
            const updateResult = await query("UPDATE dummy_data SET name = $1, note = $2, tags = $3 WHERE id = $4", [data.name, data.note, data.tags, id]);
            return res.status(200).json({ message: 'ID updated successfully', rowCount: updateResult.rowCount });
        }
      }
      else {
        // Case 3: New ID does not exist and it needs to be created
        const insertResult = await query("INSERT INTO dummy_data (id, name, tags, note) VALUES ($1, $2, $3, $4)", [newId, data.name, data.tags, data.note]);
        const deleteOld = await query("DELETE FROM dummy_data WHERE id = $1", [id]);
        return res.status(201).json({ message: 'New record created and old record deleted.' });
      }  
    } catch (error) {
      console.error('Error querying the database:', error);
      return res.status(500).send('Internal Server Error');
    }
  }

// Handler for searching items (previously search.js)
export async function searchHandler(req, res) {
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


export async function updateTagsHandler(req, res) {
  const { id, tags } = req.body;

  if (!Array.isArray(tags)) {
        return res.status(400).send('Tags must be an array');
  }
  const tagsString = `{${tags.join(',')}}`;
  try {
    const result = await query("UPDATE dummy_data SET tags = $1 WHERE id = $2 RETURNING *", [tagsString, id]);
    if (result.rowCount === 0) {
        res.status(404).send("Item not found");
    }
    res.status(200).json(result.rows[0]); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

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

export async function updateItemHandler(req, res) {
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


// Main handler function that routes to the appropriate handler based on the request
export default async function handler(req, res) {
    const { action } = req.query;
    
    switch(action) {
        case 'add':
            return addHandler(req, res);
        case 'retrieve':
            return retrieveItemHandler(req, res);
        case 'update':
            return updateIDHandler(req, res);
        case 'search':
            return searchHandler(req, res);
        case 'updateTags':
            return updateTagsHandler(req, res);
        case 'updateItem':
            return updateItemHandler(req, res);
        default:
            return res.status(400).json({ error: 'Invalid action' });
    }
}