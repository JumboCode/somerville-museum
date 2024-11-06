import { query } from './db.js';

export default async function handler(req, res) {
  console.log("in borrow!");

  const { dateBorrowed, borrowerName, borrowerEmail, returnDate, selectedItems } = req.body;
  
  console.log(dateBorrowed, borrowerName, borrowerEmail, returnDate, selectedItems);

  try {
    const statusNote = `Borrowed on Date: ${dateBorrowed}, Return Date: ${returnDate}`; 
    const borrowHistoryNote = `Borrower Name: ${borrowerName}, Borrower Email: ${borrowerEmail}`;

    console.log('Status Note:', statusNote); 
    console.log('History Note:', borrowHistoryNote);

    for (const itemId of selectedItems) {
      console.log(itemId);

      // Using array_append with COALESCE to ensure borrower_history is an array
      await query(
        'UPDATE dummy_data SET status = $1, borrower_history = array_append(COALESCE(borrower_history, \'{}\'), $2) WHERE id = $3', 
        ['Borrowed', borrowHistoryNote, itemId]
      );
    }

    res.status(200).json({ message: 'Items added successfully' });

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// import { query } from './db.js';

// export default async function handler(req, res) {
//     // console.log(req.body);
//     console.log("in borrow!");

//   const { dateBorrowed, borrowerName, borrowerEmail, returnDate, selectedItems } = req.body;
  
//     console.log(dateBorrowed, borrowerName, borrowerEmail, returnDate, selectedItems);
    
//   try {

//     const statusNote = `Borrowed on Date: ${dateBorrowed}, Return Date: ${returnDate}`; 
//     const borrowHistoryNote = `Borrower Name: ${borrowerName}, Borrower Email: ${borrowerEmail}`;

//     console.log('Status Note:', statusNote); 
//     console.log('history note:', borrowHistoryNote); 
    
//     for (const itemId of selectedItems) {
//       console.log(itemId); 
//       const currentHistoryResult = await query(
//         `SELECT borrower_history FROM dummy_data WHERE id = $1`,
//         [itemId]
//       );

//       const currentHistory = currentHistoryResult.rows[0]?.borrwer_history || [];
       
//       const updatedHistory = currentHistory.length > 0 
//       ? currentHistory.concat(borrowHistoryNote) 
//       : [borrowHistoryNote]; 

//         await query(
//           'UPDATE dummy_data SET status = $1, borrower_history = $2 WHERE id = $3', 
//           [statusNote, updatedHistory, itemId]
//         ); 
//     }


//     res.status(200).json({ message: 'Items added successfully'}); // Send the result back to the frontend

//   } catch (error) {
//     console.error("Database query error:", error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }


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