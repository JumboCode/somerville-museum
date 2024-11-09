import { query } from './db.js';

export default async function handler(req, res) {

  const { dateBorrowed, borrowerName, borrowerEmail, returnDate, 
          APPROVER_NAME, APPROVER_EMAIL, selectedItems } = req.body;

  try {
   
    //notes to make query shorter 
    const borrowHistoryNote = `Borrower Name: ${borrowerName}, Borrower Email: ${borrowerEmail}, Borrowed on Date: ${dateBorrowed}, Return Date: ${returnDate}`;
    const approverInfoNote = `Approver Name: ${APPROVER_NAME}, Approver Email: ${APPROVER_EMAIL}`;
    

    //arrays to keep track of items 
    let availableItems = [];
    let unavailableItems = []; 

    
    for (const itemId of selectedItems) {

      //checks status of each item 
      const statusResult = await query(
        'SELECT status FROM dummy_data WHERE id = $1', [itemId] 
      ); 

      const itemStatus = statusResult.rows[0]?.status; 
      
      //if the item isnt available, add to unavailable items 
      if(itemStatus !== 'Available') {
        unavailableItems.push(itemId); 
        continue;   //continue to next item
      }

      // Using array_append with COALESCE to borrower_history, sending all other data
      await query(
        'UPDATE dummy_data SET status = $1, approver_info = $2, borrower_history = array_append(COALESCE(borrower_history, \'{}\'), $3) WHERE id = $4', 
        ['Borrowed', approverInfoNote, borrowHistoryNote, itemId]
      );

      //add item to available items 
      availableItems.push(itemId);
    }

    let message = 'Borrowing process completed.';

    if (availableItems.length > 0) {
      message += `Sucessfully borrowed items ${availableItems.join(', ')}.`
    }
    if (unavailableItems.length > 0) {
      message += `The following items were unavailable: ${unavailableItems.join(', ')}.`
    }

    res.status(200).json({ message });

  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
