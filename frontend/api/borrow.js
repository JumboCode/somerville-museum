import { query } from './db.js';

export default async function handler(req, res) {
    // console.log(req.body);
    console.log("in borrow!");

  const { borrowerName, borrowerEmail, returnDate, selectedItems } = req.body;
  

    console.log(borrowerName, borrowerEmail, returnDate, selectedItems);
  try {
    

    // const borrowerInfoString = `{${Object.values(borrowedInfo).join(', ')}}`;
    const result = await query(
      'UPDATE dummy_data SET status = $1, note = $2 WHERE id = ANY($3)', ['borrowed', { borrowerName, borrowerEmail, returnDate }, selectedItems]);
    // console.log(result.rows);
    res.status(200).json(); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


// app.patch('/borrowbutton', async (req, res) => {
//     console.log(req.body);
  
//     console.log("in borrow!");
    
//     const {  
//       borrowedInfo } = req.body;
  
//     try {
//       const borrowerInfoString = `{${Object.values(borrowedInfo).join(', ')}}`;
  
//         // Query the 'dummy_data' table
//         await sql`UPDATE dummy_data \
//           SET note = ${borrowerInfoString}
//           WHERE id = 54
//           RETURNING *;
//            `;
        
//         // Send the result back to the client
//         res.json({ message: 'Item borrowed successfully!'}); // Send the result as a JSON response
//       } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error'); // Send an error response
//       }
//   });