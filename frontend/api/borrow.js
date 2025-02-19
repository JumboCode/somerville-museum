import { query } from './db.js';

export default async function handler(req, res) {
  console.log('reached borrow API', req.body); 

  let message; 

  const { dateBorrowed, borrowerName, borrowerEmail, phoneNumber, dueDate, 
          approver, note, selectedItems } = req.body;
   
  if (selectedItems == 0) {
    message = "No items selected."
    res.status(200).json({message}); 
  }
        
  try {

    //check for existing borrower
    const existingBorrowerResult = await query(
      `SELECT * FROM borrowers where email = $1`, [borrowerEmail]
    );

    let borrowerId; 
 
    //if borrower doesn't exist, create new borrower
    if (existingBorrowerResult.rows.length > 0) {
      borrowerId = existingBorrowerResult.rows[0].id; 
      console.log(`Existing borrower found with ID: ${borrowerId}`);
    } else {
      const newBorrowerResult = await query(
        `INSERT INTO borrowers (name, email, phone_number) VALUES ($1, $2, $3) RETURNING id`,
        [borrowerName, borrowerEmail, phoneNumber]
      );
      borrowerId = newBorrowerResult.rows[0].id;
      console.log(`New borrower created with ID: ${borrowerId}`);
    }
    
    for (const itemId of selectedItems) {
      let dateReturned = null; 
 
      const borrowObject = {
        borrowerId, 
        itemId,
        dateBorrowed,
        dueDate, 
        dateReturned, 
        approver,
        note
      }; 

      //updating borrowers with correct information
      const historyUpdateResult = await query(
        `
        UPDATE borrowers
        SET borrow_history = COALESCE(
          jsonb_set(
            borrow_history::jsonb,  -- Explicit cast to JSONB
            ARRAY[$1::text],        -- Ensure itemId is treated as text
            COALESCE(borrow_history->$1::text, '{}'::jsonb) || $2::jsonb
          ),
          jsonb_build_object($1::text, $2::jsonb)
        )
        WHERE id = $3 RETURNING borrow_history
        `,
        [itemId.toString(), JSON.stringify(borrowObject), borrowerId]
      );
      
      
      let borrowHistory = historyUpdateResult.rows[0].borrow_history; 
    
      //now updating the borrows table with correct information
      const borrowsResult = await query(
        'INSERT INTO borrows (borrower_id, item_id, date_borrowed, return_date, date_returned, approver, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', 
        [borrowerId, itemId, dateBorrowed, dueDate, dateReturned, approver, note]
      );

      let borrowId = borrowsResult.rows[0].id; 
      console.log(`New borrow created with ID: ${borrowId}`);

      const borrowerObject = {
        borrowerName, 
        borrowerEmail,
        phoneNumber,
        borrowHistory
      };

      // await query("UPDATE dummy_data SET status = 'Available' WHERE id = $1", itemId)
      //update each item's current_borrower, borrow_history, and borrower
      await query(
        `UPDATE dummy_data
        SET borrow_history = ARRAY_APPEND(
          COALESCE(borrow_history, '{}'), 
          $1::integer
        ), status = $2, current_borrower = $1
        WHERE id = $3 `,
        [borrowerId, 'Borrowed', itemId]
      
      );
      
    }

    message = 'Borrowing process completed. ';

    res.status(200).json({ message });

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}