import { query } from './db.js';

export default async function handler(req, res) {
  const { id } = req.body;
  try {
    const result = await query('SELECT * FROM dummy_data WHERE id = $1', [id]);
    res.status(200).json(result.rows[0]); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// // Route to query an item by ID
// app.post('/queryone', async (req, res) => {
//         const { id } = req.body; // Get ID from the request body
//         try {
//             const result = await sql`SELECT * FROM dummy_data WHERE id = ${id}`;
//             if (result.length === 0) {
//                 return res.status(404).json({ message: 'Item not found' });
//             }
//             res.json(result[0]); // Send the first item back as JSON
//         } catch (error) {
//             console.error('Error querying the database:', error);
//             res.status(500).send('Internal Server Error');
//         }
//     });