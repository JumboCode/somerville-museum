import { query } from './db.js';

export default async function handler(req, res) {
  const { selectedItems } = req.body;

  try {

    //arrays to keep track of items 
    let invalidItems = [];
    let validItems = []; 

    for (const itemId of selectedItems) {
      //checks status of each item 
      const statusResult = await query(
        'SELECT status FROM dummy_data WHERE id = $1', [itemId] 
      ); 

      const itemStatus = statusResult.rows[0]?.status; 
      
      //if the item isnt available, add to unavailable items 
      if(itemStatus !== 'Borrowed' && itemStatus !== 'Overdue') {
        invalidItems.push(itemId); 
        continue;   //continue to next item
      }

        const today = new Date();
        const todayFormatted = today.toLocaleDateString().split('T')[0];

        // let curr_borrower = `Date Returned: ${todayFormatted}`; 
      
        // Using array_append with COALESCE to borrower_history, sending all other data
        await query(
        'UPDATE dummy_data SET status = $1, borrow_history = array_append(borrow_history, current_borrower) WHERE id = $2', 
        ['Available', itemId]
      );

      //add item to available items 
      validItems.push(itemId);

    }
    
    let message = 'Returning process completed. ';

    if (validItems.length > 0) {
      message += `Sucessfully returned items ${validItems.join(', ')}. `
    }
    if (invalidItems.length > 0) {
      message += `The following items were unable to be returned: ${invalidItems.join(', ')}. `
    }


    res.status(200).json({message}); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


