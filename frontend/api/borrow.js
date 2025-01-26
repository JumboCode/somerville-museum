import { query } from './db.js';

export default async function handler(req, res) {

  const { dateBorrowed, borrowerFirstName, borrowerLastName, borrowerEmail, dueDate, 
          approver, note, selectedItems } = req.body;

  try {
   
    //notes to make query shorter 
    // const borrowHistoryNote = `Borrower Name: ${borrowerName}, Borrower Email: ${borrowerEmail}, Borrowed on Date: ${dateBorrowed}, Due Date: ${dueDate}`;
    // const approverInfoNote = `Approver Name: ${APPROVER_NAME}, Approver Email: ${APPROVER_EMAIL}`;
    
    
    for (const itemId of selectedItems) {
      const borrower = {
        borrowerFirstName: borrowerFirstName, //borrowerobject
        borrowerLastName: borrowerLastName,
        borrowerEmail:borrowerEmail,
      }

      const borrowObject = {
        ID: itemId,
        borrower: borrower,
        dateBorrowed: dateBorrowed,
        dueDate: dueDate,
        dateReturned: null,
        approver: approver,
        note: note 
      }


      //checks status of each item 
      const statusResult = await query(
        'SELECT status FROM dummy_data WHERE id = $1', [itemId] 
      ); 

      // Using array_append with COALESCE to borrower_history, sending all other data
      await query(
        'UPDATE dummy_data SET status = $1, approver_info = $2, borrower_history = array_append(COALESCE(borrower_history, \'{}\'), $3) WHERE id = $4', 
        ['Borrowed', approverInfoNote, borrowHistoryNote, itemId]
      );

    }

    res.status(200).json({ message });

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
