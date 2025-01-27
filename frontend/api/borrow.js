import { query } from './db.js';

export default async function handler(req, res) {
  console.log('reached borrow API', req.body); 


  const { dateBorrowed, borrowerName, borrowerEmail, phoneNumber, dueDate, 
          approver, note, selectedItems } = req.body;
   
  try {

    const existingBorrowerResult = await query(
      `SELECT * FROM borrowers where email = $1`, [borrowerEmail]
    );

    let borrowerId; 

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
      //ASK ABOUT THIS, this appears in the database as exactly what the var names are, is that an issue? 
      const borrowObject = {
        borrowerId, 
        itemId,
        dateBorrowed,
        dueDate, 
        dateReturned, 
        approver,
        note
      }; 

      //not updating borrowers with correct information
      const historyUpdateResult = await query(
        `
        UPDATE borrowers
        SET borrow_history = COALESCE(
          jsonb_set(
            borrow_history,
            ARRAY[$1],
            COALESCE(borrow_history->$1, '{}'::jsonb) || $2::jsonb
          ),
          jsonb_build_object($1, $2::jsonb)
        )
        WHERE id = $3 RETURNING borrow_history
        `,
        [itemId, JSON.stringify(borrowObject), borrowerId]
      );

      let borrowHistory = historyUpdateResult.rows[0].borrow_history; 
    
      //now updating the borrows table with correct information
      const borrowsResult = await query(
        'INSERT INTO borrows (borrower_id, item_id, date_borrowed, return_date, date_returned, approver, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', 
        [borrowerId, itemId, dateBorrowed, dueDate, dateReturned, approver, note]
      );

      let borrowId = borrowsResult.rows[0].id; 
      console.log(`New borrow created with ID: ${borrowId}`);

      //ASK ABOUT THIS, THERE IS SOME DISCONNECT WITH THE DATABASE AND MASTER SPEC
      const borrowerObject = {
        borrowerName, 
        borrowerEmail,
        phoneNumber,
        borrowHistory
      };

      await query(
        `UPDATE dummy_data
        SET borrow_history = COALESCE(
          jsonb_set(
            borrow_history,
            ARRAY[$1],
            COALESCE(borrow_history->$1, '{}'::jsonb) || $2::jsonb
          ),
          jsonb_build_object($1, $2::jsonb)
        ), status = $3, current_borrower = $4
        WHERE id = $5 `,
        [itemId, JSON.stringify(borrowObject), 'Borrowed', borrowerId, itemId]
      
      ); 

    }

    let message = 'Borrowing process completed. ';

    res.status(200).json({ message });

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}