import { query } from './db.js';

export default async function handler(req, res) {
  console.log('updating items in overdue api'); 
  const { overdueItems } = req.body;

  try {

    for (const itemId of overdueItems) {
        const result = await query( 
            'UPDATE dummy_data SET status = $1 WHERE id = $2', ['Overdue', itemId]
        );

    }
   
    if (result.rows.length === 0) {
      // No item found with the provided ID
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.status(200).json(result.rows[0]); // Send the result back to the frontend

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}