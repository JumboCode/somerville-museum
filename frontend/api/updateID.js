import { query } from './db.js';

export default async function handler(req, res) {
    const { id, newId, data } = req.body;
    try {
      // Check if the new ID already exists
        const existingRecord = await query("SELECT * FROM dummy_data WHERE id = $1", [newId]);

      if (existingRecord.length > 0) {
        if (newId != id) {
          // Case 1: New ID already exists, and it's not the same as the current ID
          return res.status(404).json({ message: 'Error: Trying to overwrite an existing ID. Update aborted.' });
        }
        else{
            const updateResult = await query("UPDATE dummy_data SET name = $1, note = $2, tags = $3 WHERE id = $4", [data.name, data.note, data.tags, id]);
            return res.status(200).json({ message: 'ID updated successfully', rowCount: updateResult.rowCount });
        }
      }
      else {
        const insertResult = await query("INSERT INTO dummy_data (id, name, tags, note) VALUES ($1, $2, $3, $4)", [newId, data.name, data.tags, data.note]);
        const deleteOld = await query("DELETE FROM dummy_data WHERE id = $1", [id]);
  
        return res.status(201).json({ message: 'New record created and old record deleted.' });
      }  
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).send('Internal Server Error');
    }
  }